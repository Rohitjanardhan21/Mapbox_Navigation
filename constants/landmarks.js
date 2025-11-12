// constants/landmarks.js
// Campus landmarks data

export const landmarks = [
  // Buildings and Academic Centers
  { 
    id: 'christ-university-kengeri', 
    name: 'Christ University - Kengeri Campus', 
    description: 'Main university campus',
    coordinates: [77.59167, 12.92139],
    type: 'university' 
  },
  { 
    id: 'open-air-auditorium', 
    name: 'Open Air Auditorium', 
    description: 'Outdoor auditorium for events',
    coordinates: [77.59185, 12.92165],
    type: 'building' 
  },
  { 
    id: 'vc-guest-house', 
    name: 'VC Guest House', 
    description: 'Vice Chancellor Guest House',
    coordinates: [77.59145, 12.92155],
    type: 'building' 
  },
  { 
    id: 'd-block', 
    name: 'D Block', 
    description: 'Academic block D',
    coordinates: [77.59175, 12.92125],
    type: 'academic' 
  },
  { 
    id: 'block-6', 
    name: 'Block 6', 
    description: 'Academic block 6',
    coordinates: [77.59195, 12.92150],
    type: 'academic' 
  },
  { 
    id: 'residential-pu-block', 
    name: 'Residential PU Block', 
    description: 'Residential Pre-University block',
    coordinates: [77.59155, 12.92110],
    type: 'residential' 
  },

  // Food and Dining
  { 
    id: 'punjabi-bites', 
    name: 'Punjabi Bites', 
    description: 'Punjabi food restaurant',
    coordinates: [77.59180, 12.92170],
    type: 'food' 
  },
  { 
    id: 'kns', 
    name: 'KNS', 
    description: 'KNS Food outlet',
    coordinates: [77.59140, 12.92145],
    type: 'food' 
  },
  { 
    id: 'north-canteen', 
    name: 'North Canteen', 
    description: 'North campus canteen',
    coordinates: [77.59190, 12.92115],
    type: 'food' 
  },

  // Sports Facilities
  { 
    id: 'basketball-court', 
    name: 'Basketball Court', 
    description: 'Outdoor basketball court',
    coordinates: [77.59130, 12.92140],
    type: 'sports' 
  },
  { 
    id: 'tennis-court', 
    name: 'Tennis Court', 
    description: 'Tennis court facility',
    coordinates: [77.59125, 12.92130],
    type: 'sports' 
  },
  { 
    id: 'football-ground', 
    name: 'Football Ground', 
    description: 'Football playing field',
    coordinates: [77.59120, 12.92145],
    type: 'sports' 
  },

  // Natural Areas and Gardens
  { 
    id: 'coconut-grove', 
    name: 'Coconut Grove', 
    description: 'Coconut tree grove area',
    coordinates: [77.59115, 12.92155],
    type: 'garden' 
  },
  { 
    id: 'dove-lake', 
    name: 'Dove Lake', 
    description: 'Campus lake area',
    coordinates: [77.59170, 12.92145],
    type: 'landmark' 
  },
  { 
    id: 'goose-lake', 
    name: 'Goose Lake', 
    description: 'Campus lake area',
    coordinates: [77.59200, 12.92140],
    type: 'landmark' 
  },
  { 
    id: 'devadan-garden', 
    name: 'Devadan Garden', 
    description: 'Garden area on campus',
    coordinates: [77.59185, 12.92120],
    type: 'garden' 
  },
];

// Default center coordinate for the map (Christ University Kengeri Campus)
export const DEFAULT_LOCATION = {
  latitude: 12.92139,
  longitude: 77.59167,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};

// Default camera settings for the map
export const DEFAULT_CAMERA_SETTINGS = {
  centerCoordinate: [77.59167, 12.92139], // [longitude, latitude]
  zoomLevel: 17,
  animationDuration: 1000,
  navigationZoomLevel: 18,
};