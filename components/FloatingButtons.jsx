import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/components';

const FloatingButtons = ({ 
  onGoToCurrentLocation, 
  onSetDestination,
  onShowLayers,
}) => {
  return (
    <View style={styles.floatingButtonsContainer}>
      <TouchableOpacity 
        style={styles.setDestinationButton}
        onPress={onSetDestination}
      >
        <Ionicons name="navigate" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.currentLocationButton}
        onPress={onGoToCurrentLocation}
      >
        <Ionicons name="locate" size={24} color="#4285F4" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={onShowLayers}
      >
        <Ionicons name="layers" size={22} color="#5f5f5f" />
      </TouchableOpacity>
    </View>
  );
};

export default FloatingButtons;