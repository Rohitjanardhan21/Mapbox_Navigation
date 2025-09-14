import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

export const useLocation = (isNavigating) => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);

  useEffect(() => {
    (async () => {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Allow location access to use navigation features',
          [{ text: 'OK' }]
        );
        setLocationPermission(false);
      } else {
        setLocationPermission(true);
        
        // Start watching position updates
        await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            distanceInterval: 5,
            timeInterval: 1000,
          },
          (location) => {
            const { latitude, longitude } = location.coords;
            setUserLocation([longitude, latitude]);
          }
        );
      }
    })();
  }, [isNavigating]);

  const goToCurrentLocation = async () => {
    try {
      if (!locationPermission) {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Denied',
            'Allow location access to use this feature',
            [{ text: 'OK' }]
          );
          return;
        }
        setLocationPermission(true);
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

      const { latitude, longitude } = location.coords;
      setUserLocation([longitude, latitude]);

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
    setUserLocation
  };
};
