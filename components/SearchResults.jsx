import React from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { iconMap } from '../utils/constants';
import { styles } from '../styles/components';

export const SearchResults = ({ 
  searchResults, 
  showResults, 
  onSelectResult, 
  onStartNavigation 
}) => {
  const renderResultItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.resultItem} 
      onPress={() => onSelectResult(item)}
    >
      <Ionicons 
        name={iconMap[item.type] || iconMap.default} 
        size={20} 
        color="#5f5f5f" 
        style={styles.resultIcon}
      />
      <View style={styles.resultTextContainer}>
        <Text style={styles.resultTitle}>{item.name}</Text>
        <Text style={styles.resultSubtitle}>Campus Location</Text>
      </View>
      <TouchableOpacity onPress={() => onStartNavigation(item)}>
        <Ionicons name="navigate" size={24} color="#4285F4" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (!showResults) return null;

  return (
    <View style={styles.resultsContainer}>
      <FlatList
        data={searchResults}
        renderItem={renderResultItem}
        keyExtractor={item => item.id}
        keyboardShouldPersistTaps="always"
        ListEmptyComponent={
          <View style={styles.noResults}>
            <Ionicons name="search" size={40} color="#cccccc" />
            <Text style={styles.noResultsText}>No places found</Text>
          </View>
        }
      />
    </View>
  );
};
