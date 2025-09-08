import { useEffect, useState, useRef } from 'react';
import { 
  View, 
  ActivityIndicator, 
  TextInput, 
  FlatList, 
  Text, 
  TouchableOpacity, 
  Keyboard,
  StyleSheet,
  Alert,
  Animated,
  Easing,
  Modal
} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

MapboxGL.setAccessToken(Constants.expoConfig.extra?.MAPBOX_ACCESS_TOKEN || '');

const Home = () => {
  const [ready, setReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [travelTime, setTravelTime] = useState(null);
  const [distance, setDistance] = useState(null);
  const [showDestinationOptions, setShowDestinationOptions] = useState(false);
  const [tappedCoordinate, setTappedCoordinate] = useState(null);
  const cameraRef = useRef(null);
  const slideAnim = useRef(new Animated.Value(-100)).current;

  // Sample campus landmarks data
  const campusLandmarks = [
    { id: '1', name: 'Main Academic Building', coordinates: [77.4379, 12.8631], type: 'academic' },
    { id: '2', name: 'Central Library', coordinates: [77.4385, 12.8638], type: 'library' },
    { id: '3', name: 'Student Center & Cafeteria', coordinates: [77.4372, 12.8625], type: 'food' },
    { id: '4', name: 'Sports Complex & Gymnasium', coordinates: [77.4390, 12.8645], type: 'sports' },
    { id: '5', name: 'Science & Research Block', coordinates: [77.4365, 12.8620], type: 'academic' },
    { id: '6', name: 'Administration Building', coordinates: [77.4380, 12.8640], type: 'admin' },
    { id: '7', name: 'Computer Science Department', coordinates: [77.4370, 12.8635], type: 'academic' },
    { id: '8', name: 'Campus Bookstore', coordinates: [77.4378, 12.8633], type: 'shopping' },
  ];

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
            
            // Update camera position if navigating
            if (isNavigating && cameraRef.current) {
              cameraRef.current.setCamera({
                centerCoordinate: [longitude, latitude],
                zoomLevel: 17,
                animationMode: 'flyTo',
                animationDuration: 1000,
              });
            }
          }
        );
      }
      
      await MapboxGL.requestAndroidLocationPermissions();
      setReady(true);
    })();
  }, [isNavigating]);

  // Calculate route between two points
  const calculateRoute = async (origin, destination) => {
    try {
      // Use Mapbox Directions API
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&access_token=${Constants.expoConfig.extra?.MAPBOX_ACCESS_TOKEN}`
      );
      
      const data = await response.json();
      
      if (data.routes && data.routes[0]) {
        const route = data.routes[0];
        setDistance((route.distance / 1000).toFixed(1));
        setTravelTime(Math.ceil(route.duration / 60));
        
        return {
          distance: route.distance / 1000,
          duration: route.duration / 60,
          coordinates: route.geometry.coordinates
        };
      }
    } catch (error) {
      console.error('Error calculating route with Mapbox API:', error);
      
      // Fallback to straight-line distance calculation
      const R = 6371;
      const dLat = (destination[1] - origin[1]) * Math.PI / 180;
      const dLon = (destination[0] - origin[0]) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(origin[1] * Math.PI / 180) * Math.cos(destination[1] * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const calculatedDistance = R * c;
      const calculatedTime = (calculatedDistance / 5) * 60;
      
      setDistance(calculatedDistance.toFixed(1));
      setTravelTime(Math.ceil(calculatedTime));
      
      return {
        distance: calculatedDistance,
        duration: calculatedTime,
        coordinates: [origin, destination]
      };
    }
  };

  // Function to get current location
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

      if (cameraRef.current) {
        cameraRef.current.setCamera({
          centerCoordinate: [longitude, latitude],
          zoomLevel: 16,
          animationDuration: 1000,
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your current location',
        [{ text: 'OK' }]
      );
    }
  };

  // Start navigation to a destination
  const startNavigation = async (destination) => {
    if (!userLocation) {
      Alert.alert(
        'Location Required',
        'Please enable location services to start navigation',
        [{ text: 'OK' }]
      );
      return;
    }
    
    setSelectedDestination(destination);
    setIsNavigating(true);
    
    // Calculate route
    const route = await calculateRoute(userLocation, destination.coordinates);
    setRouteInfo(route);
    
    // Show navigation panel
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  // Stop navigation
  const stopNavigation = () => {
    setIsNavigating(false);
    setSelectedDestination(null);
    setRouteInfo(null);
    
    // Hide navigation panel
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  // Set a custom destination by tapping on the map
  const handleMapPress = (event) => {
    const coordinate = event.geometry.coordinates;
    setTappedCoordinate(coordinate);
    setShowDestinationOptions(true);
  };

  // Create a custom destination at the tapped location
  const createCustomDestination = () => {
    const customDestination = {
      id: 'custom',
      name: 'Custom Destination',
      coordinates: tappedCoordinate,
      type: 'default'
    };
    
    setSelectedDestination(customDestination);
    setShowDestinationOptions(false);
    
    // Ask if user wants to navigate to this destination
    Alert.alert(
      'Custom Destination',
      'Do you want to navigate to this location?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start Navigation', onPress: () => startNavigation(customDestination) }
      ]
    );
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
      const filtered = campusLandmarks.filter(landmark => 
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
        {campusLandmarks.map(landmark => (
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
                coordinates: [userLocation, selectedDestination.coordinates],
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

      {/* Search Bar - Google Maps Style */}
      <View style={[styles.searchContainer, isSearchFocused && styles.searchContainerFocused]}>
        <Ionicons name="search" size={20} color="#5f5f5f" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search campus..."
          placeholderTextColor="#8e8e93"
          value={searchQuery}
          onChangeText={handleSearch}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => !searchQuery && setIsSearchFocused(false)}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch}>
            <Ionicons name="close-circle" size={20} color="#8e8e93" />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Results List */}
      {showResults && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={searchResults}
            renderItem={renderResultItem}
            keyExtractor={item => item.id}
            keyboardShouldPersistTaps="always"
            ListEmptyComponent={
              <View style={styles.noResults}>
                <Ionicons name="search" size={40} color="#cccccc" />
                <Text style={styles.noResultsText}>No places found</Text>
              </View>
            }
          />
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
      <Modal
        visible={showDestinationOptions}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDestinationOptions(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Destination</Text>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={createCustomDestination}
            >
              <Ionicons name="flag" size={24} color="#4285F4" />
              <Text style={styles.modalOptionText}>Use Current Map Location</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => {
                setShowDestinationOptions(false);
                setIsSearchFocused(true);
              }}
            >
              <Ionicons name="search" size={24} color="#4285F4" />
              <Text style={styles.modalOptionText}>Search for a Location</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalCancel}
              onPress={() => setShowDestinationOptions(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    top: 50,
    left: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 2,
  },
  searchContainerFocused: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    padding: 0,
  },
  resultsContainer: {
    position: 'absolute',
    top: 110,
    left: 15,
    right: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    maxHeight: 300,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultIcon: {
    marginRight: 15,
  },
  resultTextContainer: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    color: '#000',
    marginBottom: 2,
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#8e8e93',
  },
  noResults: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    marginTop: 10,
    fontSize: 16,
    color: '#8e8e93',
  },
  marker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  destinationMarker: {
    backgroundColor: '#34A853',
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  customDestinationMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FBBC05',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userLocationMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userLocationPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4285F4',
    opacity: 0.3,
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: 100,
    right: 15,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  setDestinationButton: {
    position: 'absolute',
    bottom: 160,
    right: 15,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navigationPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 3,
  },
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  navigationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  destinationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  destinationName: {
    fontSize: 16,
    marginLeft: 10,
    color: '#000',
  },
  routeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  routeInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeInfoText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#5f5f5f',
  },
  navigationControls: {
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: '#EA4335',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  stopButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 15,
  },
  modalCancel: {
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#EA4335',
    fontWeight: 'bold',
  },
});

export default Home;