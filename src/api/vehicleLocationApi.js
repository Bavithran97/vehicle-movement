import axios from 'axios';

export const fetchVehicleLocationData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/vehicle-location');
    return response.data;
  } catch (error) {
    console.error('Error fetching location data:', error);
    return [];
  }
};