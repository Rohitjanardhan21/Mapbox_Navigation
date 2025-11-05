import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/components';

const DestinationOptionsModal = ({ visible, onClose, onCreateCustomDestination, onSearchLocation }) => {
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
          
          <View style={styles.optionsContainer}>
            <Text style={styles.optionsTitle}>Set a Destination</Text>
            
            <TouchableOpacity style={styles.optionButton} onPress={onSearchLocation}>
              <Ionicons name="search" size={24} color="#4285F4" style={styles.optionIcon} />
              <Text style={styles.optionText}>Search for a location</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton} onPress={onCreateCustomDestination}>
              <Ionicons name="map" size={24} color="#4285F4" style={styles.optionIcon} />
              <Text style={styles.optionText}>Select on map</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DestinationOptionsModal;