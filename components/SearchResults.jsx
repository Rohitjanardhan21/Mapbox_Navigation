import React from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { iconMap } from '../utils/constants';
import { searchStyles } from '../styles/searchStyles'; // Changed import

export const SearchResults = ({ 
  searchResults, 
  showResults, 
  onSelectResult,
  onStartNavigation
}) => {
  const renderResultItem = ({ item }) => (
    <TouchableOpacity 
      style={searchStyles.resultItem} 
      onPress={() => {
        console.log('Search result selected:', item);
        if (onSelectResult) {
          onSelectResult(item);
        }
      }}
    >
      <Ionicons 
        name={iconMap[item.type] || iconMap.default} 
        size={20} 
        color="#5f5f5f" 
        style={searchStyles.resultIcon}
      />
      <View style={searchStyles.resultTextContainer}>
        <Text style={searchStyles.resultTitle}>{item.name}</Text>
        <Text style={searchStyles.resultSubtitle}>
          {item.address || item.description || 'Campus Location'}
        </Text>
      </View>

      <TouchableOpacity 
        onPress={() => {
          console.log('Navigate button pressed:', item);
          if (onStartNavigation) {
            onStartNavigation(item);
          }
        }}
        style={searchStyles.navigateButton}
      >
        <Ionicons name="navigate" size={24} color="#4285F4" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (!showResults || !searchResults || searchResults.length === 0) {
    return null;
  }

  return (
    <View style={searchStyles.resultsContainer}>
      <FlatList
        data={searchResults}
        renderItem={renderResultItem}
        keyExtractor={(item, index) => item.id || `search-result-${index}`}
        keyboardShouldPersistTaps="always"
      />
    </View>
  );
};

export default SearchResults;