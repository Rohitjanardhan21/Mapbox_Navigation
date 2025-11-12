// constants/landmarks.js
// Campus landmarks data

export const landmarks = [
  // Buildings and Academic Centers
  { 
    id: 'christ-university-kengeri', 
    name: 'Christ University - Kengeri Campus', 
    description: 'Main university campus',
    coordinates: [77.43789, 12.86313],
    type: 'university' 
  },
  { 
    id: 'open-air-auditorium', 
    name: 'Open Air Auditorium', 
    description: 'Outdoor auditorium for events',
    coordinates: [77.43820, 12.86380],
    type: 'building' 
  },
  { 
    id: 'vc-guest-house', 
    name: 'VC Guest House', 
    description: 'Vice Chancellor Guest House',
    coordinates: [77.43765, 12.86472],
    type: 'building' 
  },
  { 
    id: 'd-block', 
    name: 'D Block', 
    description: 'Academic block D',
    coordinates: [77.43810, 12.86250],
    type: 'academic' 
  },
  { 
    id: 'block-6', 
    name: 'Block 6', 
    description: 'Academic block 6',
    coordinates: [77.43850, 12.86370],
    type: 'academic' 
  },
  { 
    id: 'residential-pu-block', 
    name: 'Residential PU Block', 
    description: 'Residential Pre-University block',
    coordinates: [77.43764, 12.86084],
    type: 'residential' 
  },

  // Food and Dining
  { 
    id: 'punjabi-bites', 
    name: 'Punjabi Bites', 
    description: 'Punjabi food restaurant',
    coordinates: [77.43800, 12.86400],
    type: 'food' 
  },
  { 
    id: 'kns', 
    name: 'KNS', 
    description: 'KNS Food outlet',
    coordinates: [77.43720, 12.86350],
    type: 'food' 
  },
  { 
    id: 'north-canteen', 
    name: 'North Canteen', 
    description: 'North campus canteen',
    coordinates: [77.43830, 12.86200],
    type: 'food' 
  },

  // Sports Facilities
  { 
    id: 'basketball-court', 
    name: 'Basketball Court', 
    description: 'Outdoor basketball court',
    coordinates: [77.43700, 12.86330],
    type: 'sports' 
  },
  { 
    id: 'tennis-court', 
    name: 'Tennis Court', 
    description: 'Tennis court facility',
    coordinates: [77.43680, 12.86280],
    type: 'sports' 
  },
  { 
    id: 'football-ground', 
    name: 'Football Ground', 
    description: 'Football playing field',
    coordinates: [77.43660, 12.86360],
    type: 'sports' 
  },

  // Natural Areas and Gardens
  { 
    id: 'coconut-grove', 
    name: 'Coconut Grove', 
    description: 'Coconut tree grove area',
    coordinates: [77.43640, 12.86420],
    type: 'garden' 
  },
  { 
    id: 'dove-lake', 
    name: 'Dove Lake', 
    description: 'Campus lake area',
    coordinates: [77.43780, 12.86360],
    type: 'landmark' 
  },
  { 
    id: 'goose-lake', 
    name: 'Goose Lake', 
    description: 'Campus lake area',
    coordinates: [77.43870, 12.86330],
    type: 'landmark' 
  },
  { 
    id: 'devadan-garden', 
    name: 'Devadan Garden', 
    description: 'Garden area on campus',
    coordinates: [77.43850, 12.86240],
    type: 'garden' 
  },
];

// Default center coordinate for the map (Christ University Kengeri Campus)
export const DEFAULT_LOCATION = {
  latitude: 12.86313,
  longitude: 77.43789,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

// Default camera settings for the map
export const DEFAULT_CAMERA_SETTINGS = {
  centerCoordinate: [77.43789, 12.86313], // [longitude, latitude]
  zoomLevel: 16,
  animationDuration: 1000,
  navigationZoomLevel: 17,
};