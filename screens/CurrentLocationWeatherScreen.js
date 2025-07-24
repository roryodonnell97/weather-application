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
  
  const [currentLocationWeatherData, setCurrentLocationWeatherData] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [error, setError] = useState(null);

  // Call getCurrentLocationWeatherData when component mounts (when screen is navigated to)
  // The empty dependency array [] ensures it is only called once and not on every re-render
  useEffect(() => {
    getCurrentLocationWeatherData();
  }, []);

  // Fetch weather data from API
  const getCurrentLocationWeatherData = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setCurrentLocation(currentLocation);

      console.log('Location:', currentLocation);

      const data = await getWeather({ lat: currentLocation.coords.latitude, lon: currentLocation.coords.longitude });
      setCurrentLocationWeatherData(data);
    } catch (error) {
    setError(error.message);
  }
};

  // State variables
  const windDirection = getWindDirection(currentLocationWeatherData?.wind.deg);
  const navigation = useNavigation();

  // Layout of weather data
  const currentLocationWeatherLayout = currentLocationWeatherData ? [
    { key: 'location', text: `${currentLocationWeatherData.name}, ${currentLocationWeatherData.sys.country}`, style: styles.location },
    { key: 'localTime', text: moment().utcOffset(currentLocationWeatherData.timezone / 60).format('h:mm A z'), style: styles.localTime },
    { 
      key: 'conditions', 
      text: currentLocationWeatherData.weather[0].description.charAt(0).toUpperCase() + currentLocationWeatherData.weather[0].description.slice(1), 
      image: `https://openweathermap.org/img/wn/${currentLocationWeatherData.weather[0].icon}@2x.png`,
      style: styles.conditions 
    },
    { key: 'temperature', text: `Temperature: ${((currentLocationWeatherData.main.temp - 32) * (5 / 9)).toFixed(1)}°C    Feels like: ${((currentLocationWeatherData.main.feels_like - 32) * (5 / 9)).toFixed(1)}°C  `, style: styles.temperature },
    { key: 'wind',
      icon: <Icon name={"arrow-up-outline"} size={24} color="#000" style={[{ transform: [{ rotate: `${currentLocationWeatherData.wind.deg}deg` }] }]} />,
      text: `Wind: ${currentLocationWeatherData.wind.speed} mph    Direction: ${windDirection}`, 
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

  if (!currentLocationWeatherData) {
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
          ) : currentLocationWeatherData ? (
            <View style={styles.searchWeatherData}>
              {currentLocationWeatherLayout.map((item) => (
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
          {currentLocationWeatherData && (
            <MapView
              style={styles.map}
              showsUserLocation={false}
              region={{
                latitude: currentLocationWeatherData.coord.lat,
                longitude: currentLocationWeatherData.coord.lon,
                latitudeDelta: 5.0,
                longitudeDelta: 5.0,
              }}
            >
              <Marker
                coordinate={{
                  latitude: currentLocationWeatherData.coord.lat,
                  longitude: currentLocationWeatherData.coord.lon,
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