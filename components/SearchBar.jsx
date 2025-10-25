import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchStyles } from '../styles/searchStyles'; // Changed import

const SearchBar = ({
  searchQuery,
  onSearch,
  onClear,
  isSearchFocused,
  onFocus,
  onBlur,
}) => {
  return (
    <View style={searchStyles.searchContainer}>
      <View style={searchStyles.searchInputContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={searchStyles.searchInput}
          placeholder="Search for locations..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={onSearch}
          onFocus={onFocus}
          onBlur={onBlur}
          clearButtonMode="never"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={onClear} style={searchStyles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SearchBar;