import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SearchWeatherScreen from './screens/SearchWeatherScreen.js';
import CurrentLocationWeatherScreen from './screens/CurrentLocationWeatherScreen.js';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Search Location') {
              iconName = focused ? 'search' : 'search-outline';
            } else if (route.name === 'Current Location') {
              iconName = focused ? 'location-sharp' : 'location-outline';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="Current Location"
          component={CurrentLocationWeatherScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Search Location"
          component={SearchWeatherScreen}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;