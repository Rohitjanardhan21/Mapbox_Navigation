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
import * as Location from 'expo-location';

import { landmarks } from "../constants/landmarks";





MapboxGL.setAccessToken(Constants.expoConfig.extra?.MAPBOX_ACCESS_TOKEN || '');

const Home = () => {
  const [ready, setReady] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const cameraRef = useRef(null);
  const slideAnim = useRef(new Animated.Value(-100)).current;



  // Icon mapping for different location types
  const iconMap = {
    academic: 'school',
    library: 'library',
    food: 'restaurant',
    sports: 'basketball',
    admin: 'business',
    shopping: 'cart',
    default: 'location'
  };

  useEffect(() => {
    (async () => {
      await MapboxGL.requestAndroidLocationPermissions();
      setReady(true);
    })();
  }, []);

  // Update camera position during navigation
  useEffect(() => {
    if (isNavigating && userLocation && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: userLocation,
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

  const handleLandmarkPress = (landmark) => {
    console.log('handleLandmarkPress called with:', landmark);
    if (!userLocation) {
      Alert.alert('Location Required', 'Please wait for your location to be detected');
      return;
    }
    
    try {
      handleSelectResult(landmark, cameraRef, () => {
        console.log('Starting navigation from landmark press');
        return startNavigation(userLocation, landmark); // FIXED ORDER
      });
    } catch (error) {
      console.error('Error in handleLandmarkPress:', error);
    }
  };

  const handleCreateCustomDestination = () => {
    if (!userLocation) {
      Alert.alert('Location Required', 'Please wait for your location to be detected');
      return;
    }
    
    createCustomDestination((destination) => startNavigation(userLocation, destination)); // FIXED ORDER
  };

  const handleSearchLocation = () => {
    setShowDestinationOptions(false);
    setIsSearchFocused(true);
  };

  // Set destination from search results
  const handleSelectResult = (result) => {
    setSearchQuery(result.name);
    setShowResults(false);
    setIsSearchFocused(false);
    Keyboard.dismiss();
    
    if (cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: result.coordinates,
        zoomLevel: 17,
        animationDuration: 1000,
      });
    }
    
    // Set as destination and ask to navigate
    setSelectedDestination(result);
    Alert.alert(
      'Navigate to ' + result.name,
      'Do you want to start navigation to this location?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start Navigation', onPress: () => startNavigation(result) }
      ]
    );
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.length > 0) {
      const filtered = landmarks.filter(landmark => 
        landmark.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    setIsSearchFocused(false);
    Keyboard.dismiss();
  };

  const renderResultItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.resultItem} 
      onPress={() => handleSelectResult(item)}
    >
      <Ionicons 
        name={iconMap[item.type] || iconMap.default} 
        size={20} 
        color="#5f5f5f" 
        style={styles.resultIcon}
      />
      <View style={styles.resultTextContainer}>
        <Text style={styles.resultTitle}>{item.name}</Text>
        <Text style={styles.resultSubtitle}>Campus Location</Text>
      </View>
      <TouchableOpacity onPress={() => startNavigation(item)}>
        <Ionicons name="navigate" size={24} color="#4285F4" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (!ready) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapboxGL.MapView 
        style={styles.map}
        onPress={handleMapPress}
      >
        <MapboxGL.Camera 
          ref={cameraRef}
          zoomLevel={15} 
          centerCoordinate={[77.4379, 12.8631]} 
        />
        
        {/* Add markers for all campus landmarks */}
        {landmarks.map(landmark => (
          <MapboxGL.PointAnnotation
            key={landmark.id}
            id={landmark.id}
            coordinate={landmark.coordinates}
            onSelected={() => handleSelectResult(landmark)}
          >
            <View style={[
              styles.marker, 
              selectedDestination && selectedDestination.id === landmark.id && styles.destinationMarker
            ]}>
              <Ionicons 
                name={iconMap[landmark.type] || iconMap.default} 
                size={16} 
                color="white" 
              />
            </View>
          </MapboxGL.PointAnnotation>
        ))}
        
        {/* Show user location if available */}
        {userLocation && (
          <MapboxGL.PointAnnotation
            id="userLocation"
            coordinate={userLocation}
          >
            <View style={styles.userLocationMarker}>
              <View style={styles.userLocationPulse} />
              <Ionicons name="person" size={16} color="white" />
            </View>
          </MapboxGL.PointAnnotation>
        )}
        
        {/* Show custom destination marker if set */}
        {selectedDestination && selectedDestination.id === 'custom' && (
          <MapboxGL.PointAnnotation
            id="customDestination"
            coordinate={selectedDestination.coordinates}
          >
            <View style={styles.customDestinationMarker}>
              <Ionicons name="flag" size={16} color="white" />
            </View>
          </MapboxGL.PointAnnotation>
        )}
        
        {/* Draw route line if navigating */}
        {isNavigating && userLocation && selectedDestination && (
          <MapboxGL.ShapeSource
            id="routeSource"
            shape={{
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: routeInfo && routeInfo.coordinates && routeInfo.coordinates.length > 0 
                  ? routeInfo.coordinates 
                  : [userLocation, selectedDestination.coordinates],
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

      {/* Search Bar */}
      <SearchBar 
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onClear={handleClearSearch}
        isSearchFocused={isSearchFocused}
        onFocus={handleSearchFocus}
        onBlur={handleSearchBlur}
      />

      {/* Search Results */}
      <SearchResults 
        searchResults={searchResults}
        showResults={showResults}
        onSelectResult={handleSearchResultSelect}
        onStartNavigation={(item) => {
          if (!userLocation) {
            Alert.alert('Location Required', 'Please wait for your location to be detected');
            return;
          }
          startNavigation(userLocation, item); // FIXED ORDER
        }}
      />

      {/* Floating Buttons */}
      <FloatingButtons 
        onGoToCurrentLocation={handleGoToCurrentLocation}
        onSetDestination={() => setShowDestinationOptions(true)}
      />

      {/* Navigation Panel - Only shown when navigating */}
      {isNavigating && (
        <NavigationPanel 
          slideAnim={slideAnim}
          selectedDestination={selectedDestination}
          travelTime={travelTime || (routeInfo && routeInfo.duration)}
          distance={distance || (routeInfo && routeInfo.distance)}
          onStopNavigation={stopNavigation}
        />
      )}

      {/* Loading Overlay */}
      {isCalculatingRoute && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4285F4" />
          <Text style={styles.loadingText}>Calculating route...</Text>
        </View>
      )}

      {/* Current Location Button */}
      <TouchableOpacity 
        style={styles.currentLocationButton}
        onPress={goToCurrentLocation}
      >
        <Ionicons name="navigate" size={24} color="#4285F4" />
      </TouchableOpacity>

      {/* Set Destination Button */}
      <TouchableOpacity 
        style={styles.setDestinationButton}
        onPress={() => setShowDestinationOptions(true)}
      >
        <Ionicons name="flag" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Navigation Panel (Bottom Sheet) */}
      <Animated.View style={[styles.navigationPanel, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.navigationHeader}>
          <Text style={styles.navigationTitle}>Navigation Active</Text>
          <TouchableOpacity onPress={stopNavigation}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        
        {selectedDestination && (
          <View style={styles.destinationInfo}>
            <Ionicons 
              name={selectedDestination.id === 'custom' ? 'flag' : (iconMap[selectedDestination.type] || iconMap.default)} 
              size={24} 
              color="#4285F4" 
            />
            <Text style={styles.destinationName}>{selectedDestination.name}</Text>
          </View>
        )}
        
        {routeInfo && (
          <View style={styles.routeInfo}>
            <View style={styles.routeInfoItem}>
              <Ionicons name="time" size={20} color="#5f5f5f" />
              <Text style={styles.routeInfoText}>{travelTime} min</Text>
            </View>
            <View style={styles.routeInfoItem}>
              <Ionicons name="walk" size={20} color="#5f5f5f" />
              <Text style={styles.routeInfoText}>{distance} km</Text>
            </View>
          </View>
        )}
        
        <View style={styles.navigationControls}>
          <TouchableOpacity style={styles.stopButton} onPress={stopNavigation}>
            <Text style={styles.stopButtonText}>Stop Navigation</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Destination Options Modal */}
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