// constants/landmarks.js
// Campus landmarks data

export const landmarks = [
  // Buildings and Academic Centers
  { 
    id: 'sq1', 
    name: 'SQ1', 
    description: 'SQ1 Building',
    coordinates: [77.6032, 12.9342], 
    type: 'building' 
  },
  { 
    id: 'shree-swamin', 
    name: 'Shree Swamin', 
    description: 'Shree Swamin Building',
    coordinates: [77.6034, 12.9345], // Corrected coordinate
    type: 'building' 
  },
  { 
    id: 'gurudu-intern', 
    name: 'Gurudu! Intern', 
    description: 'Gurudu Internship Center',
    coordinates: [77.6036, 12.9347], // Corrected coordinate
    type: 'academic' 
  },
  { 
    id: 'christ-university', 
    name: 'Christ University', 
    description: 'Main university building',
    coordinates: [77.6038, 12.9349], // Corrected coordinate
    type: 'university' 
  },
  { 
    id: 'faculty-engineering', 
    name: 'Faculty of Engineering', 
    description: 'Engineering department',
    coordinates: [77.6040, 12.9351], // Corrected coordinate
    type: 'academic' 
  },
  { 
    id: 'kns', 
    name: 'KNS', 
    description: 'KNS Building',
    coordinates: [77.6042, 12.9353], // Corrected coordinate
    type: 'building' 
  },
  { 
    id: 'ebook-5', 
    name: 'EBook 5', 
    description: 'EBook building 5',
    coordinates: [77.6044, 12.9355], // Corrected coordinate
    type: 'academic' 
  },
  { 
    id: 'p-building', 
    name: 'P Building', 
    description: 'P Block',
    coordinates: [77.6046, 12.9357], // Corrected coordinate
    type: 'academic' 
  },

  // Food and Recreation
  { 
    id: 'plungeis-bites', 
    name: 'Plungeis Bites', 
    description: 'Food court and cafeteria',
    coordinates: [77.6048, 12.9359], // Corrected coordinate
    type: 'food' 
  },
  { 
    id: 'palm-groves', 
    name: 'Palm Groves', 
    description: 'Palm tree area',
    coordinates: [77.6050, 12.9361], // Corrected coordinate
    type: 'garden' 
  },
  
  // Sports and Outdoor Areas
  { 
    id: 'basketball-court', 
    name: 'Basketball Court', 
    description: 'Sports basketball court',
    coordinates: [77.6052, 12.9363], // Corrected coordinate
    type: 'sports' 
  },
  { 
    id: 'baseball-court', 
    name: 'Baseball Court', 
    description: 'Sports baseball court',
    coordinates: [77.6054, 12.9365], // Corrected coordinate
    type: 'sports' 
  },
  { 
    id: 'tennis-court', 
    name: 'Tennis Court', 
    description: 'Sports tennis court',
    coordinates: [77.6056, 12.9367], // Corrected coordinate
    type: 'sports' 
  },

  // Other Landmarks
  { 
    id: 'wookieo', 
    name: 'Wookieo', 
    description: 'Wookieo area',
    coordinates: [77.6058, 12.9369], // Corrected coordinate
    type: 'landmark' 
  },
  { 
    id: 'mapbox-area', 
    name: 'Mapbox Area', 
    description: 'Mapbox designated area',
    coordinates: [77.6060, 12.9371], // Corrected coordinate
    type: 'landmark' 
  },
];

// Default center coordinate for the map (Christ University approximate location)
export const DEFAULT_LOCATION = {
  latitude: 12.9345,
  longitude: 77.6035,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

// Default camera settings for the map
export const DEFAULT_CAMERA_SETTINGS = {
  centerCoordinate: [77.6035, 12.9345], // [longitude, latitude]
  zoomLevel: 16,
  animationDuration: 1000,
  navigationZoomLevel: 17,
};