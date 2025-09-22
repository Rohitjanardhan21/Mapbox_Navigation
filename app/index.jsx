import { useEffect, useState, useRef } from 'react';
import { 
  View, 
  ActivityIndicator,
  Keyboard,
  Alert,
  Text
} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import Constants from 'expo-constants';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

import { landmarks } from "../constants/landmarks";
import { DEFAULT_CAMERA_SETTINGS } from '../utils/constants';

// Hooks - Named imports (with curly braces)
import { useLocation } from '../hooks/useLocation';
import { useSearch } from '../hooks/useSearch';
import { useNavigation } from '../hooks/useNavigation';

// Components - Default imports (without curly braces)
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import NavigationPanel from '../components/NavigationPanel';
import DestinationOptionsModal from '../components/DestinationOptionsModal';
import PlaceDetailsModal from '../components/PlaceDetailsModal';
import MapMarkers from '../components/MapMarkers';
import FloatingButtons from '../components/FloatingButtons';

// Styles
import { styles } from '../styles/main';

// Set Mapbox access token - USE YOUR ACTUAL TOKEN
MapboxGL.setAccessToken('pk.eyJ1IjoiYmVyaWNrcyIsImEiOiJjbWVkMmxhdDIwNXdyMmxzNTA3ZnprMHk3In0.hE8cQigI9JFbb9YBHnOsHQ');

