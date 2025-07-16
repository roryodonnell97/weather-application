import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import getWeather from '../api.js';

const CurrentLocationWeatherScreen = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        console.log('Location:', location);

        // Pass location object to getWeather function
        const weatherData = await getWeather({ lat: location.coords.latitude, lon: location.coords.longitude });
        console.log('Weather Data:', weatherData);
        setWeatherData(weatherData);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      }
    })();
  }, []);

  if (error) {
    return (
      <View>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (!weatherData) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Temperature: {weatherData.main.temp}°F</Text>
    </View>
  );
};

export default CurrentLocationWeatherScreen;