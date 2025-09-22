import { useState } from 'react';
import { landmarks } from '../constants/landmarks';

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.length > 0) {
      const filtered = landmarks.filter(landmark =>
        landmark.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    setIsSearchFocused(false);
  };

  const handleSelectResult = (result) => {
    setSearchQuery(result.name);
    setShowResults(false);
    setIsSearchFocused(false);
    // Removed the 'return result;' statement as it's not used by the parent component.
  };

  return {
    searchQuery,
    searchResults,
    showResults,
    isSearchFocused,
    handleSearch,
    clearSearch,
    handleSelectResult,
    setIsSearchFocused
  };
};