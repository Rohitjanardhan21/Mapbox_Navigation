import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ModernBottomBar = ({ 
  onExplore,
  onGo,
  onSaved,
  onContribute,
  onUpdates,
  activeTab = 'explore'
}) => {
  const scaleAnims = {
    explore: useRef(new Animated.Value(activeTab === 'explore' ? 1 : 0)).current,
    go: useRef(new Animated.Value(activeTab === 'go' ? 1 : 0)).current,
    saved: useRef(new Animated.Value(activeTab === 'saved' ? 1 : 0)).current,
    contribute: useRef(new Animated.Value(activeTab === 'contribute' ? 1 : 0)).current,
    updates: useRef(new Animated.Value(activeTab === 'updates' ? 1 : 0)).current,
  };

  useEffect(() => {
    Object.keys(scaleAnims).forEach(key => {
      Animated.spring(scaleAnims[key], {
        toValue: activeTab === key ? 1 : 0,
        useNativeDriver: true,
        tension: 100,
        friction: 7,
      }).start();
    });
  }, [activeTab]);

  const TabButton = ({ name, icon, onPress, tab }) => {
    const isActive = activeTab === tab;
    const scale = scaleAnims[tab];

    return (
      <TouchableOpacity 
        style={styles.tabButton}
        onPress={onPress}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={name}
        activeOpacity={0.7}
      >
        <Animated.View style={[
          styles.iconContainer,
          isActive && styles.iconContainerActive,
          {
            transform: [{ scale: scale.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.1]
            })}]
          }
        ]}>
          <Ionicons 
            name={icon} 
            size={24} 
            color={isActive ? '#FFFFFF' : '#5F6368'} 
          />
        </Animated.View>
        <Animated.Text style={[
          styles.tabText,
          isActive && styles.tabTextActive,
          {
            opacity: scale.interpolate({
              inputRange: [0, 1],
              outputRange: [0.7, 1]
            })
          }
        ]}>
          {name}
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.bottomBar}>
      <View style={styles.innerContainer}>
        <TabButton name="Explore" icon="compass" onPress={onExplore} tab="explore" />
        <TabButton name="Go" icon="navigate" onPress={onGo} tab="go" />
        <TabButton name="Saved" icon="bookmark" onPress={onSaved} tab="saved" />
        <TabButton name="Add" icon="add-circle" onPress={onContribute} tab="contribute" />
        <TabButton name="Updates" icon="notifications" onPress={onUpdates} tab="updates" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 16,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconContainerActive: {
    backgroundColor: '#1A73E8',
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  tabText: {
    fontSize: 11,
    color: '#5F6368',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#1A73E8',
    fontWeight: '700',
  },
});

export default ModernBottomBar;
