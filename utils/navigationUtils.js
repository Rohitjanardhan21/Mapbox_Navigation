import Constants from 'expo-constants';

export const calculateRoute = async (origin, destination) => {
  console.log('=== CALCULATE ROUTE CALLED ===');
  console.log('Origin:', origin, 'Type:', typeof origin);
  console.log('Destination:', destination, 'Type:', typeof destination);
  
  // Validate inputs - handle undefined/null values
  if (origin === undefined || origin === null || destination === undefined || destination === null) {
    console.error('❌ Undefined or null values passed to calculateRoute');
    return getFallbackRoute([0, 0], [0, 0]);
  }
  
  // Extract coordinates from objects or use arrays directly
  let originCoords;
  let destCoords;
  
  if (Array.isArray(origin)) {
    originCoords = origin.length === 2 ? origin : [0, 0];
  } else if (origin && typeof origin === 'object' && origin.coordinates) {
    originCoords = Array.isArray(origin.coordinates) && origin.coordinates.length === 2 ? origin.coordinates : [0, 0];
  } else {
    console.error('❌ Invalid origin format:', origin);
    originCoords = [0, 0];
  }
  
  if (Array.isArray(destination)) {
    destCoords = destination.length === 2 ? destination : [0, 0];
  } else if (destination && typeof destination === 'object' && destination.coordinates) {
    destCoords = Array.isArray(destination.coordinates) && destination.coordinates.length === 2 ? destination.coordinates : [0, 0];
  } else {
    console.error('❌ Invalid destination format:', destination);
    destCoords = [0, 0];
  }
  
  console.log('Using coordinates - Origin:', originCoords, 'Destination:', destCoords);
  
  const mapboxToken = Constants.expoConfig.extra?.MAPBOX_ACCESS_TOKEN;
  console.log('Mapbox token available:', !!mapboxToken);
  
  if (!mapboxToken) {
    console.log('Mapbox token not found, using fallback');
    return getFallbackRoute(originCoords, destCoords);
  }

  try {
    // Validate coordinates before making API call
    if (!isValidCoordinate(originCoords) || !isValidCoordinate(destCoords)) {
      console.error('Invalid coordinates, using fallback');
      return getFallbackRoute(originCoords, destCoords);
    }
    
    const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${originCoords[0]},${originCoords[1]};${destCoords[0]},${destCoords[1]}?geometries=geojson&access_token=${mapboxToken}`;
    console.log('API URL:', url);
    
    const response = await fetch(url, {
      timeout: 10000 // 10 second timeout
    });
    
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Mapbox API response received');
    
    if (data.routes && data.routes[0]) {
      const route = data.routes[0];
      const result = {
        distance: route.distance ? (route.distance / 1000).toFixed(1) : '0.0',
        duration: route.duration ? Math.ceil(route.duration / 60) : 0,
        coordinates: route.geometry?.coordinates || [originCoords, destCoords]
      };
      console.log('✅ Route calculated successfully:', result);
      return result;
    } else {
      console.log('No routes found in response, using fallback');
      throw new Error('No routes found in response');
    }
  } catch (error) {
    console.error('Mapbox API error:', error.message);
    return getFallbackRoute(originCoords, destCoords);
  }
};

// Helper function to validate coordinates
const isValidCoordinate = (coord) => {
  return Array.isArray(coord) && 
         coord.length === 2 && 
         typeof coord[0] === 'number' && 
         typeof coord[1] === 'number' &&
         !isNaN(coord[0]) && 
         !isNaN(coord[1]);
};

const getFallbackRoute = (origin, destination) => {
  // Validate coordinates for fallback calculation
  const safeOrigin = isValidCoordinate(origin) ? origin : [0, 0];
  const safeDestination = isValidCoordinate(destination) ? destination : [0, 0];
  
  console.log('Calculating fallback route with:', safeOrigin, '->', safeDestination);
  
  // Check if coordinates are the same (avoid division by zero)
  if (safeOrigin[0] === safeDestination[0] && safeOrigin[1] === safeDestination[1]) {
    console.log('Same coordinates, returning zero distance');
    return {
      distance: '0.0',
      duration: 0,
      coordinates: [safeOrigin, safeDestination]
    };
  }
  
  try {
    // Haversine formula for straight-line distance
    const R = 6371; // Earth's radius in km
    const dLat = (safeDestination[1] - safeOrigin[1]) * Math.PI / 180;
    const dLon = (safeDestination[0] - safeOrigin[0]) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(safeOrigin[1] * Math.PI / 180) * Math.cos(safeDestination[1] * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    // Prevent invalid values for Math.atan2
    const sqrtA = Math.sqrt(a);
    const sqrt1MinusA = Math.sqrt(1 - a);
    
    if (isNaN(sqrtA) || isNaN(sqrt1MinusA)) {
      console.error('Invalid calculation in haversine formula');
      return {
        distance: '0.0',
        duration: 0,
        coordinates: [safeOrigin, safeDestination]
      };
    }
    
    const c = 2 * Math.atan2(sqrtA, sqrt1MinusA);
    const calculatedDistance = R * c;
    const calculatedTime = Math.max(1, Math.ceil((calculatedDistance / 5) * 60)); // At least 1 minute
    
    const result = {
      distance: calculatedDistance.toFixed(1),
      duration: calculatedTime,
      coordinates: [safeOrigin, safeDestination]
    };
    
    console.log('🔄 Using fallback route:', result);
    return result;
  } catch (error) {
    console.error('Error in fallback route calculation:', error);
    // Ultimate fallback - return safe values
    return {
      distance: '1.0',
      duration: 10,
      coordinates: [safeOrigin, safeDestination]
    };
  }
};
