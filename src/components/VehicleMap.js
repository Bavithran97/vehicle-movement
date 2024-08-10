import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchVehicleLocationData } from '../api/vehicleLocationApi';

// Custom Button Component to Show Current Location
const ShowLocationButton = ({ userLocation }) => {
  const map = useMap();

  const handleClick = () => {
    if (userLocation) {
      map.setView([userLocation.latitude, userLocation.longitude], 15);
    } else {
      alert('User location not available.');
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '8px 12px',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
        cursor: 'pointer',
      }}
    >
      Show My Location
    </button>
  );
};

const VehicleMap = () => {
  const [locations, setLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Icon for vehicle
  const vehicleIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  // Icon for user location
  const userIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  useEffect(() => {
    // Fetch Vehicle Location Data
    const fetchData = async () => {
      const data = await fetchVehicleLocationData();
      if (data && data.length > 0) {
        setLocations(data);
        setCurrentLocation(data[0]);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Update Vehicle Location
    if (locations.length > 0 && currentLocation) {
      const index = locations.findIndex(loc => loc === currentLocation);
      if (index < locations.length - 1) {
        setTimeout(() => {
          setCurrentLocation(locations[index + 1]);
        }, 5000); // Update location every 5 seconds
      }
    }
  }, [currentLocation, locations]);

  useEffect(() => {
    // Get User's Current Location
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  return (
    <MapContainer center={[17.385044, 78.486671]} zoom={15} style={{ height: '100vh', position: 'relative' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
      />

      {/* Marker for the Vehicle's Current Location */}
      {currentLocation && (
        <Marker position={[currentLocation.latitude, currentLocation.longitude]} icon={vehicleIcon}>
          <Popup>Vehicle is here</Popup>
        </Marker>
      )}

      {/* Marker for User's Current Location */}
      {userLocation && (
        <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
      )}

      {/* Polyline for the Vehicle's Route */}
      <Polyline positions={locations.map(loc => [loc.latitude, loc.longitude])} color="blue" />

      {/* Button to Show User's Current Location */}
      <ShowLocationButton userLocation={userLocation} />
    </MapContainer>
  );
};

export default VehicleMap;