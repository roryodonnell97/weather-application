import { View, Text, Image  } from 'react-native';
import moment from 'moment-timezone';
import { styles } from './styles.js';

const getForecastLayout = (forecastData) => {
    if (!forecastData) {
        return [];
    }

    const forecastLayout = [];

    for (let i = 0; i < 30; i++) {
      forecastLayout.push(
        <View key={`forecastTime_${i + 1}`} style={{ flexDirection: 'column', alignItems: 'center', marginRight: 15}}>
          <Text style={styles.forecastTime}>{moment.unix(forecastData.list[i].dt).format('ddd')}</Text>
          <Text style={styles.forecastTime}>{moment.unix(forecastData.list[i].dt).format('HH:mm')}</Text>
          <Image source={{ uri: `https://openweathermap.org/img/wn/${forecastData.list[i].weather[0].icon}@2x.png` }} style={styles.forecastImage} />
          <Text style={styles.forecastTemperature}>{((forecastData.list[i].main.temp - 32) * (5 / 9)).toFixed(0)}°C</Text>
        </View>
      );
    }
  
  
    return forecastLayout;
};

export default getForecastLayout;