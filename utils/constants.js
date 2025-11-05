export const iconMap = {
  academic: 'school',
  library: 'library',
  food: 'restaurant',
  sports: 'basketball',
  admin: 'business',
  shopping: 'cart',
  // Additions to match the landmarks data
  building: 'business', // Using 'business' or another suitable icon
  university: 'school', // 'university' can also be used
  garden: 'leaf',       // A 'leaf' or 'rose' icon is a good choice
  landmark: 'map',      // A 'map' or 'pin' icon works well
  // The default icon for unknown types
  default: 'location'
};

export const DEFAULT_CAMERA_SETTINGS = {
  zoomLevel: 15,
  centerCoordinate: [77.4379, 12.8631],
  navigationZoomLevel: 17
};