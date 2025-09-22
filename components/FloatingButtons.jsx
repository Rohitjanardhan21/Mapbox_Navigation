import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/components';

const FloatingButtons = ({ 
  onGoToCurrentLocation, 
  onSetDestination,
  // New props for added functionality
  onShowLayers,
  onExplore,
}) => {
  return (
    <>
      {/* All floating buttons should be inside a single container for consistent positioning */}
      <View style={styles.floatingButtonsContainer}>
        {/* Set Destination Button */}
        <TouchableOpacity 
          style={styles.setDestinationButton}
          onPress={onSetDestination}
        >
          <Ionicons name="navigate" size={24} color="#FFFFFF" style={{ width: 24, height: 24 }} />
        </TouchableOpacity>

        {/* Current Location Button */}
        <TouchableOpacity 
          style={styles.currentLocationButton}
          onPress={onGoToCurrentLocation}
        >
          <Ionicons name="locate" size={24} color="#4285F4" style={{ width: 24, height: 24 }} />
        </TouchableOpacity>

        {/* Layers Button */}
        <TouchableOpacity 
          style={styles.floatingButton}
          onPress={onShowLayers} // Using new prop
        >
          <Ionicons name="layers" size={22} color="#5f5f5f" style={{ width: 22, height: 22 }} />
        </TouchableOpacity>

        {/* Explore Button */}
        <TouchableOpacity 
          style={styles.exploreButton}
          onPress={onExplore} // Using new prop
        >
          <Ionicons name="compass" size={22} color="#5f5f5f" style={{ width: 22, height: 22 }} />
          <Text style={styles.exploreButtonText}>Explore</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default FloatingButtons;