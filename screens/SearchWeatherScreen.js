import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Button, Image   } from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import getWeather from '../api.js';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import getWeatherLayout from '../weatherLayout.js';
import { styles } from '../styles.js';


// Load the Ionicons font
Icon.loadFont();

// State variables
const SearchWeatherScreen = () => {
  
  const [searchLocationWeatherData, setSearchLocationWeatherData] = useState(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [error, setError] = useState(null);

  // Updates location when user enters text
  const handleLocationChange = (text) => {
    setSearchLocation(text);
    setError(null);
  };

  // Fetch weather data from API
  const getSearchLocationWeatherData = async () => {
    try {
      const data = await getWeather(searchLocation);
      setSearchLocationWeatherData(data);
    } catch (error) {
    setError(error.message);
  }
};

// Screen navigation
const navigation = useNavigation();

// Layout of weather data
const searchLocationWeatherLayout = getWeatherLayout(searchLocationWeatherData);

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
            <TouchableOpacity style={styles.getWeatherbutton} onPress={getSearchLocationWeatherData}>
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