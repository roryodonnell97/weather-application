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
  const [searchLocationWeatherData, setSearchLocationWeatherData] = useState(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [error, setError] = useState(null);

  // Updates location when user enters text
  const handleLocationChange = (text) => {
    setSearchLocation(text);
    setError(null);
  };

  // Fetch weather data from API
  const getWeatherData = async () => {
    try {
      const data = await getWeather(searchLocation);
      setSearchLocationWeatherData(data);
    } catch (error) {
    setError(error.message);
  }
};

// State variables
const windDirection = getWindDirection(searchLocationWeatherData?.wind.deg);
const navigation = useNavigation();

// Layout of weather data
const searchLocationWeatherLayout = searchLocationWeatherData ? [
  { key: 'location', text: `${searchLocationWeatherData.name}, ${searchLocationWeatherData.sys.country}`, style: styles.searchLocation },
  { key: 'localTime', text: moment().utcOffset(searchLocationWeatherData.timezone / 60).format('h:mm A z'), style: styles.localTime },
  { 
    key: 'conditions', 
    text: searchLocationWeatherData.weather[0].description.charAt(0).toUpperCase() + searchLocationWeatherData.weather[0].description.slice(1), 
    image: `https://openweathermap.org/img/wn/${searchLocationWeatherData.weather[0].icon}@2x.png`,
    style: styles.conditions 
  },
  { key: 'temperature', text: `Temperature: ${((searchLocationWeatherData.main.temp - 32) * (5 / 9)).toFixed(1)}°C    Feels like: ${((searchLocationWeatherData.main.feels_like - 32) * (5 / 9)).toFixed(1)}°C  `, style: styles.temperature },
  { key: 'wind',
    icon: <Icon name={"arrow-up-outline"} size={24} color="#000" style={[{ transform: [{ rotate: `${searchLocationWeatherData.wind.deg}deg` }] }]} />,
    text: `Wind: ${searchLocationWeatherData.wind.speed} mph    Direction: ${windDirection}`, 
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
              value={searchLocation}
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
          ) : searchLocationWeatherData ? (
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
                      source={{ uri: item.image }} style={styles.image} />
                    </View>
                      : 
                      <Text style={item.style}>{item.text}</Text>
                  }
                </View>
              ))}
            </View>
          ) : null}
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