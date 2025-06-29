import axios from 'axios/dist/axios.min';

const API_KEY = process.env.API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const getWeather = async (location) => {
  const params = {
    q: location,
    units: 'imperial',
    appid: API_KEY,
  };
  const response = await axios.get(BASE_URL, { params });
  return response.data;
};

export default getWeather;