import { StyleSheet } from 'react-native';

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
  forecastHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    color: 'black',
    marginLeft: 15
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
  weatherImage: {
    width: 100,
    height: 100,
  },
  forecastImage: {
    width: 55,
    height: 55,
  },
  forecastTime: {
    fontSize: 16,
  },
  forecastTemperature: {
    fontSize: 17,
  },
});

export { styles };