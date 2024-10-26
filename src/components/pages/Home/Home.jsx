import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';
import iconUrl from '../../../assets/wildfire.png';

function Home() {
	const [locations, setLocations] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		// Api insert
		axios.get('http://127.0.0.1:5000/api/locations')
			.then(response => {
				setLocations(response.data);
			})
			.catch(error => {
				console.error("Error fetching locations:", error);
				setError("Error fetching locations.");
			});
	}, []);

	useEffect(() => {
		if (!window.google) {
			const script = document.createElement('script');
			script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAHKDNWGOOyJ0D3L9naRlJ0V4-HbIf8pyo`;
			script.async = true;
			script.onload = () => initMap();
			document.body.appendChild(script);
		} else {
			initMap();
		}

		function initMap() {
			const mapOptions = {
				// Define Starting position 
				center: { lat: 43.6598, lng: -79.3973 },
				zoom: 3,
			};
			const map = new window.google.maps.Map(document.getElementById('map'), mapOptions);

			// For each disastor entry, pin it on the map
			locations.forEach(location => {
				const marker = new window.google.maps.Marker({
					position: { lat: location.lat, lng: location.lng },
					map: map,

					// Add if statement and assign proper icon accordingly
					icon: {
						url: iconUrl,
						// Adjust size for scale
						scaledSize: new window.google.maps.Size(100, 100),
					}
				});
				// Window for each pin
				const infoWindow = new window.google.maps.InfoWindow({
					content: `<h3>${location.lat}</h3><p>${location.lng}</p>`,
				});

				marker.addListener('click', () => {
					infoWindow.open(map, marker);
				});
			});
		}
	}, [locations]);

	return (
		<div>
			{error ? (
				<p>{error}</p>
			) : (
				<div id="map" className="home"></div>
			)}
		</div>
	);
}

export default Home;
