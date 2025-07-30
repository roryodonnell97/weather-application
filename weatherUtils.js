// Returns wind direction letters
const getWindDirection = (degrees) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

// Check if location is a string (location name) or an object (latitude/longitude)
const checkLocationType = (location) => {
const API_KEY = '377353b2705d73d27295030e6fa3cfd1'

  if (typeof location === 'string') {
    return {
      type: 'string',
      params: {
        q: location,
        units: 'imperial',
        appid: API_KEY,
      },
    };
  } else if (typeof location === 'object' && location.lat && location.lon) {
    return {
      type: 'object',
      params: {
        lat: location.lat,
        lon: location.lon,
        units: 'imperial',
        appid: API_KEY,
      },
    };
  } else {
    throw new Error('Invalid location format. Please use a string for location name or an object with lat and lon properties for latitude/longitude.');
  }
};

export { getWindDirection, checkLocationType };