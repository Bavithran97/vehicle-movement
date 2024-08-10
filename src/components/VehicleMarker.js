import React from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';

// Setup for the vehicle icon
const vehicleIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const VehicleMarker = ({ position }) => {
  if (!position) return null;

  return <Marker position={position} icon={vehicleIcon} />;
};

export default VehicleMarker;