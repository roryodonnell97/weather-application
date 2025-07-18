import { weatherType } from './weatherType.js';


// Returns weather icon based on weather type
const getWeatherIcon = (weather) => {
  if (!weather) {
    return null;
  }

  const { main: type } = weather.weather[0];
  const { icon, backgroundColor } = weatherType[type];

  return { icon, backgroundColor };
};

// Returns wind direction letters
const getWindDirection = (degrees) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

export { getWeatherIcon, getWindDirection};