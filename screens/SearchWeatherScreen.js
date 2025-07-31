import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { getWeather, getForecast } from '../api.js';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import getWeatherLayout from '../weatherLayout.js';
import getForecastLayout from '../forecastLayout.js';
import { styles } from '../styles.js';


// Load the Ionicons font
Icon.loadFont();

const SearchWeatherScreen = () => {
  
  // State variables
  const [searchLocationWeatherData, setSearchLocationWeatherData] = useState(null);
  const [searchLocationForecastData, setSearchLocationForecastData] = useState(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [error, setError] = useState(null);

  // Updates location when user enters text
  const handleLocationChange = (text) => {
    setSearchLocation(text);
    setError(null);
  };

  // Fetch weather & forecast data from API
  const getSearchLocationData = async () => {
    try {
      const weatherData = await getWeather(searchLocation);
      const forecastData = await getForecast(searchLocation);

      setSearchLocationWeatherData(weatherData);
      setSearchLocationForecastData(forecastData);
    } catch (error) {
    setError(error.message);
  }
};

// Screen navigation
const navigation = useNavigation();

// Layout of weather & forecast data
const searchLocationWeatherLayout = getWeatherLayout(searchLocationWeatherData);
const searchLocationForecastLayout = getForecastLayout(searchLocationForecastData);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.currentLocationButtonView}>
            <TouchableOpacity style={styles.currentLocationButton} onPress={() => navigation.navigate('CurrentLocationWeatherScreen')}>
              <Text>Current Location </Text>
              <Icon name={"navigate-outline"} size={16} color="#000" />
            </TouchableOpacity>
          </View>
          <View style={styles.instructions}>
            <Text style={styles.header}>Search Location</Text>
            <TextInput
              style={styles.input}
              value={searchLocation}
              onChangeText={handleLocationChange}
              placeholder="City, State or Zip Code"
            />
            <TouchableOpacity style={styles.getWeatherbutton} onPress={getSearchLocationData}>
              <Text>Search </Text>
              <Icon name={"search-outline"} size={16} color="#000" />
            </TouchableOpacity>
          </View>
          {searchLocationWeatherData && (
            <View style={styles.searchWeatherData}>
              {searchLocationWeatherLayout.map((item) => (
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
                        source={{ uri: item.image }}
                        style={styles.image}
                      />
                    </View> 
                    : 
                    <Text style={item.style}>{item.text}</Text>
                  }
                </View>
              ))}
            </View>
          )}
          {searchLocationForecastData && (
            <View>
              <Text style={styles.header}>Forecast</Text>
              {searchLocationForecastLayout.map((item) => (
                <View key={item.key}>
                  <Text style={item.style}>{item.text}</Text>
                </View>
              ))}
            </View>
          )}
          {searchLocationWeatherData && (
            <MapView
              style={styles.map}
              showsUserLocation={false}
              region={{
                latitude: searchLocationWeatherData.coord.lat,
                longitude: searchLocationWeatherData.coord.lon,
                latitudeDelta: 5.0,
                longitudeDelta: 5.0,
              }}
            >
              <Marker
                coordinate={{
                  latitude: searchLocationWeatherData.coord.lat,
                  longitude: searchLocationWeatherData.coord.lon,
                }}
              />
            </MapView>
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default SearchWeatherScreen;