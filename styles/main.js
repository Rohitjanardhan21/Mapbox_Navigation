import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
  
  // Styles for positioning the SearchBar and SearchResults
  searchBarContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40, // Adjust for iOS and Android
    left: 10,
    right: 10,
    zIndex: 2, // Ensures the search bar is on top of the map
  },
  searchResultsContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 120 : 100, // Position it below the search bar
    left: 10,
    right: 10,
    zIndex: 1, // Ensures results are on top of the map, but below the search bar
    maxHeight: '50%',
  },

  // Styles for the loading overlay
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 3, // Ensures it's on top of all other components
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },

  // Existing styles for other components
  navigationPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  // Floating Buttons Container
  floatingButtonsContainer: {
    position: 'absolute',
    bottom: 30, 
    right: 20,
    flexDirection: 'column-reverse', 
    alignItems: 'flex-end',
    gap: 15,
    zIndex: 2,
  },
});