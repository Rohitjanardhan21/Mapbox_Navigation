import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { iconMap } from '../utils/constants';
import { styles } from '../styles/components';

export const DestinationModal = ({ visible, landmark, onClose, onStartNavigation }) => {
  if (!landmark) return null;

  // Mock data for Google Maps-like features
  const placeDetails = {
    rating: 4.5,
    reviews: 120,
    hours: "Open until 8:00 PM",
    website: "www.example.com",
    phone: "(123) 456-7890"
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeaderBar}>
            <View style={styles.modalHeaderHandle} />
            <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
              <Ionicons name="close" size={20} color="#5f6368" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScrollView}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconContainer}>
                <Ionicons 
                  name={landmark.id === 'custom' ? 'flag' : (iconMap[landmark.type] || iconMap.default)} 
                  size={24} 
                  color="#FFFFFF" 
                />
              </View>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle}>{landmark.name}</Text>
                <Text style={styles.modalSubtitle}>
                  {landmark.id === 'custom' ? 'Custom destination' : landmark.type}
                </Text>
                {placeDetails.rating && (
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>{placeDetails.rating}</Text>
                    <View style={styles.starsContainer}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons 
                          key={star}
                          name={star <= Math.floor(placeDetails.rating) ? "star" : "star-outline"} 
                          size={14} 
                          color={star <= Math.floor(placeDetails.rating) ? "#FBBC04" : "#DADCE0"} 
                          style={{marginRight: 2}}
                        />
                      ))}
                    </View>
                    <Text style={styles.reviewsText}>({placeDetails.reviews})</Text>
                  </View>
                )}
              </View>
            </View>
            
            <View style={styles.modalActionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="navigate" size={20} color="#4285F4" />
                <Text style={styles.actionButtonText}>Directions</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="save" size={20} color="#4285F4" />
                <Text style={styles.actionButtonText}>Save</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="share-social" size={20} color="#4285F4" />
                <Text style={styles.actionButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalInfoSection}>
              <View style={styles.infoItem}>
                <Ionicons name="time" size={20} color="#5f6368" style={styles.infoIcon} />
                <Text style={styles.infoText}>{placeDetails.hours}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Ionicons name="globe" size={20} color="#5f6368" style={styles.infoIcon} />
                <Text style={styles.infoText}>{placeDetails.website}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Ionicons name="call" size={20} color="#5f6368" style={styles.infoIcon} />
                <Text style={styles.infoText}>{placeDetails.phone}</Text>
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.startNavigationButton} 
              onPress={() => onStartNavigation(landmark)}
            >
              <Text style={styles.startNavigationButtonText}>Start Navigation</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DestinationModal;