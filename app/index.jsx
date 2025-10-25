import { useEffect, useState, useRef } from 'react';
import { 
  View, 
  ActivityIndicator,
  Keyboard,
  Alert,
  Text
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

// Set Mapbox access token - Use your actual token from app.json
MapboxGL.setAccessToken('pk.eyJ1IjoidmFydW5rbTM2MCIsImEiOiJjbWVpNHA5eGswNjBtMmtxdGxia2cxNw2In0.f88HMcQt5Lh9ZQGIpeNKug');

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
        setFontsLoaded(true); // Continue even if fonts fail
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
    handleImmediateMapNavigation
  } = useNavigation();

  useEffect(() => {
    (async () => {
      try {
        await MapboxGL.requestAndroidLocationPermissions();
        setReady(true);
      } catch (error) {
        console.error('Error requesting permissions:', error);
        setReady(true); // Continue even if permissions fail
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
    try {
      const location = await goToCurrentLocation();
      if (location && cameraRef.current) {
        const coords = getCoordinates(location);
        if (coords && coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
          cameraRef.current.setCamera({
            centerCoordinate: coords,
            zoomLevel: 16,
            animationDuration: 1000,
          });
        }
      }
    } catch (error) {
      console.error('Error going to current location:', error);
      Alert.alert('Error', 'Could not get current location');
    }
  };

  // New handler to wrap map press and immediate navigation
  const handleMapPressAndRoute = (event) => {
    if (isSearchFocused || (searchResults && searchResults.length > 0)) {
      handleClearSearch();
    }
    
    if (handleImmediateMapNavigation) {
      handleImmediateMapNavigation(event, userLocation);
    }
  };

  const handleRandomNavigation = async () => {
    if (!userLocation) {
      Alert.alert('Location Required', 'Please wait for your location to be detected before selecting a random route.');
      return;
    }
    
    try {
      const destination = selectRandomDestination();
      
      if (destination) {
        await startNavigation(userLocation, destination);
        
        const destCoords = getCoordinates(destination);
        if (destCoords && destCoords.length === 2 && !isNaN(destCoords[0]) && !isNaN(destCoords[1]) && cameraRef.current) {
          cameraRef.current.setCamera({
            centerCoordinate: destCoords,
            zoomLevel: 14,
            animationDuration: 1000,
          });
        }
      } else {
        Alert.alert('Error', 'Failed to generate a random destination.');
      }
    } catch (error) {
      console.error('Error in random navigation:', error);
      Alert.alert('Error', 'Failed to start random navigation');
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

  // Helper function to extract coordinates with validation
  const getCoordinates = (location) => {
    if (!location) return null;
    
    try {
      let longitude, latitude;
      
      if (Array.isArray(location)) {
        if (location.length === 2) {
          [longitude, latitude] = location;
        } else {
          return null;
        }
      } else if (location.coordinates && Array.isArray(location.coordinates)) {
        if (location.coordinates.length === 2) {
          [longitude, latitude] = location.coordinates;
        } else {
          return null;
        }
      } else if (location.longitude !== undefined && location.latitude !== undefined) {
        longitude = location.longitude;
        latitude = location.latitude;
      } else {
        return null;
      }
      
      // Validate coordinates are numbers and within valid ranges
      if (typeof longitude === 'number' && typeof latitude === 'number' &&
          !isNaN(longitude) && !isNaN(latitude) &&
          longitude >= -180 && longitude <= 180 &&
          latitude >= -90 && latitude <= 90) {
        return [longitude, latitude];
      }
      
      return null;
    } catch (error) {
      console.error('Error extracting coordinates:', error);
      return null;
    }
  };

  // Quick navigation handler
  const handleQuickNavigation = (item) => {
    console.log('Quick navigation started for:', item);
    
    if (!userLocation) {
      Alert.alert('Location Required', 'Please wait for your location to be detected');
      return;
    }
    
    try {
      const userCoords = getCoordinates(userLocation);
      const resultCoords = getCoordinates(item);
      
      if (!userCoords || !resultCoords) {
        Alert.alert('Error', 'Invalid coordinates for navigation');
        return;
      }
      
      handleSelectResult(item);
      startNavigation(userCoords, {
        ...item,
        coordinates: resultCoords
      });
    } catch (error) {
      console.error('Error in quick navigation:', error);
      Alert.alert('Error', 'Failed to start navigation');
    }
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
    
    try {
      const destination = createCustomDestination();
      if (destination) {
        startNavigation(userLocation, destination);
      }
    } catch (error) {
      console.error('Error creating custom destination:', error);
      Alert.alert('Error', 'Failed to create custom destination');
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
    
    try {
      const success = await startNavigation(userLocation, selectedDestination);
      
      if (!success) {
        Alert.alert('Navigation Error', 'Could not start navigation. Please try again.');
      }
    } catch (error) {
      console.error('Error starting navigation:', error);
      Alert.alert('Navigation Error', 'Failed to start navigation');
    }
  };

  // Handle location updates properly
  const handleLocationUpdate = (location) => {
    if (setUserLocation && location && location.coords) {
      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        coords: location.coords
      };
      
      // Validate location coordinates
      if (!isNaN(newLocation.latitude) && !isNaN(newLocation.longitude) &&
          newLocation.latitude >= -90 && newLocation.latitude <= 90 &&
          newLocation.longitude >= -180 && newLocation.longitude <= 180) {
        setUserLocation(newLocation);
      }
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
        onPress={handleMapPressAndRoute}
        logoEnabled={false}
        pointerEvents="box-none"  // ← ADDED: Allows buttons to receive touch events
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
                  : [getCoordinates(userLocation), getCoordinates(selectedDestination)].filter(coord => coord !== null),
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

      {/* ADDED: Wrapper for proper positioning */}
      <View style={styles.floatingButtonsContainer}>
        <FloatingButtons 
          onGoToCurrentLocation={handleGoToCurrentLocation}
          onSetDestination={() => setShowDestinationOptions(true)}
          onShowLayers={() => Alert.alert('Layers', 'Map layers functionality')}
          onRandomNavigation={handleRandomNavigation}
        />
      </View>

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