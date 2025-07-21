import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Button, Image   } from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment-timezone';
import getWeather from '../api.js';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import {  getWindDirection } from '../weatherUtils.js';

// Load the Ionicons font
Icon.loadFont();

// State variables
const SearchWeatherScreen = () => {
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

// State variables
const windDirection = getWindDirection(weather?.wind.deg);
const navigation = useNavigation();

// Layout of weather data
const searchWeatherData = weather ? [
  { key: 'location', text: `${weather.name}, ${weather.sys.country}`, style: styles.location },
  { key: 'localTime', text: moment().utcOffset(weather.timezone / 60).format('h:mm A z'), style: styles.localTime },
  { 
    key: 'conditions', 
    text: weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1), 
    image: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
    style: styles.conditions 
  },
  { key: 'temperature', text: `Temperature: ${((weather.main.temp - 32) * (5 / 9)).toFixed(1)}°C    Feels like: ${((weather.main.feels_like - 32) * (5 / 9)).toFixed(1)}°C  `, style: styles.temperature },
  { key: 'wind',
    icon: <Icon name={"arrow-up-outline"} size={24} color="#000" style={[{ transform: [{ rotate: `${weather.wind.deg}deg` }] }]} />,
    text: `Wind: ${weather.wind.speed} mph    Direction: ${windDirection}`, 
    style: styles.wind 
  },
] : [];

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
              value={location}
              onChangeText={handleLocationChange}
              placeholder="City, State or Zip Code"
            />
            <TouchableOpacity style={styles.getWeatherbutton} onPress={getWeatherData}>
              <Text>Search </Text>
              <Icon name={"search-outline"} size={16} color="#000" />
            </TouchableOpacity>
          </View>
          {error ? (
            <Text style={styles.error}>{error}</Text>
          ) : weather ? (
            <View style={styles.searchWeatherData}>
              {searchWeatherData.map((item) => (
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
          {weather && (
            <MapView
              style={styles.map}
              showsUserLocation={false}
              region={{
                latitude: weather.coord.lat,
                longitude: weather.coord.lon,
                latitudeDelta: 5.0,
                longitudeDelta: 5.0,
              }}
            >
              <Marker
                coordinate={{
                  latitude: weather.coord.lat,
                  longitude: weather.coord.lon,
                }}
              />
            </MapView>
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
    backgroundColor: 'lightblue',
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
    flexDirection: 'row',
    backgroundColor: 'lightgreen',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 30,
  },
  currentLocationButton: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'lightgreen',
    padding: 10,
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 1,
    width: 150,
  },
  currentLocationButtonView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    color: 'black',

  },
  input: {
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  error: {
    color: 'red',
  },
  searchWeatherData: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 20,
    marginBottom: 20,
  },
  conditionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  localTime: {
    fontSize: 20,
    marginBottom: 10,
  },
  temperature: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 10,
  },
  conditions : {
    fontSize: 20,
    marginBottom: 10,
    marginRight: 20,
  },
  wind: {
    fontSize: 16,
    marginBottom: 10,
  },
  map: {
    height: 200,
    width: '100%',
    marginTop: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
    backgroundColor: 'lightblue',
    
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageText: {
    fontSize: 20,
    marginBottom: 10,
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
  },
});

export { styles };
export default SearchWeatherScreen;