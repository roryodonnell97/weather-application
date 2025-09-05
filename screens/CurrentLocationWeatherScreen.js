import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { Text, ScrollView, Image, FlatList  } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { getWeather, getForecast } from '../api.js';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles.js';
import getWeatherLayout from '../weatherLayout.js';
import getForecastLayout from '../forecastLayout.js';
import { View } from 'react-native-animatable';

// Load the Ionicons font
Icon.loadFont();

const CurrentLocationWeatherScreen = () => {
  
  const [currentLocationWeatherData, setCurrentLocationWeatherData] = useState(null);
  const [currentLocationForecastData, setCurrentLocationForecastData] = useState(null);
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

      const weatherData = await getWeather({ lat: currentLocation.coords.latitude, lon: currentLocation.coords.longitude });
      const forecastData = await getForecast({ lat: currentLocation.coords.latitude, lon: currentLocation.coords.longitude });

      setCurrentLocationWeatherData(weatherData);
      setCurrentLocationForecastData(forecastData);
    } catch (error) {
    setError(error.message);
  }
};

  // Screen navigation
  const navigation = useNavigation();

  // Layout of weather data
  const currentLocationWeatherLayout = getWeatherLayout(currentLocationWeatherData);
  const currentLocationForecastLayout = getForecastLayout(currentLocationForecastData);

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
          <View style={styles.instructions} animation="slideInDown" duration={750} delay={100}>
            <Text style={styles.header}>Current Location</Text>
          </View>
          {currentLocationWeatherData && (
            <View style={styles.searchWeatherData} animation="slideInRight" duration={750} delay={100}>
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
                      source={{ uri: item.image }} style={styles.weatherImage} />
                    </View>
                      : 
                      <Text style={item.style}>{item.text}</Text>
                  }
                </View>
              ))}
            </View>
          )}
          {currentLocationForecastLayout && (
            <View style={styles.forecastContainer} animation="slideInLeft" duration={750} delay={100}>
              <Text style={styles.forecastHeader}>Forecast</Text>
              <FlatList 
                horizontal
                style={{ marginLeft : 10 }}
                data={currentLocationForecastLayout}
                renderItem={({ item, index }) => (
                  <View key={index}>
                    {item}
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          )}
          {currentLocationWeatherData && (
            <View 
            animation="slideInUp"
            duration={750}
            delay={100}
            >
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
            </View>
          )}         
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default CurrentLocationWeatherScreen;