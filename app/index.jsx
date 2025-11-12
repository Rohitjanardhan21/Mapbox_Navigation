import { useEffect, useState, useRef } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  Alert,
  Keyboard,
  Share
} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { Ionicons } from '@expo/vector-icons';

import { landmarks } from "../constants/landmarks";

// Hooks
import { useLocation } from '../hooks/useLocation';
import { useSearch } from '../hooks/useSearch';
import { useNavigation } from '../hooks/useNavigation';

// Components
import FuturisticSearchBar from '../components/FuturisticSearchBar';
import SearchResults from '../components/SearchResults';
import EnhancedNavigationPanel from '../components/EnhancedNavigationPanel';
import DestinationModal from '../components/DestinationModal';
import SmartFloatingButtons from '../components/SmartFloatingButtons';
import ModernBottomBar from '../components/ModernBottomBar';
import MenuModal from '../components/MenuModal';
import SettingsModal from '../components/SettingsModal';

// Styles
import { styles } from '../styles/main';
import { iconMap, DEFAULT_CAMERA_SETTINGS } from '../utils/constants';

// Set Mapbox access token - using a valid token
MapboxGL.setAccessToken('pk.eyJ1IjoiYmVyaWNrcyIsImEiOiJjbWVkMmxhdDIwNXdyMmxzNTA3ZnprMHk3In0.hE8cQigI9JFbb9YBHnOsHQ');

