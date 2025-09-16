// components/MapMarkers.jsx
import React from 'react';
import MapboxGL from '@rnmapbox/maps';
import { View, Text, StyleSheet } from 'react-native';

const MapMarkers = ({ landmarks, userLocation, selectedDestination, onLandmarkPress }) => {
  return (
    <>
      {/* User location is handled by MapboxGL.UserLocation in the main component */}
      
      {/* Landmark markers */}
      {landmarks.map(landmark => {
        const isSelected = selectedDestination && selectedDestination.id === landmark.id;
        return (
          <MapboxGL.PointAnnotation
            key={landmark.id}
            id={landmark.id.toString()}
            coordinate={landmark.coordinates}
            onPress={() => onLandmarkPress(landmark)}
          >
            <View style={styles.markerContainer}>
              <View style={[
                styles.marker,
                isSelected && styles.selectedMarker
              ]}>
                <Text style={styles.markerText}>
                  {landmark.name.charAt(0)}
                </Text>
              </View>
            </View>
          </MapboxGL.PointAnnotation>
        );
      })}
      
      {/* Selected destination marker (for custom locations)
        This marker will only be rendered if a destination is selected
        AND that destination is NOT one of the predefined landmarks.
      */}
      {selectedDestination && !landmarks.some(l => l.id === selectedDestination.id) && (
        <MapboxGL.PointAnnotation
          id="selected-destination"
          coordinate={selectedDestination.coordinates}
          title="Destination"
        >
          <View style={styles.markerContainer}>
            <View style={styles.destinationMarker}>
              <Text style={styles.destinationMarkerText}>📍</Text>
            </View>
          </View>
        </MapboxGL.PointAnnotation>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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
  selectedMarker: {
    backgroundColor: '#34A853',
    transform: [{ scale: 1.2 }],
  },
  destinationMarker: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destinationMarkerText: {
    fontSize: 30,
  },
  markerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default MapMarkers;