import { useEffect, useState, useRef, useCallback } from 'react';
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
  Modal
} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Speech from 'expo-speech';

import { landmarks } from "../constants/landmarks";
import { styles } from '../styles/Design_Home';





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
  const [navigationOpened, setNavigationOpened] = useState(false);
  const [travelTime, setTravelTime] = useState(null);
  const [distance, setDistance] = useState(null);
  const [showDestinationOptions, setShowDestinationOptions] = useState(false);
  const [tappedCoordinate, setTappedCoordinate] = useState(null);
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/streets-v11');
  const [showMapControls, setShowMapControls] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [voiceGuidanceEnabled, setVoiceGuidanceEnabled] = useState(true);
  const [lastVoiceAnnouncement, setLastVoiceAnnouncement] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [weatherData, setWeatherData] = useState(null);
  const [showWeather, setShowWeather] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isVoiceSearching, setIsVoiceSearching] = useState(false);
  const [autoSuggestions, setAutoSuggestions] = useState([]);
  const [showAutoSuggestions, setShowAutoSuggestions] = useState(false);
  const [quickShortcuts, setQuickShortcuts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedLocationDetails, setSelectedLocationDetails] = useState(null);
  const [showLocationBottomSheet, setShowLocationBottomSheet] = useState(false);
  const cameraRef = useRef(null);
  const mapRef = useRef(null);
  const isMountedRef = useRef(true);



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

  // Marker selection handler with proper cleanup
  const handleMarkerSelect = useCallback((landmark) => {
    if (isMountedRef.current) {
      setSelectedMarker(landmark);
    }
  }, []);

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
            if (isNavigating && cameraRef.current && isMountedRef.current) {
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

      // Fetch weather data
      fetchWeatherData();
    })();

    return () => {
      isMountedRef.current = false;
      // Clear any pending camera operations
      if (cameraRef.current) {
        cameraRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current = null;
      }
    };
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

      if (cameraRef.current && isMountedRef.current) {
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
    setNavigationOpened(true);

    // Calculate route
    const route = await calculateRoute(userLocation, destination.coordinates);
    setRouteInfo(route);

    // Show navigation panel
    setNavigationOpened(true);

    // Announce navigation start
    setTimeout(() => announceNavigationStart(destination), 1000);
  };

  // Stop navigation
  const stopNavigation = () => {
    if (selectedDestination) {
      announceArrival(selectedDestination);
    }
    setIsNavigating(false);
    setNavigationOpened(false);
    setSelectedDestination(null);
    setRouteInfo(null);
    setLastVoiceAnnouncement(null);
  };

  // Set a custom destination by tapping on the map
  const handleMapPress = (event) => {
    const coordinate = event.geometry.coordinates;
    setTappedCoordinate(coordinate);
    setSelectedMarker(null); // Close any open callouts
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

  // Map control functions
  const zoomIn = () => {
    if (cameraRef.current && isMountedRef.current && mapRef.current) {
      cameraRef.current.getCamera().then(camera => {
        if (isMountedRef.current && cameraRef.current) {
          cameraRef.current.setCamera({
            zoomLevel: camera.zoom + 1,
            animationDuration: 300,
          });
        }
      }).catch(error => {
        console.warn('Camera zoom in error:', error);
      });
    }
  };

  const zoomOut = () => {
    if (cameraRef.current && isMountedRef.current && mapRef.current) {
      cameraRef.current.getCamera().then(camera => {
        if (isMountedRef.current && cameraRef.current) {
          cameraRef.current.setCamera({
            zoomLevel: Math.max(camera.zoom - 1, 0),
            animationDuration: 300,
          });
        }
      }).catch(error => {
        console.warn('Camera zoom out error:', error);
      });
    }
  };

  const toggleMapStyle = () => {
    const styles = [
      'mapbox://styles/mapbox/streets-v11',
      'mapbox://styles/mapbox/satellite-v9',
      'mapbox://styles/mapbox/outdoors-v11'
    ];
    
    const currentIndex = styles.indexOf(mapStyle);
    const nextIndex = (currentIndex + 1) % styles.length;
    setMapStyle(styles[nextIndex]);
  };

  // Enhanced map style names for UI
  const getMapStyleName = () => {
    switch(mapStyle) {
      case 'mapbox://styles/mapbox/streets-v11': return 'Street';
      case 'mapbox://styles/mapbox/satellite-v9': return 'Satellite';
      case 'mapbox://styles/mapbox/outdoors-v11': return 'Terrain';
      default: return 'Street';
    }
  };

  const resetNorth = () => {
    if (cameraRef.current && isMountedRef.current && mapRef.current) {
      cameraRef.current.setCamera({
        heading: 0,
        animationDuration: 500,
      }).catch(error => {
        console.warn('Camera reset north error:', error);
      });
    }
  };

  // Voice guidance functions
  const speak = (text) => {
    if (voiceGuidanceEnabled && text !== lastVoiceAnnouncement) {
      Speech.speak(text, {
        language: 'en',
        pitch: 1,
        rate: 0.8,
      });
      setLastVoiceAnnouncement(text);
    }
  };

  const announceNavigationStart = (destination) => {
    const message = `Starting navigation to ${destination.name}. Estimated travel time: ${travelTime} minutes. Distance: ${distance} kilometers.`;
    speak(message);
  };

  const announceArrival = (destination) => {
    const message = `You have arrived at ${destination.name}. Navigation complete.`;
    speak(message);
  };

  const announceLocationUpdate = () => {
    if (travelTime && distance && selectedDestination) {
      const message = `${travelTime} minutes remaining. ${distance} kilometers to go.`;
      speak(message);
    }
  };

  // Favorites functions
  const addToFavorites = (location) => {
    if (!favorites.find(fav => fav.id === location.id)) {
      setFavorites([...favorites, location]);
      speak(`${location.name} added to favorites`);
    }
  };

  const removeFromFavorites = (locationId) => {
    setFavorites(favorites.filter(fav => fav.id !== locationId));
  };

  const isFavorite = (locationId) => {
    return favorites.some(fav => fav.id === locationId);
  };

  // Weather functions
  const fetchWeatherData = async () => {
    try {
      // Using OpenWeatherMap API (you'll need to add your API key to constants)
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=12.8631&lon=77.4379&units=metric&appid=${Constants.expoConfig.extra?.OPENWEATHER_API_KEY || 'demo'}`
      );

      if (response.ok) {
        const data = await response.json();
        setWeatherData({
          temperature: Math.round(data.main.temp),
          condition: data.weather[0].main,
          description: data.weather[0].description,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          icon: data.weather[0].icon,
        });
      } else {
        // Fallback to demo data
        setWeatherData({
          temperature: 28,
          condition: 'Clear',
          description: 'clear sky',
          humidity: 65,
          windSpeed: 3.5,
          icon: '01d',
        });
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
      // Fallback to demo data
      setWeatherData({
        temperature: 28,
        condition: 'Clear',
        description: 'clear sky',
        humidity: 65,
        windSpeed: 3.5,
        icon: '01d',
      });
    }
  };

  // Set destination from search results with bottom sheet
  const handleSelectResult = (result) => {
    setSearchQuery(result.name);
    setShowResults(false);
    setIsSearchFocused(false);
    setShowAutoSuggestions(false);
    Keyboard.dismiss();

    // Add to recent searches
    addToRecentSearches(result);

    if (cameraRef.current && isMountedRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: result.coordinates,
        zoomLevel: 17,
        animationDuration: 1000,
      });
    }

    // Show location details in bottom sheet
    setSelectedLocationDetails(result);
    setShowLocationBottomSheet(true);
  };

  // Pull to refresh functionality
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Refresh weather data
      await fetchWeatherData();
      // Refresh location if needed
      if (locationPermission) {
        await goToCurrentLocation();
      }
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.length > 0) {
      // Generate auto-suggestions
      const suggestions = landmarks
        .filter(landmark => landmark.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
        .map(landmark => landmark.name);
      
      setAutoSuggestions(suggestions);
      setShowAutoSuggestions(query.length > 1);

      let filtered = landmarks.filter(landmark =>
        landmark.name.toLowerCase().includes(query.toLowerCase())
      );

      // Apply category filter
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(landmark => landmark.type === selectedCategory);
      }

      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
      setAutoSuggestions([]);
      setShowAutoSuggestions(false);
    }
  };

  // Voice search functionality
  const startVoiceSearch = async () => {
    setIsVoiceSearching(true);
    try {
      // Note: You'll need to install expo-speech for this to work
      // For now, we'll simulate voice search
      setTimeout(() => {
        setIsVoiceSearching(false);
        // Simulate voice input
        handleSearch("library");
      }, 2000);
    } catch (error) {
      console.error('Voice search error:', error);
      setIsVoiceSearching(false);
    }
  };

  // Generate quick shortcuts based on time and usage
  const generateQuickShortcuts = () => {
    const hour = new Date().getHours();
    let shortcuts = [];

    if (hour >= 7 && hour <= 10) {
      shortcuts = landmarks.filter(l => l.type === 'academic').slice(0, 3);
    } else if (hour >= 11 && hour <= 14) {
      shortcuts = landmarks.filter(l => l.type === 'food').slice(0, 3);
    } else if (hour >= 15 && hour <= 18) {
      shortcuts = landmarks.filter(l => l.type === 'library').slice(0, 3);
    } else {
      shortcuts = favorites.slice(0, 3);
    }

    setQuickShortcuts(shortcuts);
  };

  const addToRecentSearches = (location) => {
    const updated = [location, ...recentSearches.filter(item => item.id !== location.id)].slice(0, 5);
    setRecentSearches(updated);
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
      {/* Enhanced Map with Dark Mode Support */}
      <MapboxGL.MapView
        key={`map-${mapStyle}-${isDarkMode}`}
        ref={mapRef}
        style={styles.map}
        styleURL={isDarkMode ? 'mapbox://styles/mapbox/dark-v10' : mapStyle}
        onPress={handleMapPress}
        onDidFinishLoadingMap={() => console.log('Map loaded successfully')}
        onDidFailLoadingMap={(error) => console.warn('Map loading failed:', error)}
      >
        <MapboxGL.Camera 
          key={`camera-${mapStyle}`}
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
            onSelected={() => handleMarkerSelect(landmark)}
          >
            <View style={[
              styles.marker,
              selectedDestination && selectedDestination.id === landmark.id && styles.destinationMarker
            ]}>
              <Ionicons
                name={iconMap[landmark.type] || iconMap.default}
                size={18}
                color="white"
              />
            </View>
            {selectedMarker && selectedMarker.id === landmark.id && (
              <MapboxGL.Callout style={styles.callout}>
                <View style={styles.calloutContent}>
                  <Text style={styles.calloutTitle}>{landmark.name}</Text>
                  <Text style={styles.calloutSubtitle}>Campus Location</Text>
                  <View style={styles.calloutActions}>
                    <TouchableOpacity
                      style={styles.calloutButton}
                      onPress={() => {
                        setSelectedMarker(null);
                        handleSelectResult(landmark);
                      }}
                    >
                      <Ionicons name="information-circle" size={16} color="#4285F4" />
                      <Text style={styles.calloutButtonText}>Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.calloutButton}
                      onPress={() => {
                        if (isFavorite(landmark.id)) {
                          removeFromFavorites(landmark.id);
                        } else {
                          addToFavorites(landmark);
                        }
                      }}
                    >
                      <Ionicons
                        name={isFavorite(landmark.id) ? "heart" : "heart-outline"}
                        size={16}
                        color={isFavorite(landmark.id) ? "#e74c3c" : "#95a5a6"}
                      />
                      <Text style={styles.calloutButtonText}>
                        {isFavorite(landmark.id) ? "Unfavorite" : "Favorite"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.calloutButton}
                      onPress={() => {
                        setSelectedMarker(null);
                        startNavigation(landmark);
                      }}
                    >
                      <Ionicons name="navigate" size={16} color="#27ae60" />
                      <Text style={styles.calloutButtonText}>Navigate</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </MapboxGL.Callout>
            )}
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
        {isNavigating && routeInfo && routeInfo.coordinates && routeInfo.coordinates.length > 0 && (
          <MapboxGL.ShapeSource
            key={`route-${routeInfo.coordinates.length}`}
            id="routeSource"
            shape={{
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: routeInfo.coordinates,
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

      {/* Enhanced Search Bar with Voice Search */}
      <View
        style={[
          styles.searchContainer, 
          isSearchFocused && styles.searchContainerFocused,
          isDarkMode && styles.searchContainerDark
        ]}
        accessible={true}
        accessibilityRole="search"
        accessibilityLabel="Campus search"
        accessibilityHint="Search for locations on campus"
      >
        <Ionicons name="search" size={22} color={isDarkMode ? "#9aa0a6" : "#5f6368"} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, isDarkMode && styles.searchInputDark]}
          placeholder="Search here"
          placeholderTextColor={isDarkMode ? "#80868b" : "#9aa0a6"}
          value={searchQuery}
          onChangeText={handleSearch}
          onFocus={() => {
            setIsSearchFocused(true);
            generateQuickShortcuts();
          }}
          onBlur={() => {
            if (!searchQuery) {
              setIsSearchFocused(false);
              setShowAutoSuggestions(false);
            }
          }}
          accessible={true}
          accessibilityLabel="Search input"
          accessibilityHint="Type to search for campus locations"
          autoComplete="off"
          autoCorrect={false}
          autoCapitalize="words"
          selectionColor="#4285F4"
        />
        
        {/* Voice Search Button */}
        <TouchableOpacity
          onPress={startVoiceSearch}
          style={[styles.voiceSearchButton, isVoiceSearching && styles.voiceSearchButtonActive]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Voice search"
          accessibilityHint="Tap to search by voice"
          activeOpacity={0.7}
        >
          <Ionicons 
            name={isVoiceSearching ? "radio-button-on" : "mic"} 
            size={18} 
            color={isVoiceSearching ? "#ea4335" : "#5f6368"} 
          />
        </TouchableOpacity>

        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={clearSearch}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            accessibilityHint="Clear the search text"
            style={styles.clearSearchButton}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={18} color="#5f6368" />
          </TouchableOpacity>
        )}
        
        <View style={[styles.searchDivider, isDarkMode && styles.searchDividerDark]} />
        
        <TouchableOpacity
          style={styles.favoritesButton}
          onPress={() => setShowFavorites(!showFavorites)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Favorites ${favorites.length > 0 ? `(${favorites.length} saved)` : '(empty)'}`}
          accessibilityHint="View your favorite locations"
          activeOpacity={0.7}
        >
          <Ionicons
            name={favorites.length > 0 ? "heart" : "heart-outline"}
            size={20}
            color={favorites.length > 0 ? "#ea4335" : "#5f6368"}
          />
        </TouchableOpacity>
      </View>

      {/* Auto-suggestions Dropdown */}
      {showAutoSuggestions && autoSuggestions.length > 0 && (
        <View style={[styles.autoSuggestionsContainer, isDarkMode && styles.autoSuggestionsContainerDark]}>
          {autoSuggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.suggestionItem, isDarkMode && styles.suggestionItemDark]}
              onPress={() => {
                setSearchQuery(suggestion);
                handleSearch(suggestion);
                setShowAutoSuggestions(false);
              }}
            >
              <Ionicons name="search" size={16} color="#9aa0a6" style={styles.suggestionIcon} />
              <Text style={[styles.suggestionText, isDarkMode && styles.suggestionTextDark]}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Quick Shortcuts */}
      {isSearchFocused && !showResults && quickShortcuts.length > 0 && (
        <View style={[styles.quickShortcutsContainer, isDarkMode && styles.quickShortcutsContainerDark]}>
          <Text style={[styles.quickShortcutsTitle, isDarkMode && styles.quickShortcutsTitleDark]}>Quick Access</Text>
          {quickShortcuts.map((shortcut) => (
            <TouchableOpacity
              key={shortcut.id}
              style={[styles.shortcutItem, isDarkMode && styles.shortcutItemDark]}
              onPress={() => handleSelectResult(shortcut)}
            >
              <Ionicons
                name={iconMap[shortcut.type] || iconMap.default}
                size={20}
                color="#4285F4"
                style={styles.shortcutIcon}
              />
              <Text style={[styles.shortcutText, isDarkMode && styles.shortcutTextDark]}>{shortcut.name}</Text>
              <Ionicons name="arrow-forward" size={16} color="#9aa0a6" />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Search Results List */}
      {showResults && (
        <View style={styles.resultsContainer}>
          {/* Category Filters */}
          <View style={styles.categoryFilters}>
            {[
              { key: 'all', label: 'All', icon: 'apps' },
              { key: 'academic', label: 'Academic', icon: 'school' },
              { key: 'food', label: 'Food', icon: 'restaurant' },
              { key: 'sports', label: 'Sports', icon: 'basketball' },
              { key: 'admin', label: 'Admin', icon: 'business' },
            ].map(category => (
              <TouchableOpacity
                key={category.key}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.key && styles.categoryButtonActive
                ]}
                onPress={() => {
                  setSelectedCategory(category.key);
                  handleSearch(searchQuery); // Re-filter with new category
                }}
              >
                <Ionicons
                  name={category.icon}
                  size={16}
                  color={selectedCategory === category.key ? '#fff' : '#2c3e50'}
                />
                <Text style={[
                  styles.categoryButtonText,
                  selectedCategory === category.key && styles.categoryButtonTextActive
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <FlatList
            data={searchResults}
            renderItem={renderResultItem}
            keyExtractor={item => item.id}
            keyboardShouldPersistTaps="always"
            ListEmptyComponent={
              <View style={styles.noResults}>
                <Ionicons name="search" size={40} color="#cccccc" />
                <Text style={styles.noResultsText}>No places found</Text>
                <Text style={styles.noResultsSubtext}>
                  Try adjusting your search or category filter
                </Text>
              </View>
            }
          />
        </View>
      )}

      {/* Recent Searches */}
      {!showResults && !showFavorites && recentSearches.length > 0 && (
        <View style={styles.recentSearchesContainer}>
          <View style={styles.recentSearchesHeader}>
            <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
            <TouchableOpacity onPress={() => setRecentSearches([])}>
              <Text style={styles.clearRecentText}>Clear</Text>
            </TouchableOpacity>
          </View>
          {recentSearches.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.recentSearchItem}
              onPress={() => handleSelectResult(item)}
            >
              <Ionicons
                name={iconMap[item.type] || iconMap.default}
                size={20}
                color="#7f8c8d"
                style={styles.recentSearchIcon}
              />
              <View style={styles.recentSearchTextContainer}>
                <Text style={styles.recentSearchTitle}>{item.name}</Text>
                <Text style={styles.recentSearchSubtitle}>Campus Location</Text>
              </View>
              <TouchableOpacity onPress={() => startNavigation(item)}>
                <Ionicons name="navigate" size={24} color="#4285F4" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Favorites List */}
      {showFavorites && (
        <View style={styles.favoritesContainer}>
          <View style={styles.favoritesHeader}>
            <Text style={styles.favoritesTitle}>Favorites</Text>
            <TouchableOpacity onPress={() => setShowFavorites(false)}>
              <Ionicons name="close" size={24} color="#2c3e50" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={favorites}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.favoriteItem}
                onPress={() => {
                  setShowFavorites(false);
                  handleSelectResult(item);
                }}
              >
                <Ionicons
                  name={iconMap[item.type] || iconMap.default}
                  size={20}
                  color="#4285F4"
                  style={styles.favoriteIcon}
                />
                <View style={styles.favoriteTextContainer}>
                  <Text style={styles.favoriteTitle}>{item.name}</Text>
                  <Text style={styles.favoriteSubtitle}>Campus Location</Text>
                </View>
                <TouchableOpacity
                  onPress={() => removeFromFavorites(item.id)}
                  style={styles.removeFavoriteButton}
                >
                  <Ionicons name="heart" size={20} color="#e74c3c" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => startNavigation(item)}>
                  <Ionicons name="navigate" size={24} color="#4285F4" />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
            ListEmptyComponent={
              <View style={styles.noFavorites}>
                <Ionicons name="heart-outline" size={40} color="#cccccc" />
                <Text style={styles.noFavoritesText}>No favorites yet</Text>
                <Text style={styles.noFavoritesSubtext}>Tap the heart icon on locations to add them here</Text>
              </View>
            }
          />
        </View>
      )}

      {/* Google Maps Style Bottom Bar */}
      <View style={[styles.bottomBar, isDarkMode && styles.bottomBarDark]}>
        <View style={styles.bottomBarContent}>
          {/* Current Location */}
          <TouchableOpacity
            style={styles.bottomBarButton}
            onPress={goToCurrentLocation}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Go to current location"
          >
            <Ionicons name="locate" size={24} color={isDarkMode ? "#8ab4f8" : "#4285F4"} />
            <Text style={[styles.bottomBarButtonText, isDarkMode && styles.bottomBarButtonTextDark]}>
              My Location
            </Text>
          </TouchableOpacity>

          {/* Explore */}
          <TouchableOpacity
            style={styles.bottomBarButton}
            onPress={() => {
              setIsSearchFocused(true);
              generateQuickShortcuts();
            }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Explore locations"
          >
            <Ionicons name="compass" size={24} color={isDarkMode ? "#8ab4f8" : "#4285F4"} />
            <Text style={[styles.bottomBarButtonText, isDarkMode && styles.bottomBarButtonTextDark]}>
              Explore
            </Text>
          </TouchableOpacity>

          {/* Directions */}
          <TouchableOpacity
            style={styles.bottomBarButton}
            onPress={() => setShowDestinationOptions(true)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Get directions"
          >
            <Ionicons name="navigate" size={24} color={isDarkMode ? "#8ab4f8" : "#4285F4"} />
            <Text style={[styles.bottomBarButtonText, isDarkMode && styles.bottomBarButtonTextDark]}>
              Directions
            </Text>
          </TouchableOpacity>

          {/* Saved */}
          <TouchableOpacity
            style={styles.bottomBarButton}
            onPress={() => setShowFavorites(true)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="View saved places"
          >
            <View style={styles.savedButtonContainer}>
              <Ionicons name="heart" size={24} color={favorites.length > 0 ? "#ea4335" : (isDarkMode ? "#9aa0a6" : "#5f6368")} />
              {favorites.length > 0 && (
                <View style={styles.savedBadge}>
                  <Text style={styles.savedBadgeText}>{favorites.length}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.bottomBarButtonText, isDarkMode && styles.bottomBarButtonTextDark]}>
              Saved
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Weather Icon - Small toggle button */}
      {weatherData && (
        <TouchableOpacity
          style={styles.weatherIconButton}
          onPress={() => setShowWeather(!showWeather)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Weather: ${weatherData.temperature}°C, ${weatherData.condition}`}
          accessibilityHint="Tap to view weather details"
        >
          <Ionicons 
            name={weatherData.condition === 'Clear' ? "sunny" : weatherData.condition === 'Rain' ? "rainy" : "partly-sunny"} 
            size={20} 
            color="#5f6368" 
          />
        </TouchableOpacity>
      )}

      {/* Weather Details Modal */}
      {showWeather && weatherData && (
        <Modal
          visible={showWeather}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowWeather(false)}
        >
          <TouchableOpacity 
            style={styles.weatherModalOverlay}
            activeOpacity={1}
            onPress={() => setShowWeather(false)}
          >
            <View style={styles.weatherModal}>
              <View style={styles.weatherModalHeader}>
                <Text style={styles.weatherModalTitle}>Weather</Text>
                <TouchableOpacity onPress={() => setShowWeather(false)}>
                  <Ionicons name="close" size={24} color="#2c3e50" />
                </TouchableOpacity>
              </View>
              <View style={styles.weatherModalContent}>
                <View style={styles.weatherMainInfo}>
                  <Ionicons 
                    name={weatherData.condition === 'Clear' ? "sunny" : weatherData.condition === 'Rain' ? "rainy" : "partly-sunny"} 
                    size={48} 
                    color="#4285F4" 
                  />
                  <Text style={styles.weatherModalTemp}>{weatherData.temperature}°C</Text>
                </View>
                <Text style={styles.weatherModalCondition}>{weatherData.condition}</Text>
                <View style={styles.weatherModalStats}>
                  <View style={styles.weatherModalStat}>
                    <Ionicons name="water" size={20} color="#5f6368" />
                    <Text style={styles.weatherModalStatText}>Humidity: {weatherData.humidity}%</Text>
                  </View>
                  <View style={styles.weatherModalStat}>
                    <Ionicons name="speedometer" size={20} color="#5f6368" />
                    <Text style={styles.weatherModalStatText}>Wind: {weatherData.windSpeed} m/s</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Top Right Controls */}
      <View style={styles.topRightControls}>
        {/* Dark/Light Mode Toggle - More Visible */}
        <TouchableOpacity
          style={[styles.themeToggleButton, isDarkMode && styles.themeToggleButtonDark]}
          onPress={() => setIsDarkMode(!isDarkMode)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        >
          <Ionicons 
            name={isDarkMode ? "sunny" : "moon"} 
            size={20} 
            color={isDarkMode ? "#fdd835" : "#5f6368"} 
          />
        </TouchableOpacity>
      </View>

      {/* Map Controls */}
      {showMapControls && (
        <View style={styles.mapControlsContainer} accessible={true} accessibilityLabel="Map controls">
          {/* Zoom Controls */}
          <View style={[styles.zoomControls, isDarkMode && styles.zoomControlsDark]}>
            <TouchableOpacity
              style={[styles.zoomButton, isDarkMode && styles.zoomButtonDark]}
              onPress={zoomIn}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Zoom in"
              accessibilityHint="Increase map zoom level"
            >
              <Ionicons name="add" size={24} color={isDarkMode ? "#e8eaed" : "#2c3e50"} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.zoomButton, isDarkMode && styles.zoomButtonDark]}
              onPress={zoomOut}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Zoom out"
              accessibilityHint="Decrease map zoom level"
            >
              <Ionicons name="remove" size={24} color={isDarkMode ? "#e8eaed" : "#2c3e50"} />
            </TouchableOpacity>
          </View>

          {/* Compass */}
          <TouchableOpacity
            style={[styles.compassButton, isDarkMode && styles.compassButtonDark]}
            onPress={resetNorth}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Reset north"
            accessibilityHint="Rotate map to show north at top"
          >
            <Ionicons name="compass" size={20} color={isDarkMode ? "#e8eaed" : "#2c3e50"} />
          </TouchableOpacity>

          {/* Enhanced Map Style Toggle */}
          <TouchableOpacity
            style={[styles.mapStyleButton, isDarkMode && styles.mapStyleButtonDark]}
            onPress={toggleMapStyle}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Current: ${getMapStyleName()}. Tap to change map style`}
            accessibilityHint="Cycle through street, satellite, and terrain views"
          >
            <Ionicons
              name={mapStyle.includes('satellite') ? 'satellite' : mapStyle.includes('outdoors') ? 'trail-sign' : 'map'}
              size={16}
              color={isDarkMode ? "#e8eaed" : "#2c3e50"}
            />
            <Text style={[styles.mapStyleText, isDarkMode && styles.mapStyleTextDark]}>
              {getMapStyleName()}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Navigation Panel (Bottom Sheet) */}
      {navigationOpened && (
        <View
          style={styles.navigationPanel}
          accessible={true}
          accessibilityLabel="Navigation panel"
        >
          <View style={styles.navigationHeader}>
            <Text style={styles.navigationTitle}>Navigation Active</Text>
            <TouchableOpacity
              onPress={stopNavigation}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Stop navigation"
              accessibilityHint="End current navigation and close panel"
              style={{ minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' }}
            >
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
          <View style={styles.navigationControlRow}>
            <TouchableOpacity
              style={[styles.voiceToggleButton, voiceGuidanceEnabled && styles.voiceToggleButtonActive, { minWidth: 44, minHeight: 44 }]}
              onPress={() => setVoiceGuidanceEnabled(!voiceGuidanceEnabled)}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Voice guidance ${voiceGuidanceEnabled ? 'enabled' : 'disabled'}`}
              accessibilityHint={`Turn voice navigation ${voiceGuidanceEnabled ? 'off' : 'on'}`}
            >
              <Ionicons
                name={voiceGuidanceEnabled ? "volume-high" : "volume-mute"}
                size={20}
                color={voiceGuidanceEnabled ? "#27ae60" : "#95a5a6"}
              />
              <Text style={[styles.voiceToggleText, voiceGuidanceEnabled && styles.voiceToggleTextActive]}>
                Voice {voiceGuidanceEnabled ? 'On' : 'Off'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.stopButton, { minWidth: 44, minHeight: 44 }]}
              onPress={stopNavigation}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Stop navigation"
              accessibilityHint="End current navigation session"
            >
              <Text style={styles.stopButtonText}>Stop Navigation</Text>
            </TouchableOpacity>
          </View>
        </View>
        </View>
      )}

      {/* Location Details Bottom Sheet */}
      <Modal
        visible={showLocationBottomSheet}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLocationBottomSheet(false)}
      >
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity 
            style={styles.bottomSheetBackdrop}
            activeOpacity={1}
            onPress={() => setShowLocationBottomSheet(false)}
          />
          <View style={[styles.bottomSheet, isDarkMode && styles.bottomSheetDark]}>
            <View style={styles.bottomSheetHandle} />
            
            {selectedLocationDetails && (
              <>
                <View style={styles.bottomSheetHeader}>
                  <View style={styles.locationInfo}>
                    <Ionicons
                      name={iconMap[selectedLocationDetails.type] || iconMap.default}
                      size={32}
                      color="#4285F4"
                      style={styles.locationIcon}
                    />
                    <View style={styles.locationTextInfo}>
                      <Text style={[styles.locationTitle, isDarkMode && styles.locationTitleDark]}>
                        {selectedLocationDetails.name}
                      </Text>
                      <Text style={[styles.locationSubtitle, isDarkMode && styles.locationSubtitleDark]}>
                        Campus Location • {selectedLocationDetails.type}
                      </Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity
                    onPress={() => {
                      if (isFavorite(selectedLocationDetails.id)) {
                        removeFromFavorites(selectedLocationDetails.id);
                      } else {
                        addToFavorites(selectedLocationDetails);
                      }
                    }}
                    style={styles.favoriteToggle}
                  >
                    <Ionicons
                      name={isFavorite(selectedLocationDetails.id) ? "heart" : "heart-outline"}
                      size={24}
                      color={isFavorite(selectedLocationDetails.id) ? "#ea4335" : "#9aa0a6"}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.bottomSheetActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.primaryActionButton]}
                    onPress={() => {
                      setShowLocationBottomSheet(false);
                      startNavigation(selectedLocationDetails);
                    }}
                  >
                    <Ionicons name="navigate" size={20} color="#ffffff" />
                    <Text style={styles.primaryActionText}>Navigate</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.secondaryActionButton, isDarkMode && styles.secondaryActionButtonDark]}
                    onPress={() => {
                      // Share location functionality
                      console.log('Share location:', selectedLocationDetails.name);
                    }}
                  >
                    <Ionicons name="share" size={20} color="#4285F4" />
                    <Text style={[styles.secondaryActionText, isDarkMode && styles.secondaryActionTextDark]}>Share</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.locationDetails}>
                  <View style={[styles.detailItem, isDarkMode && styles.detailItemDark]}>
                    <Ionicons name="time" size={16} color="#9aa0a6" />
                    <Text style={[styles.detailText, isDarkMode && styles.detailTextDark]}>
                      Usually open • Campus hours
                    </Text>
                  </View>
                  <View style={[styles.detailItem, isDarkMode && styles.detailItemDark]}>
                    <Ionicons name="location" size={16} color="#9aa0a6" />
                    <Text style={[styles.detailText, isDarkMode && styles.detailTextDark]}>
                      {selectedLocationDetails.coordinates[1].toFixed(4)}, {selectedLocationDetails.coordinates[0].toFixed(4)}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Enhanced Destination Options Modal */}
      <Modal
        visible={showDestinationOptions}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDestinationOptions(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, isDarkMode && styles.modalContentDark]}>
            <Text style={[styles.modalTitle, isDarkMode && styles.modalTitleDark]}>Add Destination</Text>
            
            <TouchableOpacity 
              style={[styles.modalOption, isDarkMode && styles.modalOptionDark]}
              onPress={createCustomDestination}
            >
              <Ionicons name="flag" size={24} color="#4285F4" />
              <Text style={[styles.modalOptionText, isDarkMode && styles.modalOptionTextDark]}>Use Current Map Location</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalOption, isDarkMode && styles.modalOptionDark]}
              onPress={() => {
                setShowDestinationOptions(false);
                setIsSearchFocused(true);
              }}
            >
              <Ionicons name="search" size={24} color="#4285F4" />
              <Text style={[styles.modalOptionText, isDarkMode && styles.modalOptionTextDark]}>Search for a Location</Text>
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



export default Home;