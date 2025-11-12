import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { campusBuildings, buildingTypes } from '../utils/campusBuildings';
import { getFavorites } from '../utils/savedRoutes';

const QuickAccessPanel = ({ visible, onClose, onSelectDestination, userLocation }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, [visible]);

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavorites(favs);
  };

  const categories = [
    { id: 'all', name: 'All', icon: 'grid' },
    { id: 'academic', name: 'Academic', icon: 'school' },
    { id: 'dining', name: 'Dining', icon: 'restaurant' },
    { id: 'recreation', name: 'Sports', icon: 'fitness' },
    { id: 'residential', name: 'Hostels', icon: 'home' },
    { id: 'favorites', name: 'Favorites', icon: 'star' }
  ];

  const getFilteredBuildings = () => {
    if (activeTab === 'favorites') {
      return favorites;
    }
    if (activeTab === 'all') {
      return campusBuildings;
    }
    return campusBuildings.filter(b => b.type === activeTab);
  };

  const renderBuilding = (building) => {
    const typeInfo = buildingTypes[building.type] || { icon: 'location', color: '#666' };
    
    return (
      <TouchableOpacity
        key={building.id}
        style={styles.buildingCard}
        onPress={() => {
          onSelectDestination(building);
          onClose();
        }}
      >
        <View style={[styles.iconContainer, { backgroundColor: typeInfo.color + '20' }]}>
          <Ionicons name={typeInfo.icon} size={24} color={typeInfo.color} />
        </View>
        
        <View style={styles.buildingInfo}>
          <Text style={styles.buildingName}>{building.name}</Text>
          <Text style={styles.buildingType}>{building.type}</Text>
          {building.openHours && (
            <Text style={styles.buildingHours}>
              <Ionicons name="time-outline" size={12} /> {building.openHours}
            </Text>
          )}
        </View>

        <View style={styles.buildingMeta}>
          {building.hasElevator && (
            <Ionicons name="arrow-up-circle" size={16} color="#4CAF50" />
          )}
          {building.hasRamp && (
            <Ionicons name="accessibility" size={16} color="#2196F3" style={{ marginLeft: 5 }} />
          )}
        </View>
      </TouchableOpacity>
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
            <Text style={styles.headerTitle}>Quick Access</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.tab, activeTab === cat.id && styles.activeTab]}
                onPress={() => setActiveTab(cat.id)}
              >
                <Ionicons 
                  name={cat.icon} 
                  size={20} 
                  color={activeTab === cat.id ? '#4285F4' : '#666'} 
                />
                <Text style={[styles.tabText, activeTab === cat.id && styles.activeTabText]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView style={styles.buildingList}>
            {getFilteredBuildings().map(renderBuilding)}
          </ScrollView>
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
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  activeTab: {
    backgroundColor: '#E3F2FD',
  },
  tabText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#4285F4',
    fontWeight: '600',
  },
  buildingList: {
    padding: 15,
  },
  buildingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  buildingInfo: {
    flex: 1,
  },
  buildingName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  buildingType: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: 3,
  },
  buildingHours: {
    fontSize: 11,
    color: '#999',
  },
  buildingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default QuickAccessPanel;
