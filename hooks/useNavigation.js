import { useState, useRef, useCallback } from 'react';
import { Alert, Animated, Easing } from 'react-native';

export const useNavigation = () => {
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [travelTime, setTravelTime] = useState(null);
  const [distance, setDistance] = useState(null);
  const [showDestinationOptions, setShowDestinationOptions] = useState(false);
  const [tappedCoordinate, setTappedCoordinate] = useState(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  const slideAnim = useRef(new Animated.Value(-100)).current;

  // Helper function to validate coordinates
  const validateCoordinates = (coords) => {
    if (!coords || !Array.isArray(coords) || coords.length !== 2) {
      return false;
    }
    
    const [lng, lat] = coords;
    return typeof lng === 'number' && 
           typeof lat === 'number' && 
           !isNaN(lng) && 
           !isNaN(lat) &&
           lng >= -180 && lng <= 180 &&
           lat >= -90 && lat <= 90;
  };

  // Helper function for safe coordinate extraction
  const getSafeCoordinates = (location) => {
    if (!location) return null;
    
    if (Array.isArray(location)) {
      if (location.length === 2 && validateCoordinates(location)) {
        return location;
      }
      return null;
    }
    
    if (location.coordinates && Array.isArray(location.coordinates)) {
      if (location.coordinates.length === 2 && validateCoordinates(location.coordinates)) {
        return location.coordinates;
      }
      return null;
    }
    
    if (location.longitude !== undefined && location.latitude !== undefined) {
      const coords = [location.longitude, location.latitude];
      if (validateCoordinates(coords)) {
        return coords;
      }
      return null;
    }
    
    return null;
  };

  // Fallback route calculation for network failures
  const calculateFallbackRoute = useCallback((startCoords, endCoords) => {
    if (!validateCoordinates(startCoords) || !validateCoordinates(endCoords)) {
      return null;
    }

    // Simple fallback: straight line between points
    const coordinates = [startCoords, endCoords];
    
    // Calculate approximate distance using Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = (endCoords[1] - startCoords[1]) * Math.PI / 180;
    const dLon = (endCoords[0] - startCoords[0]) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(startCoords[1] * Math.PI / 180) * Math.cos(endCoords[1] * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = (R * c).toFixed(1); // Distance in km
    
    // Estimate walking time (5 km/h average walking speed)
    const duration = Math.round((distance / 5) * 60);
    
    return {
      coordinates,
      duration,
      distance
    };
  }, []);

  // Memoized function for route calculation (uses Mapbox API)
  const calculateRoute = useCallback(async (startCoords, endCoords) => {
    try {
      if (!validateCoordinates(startCoords) || !validateCoordinates(endCoords)) {
        console.error('Invalid coordinates for route calculation');
        return calculateFallbackRoute(startCoords, endCoords);
      }

      console.log('Calculating route from:', startCoords, 'to:', endCoords);

      const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiYmVyaWNrcyIsImEiOiJjbWVkMmxhdDIwNXdyMmxzNTA3ZnprMHk3In0.hE8cQigI9JFbb9YBHnOsHQ';
      
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?` +
        `access_token=${MAPBOX_ACCESS_TOKEN}&` +
        `geometries=geojson&overview=full&steps=true`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        return {
          coordinates: route.geometry.coordinates,
          duration: Math.round(route.duration / 60), // Duration in minutes
          distance: (route.distance / 1000).toFixed(1) // Distance in km
        };
      }
      return null;
    } catch (error) {
      console.error('Route calculation error:', error);
      console.log('Using fallback route calculation');
      return calculateFallbackRoute(startCoords, endCoords);
    }
  }, [calculateFallbackRoute]);

  // Calculate route info for display
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
        setTravelTime(route.duration);
        setDistance(route.distance);
      } else {
        console.log('No route found');
        setTravelTime(null);
        setDistance(null);
      }
    } catch (error) {
      console.error('Route calculation error:', error);
      setRouteInfo(null);
      setTravelTime(null);
      setDistance(null);
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
        setTravelTime(route.duration);
        setDistance(route.distance);
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
    setTravelTime(null);
    setDistance(null);

    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  // Original handleMapPress (for modal pop-up)
  const handleMapPress = useCallback((event) => {
    try {
      const coordinate = event.geometry.coordinates;
      if (validateCoordinates(coordinate)) {
        setTappedCoordinate(coordinate);
        setShowDestinationOptions(true);
      } else {
        console.error('Invalid coordinates from map press');
      }
    } catch (error) {
      console.error('Error handling map press:', error);
    }
  }, []);

  // New immediate navigation handler
  const handleImmediateMapNavigation = useCallback(async (event, userLocation) => {
    try {
      const coordinate = event.geometry.coordinates;
      
      if (!validateCoordinates(coordinate) || !userLocation) {
        Alert.alert('Error', 'Invalid location tapped or current location unavailable.');
        return false;
      }

      const destination = {
        id: 'tap-' + Date.now(),
        name: `Tapped Location (${coordinate[0].toFixed(4)}, ${coordinate[1].toFixed(4)})`,
        coordinates: coordinate,
        type: 'tap'
      };

      setShowDestinationOptions(false);
      await startNavigation(userLocation, destination);

      return true;
    } catch (error) {
      console.error('Error in handleImmediateMapNavigation:', error);
      Alert.alert('Error', 'Failed to start route from tapped location.');
      return false;
    }
  }, [startNavigation]);

  const createCustomDestination = useCallback(() => {
    if (!tappedCoordinate || !validateCoordinates(tappedCoordinate)) {
      Alert.alert('Error', 'No valid location tapped on map');
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

  const selectRandomDestination = useCallback(() => {
    const randomLng = Math.random() * 360 - 180;
    const randomLat = Math.random() * 180 - 90;
    
    const randomCoordinates = [randomLng, randomLat];

    if (!validateCoordinates(randomCoordinates)) {
      Alert.alert('Error', 'Failed to generate valid random coordinates.');
      return null;
    }
    
    const randomDestination = {
      id: 'random-' + Date.now(),
      name: `Random Location (${randomLng.toFixed(2)}, ${randomLat.toFixed(2)})`,
      coordinates: randomCoordinates,
      type: 'random'
    };
    
    setSelectedDestination(randomDestination);
    setShowDestinationOptions(false);
    return randomDestination;
  }, []);

  return {
    selectedDestination,
    routeInfo,
    isNavigating,
    travelTime,
    distance,
    showDestinationOptions,
    tappedCoordinate,
    slideAnim,
    isCalculatingRoute,
    startNavigation,
    stopNavigation,
    handleMapPress,
    handleImmediateMapNavigation,
    createCustomDestination,
    selectRandomDestination,
    setShowDestinationOptions,
    setSelectedDestination,
    calculateRouteInfo
  };
};