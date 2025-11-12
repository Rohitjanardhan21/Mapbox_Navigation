import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BottomBar = ({ 
  onExplore,
  onGo,
  onSaved,
  onContribute,
  onUpdates,
  activeTab = 'explore'
}) => {
  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity 
        style={styles.bottomBarButton}
        onPress={onExplore}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Explore"
        accessibilityHint="Browse nearby places and landmarks"
      >
        <Ionicons 
          name="compass" 
          size={24} 
          color={activeTab === 'explore' ? '#1A73E8' : '#5F6368'} 
        />
        <Text style={[
          styles.bottomBarText,
          activeTab === 'explore' && styles.bottomBarTextActive
        ]}>
          Explore
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.bottomBarButton}
        onPress={onGo}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Go"
        accessibilityHint="Start navigation to a destination"
      >
        <Ionicons 
          name="navigate" 
          size={24} 
          color={activeTab === 'go' ? '#1A73E8' : '#5F6368'} 
        />
        <Text style={[
          styles.bottomBarText,
          activeTab === 'go' && styles.bottomBarTextActive
        ]}>
          Go
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.bottomBarButton}
        onPress={onSaved}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Saved"
        accessibilityHint="View your saved places"
      >
        <Ionicons 
          name="bookmark" 
          size={24} 
          color={activeTab === 'saved' ? '#1A73E8' : '#5F6368'} 
        />
        <Text style={[
          styles.bottomBarText,
          activeTab === 'saved' && styles.bottomBarTextActive
        ]}>
          Saved
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.bottomBarButton}
        onPress={onContribute}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Contribute"
        accessibilityHint="Add or edit places"
      >
        <Ionicons 
          name="add-circle-outline" 
          size={24} 
          color={activeTab === 'contribute' ? '#1A73E8' : '#5F6368'} 
        />
        <Text style={[
          styles.bottomBarText,
          activeTab === 'contribute' && styles.bottomBarTextActive
        ]}>
          Contribute
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.bottomBarButton}
        onPress={onUpdates}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Updates"
        accessibilityHint="View recent updates and notifications"
      >
        <Ionicons 
          name="notifications-outline" 
          size={24} 
          color={activeTab === 'updates' ? '#1A73E8' : '#5F6368'} 
        />
        <Text style={[
          styles.bottomBarText,
          activeTab === 'updates' && styles.bottomBarTextActive
        ]}>
          Updates
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: 8,
    paddingTop: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bottomBarButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  bottomBarText: {
    fontSize: 12,
    color: '#5F6368',
    marginTop: 4,
    fontWeight: '500',
  },
  bottomBarTextActive: {
    color: '#1A73E8',
    fontWeight: '600',
  },
});

export default BottomBar;
