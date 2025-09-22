import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // SearchBar styles
  searchContainer: {
    // REMOVED: position: 'absolute', top, left, right, zIndex
  },
  searchInputWrapper: { // Corrected name to match SearchBar.js
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  clearButton: {
    padding: 5,
  },
  // Additions to support the profile button in SearchBar.js
  searchIcon: {
    marginRight: 10,
  },
  searchRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButton: {
    padding: 8,
    marginLeft: 8,
  },
  searchContainerFocused: {
    // Add styles for focused state if needed, e.g., borderColor
  },

  // SearchResults styles
  resultsContainer: {
    // REMOVED: position: 'absolute', top, left, right, zIndex
    backgroundColor: 'white',
    borderRadius: 15,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultIcon: {
    marginRight: 12,
  },
  resultTextContainer: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  navigateButton: {
    padding: 8,
  },
  noResults: {
    padding: 30,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },

  // NavigationPanel styles
  navigationPanel: {
    // REMOVED: position: 'absolute', bottom, left, right, zIndex
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  navigationHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  navigationHeaderHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ddd',
    borderRadius: 3,
    marginBottom: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 8,
  },
  destinationCard: {
    marginBottom: 20,
  },
  destinationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  destinationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  destinationTextContainer: {
    flex: 1,
  },
  destinationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  destinationSubtext: {
    fontSize: 14,
    color: '#666',
  },
  routeInfoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  routeMainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  routeTimeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  routeDistanceText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  routeDetails: {
    gap: 8,
  },
  routeDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeDetailText: {
    fontSize: 14,
    color: '#5f5f5f',
  },
  navigationControls: {
    flexDirection: 'row',
    gap: 12,
  },
  startButton: {
    flex: 1,
    backgroundColor: '#4285F4',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stopButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  stopButtonText: {
    color: '#5f5f5f',
    fontWeight: '500',
    fontSize: 16,
  },

  // FloatingButtons styles
  floatingButtons: {
    // REMOVED: position: 'absolute', bottom, right, gap
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // DestinationModal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 200,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
  closeModalButton: {
    alignItems: 'center',
    padding: 15,
    marginTop: 10,
  },
  closeModalText: {
    fontSize: 16,
    color: '#666',
  },

  // MapMarkers styles
  markerContainer: {
    alignItems: 'center',
  },
  markerPin: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  selectedMarker: {
    backgroundColor: '#ff6b35',
    transform: [{ scale: 1.2 }],
  },
});

export default styles;