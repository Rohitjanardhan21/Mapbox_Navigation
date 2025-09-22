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
  // Add safety checks
  if (!showResults || !searchResults || !Array.isArray(searchResults)) {
    return null;
  }

  const renderResultItem = ({ item, index }) => {
    // Ensure item has required properties
    if (!item || !item.name) {
      return null;
    }
    
    // Create a unique key for each item
    const itemKey = item.id || `search-result-${index}`;
    
    return (
      <TouchableOpacity 
        style={styles.resultItem} 
        onPress={() => {
          console.log('Search result selected:', item);
          if (onSelectResult && typeof onSelectResult === 'function') {
            onSelectResult(item);
          } else {
            console.error('onSelectResult is not a function:', onSelectResult);
          }
        }}
      >
        <Ionicons 
          name={iconMap[item.type] || iconMap.default} 
          size={20} 
          color="#5f5f5f" 
          style={styles.resultIcon}
        />
        <View style={styles.resultTextContainer}>
          <Text style={styles.resultTitle}>{item.name}</Text>
          <Text style={styles.resultSubtitle}>
            {item.address || item.description || 'Campus Location'}
          </Text>
        </View>

        {/* Navigate icon: starts navigation directly */}
        {onStartNavigation && (
          <TouchableOpacity 
            onPress={() => {
              console.log('Navigate button pressed:', item);
              if (onStartNavigation && typeof onStartNavigation === 'function') {
                onStartNavigation(item);
              } else {
                console.error('onStartNavigation is not a function:', onStartNavigation);
              }
            }}
            style={styles.navigateButton}
          >
            <Ionicons name="navigate" size={24} color="#4285F4" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.resultsContainer}>
      <FlatList
        data={searchResults}
        renderItem={renderResultItem}
        keyExtractor={(item, index) => item.id || `search-result-${index}`}
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

export default SearchResults;