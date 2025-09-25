import { useEffect, useState, useRef } from 'react';
import { 
  View, 
  ActivityIndicator,
  Keyboard,
  Alert,
  Text // Make sure Text is imported
} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

import { landmarks } from "../constants/landmarks";
import { DEFAULT_CAMERA_SETTINGS } from '../utils/constants';

// Hooks
import { useLocation } from '../hooks/useLocation';
import { useSearch } from '../hooks/useSearch';
import { useNavigation } from '../hooks/useNavigation';

// Components
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import NavigationPanel from '../components/NavigationPanel';
import DestinationModal from '../components/DestinationModal';
import MapMarkers from '../components/MapMarkers';
import FloatingButtons from '../components/FloatingButtons';

// Styles
import { styles } from '../styles/main';

// Set Mapbox access token
MapboxGL.setAccessToken('pk.eyJ1IjoiYmVyaWNrcyIsImEiOiJjbWVkMmxhdDIwNXdyMmxzNTA3ZnprMHk3In0.hE8cQigI9JFbb9YBHnOsHQ');

const Home = () => {
  const [ready, setReady] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const cameraRef = useRef(null);
  
  // Load fonts
  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          ...Ionicons.font
        });
        console.log('Fonts loaded successfully');
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
      }
    }
    
    loadFonts();
  }, []);

  // Custom hooks
  const { 
    userLocation, 
    locationPermission, 
    goToCurrentLocation,
    setUserLocation 
  } = useLocation();
  
  const { 
    searchQuery, 
    searchResults, 
    showResults, 
    isSearchFocused, 
    handleSearch, 
    clearSearch, 
    handleSelectResult,
    setIsSearchFocused 
  } = useSearch();
  
  const { 
    selectedDestination, 
    routeInfo, 
    isNavigating, 
    travelTime, 
    distance, 
    showDestinationOptions, 
    slideAnim, 
    startNavigation, 
    stopNavigation, 
    handleMapPress, 
    createCustomDestination,
    setShowDestinationOptions,
    isCalculatingRoute,
    calculateRouteInfo,
    setSelectedDestination,
    selectRandomDestination,
    handleImmediateMapNavigation // <--- FIX 1: Import new handler
  } = useNavigation();

  useEffect(() => {
    (async () => {
      try {
        await MapboxGL.requestAndroidLocationPermissions();
        setReady(true);
      } catch (error) {
        console.error('Error requesting permissions:', error);
        setReady(true);
      }
    })();
  }, []);

  // Calculate route info whenever a destination is selected
  useEffect(() => {
    if (selectedDestination && userLocation && !isNavigating) {
      console.log('Calculating route info for selected destination:', selectedDestination.name);
      calculateRouteInfo(userLocation, selectedDestination);
    }
  }, [selectedDestination, userLocation, isNavigating, calculateRouteInfo]);

  const handleGoToCurrentLocation = async () => {
    const location = await goToCurrentLocation();
    if (location && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [location.longitude, location.latitude], 
        zoomLevel: 16,
        animationDuration: 1000,
      });
    }
  };
  
  // --- NEW HANDLER TO WRAP MAPBOX EVENT AND USER LOCATION ---
  const handleMapPressAndRoute = (event) => {
    // 1. If search is active, dismiss it first
    if (isSearchFocused || (searchResults && searchResults.length > 0)) {
        handleClearSearch();
    }
    
    // 2. Call the streamlined hook function, passing the map event and user location
    handleImmediateMapNavigation(event, userLocation);
  };
  // -----------------------------------------------------------

  const handleRandomNavigation = async () => {
    if (!userLocation) {
      Alert.alert('Location Required', 'Please wait for your location to be detected before selecting a random route.');
      return;
    }
    
    const destination = selectRandomDestination();
    
    if (destination) {
      await startNavigation(userLocation, destination);
      
      const destCoords = getCoordinates(destination);
      if (destCoords && cameraRef.current) {
        cameraRef.current.setCamera({
          centerCoordinate: destCoords,
          zoomLevel: 14,
          animationDuration: 1000,
        });
      }
    } else {
       Alert.alert('Error', 'Failed to generate a random destination.');
    }
  };


  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    if (!searchQuery) {
      setIsSearchFocused(false);
    }
  };

  const handleClearSearch = () => {
    clearSearch();
    Keyboard.dismiss();
  };

  // Helper function to extract coordinates
  const getCoordinates = (location) => {
    if (!location) return null;
    
    if (Array.isArray(location)) {
      return location.length === 2 ? location : null;
    }
    
    if (location.coordinates && Array.isArray(location.coordinates)) {
      return location.coordinates;
    }
    
    if (location.longitude !== undefined && location.latitude !== undefined) {
      return [location.longitude, location.latitude];
    }
    
    return null;
  };

  // Quick navigation handler
  const handleQuickNavigation = (item) => {
    console.log('Quick navigation started for:', item);
    const userCoords = getCoordinates(userLocation);
    if (!userCoords) {
      Alert.alert('Location Required', 'Please wait for your location to be detected');
      return;
    }
    
    const resultCoords = getCoordinates(item);
    if (!resultCoords) {
      Alert.alert('Error', 'This location has invalid coordinates');
      return;
    }
    
    handleSelectResult(item);
    startNavigation(userLocation, {
      ...item,
      coordinates: resultCoords
    });
  };

  const handleLandmarkPress = (landmark) => {
    console.log('handleLandmarkPress called with:', landmark);
    
    if (!userLocation) {
      Alert.alert('Location Required', 'Please wait for your location to be detected');
      return;
    }
    
    try {
      const landmarkCoords = getCoordinates(landmark.location || landmark);
      if (!landmarkCoords) {
        Alert.alert('Error', 'This location has invalid coordinates');
        return;
      }
      
      const landmarkWithCoords = {
        ...landmark,
        coordinates: landmarkCoords
      };
      
      setSelectedDestination(landmarkWithCoords);
      
      if (cameraRef.current) {
        cameraRef.current.setCamera({
          centerCoordinate: landmarkCoords,
          zoomLevel: 16,
          animationDuration: 1000,
        });
      }
    } catch (error) {
      console.error('Error in handleLandmarkPress:', error);
      Alert.alert('Error', 'Failed to select landmark');
    }
  };

  const handleCreateCustomDestination = () => {
    if (!userLocation) {
      Alert.alert('Location Required', 'Please wait for your location to be detected');
      return;
    }
    
    const destination = createCustomDestination();
    if (destination) {
      startNavigation(userLocation, destination);
    }
  };

  const handleSearchLocation = () => {
    setShowDestinationOptions(false);
    setIsSearchFocused(true);
  };

  const handleSearchResultSelect = (result) => {
    console.log('handleSearchResultSelect called with:', result);
    
    if (!userLocation) {
      Alert.alert('Location Required', 'Please wait for your location to be detected');
      return;
    }
    
    try {
      const resultCoords = getCoordinates(result.location || result);
      if (!resultCoords) {
        Alert.alert('Error', 'This location has invalid coordinates');
        return;
      }
      
      const resultWithCoords = {
        ...result,
        coordinates: resultCoords
      };
      
      handleSelectResult(resultWithCoords);
      setSelectedDestination(resultWithCoords);
      
      if (cameraRef.current) {
        cameraRef.current.setCamera({
          centerCoordinate: resultCoords,
          zoomLevel: 16,
          animationDuration: 1000,
        });
      }
    } catch (error) {
      console.error('Error in handleSearchResultSelect:', error);
      Alert.alert('Error', 'Failed to select location');
    }
  };

  const handleStartNavigation = async () => {
    if (!selectedDestination) {
      Alert.alert('Error', 'No destination selected');
      return;
    }
    
    if (!userLocation) {
      Alert.alert('Location Required', 'Please wait for your location to be detected');
      return;
    }
    
    console.log('Starting navigation to:', selectedDestination);
    const success = await startNavigation(userLocation, selectedDestination);
    
    if (!success) {
      Alert.alert('Navigation Error', 'Could not start navigation. Please try again.');
    }
  };

  // Handle location updates properly
  const handleLocationUpdate = (location) => {
    if (setUserLocation) {
      setUserLocation(location.coords);
    }
  };

  if (!ready || !fontsLoaded) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={{marginTop: 10}}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapboxGL.MapView 
        style={styles.map}
        onPress={handleMapPressAndRoute} // <--- CORRECTED: Using the new, immediate handler
        logoEnabled={false}
      >
        <MapboxGL.Camera 
          ref={cameraRef}
          defaultSettings={{
            zoomLevel: DEFAULT_CAMERA_SETTINGS.zoomLevel, 
            centerCoordinate: DEFAULT_CAMERA_SETTINGS.centerCoordinate
          }}
        />
        
        {userLocation && (
          <MapboxGL.UserLocation 
            visible={true}
            onUpdate={handleLocationUpdate}
          />
        )}
        
        <MapMarkers 
          landmarks={landmarks}
          userLocation={userLocation}
          selectedDestination={selectedDestination}
          onLandmarkPress={handleLandmarkPress}
        />
        
        {isNavigating && userLocation && selectedDestination && routeInfo && (
          <MapboxGL.ShapeSource
            id="routeSource"
            shape={{
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: routeInfo.coordinates && routeInfo.coordinates.length > 0 
                  ? routeInfo.coordinates 
                  : [getCoordinates(userLocation), getCoordinates(selectedDestination)],
              },
            }}
          >
            <MapboxGL.LineLayer
              id="routeLine"
              style={{
                lineColor: '#4285F4',
                lineWidth: 5,
                lineOpacity: 0.7,
              }}
            />
          </MapboxGL.ShapeSource>
        )}
      </MapboxGL.MapView>

      <SearchBar 
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onClear={handleClearSearch}
        isSearchFocused={isSearchFocused}
        onFocus={handleSearchFocus}
        onBlur={handleSearchBlur}
      />

      {showResults && searchResults && searchResults.length > 0 && (
        <SearchResults 
          searchResults={searchResults}
          showResults={showResults}
          onSelectResult={handleSearchResultSelect}
          onStartNavigation={handleQuickNavigation}
        />
      )}

      <FloatingButtons 
        onGoToCurrentLocation={handleGoToCurrentLocation}
        onSetDestination={() => setShowDestinationOptions(true)}
        onShowLayers={() => Alert.alert('Layers', 'Map layers functionality')}
        onRandomNavigation={handleRandomNavigation}
      />

      {selectedDestination && (
        <NavigationPanel 
          slideAnim={slideAnim}
          selectedDestination={selectedDestination}
          travelTime={travelTime}
          distance={distance}
          onStopNavigation={stopNavigation}
          onStartNavigation={handleStartNavigation}
          isNavigating={isNavigating}
        />
      )}

      {isCalculatingRoute && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4285F4" />
          <Text style={styles.loadingText}>Calculating route...</Text>
        </View>
      )}

      <DestinationModal 
        visible={showDestinationOptions}
        onClose={() => setShowDestinationOptions(false)}
        onCreateCustomDestination={handleCreateCustomDestination}
        onSearchLocation={handleSearchLocation}
      />
    </View>
  );
};

export default Home;