const Home = () => {
  const [ready, setReady] = useState(false);
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/streets-v11');
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [activeTab, setActiveTab] = useState('explore');
  const [showLayersMenu, setShowLayersMenu] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(DEFAULT_CAMERA_SETTINGS.zoomLevel);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const cameraRef = useRef(null);
  const mapRef = useRef(null);

  // Use custom hooks
  const { userLocation, locationPermission, goToCurrentLocation } = useLocation();
  
  const {
    searchQuery,
    searchResults,
    showResults,
    isSearchFocused,
    handleSearch,
    clearSearch,
    handleSelectResult: selectResult,
    setIsSearchFocused,
    showAllLocations
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
    handleImmediateMapNavigation,
    createCustomDestination,
    selectRandomDestination,
    setShowDestinationOptions
  } = useNavigation();

  useEffect(() => {
    const initMap = async () => {
      await MapboxGL.requestAndroidLocationPermissions();
      setReady(true);
    };
    initMap();
  }, []);

  const handleGoToCurrentLocation = async () => {
    try {
      const location = await goToCurrentLocation();
      if (location && cameraRef.current) {
        cameraRef.current.setCamera({
          centerCoordinate: location,
          zoomLevel: 16,
          animationDuration: 1000,
        });
      }
    } catch (error) {
      console.error('Error going to current location:', error);
      Alert.alert('Error', 'Could not get current location');
    }
  };

  const handleMapPressAndRoute = (event) => {
    if (isSearchFocused || (searchResults && searchResults.length > 0)) {
      clearSearch();
      Keyboard.dismiss();
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
        
        if (destination.coordinates && cameraRef.current) {
          cameraRef.current.setCamera({
            centerCoordinate: destination.coordinates,
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

  const handleSelectResult = (result) => {
    selectResult(result);
    Keyboard.dismiss();

    if (cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: result.coordinates,
        zoomLevel: 17,
        animationDuration: 1000,
      });
    }
  };

  const handleQuickNavigation = (item) => {
    if (!userLocation) {
      Alert.alert('Location Required', 'Please wait for your location to be detected');
      return;
    }
    
    try {
      handleSelectResult(item);
      startNavigation(userLocation, item);
    } catch (error) {
      console.error('Error in quick navigation:', error);
      Alert.alert('Error', 'Failed to start navigation');
    }
  };

  const handleLandmarkPress = (landmark) => {
    try {
      if (cameraRef.current) {
        cameraRef.current.setCamera({
          centerCoordinate: landmark.coordinates,
          zoomLevel: 16,
          animationDuration: 1000,
        });
      }
    } catch (error) {
      console.error('Error in handleLandmarkPress:', error);
      Alert.alert('Error', 'Failed to select landmark');
    }
  };

  const handleCreateCustomDestination = async () => {
    if (!userLocation) {
      Alert.alert('Location Required', 'Please wait for your location to be detected');
      return;
    }

    const destination = createCustomDestination();
    if (destination) {
      Alert.alert(
        'Custom Destination',
        'Do you want to navigate to this location?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Start Navigation', 
            onPress: async () => {
              await startNavigation(userLocation, destination);
            }
          }
        ]
      );
    }
  };

  const zoomIn = () => {
    const newZoom = Math.min(currentZoom + 1, 20);
    setCurrentZoom(newZoom);
    if (cameraRef.current) {
      cameraRef.current.setCamera({
        zoomLevel: newZoom,
        animationDuration: 300,
      });
    }
  };

  const zoomOut = () => {
    const newZoom = Math.max(currentZoom - 1, 0);
    setCurrentZoom(newZoom);
    if (cameraRef.current) {
      cameraRef.current.setCamera({
        zoomLevel: newZoom,
        animationDuration: 300,
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

  const handleExplore = () => {
    setActiveTab('explore');
    Alert.alert('Explore', 'Browse nearby places and landmarks');
  };

  const handleGo = () => {
    setActiveTab('go');
    setIsSearchFocused(true);
  };

  const handleSaved = () => {
    setActiveTab('saved');
    Alert.alert('Saved', 'View your saved places');
  };

  const handleContribute = () => {
    setActiveTab('contribute');
    Alert.alert('Contribute', 'Add or edit places on the map');
  };

  const handleUpdates = () => {
    setActiveTab('updates');
    Alert.alert('Updates', 'View recent updates and notifications');
  };

  if (!ready) {
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
        ref={mapRef}
        style={styles.map}
        styleURL={mapStyle}
        onPress={handleMapPressAndRoute}
        onDidFinishLoadingMap={() => console.log('Map loaded successfully')}
        onDidFailLoadingMap={(error) => console.warn('Map loading failed:', error)}
      >
        <MapboxGL.Camera 
          ref={cameraRef}
          defaultSettings={{
            zoomLevel: DEFAULT_CAMERA_SETTINGS.zoomLevel, 
            centerCoordinate: DEFAULT_CAMERA_SETTINGS.centerCoordinate
          }}
        />
        
        {landmarks.map(landmark => (
          <MapboxGL.PointAnnotation
            key={landmark.id}
            id={landmark.id}
            coordinate={landmark.coordinates}
            onSelected={() => setSelectedMarker(landmark)}
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
          </MapboxGL.PointAnnotation>
        ))}
        
        {userLocation && (
          <MapboxGL.UserLocation visible={true} />
        )}
        
        {isNavigating && routeInfo && routeInfo.coordinates && routeInfo.coordinates.length > 0 && (
          <MapboxGL.ShapeSource
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

      <FuturisticSearchBar
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onClear={clearSearch}
        onFocus={() => {
          setIsSearchFocused(true);
          showAllLocations();
        }}
        onBlur={() => {
          if (!searchQuery) {
            setIsSearchFocused(false);
          }
        }}
        isSearchFocused={isSearchFocused}
        onVoiceSearch={() => {
          Alert.alert('Voice Search', 'Voice search feature coming soon!', [
            { text: 'OK' }
          ]);
        }}
        onMenu={() => setShowMenuModal(true)}
        onProfile={() => {
          Alert.alert(
            'Profile',
            'User Profile',
            [
              { text: 'View Profile', onPress: () => Alert.alert('Profile', 'Profile details') },
              { text: 'Edit Profile', onPress: () => Alert.alert('Edit', 'Edit your profile') },
              { text: 'Logout', onPress: () => Alert.alert('Logout', 'Logged out') },
              { text: 'Cancel', style: 'cancel' }
            ]
          );
        }}
      />

      {showResults && searchResults && searchResults.length > 0 ? (
        <SearchResults
          results={searchResults}
          onSelectResult={handleSelectResult}
          onQuickNavigation={handleQuickNavigation}
        />
      ) : isSearchFocused && (
        <View style={{ 
          position: 'absolute', 
          top: 90, 
          left: 16, 
          right: 16, 
          backgroundColor: 'white', 
          padding: 20, 
          borderRadius: 16,
          elevation: 10,
          zIndex: 999
        }}>
          <Text style={{ fontSize: 14, color: '#666' }}>
            Debug: showResults={showResults ? 'true' : 'false'}, 
            results={searchResults?.length || 0}
          </Text>
        </View>
      )}

      {isNavigating && (
        <EnhancedNavigationPanel
          slideAnim={slideAnim}
          selectedDestination={selectedDestination}
          travelTime={travelTime}
          distance={distance}
          onStopNavigation={stopNavigation}
          isNavigating={isNavigating}
        />
      )}

      <SmartFloatingButtons
        onCurrentLocation={handleGoToCurrentLocation}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onToggleMapStyle={toggleMapStyle}
        on3DView={() => Alert.alert('3D View', '3D view activated')}
        onTraffic={() => Alert.alert('Traffic', 'Traffic layer toggled')}
        isNavigating={isNavigating}
      />

      <ModernBottomBar
        onExplore={handleExplore}
        onGo={handleGo}
        onSaved={handleSaved}
        onContribute={handleContribute}
        onUpdates={handleUpdates}
        activeTab={activeTab}
      />

      <DestinationModal
        visible={showDestinationOptions}
        onClose={() => setShowDestinationOptions(false)}
        onNavigate={handleCreateCustomDestination}
      />

      <MenuModal
        visible={showMenuModal}
        onClose={() => setShowMenuModal(false)}
        onSettings={() => {
          setShowMenuModal(false);
          setShowSettingsModal(true);
        }}
        onAbout={() => {
          setShowMenuModal(false);
          Alert.alert('About', 'Navigation App v1.0\n\nA modern navigation app with real-time directions and advanced features.');
        }}
        onHelp={() => {
          setShowMenuModal(false);
          Alert.alert('Help & Support', 'For help:\n• Tap search to find locations\n• Tap a location to navigate\n• Use voice guidance for directions\n\nContact: support@navapp.com');
        }}
        onFeedback={() => {
          setShowMenuModal(false);
          Alert.alert('Send Feedback', 'We\'d love to hear from you!\n\nEmail: feedback@navapp.com');
        }}
        onShare={async () => {
          setShowMenuModal(false);
          try {
            await Share.share({
              message: 'Check out this amazing Navigation App! Download now.',
              title: 'Navigation App',
            });
          } catch (error) {
            console.error('Share error:', error);
          }
        }}
      />

      <SettingsModal
        visible={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </View>
  );
};

export default Home;
