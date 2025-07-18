import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SearchWeatherScreen from './screens/SearchWeatherScreen.js';
import CurrentLocationWeatherScreen from './screens/CurrentLocationWeatherScreen.js';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SearchWeatherScreen" component={SearchWeatherScreen} />
        <Stack.Screen name="CurrentLocationWeatherScreen" component={CurrentLocationWeatherScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;