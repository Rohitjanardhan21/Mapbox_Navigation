import Constants from 'expo-constants';

export const calculateRoute = async (origin, destination) => {
  const mapboxToken = Constants.expoConfig.extra?.MAPBOX_ACCESS_TOKEN;
  
  if (!mapboxToken) {
    console.log('Mapbox token not found, using fallback');
    return getFallbackRoute(origin, destination);
  }

  try {
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/walking/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&access_token=${mapboxToken}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.routes && data.routes[0]) {
      const route = data.routes[0];
      return {
        distance: (route.distance / 1000).toFixed(1),
        duration: Math.ceil(route.duration / 60),
        coordinates: route.geometry.coordinates
      };
    } else {
      throw new Error('No routes found in response');
    }
  } catch (error) {
    console.error('Mapbox API error:', error);
    return getFallbackRoute(origin, destination);
  }
};

const getFallbackRoute = (origin, destination) => {
  // Haversine formula for straight-line distance
  const R = 6371;
  const dLat = (destination[1] - origin[1]) * Math.PI / 180;
  const dLon = (destination[0] - origin[0]) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(origin[1] * Math.PI / 180) * Math.cos(destination[1] * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const calculatedDistance = R * c;
  const calculatedTime = (calculatedDistance / 5) * 60;
  
  return {
    distance: calculatedDistance.toFixed(1),
    duration: Math.ceil(calculatedTime),
    coordinates: [origin, destination]
  };
};