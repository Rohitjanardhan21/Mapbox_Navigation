/**
 * Saved Routes and Favorites Management
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVED_ROUTES_KEY = '@campus_nav_saved_routes';
const FAVORITE_PLACES_KEY = '@campus_nav_favorites';
const RECENT_SEARCHES_KEY = '@campus_nav_recent';

// Saved Routes
export const saveRoute = async (route) => {
  try {
    const existing = await getSavedRoutes();
    const newRoute = {
      id: Date.now().toString(),
      ...route,
      savedAt: new Date().toISOString()
    };
    const updated = [newRoute, ...existing].slice(0, 20); // Keep last 20
    await AsyncStorage.setItem(SAVED_ROUTES_KEY, JSON.stringify(updated));
    return newRoute;
  } catch (error) {
    console.error('Error saving route:', error);
    return null;
  }
};

export const getSavedRoutes = async () => {
  try {
    const data = await AsyncStorage.getItem(SAVED_ROUTES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting saved routes:', error);
    return [];
  }
};

export const deleteRoute = async (routeId) => {
  try {
    const existing = await getSavedRoutes();
    const updated = existing.filter(r => r.id !== routeId);
    await AsyncStorage.setItem(SAVED_ROUTES_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error deleting route:', error);
    return false;
  }
};

// Favorite Places
export const addFavorite = async (place) => {
  try {
    const existing = await getFavorites();
    const newFavorite = {
      id: Date.now().toString(),
      ...place,
      addedAt: new Date().toISOString()
    };
    const updated = [newFavorite, ...existing];
    await AsyncStorage.setItem(FAVORITE_PLACES_KEY, JSON.stringify(updated));
    return newFavorite;
  } catch (error) {
    console.error('Error adding favorite:', error);
    return null;
  }
};

export const getFavorites = async () => {
  try {
    const data = await AsyncStorage.getItem(FAVORITE_PLACES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const removeFavorite = async (placeId) => {
  try {
    const existing = await getFavorites();
    const updated = existing.filter(f => f.id !== placeId);
    await AsyncStorage.setItem(FAVORITE_PLACES_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error removing favorite:', error);
    return false;
  }
};

export const isFavorite = async (placeId) => {
  try {
    const favorites = await getFavorites();
    return favorites.some(f => f.id === placeId);
  } catch (error) {
    return false;
  }
};

// Recent Searches
export const addRecentSearch = async (search) => {
  try {
    const existing = await getRecentSearches();
    // Remove duplicates
    const filtered = existing.filter(s => s.name !== search.name);
    const updated = [search, ...filtered].slice(0, 10); // Keep last 10
    await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error adding recent search:', error);
    return false;
  }
};

export const getRecentSearches = async () => {
  try {
    const data = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting recent searches:', error);
    return [];
  }
};

export const clearRecentSearches = async () => {
  try {
    await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing recent searches:', error);
    return false;
  }
};
