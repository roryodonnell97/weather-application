import axios from 'axios/dist/axios.min';

const API_KEY = '377353b2705d73d27295030e6fa3cfd1'
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