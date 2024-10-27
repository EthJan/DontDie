import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './Home.css';
import iconFire from '../../../assets/wildfire.png';
import iconAir from '../../../assets/air.png';
import iconEarth from '../../../assets/earthquake.png';
import iconWarn from '../../../assets/warning.png';
import iconWater from '../../../assets/water.png';
import iconSnow from '../../../assets/snow.png';
import iconOver from '../../../assets/over.png';
import iconHelp from '../../../assets/help.png';

function Home() {
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

    const [locations, setLocations] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [error, setError] = useState(null);
    const mapRef = useRef(null); // Reference to hold the map instance
    const markersRef = useRef([]); // Reference to hold current markers

    // Function to fetch location data from the backend
    const fetchLocations = () => {
        axios.get('http://127.0.0.1:5000/api/reports') // Adjusted to match the backend endpoint
            .then(response => {
                setLocations(response.data);
            })
            .catch(error => {
                console.error("Error fetching locations:", error);
                setError("Error fetching locations.");
            });
    };
    
    const fetchOrganizations = () => {
        axios.get('http://127.0.0.1:5000/api/organizations') // Adjusted to match the backend endpoint
        .then(response => {
            setOrganizations(response.data);
        })
        .catch(error => {
            console.error("Error fetching locations:", error);
            setError("Error fetching locations.");
        });
    };
    
    const [activeTab, setActiveTab] = useState('home'); // Track the active tab

    useEffect(() => {
        // Reset to the top of the page when on the home tab
        if (activeTab === 'home') {
            window.scrollTo(0, 0); 
        }
        if (activeTab === 'about' || activeTab === 'report' || activeTab === 'volunteer') {
            // Allow scrolling on about, volunteer and report pages. 
            document.body.style.overflow = 'auto';
        } else {
            // Disable scrolling for other tabs
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [activeTab]);

    // Check for new location data every 10 seconds
    useEffect(() => {
        fetchLocations(); // Initial fetch
        const interval = setInterval(fetchLocations, 10000); // Check 
        return () => clearInterval(interval); // Clear interval on component unmount
    }, []);

    useEffect(() => {
        fetchOrganizations(); // Initial fetch
        const interval = setInterval(fetchLocations, 10000); // Check 
        return () => clearInterval(interval); // Clear interval on component unmount
    }, []);

    // Initialize the Google Map once
    useEffect(() => {
        if (!window.google) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAHKDNWGOOyJ0D3L9naRlJ0V4-HbIf8pyo`;
            script.async = true;
            script.onload = () => initializeMap();
            document.body.appendChild(script);
        } else {
            initializeMap();
        }

        function initializeMap() {
            // Create a new Google Map and save it in the mapRef

            mapRef.current = new window.google.maps.Map(document.getElementById('map'), {
                center: { lat: 40.0, lng: -95.0 },
                zoom: 5,
                minZoom: 3,
                zoomControl: true,
                // Set position of ui widgets
                zoomControlOptions: {
                    position: window.google.maps.ControlPosition.LEFT_BOTTOM, // Move zoom controls to bottom left
                },
                fullscreenControl: true,
                fullscreenControlOptions: {
                    position: window.google.maps.ControlPosition.LEFT_BOTTOM, // Position the fullscreen control
                },
                mapTypeControl: true,
                mapTypeControlOptions: {
                    style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    position: window.google.maps.ControlPosition.BOTTOM_LEFT, // Position map type control
                },
                restriction: {
                    latLngBounds: {
                        north: 80.0,
                        south: -80.0,
                        west: -180.0,
                        east: 180.0,
                    },
                    strictBounds: false,
                },
                gestureHandling: "greedy",
            });
        }

    }, []);
    

    // Function to update markers on the map whenever a location is
    useEffect(() => {
        if (mapRef.current && locations.length > 0) {
            // Clear existing markers
            markersRef.current.forEach(marker => marker.setMap(null));
            markersRef.current = []; // Reset marker reference

            const earth = ["drought", "earthquake", "landslide"];
            const fire = ["fire", "volcano"];
            const snow = ["snowstorm", "avalanche"];
            const water = ["flood", "tsunami", "hurricane"];
            const air = ["tornado", "storm"];

            locations.forEach(location => {
                const marker = new window.google.maps.Marker({
                    position: { lat: location.latitude, lng: location.longitude },
                    map: mapRef.current,
                    title: location.address || location.category,
                    // Icon check and assign
                    icon: (() => {
                        if (location.category === 'hazard') {
                            return {
                                url: iconWarn,
                                scaledSize: new window.google.maps.Size(80, 80),
                            };
                        } else if (location.category === 'over') {
                            return {
                                url: iconOver,
                                scaledSize: new window.google.maps.Size(80, 80),
                            };
                        } else if (earth.includes(location.category)) {
                            return {
                                url: iconEarth,
                                scaledSize: new window.google.maps.Size(80, 80),
                            };
                        } else if (fire.includes(location.category)) {
                            return {
                                url: iconFire,
                                scaledSize: new window.google.maps.Size(80, 80),
                            };
                        } else if (air.includes(location.category)) {
                            return {
                                url: iconAir,
                                scaledSize: new window.google.maps.Size(80, 80),
                            };
                        } else if (water.includes(location.category)) {
                            return {
                                url: iconWater,
                                scaledSize: new window.google.maps.Size(80, 80),
                            };
                        } else if (snow.includes(location.category)) {
                            return {
                                url: iconSnow,
                                scaledSize: new window.google.maps.Size(80, 80),
                            };
                        } else {
                            return {
                                url: iconWarn, // Default icon if no match
                                scaledSize: new window.google.maps.Size(80, 80),
                            };
                        }
                    })(),
                });

                const infoWindow = new window.google.maps.InfoWindow({
                    content: `<h3>${location.status + ' ' + location.category}</h3><p>${location.address}</p><p>${location.description}</p>`,
                });

                marker.addListener('click', () => {
                    infoWindow.open(mapRef.current, marker);
                });

                markersRef.current.push(marker);
            });

            organizations.forEach(org => {
                const marker = new window.google.maps.Marker({
                    position: { lat: org.latitude, lng: org.longitude },
                    map: mapRef.current,
                    title: org.name,
                    icon: {
                        url: iconHelp,
                        scaledSize: new window.google.maps.Size(30, 30),
                    },
                });

                const infoWindow = new window.google.maps.InfoWindow({
                    content: `<h3>${org.name}</h3><p>${org.radius} km radius</p>`,
                });

                marker.addListener('click', () => {
                    infoWindow.open(mapRef.current, marker);
                });

                markersRef.current.push(marker);
            })
        }
    }, [locations, organizations]);

    return (
        <div>
            {error ? (
                <p>{error}</p>
            ) : (
                <div id="map" className="home">
                    {/* <Boxselect options={categories} selectedOptions={selectedCategories} setSelectedOptions={setSelectedCategories} /> */}
                </div>
            )}
        </div>
    );
}

export default Home;