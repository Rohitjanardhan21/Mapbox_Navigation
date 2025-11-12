import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Linking,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EmergencyPanel = ({ visible, onClose, userLocation }) => {
  const emergencyContacts = [
    {
      id: 'security',
      name: 'Campus Security',
      phone: '100',
      icon: 'shield-checkmark',
      color: '#2196F3'
    },
    {
      id: 'medical',
      name: 'Medical Emergency',
      phone: '108',
      icon: 'medical',
      color: '#E91E63'
    },
    {
      id: 'fire',
      name: 'Fire Department',
      phone: '101',
      icon: 'flame',
      color: '#FF5722'
    },
    {
      id: 'police',
      name: 'Police',
      phone: '100',
      icon: 'shield',
      color: '#3F51B5'
    }
  ];

  const emergencyLocations = [
    {
      id: 'medical-center',
      name: 'Medical Center',
      coordinates: [77.4378, 12.8633],
      icon: 'medical',
      color: '#E91E63'
    },
    {
      id: 'security-office',
      name: 'Security Office',
      coordinates: [77.4385, 12.8630],
      icon: 'shield-checkmark',
      color: '#2196F3'
    },
    {
      id: 'fire-exit-1',
      name: 'Fire Assembly Point 1',
      coordinates: [77.4375, 12.8635],
      icon: 'exit',
      color: '#FF5722'
    }
  ];

  const handleCall = (phone, name) => {
    Alert.alert(
      'Emergency Call',
      `Call ${name} at ${phone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${phone}`);
          }
        }
      ]
    );
  };

  const handleNavigateToEmergency = (location) => {
    Alert.alert(
      'Navigate to Emergency Location',
      `Navigate to ${location.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Navigate',
          onPress: () => {
            // Trigger navigation
            onClose();
            // You can call your navigation function here
          }
        }
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons name="warning" size={24} color="#FF5722" />
              <Text style={styles.headerTitle}>Emergency</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <View style={styles.contactList}>
            {emergencyContacts.map(contact => (
              <TouchableOpacity
                key={contact.id}
                style={[styles.contactCard, { borderLeftColor: contact.color }]}
                onPress={() => handleCall(contact.phone, contact.name)}
              >
                <View style={[styles.contactIcon, { backgroundColor: contact.color + '20' }]}>
                  <Ionicons name={contact.icon} size={24} color={contact.color} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
                </View>
                <Ionicons name="call" size={24} color={contact.color} />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Emergency Locations</Text>
          <View style={styles.locationList}>
            {emergencyLocations.map(location => (
              <TouchableOpacity
                key={location.id}
                style={styles.locationCard}
                onPress={() => handleNavigateToEmergency(location)}
              >
                <View style={[styles.locationIcon, { backgroundColor: location.color + '20' }]}>
                  <Ionicons name={location.icon} size={20} color={location.color} />
                </View>
                <Text style={styles.locationName}>{location.name}</Text>
                <Ionicons name="navigate" size={20} color="#4285F4" />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.warningBox}>
            <Ionicons name="alert-circle" size={20} color="#FF9800" />
            <Text style={styles.warningText}>
              For life-threatening emergencies, call 108 immediately
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  closeButton: {
    padding: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
    marginBottom: 10,
  },
  contactList: {
    marginBottom: 20,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  contactIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  contactPhone: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  locationList: {
    marginBottom: 20,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  warningText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 12,
    color: '#E65100',
    fontWeight: '500',
  },
});

export default EmergencyPanel;
