import moment from 'moment-timezone';
import { getWindDirection } from './weatherUtils.js';
import { styles } from './screens/SearchWeatherScreen';
import Icon from 'react-native-vector-icons/Ionicons';

const getWeatherLayout = (weatherData) => {
  if (!weatherData) return [];

  return [
    { key: 'location', text: `${weatherData.name}, ${weatherData.sys.country}`, style: styles.location },
    { key: 'localTime', text: moment().utcOffset(weatherData.timezone / 60).format('h:mm A z'), style: styles.localTime },
    { 
      key: 'conditions', 
      text: weatherData.weather[0].description.charAt(0).toUpperCase() + weatherData.weather[0].description.slice(1), 
      image: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
      style: styles.conditions 
    },
    { key: 'temperature', text: `Temperature: ${((weatherData.main.temp - 32) * (5 / 9)).toFixed(1)}°C    Feels like: ${((weatherData.main.feels_like - 32) * (5 / 9)).toFixed(1)}°C  `, style: styles.temperature },
    { key: 'wind',
      icon: <Icon name={"arrow-up-outline"} size={24} color="#000" style={[{ transform: [{ rotate: `${weatherData.wind.deg}deg` }] }]} />,
      text: `Wind: ${weatherData.wind.speed} mph    Direction: ${getWindDirection(weatherData.wind.deg)}`, 
      style: styles.wind 
    },
  ];
};

export default getWeatherLayout;