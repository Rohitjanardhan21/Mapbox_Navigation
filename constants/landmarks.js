// constants/landmarks.js
// Campus landmarks data

export const landmarks = [
  // Buildings and Academic Centers
  { 
    id: 'christ-university-kengeri', 
    name: 'Christ University - Kengeri Campus', 
    description: 'Main university campus',
    coordinates: [77.6038, 12.9349],
    type: 'university' 
  },
  { 
    id: 'open-air-auditorium', 
    name: 'Open Air Auditorium', 
    description: 'Outdoor auditorium for events',
    coordinates: [77.6042, 12.9355],
    type: 'building' 
  },
  { 
    id: 'vc-guest-house', 
    name: 'VC Guest House', 
    description: 'Vice Chancellor Guest House',
    coordinates: [77.6040, 12.9348],
    type: 'building' 
  },
  { 
    id: 'd-block', 
    name: 'D Block', 
    description: 'Academic block D',
    coordinates: [77.6045, 12.9345],
    type: 'academic' 
  },
  { 
    id: 'block-6', 
    name: 'Block 6', 
    description: 'Academic block 6',
    coordinates: [77.6048, 12.9352],
    type: 'academic' 
  },
  { 
    id: 'residential-pu-block', 
    name: 'Residential PU Block', 
    description: 'Residential Pre-University block',
    coordinates: [77.6038, 12.9342],
    type: 'residential' 
  },

  // Food and Dining
  { 
    id: 'punjabi-bites', 
    name: 'Punjabi Bites', 
    description: 'Punjabi food restaurant',
    coordinates: [77.6044, 12.9358],
    type: 'food' 
  },
  { 
    id: 'kns', 
    name: 'KNS', 
    description: 'KNS Food outlet',
    coordinates: [77.6036, 12.9352],
    type: 'food' 
  },
  { 
    id: 'north-canteen', 
    name: 'North Canteen', 
    description: 'North campus canteen',
    coordinates: [77.6046, 12.9340],
    type: 'food' 
  },

  // Sports Facilities
  { 
    id: 'basketball-court', 
    name: 'Basketball Court', 
    description: 'Outdoor basketball court',
    coordinates: [77.6034, 12.9348],
    type: 'sports' 
  },
  { 
    id: 'tennis-court', 
    name: 'Tennis Court', 
    description: 'Tennis court facility',
    coordinates: [77.6032, 12.9344],
    type: 'sports' 
  },
  { 
    id: 'football-ground', 
    name: 'Football Ground', 
    description: 'Football playing field',
    coordinates: [77.6030, 12.9350],
    type: 'sports' 
  },

  // Natural Areas and Gardens
  { 
    id: 'coconut-grove', 
    name: 'Coconut Grove', 
    description: 'Coconut tree grove area',
    coordinates: [77.6028, 12.9356],
    type: 'garden' 
  },
  { 
    id: 'dove-lake', 
    name: 'Dove Lake', 
    description: 'Campus lake area',
    coordinates: [77.6042, 12.9350],
    type: 'landmark' 
  },
  { 
    id: 'goose-lake', 
    name: 'Goose Lake', 
    description: 'Campus lake area',
    coordinates: [77.6050, 12.9348],
    type: 'landmark' 
  },
  { 
    id: 'devadan-garden', 
    name: 'Devadan Garden', 
    description: 'Garden area on campus',
    coordinates: [77.6048, 12.9342],
    type: 'garden' 
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