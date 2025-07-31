import moment from 'moment-timezone';
import { getWindDirection } from './weatherUtils.js';
import { styles } from './styles.js';
import Icon from 'react-native-vector-icons/Ionicons';

const getForecastLayout = (forecastData) => {
    if (!forecastData) {
        return [];
    }

  return [
    { key: 'forecastTime_1', text: `Time 1:  ${moment.unix(forecastData.list[0].dt).format('h:mm A z')}  ${forecastData.list[0].weather[0].description}` , style: styles.localTime },
    { key: 'forecastTime_2', text: `Time 2:  ${moment.unix(forecastData.list[1].dt).format('h:mm A z')}  ${forecastData.list[1].weather[0].description}` , style: styles.localTime },
    { key: 'forecastTime_3', text: `Time 3:  ${moment.unix(forecastData.list[2].dt).format('h:mm A z')}  ${forecastData.list[2].weather[0].description}` , style: styles.localTime },
  ];
};

export default getForecastLayout;