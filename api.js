import axios from 'axios/dist/axios.min';

const API_KEY = '377353b2705d73d27295030e6fa3cfd1'
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const getWeather = async (location) => {
  let params;

  // Check if location is a string (location name) or an object (latitude/longitude)
  if (typeof location === 'string') {
    params = {
      q: location,
      units: 'imperial',
      appid: API_KEY,
    };
  } else if (typeof location === 'object' && location.lat && location.lon) {
    params = {
      lat: location.lat,
      lon: location.lon,
      units: 'imperial',
      appid: API_KEY,
    };
  } else {
    throw new Error('Invalid location format. Please use a string for location name or an object with lat and lon properties for latitude/longitude.');
  }

  const response = await axios.get(BASE_URL, { params });
  return response.data;
};

export default getWeather;