const Home = () => {
  const [ready, setReady] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showPlaceDetails, setShowPlaceDetails] = useState(false);
  const cameraRef = useRef(null);
  
  // Debug imports
  useEffect(() => {
    console.log('Component imports:', {
      SearchBar: typeof SearchBar,
      SearchResults: typeof SearchResults,
      NavigationPanel: typeof NavigationPanel,
      MapMarkers: typeof MapMarkers,
      FloatingButtons: typeof FloatingButtons,
      useLocation: typeof useLocation,
      useSearch: typeof useSearch,
      useNavigation: typeof useNavigation
    });
  }, []);

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
  const { userLocation, locationPermission, goToCurrentLocation, setUserLocation } = useLocation();
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
    handleSelectResult: handleNavigationSelectResult,
    setShowDestinationOptions,
    setSelectedDestination,
    isCalculatingRoute,
    calculateRouteInfo
  } = useNavigation();

  useEffect(() => {
    (async () => {
      // Request location permissions
      try {
        // For Android
        await MapboxGL.requestAndroidLocationPermissions();
        setReady(true);
      } catch (error) {
        console.error('Error requesting permissions:', error);
        setReady(true); // Still set ready to true to show the map
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

  // Update camera position during navigation
  useEffect(() => {
    if (isNavigating && userLocation && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [userLocation.longitude, userLocation.latitude],
        zoomLevel: DEFAULT_CAMERA_SETTINGS.navigationZoomLevel,
        animationMode: 'flyTo',
        animationDuration: 1000,
      });
    }
  }, [userLocation, isNavigating]);

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

  // Helper function to extract coordinates in [longitude, latitude] format
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
    
    // Update search query with the selected item
    handleSelectResult(item);
    
    // Start navigation
    startNavigation(userCoords, {
      ...item,
      coordinates: resultCoords
    });
  };

  const handleLandmarkPress = (landmark) => {
    console.log('handleLandmarkPress called with:', landmark);
    const userCoords = getCoordinates(userLocation);
    if (!userCoords) {
      Alert.alert('Location Required', 'Please wait for your location to be detected');
      return;
    }
    
    try {
      // Ensure landmark has coordinates in the correct format
      const landmarkCoords = getCoordinates(landmark.location || landmark);
      if (!landmarkCoords) {
        Alert.alert('Error', 'This location does not have valid coordinates');
        return;
      }
      
      // Update landmark with proper coordinates
      const landmarkWithCoords = {
        ...landmark,
        coordinates: landmarkCoords
      };
      
      // Set as selected destination (this will trigger route calculation)
      setSelectedDestination(landmarkWithCoords);
      
      // Move camera to landmark
      if (cameraRef.current) {
        cameraRef.current.setCamera({
          centerCoordinate: landmarkCoords,
          zoomLevel: 16,
          animationDuration: 1000,
        });
      }
      
      // Show the PlaceDetailsModal
      setShowPlaceDetails(true);
      
    } catch (error) {
      console.error('Error in handleLandmarkPress:', error);
      Alert.alert('Error', 'Failed to select landmark');
    }
  };

  const handleCreateCustomDestination = () => {
    const userCoords = getCoordinates(userLocation);
    if (!userCoords) {
      Alert.alert('Location Required', 'Please wait for your location to be detected');
      return;
    }
    
    createCustomDestination((destination) => {
      const destCoords = getCoordinates(destination);
      if (!destCoords) {
        Alert.alert('Error', 'Invalid destination coordinates');
        return;
      }
      
      const destinationWithCoords = {
        ...destination,
        coordinates: destCoords
      };
      
      startNavigation(userCoords, destinationWithCoords);
    });
  };

  const handleSearchLocation = () => {
    setShowDestinationOptions(false);
    setIsSearchFocused(true);
  };

  const handleSearchResultSelect = (result) => {
    console.log('handleSearchResultSelect called with:', result);
    const userCoords = getCoordinates(userLocation);
    if (!userCoords) {
      Alert.alert('Location Required', 'Please wait for your location to be detected');
      return;
    }
    
    try {
      // Ensure result has coordinates in the correct format
      const resultCoords = getCoordinates(result.location || result);
      if (!resultCoords) {
        Alert.alert('Error', 'This location does not have valid coordinates');
        return;
      }
      
      // Update result with proper coordinates
      const resultWithCoords = {
        ...result,
        coordinates: resultCoords
      };
      
      // Update search query with the selected result
      handleSelectResult(resultWithCoords);
      
      // Set as selected destination (this will trigger route calculation)
      setSelectedDestination(resultWithCoords);
      
      // Move camera to selected destination
      if (cameraRef.current) {
        cameraRef.current.setCamera({
          centerCoordinate: resultCoords,
          zoomLevel: 16,
          animationDuration: 1000,
        });
      }
      
      // Show the PlaceDetailsModal after selecting a search result
      setShowPlaceDetails(true);
      
    } catch (error) {
      console.error('Error in handleSearchResultSelect:', error);
      Alert.alert('Error', 'Failed to select location');
    }
  };

  // Add this function to handle starting navigation
  const handleStartNavigation = async () => {
    if (!selectedDestination) {
      Alert.alert('Error', 'No destination selected');
      return;
    }
    
    const userCoords = getCoordinates(userLocation);
    if (!userCoords) {
      Alert.alert('Location Required', 'Please wait for your location to be detected');
      return;
    }
    
    console.log('Starting navigation to:', selectedDestination);
    const success = await startNavigation(userCoords, selectedDestination);
    
    if (success) {
      console.log('Navigation started successfully');
      // Hide the modal after navigation starts
      setShowPlaceDetails(false);
    } else {
      Alert.log('Navigation Error', 'Could not start navigation. Please try again.');
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
      {/* Map */}
      <MapboxGL.MapView 
        style={styles.map}
        onPress={handleMapPress}
        logoEnabled={false}
      >
        <MapboxGL.Camera 
          ref={cameraRef}
          defaultSettings={{
            zoomLevel: DEFAULT_CAMERA_SETTINGS.zoomLevel, 
            centerCoordinate: DEFAULT_CAMERA_SETTINGS.centerCoordinate
          }}
        />
        
        {/* User location - REMOVED onUpdate prop */}
        {userLocation && (
          <MapboxGL.UserLocation 
            visible={true}
          />
        )}
        
        <MapMarkers 
          landmarks={landmarks}
          userLocation={userLocation}
          selectedDestination={selectedDestination}
          onLandmarkPress={handleLandmarkPress}
        />
        
        {/* CORRECTED: Draw route line without unmounting the component */}
        <MapboxGL.ShapeSource
          id="routeSource"
          // Conditionally provide the shape
          shape={
            isNavigating && userLocation && selectedDestination && routeInfo ?
            {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: routeInfo.coordinates && routeInfo.coordinates.length > 0 
                  ? routeInfo.coordinates 
                  : [getCoordinates(userLocation), getCoordinates(selectedDestination)],
              },
            }
            :
            null // If not navigating, don't provide a shape
          }
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

      </MapboxGL.MapView>

      {/* Search Bar - FIXED ALIGNMENT */}
      <View style={styles.searchBarContainer}>
        <SearchBar 
          searchQuery={searchQuery}
          onSearch={handleSearch}
          onClear={handleClearSearch}
          isSearchFocused={isSearchFocused}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
        />
      </View>

      {/* Search Results - FIXED ALIGNMENT */}
      {showResults && searchResults && searchResults.length > 0 && (
        <View style={styles.searchResultsContainer}>
          <SearchResults 
            searchResults={searchResults}
            showResults={showResults}
            onSelectResult={handleSearchResultSelect}
            onStartNavigation={handleQuickNavigation}
          />
        </View>
      )}

      {/* Floating Buttons */}
      <FloatingButtons 
        onGoToCurrentLocation={handleGoToCurrentLocation}
        onSetDestination={() => setShowDestinationOptions(true)}
      />

      {/* Navigation Panel */}
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

      {/* Loading Overlay */}
      {isCalculatingRoute && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4285F4" />
          <Text style={styles.loadingText}>Calculating route...</Text>
        </View>
      )}

      {/* Destination Options Modal */}
      <DestinationOptionsModal 
        visible={showDestinationOptions}
        onClose={() => setShowDestinationOptions(false)}
        onCreateCustomDestination={handleCreateCustomDestination}
        onSearchLocation={handleSearchLocation}
      />
      
      {/* Place Details Modal (for showing info when a landmark is tapped) */}
      <PlaceDetailsModal
        visible={showPlaceDetails}
        landmark={selectedDestination}
        onClose={() => setShowPlaceDetails(false)}
        onStartNavigation={handleStartNavigation}
      />
    </View>
  );
};

export default Home;