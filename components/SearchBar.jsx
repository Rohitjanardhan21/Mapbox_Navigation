import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/components';

export const SearchBar = ({ 
  searchQuery, 
  onSearch, 
  onClear, 
  isSearchFocused, 
  onFocus, 
  onBlur 
}) => {
  return (
    <View style={[styles.searchContainer, isSearchFocused && styles.searchContainerFocused]}>
      <View style={styles.searchInputWrapper}>
        <Ionicons name="search" size={20} color="#5f5f5f" style={{...styles.searchIcon, width: 20, height: 20}} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search here"
          placeholderTextColor="#8e8e93"
          value={searchQuery}
          onChangeText={onSearch}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <Ionicons name="close" size={18} color="#8e8e93" style={{ width: 18, height: 18 }} />
          </TouchableOpacity>
        )}
      </View>
      
      {!isSearchFocused && (
        <View style={styles.searchRightIcons}>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person" size={18} color="#4285F4" style={{ width: 18, height: 18 }} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
