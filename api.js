import axios from 'axios/dist/axios.min';
import { checkLocationType } from './weatherUtils.js';

const CURRENT_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

const getWeather = async (location) => {
  const locationType  = checkLocationType(location);

  const response = await axios.get(CURRENT_WEATHER_URL, { params: locationType.params });
  return response.data;
};

const getForecast = async (location) => {
  const locationType  = checkLocationType(location);

  const response = await axios.get(FORECAST_URL, { params: locationType.params });
  return response.data;
};

export { getWeather, getForecast };