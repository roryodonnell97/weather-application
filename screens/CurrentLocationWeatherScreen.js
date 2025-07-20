import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Button, Image  } from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment-timezone';
import getWeather from '../api.js';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import {  getWindDirection } from '../weatherUtils.js';
import { styles } from './SearchWeatherScreen';

// Load the Ionicons font
Icon.loadFont();

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

  // State variables
  const windDirection = getWindDirection(weatherData?.wind.deg);
  const navigation = useNavigation();

  // Layout of weather data
  const currentLocationWeatherData = weatherData ? [
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
      text: `Wind: ${weatherData.wind.speed} mph    Direction: ${windDirection}`, 
      style: styles.wind 
    },
  ] : [];

  if (error) {
    return (
      <View>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (!weatherData) {
    return [];
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.instructions}>
            <Text style={styles.header}>Current Location</Text>
          </View>
          {error ? (
            <Text style={styles.error}>{error}</Text>
          ) : weatherData ? (
            <View style={styles.searchWeatherData}>
              {currentLocationWeatherData.map((item) => (
                <View key={item.key}>
                  {item.icon ? 
                    <View style={styles.conditionsContainer}>
                      <Text style={item.style}>{item.text}</Text>
                      {item.icon}
                    </View> 
                    : item.image ? 
                    <View style={styles.imageContainer}>
                      <Text style={styles.imageText}>{item.text}</Text>
                      <Image 
                      source={{ uri: item.image }} style={styles.image} />
                    </View>
                      : 
                      <Text style={item.style}>{item.text}</Text>
                  }
                </View>
              ))}
            </View>
          ) : null}
          {weatherData && (
            <MapView
              style={styles.map}
              showsUserLocation={false}
              region={{
                latitude: weatherData.coord.lat,
                longitude: weatherData.coord.lon,
                latitudeDelta: 5.0,
                longitudeDelta: 5.0,
              }}
            >
              <Marker
                coordinate={{
                  latitude: weatherData.coord.lat,
                  longitude: weatherData.coord.lon,
                }}
              />
            </MapView>
          )}         
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default CurrentLocationWeatherScreen;