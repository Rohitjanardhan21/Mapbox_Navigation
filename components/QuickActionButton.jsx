import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const QuickActionButton = ({ 
  onPress,
  icon = 'navigate',
  color = '#1A73E8',
  size = 56,
  iconSize = 28,
  style
}) => {
  return (
    <TouchableOpacity 
      style={[styles.quickActionButton, { backgroundColor: color, width: size, height: size }, style]}
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel="Quick navigation"
      accessibilityHint="Start navigation quickly"
      activeOpacity={0.8}
    >
      <Ionicons name={icon} size={iconSize} color="#FFFFFF" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  quickActionButton: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default QuickActionButton;
