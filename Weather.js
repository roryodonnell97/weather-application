import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment-timezone';
import getWeather from './api';
import { weatherType } from './weatherType.js';

console.log(weatherType);

const Weather = () => {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  // Updates location when user enters text
  const handleLocationChange = (text) => {
    setLocation(text);
    setError(null);
  };

  // Fetch weather data from API
  const getWeatherData = async () => {
    try {
      const data = await getWeather(location);
      setWeather(data);
    } catch (error) {
    setError(error.message);
  }
};

// Returns weather icon based on weather type
const getWeatherIcon = () => {
  if (!weather) {
    return null;
  }

  const { main: type } = weather.weather[0];
  const { icon, backgroundColor } = weatherType[type];

  return { icon, backgroundColor };
};

const iconData = getWeatherIcon();

const weatherData = weather ? [
  { key: 'location', text: `${weather.name}, ${weather.sys.country}`, style: styles.location },
  { key: 'localTime', text: moment().utcOffset(weather.timezone / 60).format('h:mm A z'), style: styles.localTime },
  { key: 'temperature', text: `Temperature: ${((weather.main.temp - 32) * (5 / 9)).toFixed(1)}°C | Feels like: ${((weather.main.feels_like - 32) * (5 / 9)).toFixed(1)}°C`, style: styles.temperature },
  { key: 'conditions', text: weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1), style: styles.conditions },
  { key: 'icon', icon: iconData && <Icon name={iconData.icon} size={70} color={iconData.backgroundColor} /> },
] : [];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.instructions}>
            <Text style={styles.header}>Enter Location:</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={handleLocationChange}
              placeholder="City, State or Zip Code"
            />
            <TouchableOpacity style={styles.getWeatherbutton} onPress={getWeatherData}>
              <Text>Get Weather</Text>
            </TouchableOpacity>
          </View>
          {error ? (
            <Text style={styles.error}>{error}</Text>
          ) : weather ? (
            <View style={styles.weatherData}>
              {weatherData.map((item) => (
                  <View key={item.key}>
                    {item.icon ? item.icon : <Text style={item.style}>{item.text}</Text>}
                  </View>
              ))}
            </View>
          ) : (
            <Text>Loading...</Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  scrollView: {
    backgroundColor: 'lightgreen',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
    maxWidth: 500,
  },
  instructions: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  getWeatherbutton: {
    alignItems: 'center',
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  },
  error: {
    color: 'red',
  },
  weatherData: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
  },
  location: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  localTime: {
    fontSize: 18,
    marginBottom: 10,
  },
  temperature: {
    fontSize: 10,
    marginBottom: 10,
  },
  feelsLike: {
    fontSize: 10,
    marginBottom: 10,
  },
  conditions : {
    fontSize: 20,
    marginBottom: 10,
  },
});

export default Weather;