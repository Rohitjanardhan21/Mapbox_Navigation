import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapboxGL from '@rnmapbox/maps';
import { iconMap } from '../utils/constants';
import { styles } from '../styles/components';

// Ensure Ionicons is properly loaded
import * as Font from 'expo-font';

export const MapMarkers = ({ 
  landmarks, 
  userLocation, 
  selectedDestination, 
  onLandmarkPress 
}) => {
  return (
    <>
      {/* Add markers for all campus landmarks */}
      {landmarks.map(landmark => (
        <MapboxGL.PointAnnotation
          key={landmark.id}
          id={landmark.id}
          coordinate={landmark.coordinates}
          onSelected={() => onLandmarkPress(landmark)}
        >
          <View style={[
            markerStyles.markerIconContainer,
            selectedDestination && selectedDestination.id === landmark.id ? 
              markerStyles.selectedMarker : null
          ]}>
            <Ionicons 
              name={iconMap[landmark.type] || 'location'} 
              size={16} 
              color={selectedDestination && selectedDestination.id === landmark.id ? '#FFFFFF' : '#4285F4'}
              style={{ width: 16, height: 16 }} 
            />
          </View>
          
          <MapboxGL.Callout title={landmark.name}>
            <View style={markerStyles.calloutContainer}>
              <Text style={markerStyles.calloutTitle}>{landmark.name}</Text>
              <Text style={markerStyles.calloutSubtitle}>{landmark.type}</Text>
              <View style={markerStyles.calloutActions}>
                <TouchableOpacity 
                  style={markerStyles.calloutButton}
                  onPress={() => {
                    console.log('Directions button pressed for:', landmark.name);
                    onLandmarkPress(landmark);
                  }}
                >
                  <Ionicons name="navigate" size={14} color="#4285F4" style={{ width: 14, height: 14 }} />
                  <Text style={markerStyles.calloutButtonText}>Directions</Text>
                </TouchableOpacity>
                <TouchableOpacity style={markerStyles.calloutButton}>
                  <Ionicons name="star" size={14} color="#4285F4" style={{ width: 14, height: 14 }} />
                  <Text style={markerStyles.calloutButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </MapboxGL.Callout>
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
            <Ionicons name="person" size={16} color="white" style={{ width: 16, height: 16 }} />
          </View>
        </MapboxGL.PointAnnotation>
      )}
      
      {/* Show custom destination marker if set */}
      {selectedDestination && selectedDestination.id === 'custom' && (
        <MapboxGL.PointAnnotation
          id="customDestination"
          coordinate={selectedDestination.coordinates}
        >
          <View style={markerStyles.customDestinationMarker}>
            <Ionicons name="flag" size={16} color="white" style={{ width: 16, height: 16 }} />
          </View>
        </MapboxGL.PointAnnotation>
      )}
    </>
  );
};

const markerStyles = StyleSheet.create({
  markerIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  selectedMarker: {
    backgroundColor: '#4285F4',
    zIndex: 1,
  },
  customDestinationMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EA4335',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    width: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#202124',
    marginBottom: 4,
  },
  calloutSubtitle: {
    fontSize: 14,
    color: '#5f6368',
    marginBottom: 8,
  },
  calloutActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E8EAED',
    paddingTop: 8,
  },
  calloutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  calloutButtonText: {
    fontSize: 12,
    color: '#4285F4',
    marginLeft: 4,
    fontWeight: '500',
  },
});
