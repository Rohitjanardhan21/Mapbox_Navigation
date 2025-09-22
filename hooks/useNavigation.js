import { useState, useRef, useCallback } from 'react';
import { Alert, Animated, Easing } from 'react-native';

export const useNavigation = () => {
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showDestinationOptions, setShowDestinationOptions] = useState(false);
  const [tappedCoordinate, setTappedCoordinate] = useState(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  const slideAnim = useRef(new Animated.Value(-100)).current;

  // Helper function for safe coordinate extraction
  const getSafeCoordinates = (location) => {
    if (!location) return null;
    
    if (Array.isArray(location)) {
      return location.length === 2 ? location : null;
    }
    
    if (location.coordinates && Array.isArray(location.coordinates)) {
      return location.coordinates.length === 2 ? location.coordinates : null;
    }
    
    if (location.longitude !== undefined && location.latitude !== undefined) {
      return [location.longitude, location.latitude];
    }
    
    return null;
  };

  // Memoized function for route calculation to prevent re-creation
  const calculateRoute = useCallback(async (startCoords, endCoords) => {
    try {
      if (!startCoords || !endCoords) {
        throw new Error('Invalid coordinates');
      }

      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?` +
        `access_token=pk.eyJ1IjoiYmVyaWNrcyIsImEiOiJjbWVkMmxhdDIwNXdyMmxzNTA3ZnprMHk3In0.hE8cQigI9JFbb9YBHnOsHQ&` +
        `geometries=geojson&overview=full&steps=true`
      );

      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        return {
          coordinates: route.geometry.coordinates,
          duration: Math.round(route.duration / 60),
          distance: (route.distance / 1000).toFixed(1)
        };
      }
      return null;
    } catch (error) {
      console.error('Route calculation error:', error);
      throw error;
    }
  }, []);

  // Calculate route info for display (passive, no navigation)
  const calculateRouteInfo = useCallback(async (userLocation, destination) => {
    console.log('Calculating route info...');
    
    const userCoords = getSafeCoordinates(userLocation);
    const destCoords = getSafeCoordinates(destination);
    
    if (!userCoords || !destCoords) {
      console.log('Invalid coordinates for route calculation');
      return;
    }

    setIsCalculatingRoute(true);
    try {
      const route = await calculateRoute(userCoords, destCoords);
      if (route) {
        setRouteInfo(route);
      } else {
        console.log('No route found');
      }
    } catch (error) {
      console.error('Route calculation error:', error);
      setRouteInfo(null);
    } finally {
      setIsCalculatingRoute(false);
    }
  }, [calculateRoute]);

  // Start active navigation
  const startNavigation = useCallback(async (userLocation, destination) => {
    console.log('=== STARTING NAVIGATION ===');
    
    const userCoords = getSafeCoordinates(userLocation);
    const destCoords = getSafeCoordinates(destination);
    
    if (!userCoords || !destCoords) {
      Alert.alert('Error', 'Invalid coordinates for navigation');
      return false;
    }

    setIsCalculatingRoute(true);

    try {
      const route = await calculateRoute(userCoords, destCoords);
      
      if (route) {
        setRouteInfo(route);
        setSelectedDestination(destination);
        setIsNavigating(true);

        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();

        return true;
      } else {
        throw new Error('No route found');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert(
        'Navigation Error',
        'Could not calculate route. Please try again.'
      );
      return false;
    } finally {
      setIsCalculatingRoute(false);
    }
  }, [calculateRoute, slideAnim]);

  const stopNavigation = useCallback(() => {
    setIsNavigating(false);
    setSelectedDestination(null);
    setRouteInfo(null);

    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  const handleMapPress = useCallback((event) => {
    const coordinate = event.geometry.coordinates;
    setTappedCoordinate(coordinate);
    setShowDestinationOptions(true);
  }, []);

  // Simplified and more focused function
  const createCustomDestination = useCallback(() => {
    if (!tappedCoordinate) {
      Alert.alert('Error', 'No location tapped on map');
      return null;
    }
    const customDestination = {
      id: 'custom-' + Date.now(),
      name: 'Custom Destination',
      coordinates: tappedCoordinate,
      type: 'custom'
    };
    setSelectedDestination(customDestination);
    setShowDestinationOptions(false);
    return customDestination;
  }, [tappedCoordinate]);

  // Removed redundant handleSelectResult as it's handled by the parent component.

  return {
    selectedDestination,
    routeInfo,
    isNavigating,
    showDestinationOptions,
    tappedCoordinate,
    slideAnim,
    isCalculatingRoute,
    startNavigation,
    stopNavigation,
    handleMapPress,
    createCustomDestination,
    setShowDestinationOptions,
    setSelectedDestination,
    calculateRouteInfo
  };
};