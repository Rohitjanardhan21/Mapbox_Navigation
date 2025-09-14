import React from 'react';
import { View, Text, TouchableOpacity, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { iconMap } from '../utils/constants';
import { styles } from '../styles/components';

export const NavigationPanel = ({ 
  slideAnim, 
  selectedDestination, 
  travelTime, 
  distance, 
  onStopNavigation 
}) => {
  return (
    <Animated.View style={[styles.navigationPanel, { transform: [{ translateY: slideAnim }] }]}>
      {/* Debug info */}
      <Text style={{ position: 'absolute', top: 5, right: 5, fontSize: 10, color: '#ff0000' }}>
        Panel Active
      </Text>
      <View style={styles.navigationHeader}>
        <View style={styles.navigationHeaderHandle} />
        
        <TouchableOpacity style={styles.closeButton} onPress={onStopNavigation}>
          <Ionicons name="close" size={20} color="#5f5f5f" style={{ width: 20, height: 20 }} />
        </TouchableOpacity>
      </View>
      
      {selectedDestination && (
        <View style={styles.destinationCard}>
          <View style={styles.destinationHeader}>
            <View style={styles.destinationIconContainer}>
              <Ionicons 
                name={selectedDestination.id === 'custom' ? 'flag' : (iconMap[selectedDestination.type] || 'location')} 
                size={24} 
                color="#FFFFFF"
                style={{ width: 24, height: 24 }} 
              />
            </View>
            <View style={styles.destinationTextContainer}>
              <Text style={styles.destinationName}>{selectedDestination.name}</Text>
              <Text style={styles.destinationSubtext}>Fastest route available</Text>
            </View>
          </View>
          
          {travelTime && distance && (
            <View style={styles.routeInfoCard}>
              <View style={styles.routeMainInfo}>
                <Text style={styles.routeTimeText}>{travelTime} min</Text>
                <Text style={styles.routeDistanceText}>{distance} km</Text>
              </View>
              
              <View style={styles.routeDetails}>
                <View style={styles.routeDetailItem}>
                  <Ionicons name="time" size={16} color="#5f5f5f" />
                  <Text style={styles.routeDetailText}>Arrive at {getArrivalTime(travelTime)}</Text>
                </View>
                
                <View style={styles.routeDetailItem}>
                  <Ionicons name="walk" size={16} color="#5f5f5f" />
                  <Text style={styles.routeDetailText}>Walking directions</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      )}
      
      <View style={styles.navigationControls}>
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => {
            // Keep navigation active when Start is pressed
            // This prevents the panel from closing
            Alert.alert(
              'Navigation Started',
              'Follow the route to reach your destination',
              [{ text: 'OK' }]
            );
          }}
        >
          <Text style={styles.startButtonText}>Start</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.stopButton} onPress={onStopNavigation}>
          <Text style={styles.stopButtonText}>Exit</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// Helper function to calculate arrival time
const getArrivalTime = (travelTimeMinutes) => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + parseInt(travelTimeMinutes));
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
