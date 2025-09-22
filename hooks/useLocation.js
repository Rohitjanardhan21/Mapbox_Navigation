import { useState, useEffect, useRef } from 'react'; // Added useRef for subscription
import * as Location from 'expo-location';
import { Alert } from 'react-native';

export const useLocation = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const subscriptionRef = useRef(null); // Ref to hold the location subscription

  useEffect(() => {
    (async () => {
      // Request location permissions once
      let { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      setLocationPermission(granted);

      if (granted) {
        // Start watching position updates
        try {
          subscriptionRef.current = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.BestForNavigation,
              distanceInterval: 5,
              timeInterval: 1000,
            },
            (location) => {
              const { latitude, longitude } = location.coords;
              // Mapbox GL expects [longitude, latitude]
              setUserLocation([longitude, latitude]);
            }
          );
        } catch (error) {
          console.error("Error watching location:", error);
        }
      } else {
        Alert.alert(
          'Permission Denied',
          'Allow location access to use navigation features',
          [{ text: 'OK' }]
        );
      }
    })();

    // Cleanup function to remove the location subscription
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
        console.log('Location subscription removed.');
      }
    };
  }, []); // The empty dependency array ensures this effect runs only once

  const goToCurrentLocation = async () => {
    try {
      if (!locationPermission) {
        // Request permission again if it was denied initially
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Denied',
            'Allow location access to use this feature',
            [{ text: 'OK' }]
          );
          return null;
        }
        setLocationPermission(true);
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

      const { latitude, longitude } = location.coords;
      // Update state with the new location
      setUserLocation([longitude, latitude]);

      // Return a standard object with latitude and longitude for convenience
      return { latitude, longitude };
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your current location',
        [{ text: 'OK' }]
      );
      return null;
    }
  };

  return {
    userLocation,
    locationPermission,
    goToCurrentLocation,
    // The setUserLocation function is no longer needed in the return value
    // because the hook manages it internally.
  };
};