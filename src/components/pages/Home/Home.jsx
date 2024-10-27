import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';
import iconUrl from '../../../assets/wildfire.png';
import Boxselect from '../../Boxselect/Boxselect';

function Home() {
	const [locations, setLocations] = useState([]);
	const [error, setError] = useState(null);
	const categories = [
		'fire',
		'flood',
		'tornado',
		'drought',
		'volcano',
		'landslide',
		'earthquake',
		'avalanche',
		'snowstorm',
	];
	const initSelectedCategories = categories.reduce((ob, cat) => {
        ob[cat] = false;
        return ob;
    }, {});

    const [selectedCategories, setSelectedCategories] = useState(initSelectedCategories);

	//changes made here
	const fetchLocations = () => {
        axios.get('http://127.0.0.1:5000/api/locations')
            .then(response => {
                setLocations(response.data);
            })
            .catch(error => {
                console.error("Error fetching locations:", error);
                setError("Error fetching locations.");
            });
    };

    useEffect(() => {
        // Initial fetch of locations
        fetchLocations();

        // Polling every 10 seconds to get updated locations
        const interval = setInterval(fetchLocations, 10000); // 10 seconds

        // Clear the interval on component unmount
        return () => clearInterval(interval);
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
			// Define the boundaries for soft boundary 
			const verticalBounds = {
			  north: 80.0,  
			  south: -80.0,  
			  west: -180.0,
			  east: 180.0,  
			};
					  
			const mapOptions = {
			  center: { lat: 40.0, lng: -95.0 }, // Initial map center
			  zoom: 5,
			  minZoom: 3,
			  zoomControl: true,
			  zoomControlOptions: {
				position: window.google.maps.ControlPosition.TOP_LEFT,
			  },
			  restriction: {
				latLngBounds: verticalBounds,
				strictBounds: false, 
			  },
			  gestureHandling: "greedy" // Removes page scrolling and enables map scrolling
			};
		  
			const map = new window.google.maps.Map(document.getElementById('map'), mapOptions);
		  window.onload = initMap;

			locations.forEach(location => {
			  const marker = new window.google.maps.Marker({
				position: { lat: location.lat, lng: location.lng },
				map: map,
				title: location.title,
				icon: {
				  url: iconUrl,
				  scaledSize: new window.google.maps.Size(100, 100),
				},
			  });
		  
			  const infoWindow = new window.google.maps.InfoWindow({
				content: `<h3>${location.title}</h3><p>${location.description}</p>`,
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
				<div id="map" className="map">
					<Boxselect options={categories} selectedOptions={selectedCategories} setSelectedOptions={setSelectedCategories} />
				</div>
			)}
		</div>
	);
}

export default Home;
