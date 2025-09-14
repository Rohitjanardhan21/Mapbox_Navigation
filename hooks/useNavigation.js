import { useState, useRef } from 'react';
import { Alert, Animated, Easing } from 'react-native';
import { calculateRoute } from '../utils/navigationUtils';

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

  const startNavigation = async (destination, userLocation) => {
    console.log('=== STARTING NAVIGATION ===');
    console.log('Destination:', destination);
    console.log('User location:', userLocation);
    
    if (!destination) {
      console.log('No destination provided');
      Alert.alert('Error', 'No destination selected');
      return;
    }
    
    if (!userLocation) {
      console.log('No user location available');
      Alert.alert('Location Required', 'Please enable location services');
      return;
    }
    
    setSelectedDestination(destination);
    setIsCalculatingRoute(true);
    
    try {
      console.log('Calculating route...');
      const route = await calculateRoute(userLocation, destination.coordinates);
      console.log('Route calculated:', route);
      
      if (route) {
        setRouteInfo(route);
        setTravelTime(route.duration);
        setDistance(route.distance);
        setIsNavigating(true);
        
        // Show navigation panel
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();
        
        console.log('Navigation started successfully');
        return destination;
      } else {
        throw new Error('No route returned');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Navigation Error', 'Could not calculate route. Please try again.');
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    setSelectedDestination(null);
    setRouteInfo(null);
    setDistance(null);
    setTravelTime(null);
    
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handleMapPress = (event) => {
    const coordinate = event.geometry.coordinates;
    setTappedCoordinate(coordinate);
    setShowDestinationOptions(true);
  };

  const createCustomDestination = (onStartNavigation) => {
    if (!tappedCoordinate) return;
    
    const customDestination = {
      id: 'custom',
      name: 'Custom Destination',
      coordinates: tappedCoordinate,
      type: 'default'
    };
    
    setSelectedDestination(customDestination);
    setShowDestinationOptions(false);
    onStartNavigation(customDestination);
  };

  const handleSelectResult = (result, cameraRef, onStartNavigation) => {
    // Move camera to selected location
    if (cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: result.coordinates,
        zoomLevel: 17,
        animationDuration: 1000,
      });
    }
    
    // Set as destination and start navigation
    setSelectedDestination(result);
    onStartNavigation(result);
  };

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
    createCustomDestination,
    handleSelectResult,
    setShowDestinationOptions
  };
};