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
    coordinates: [77.43805, 12.86335],
    type: 'building' 
  },
  { 
    id: 'vc-guest-house', 
    name: 'VC Guest House', 
    description: 'Vice Chancellor Guest House',
    coordinates: [77.43775, 12.86328],
    type: 'building' 
  },
  { 
    id: 'd-block', 
    name: 'D Block', 
    description: 'Academic block D',
    coordinates: [77.43795, 12.86300],
    type: 'academic' 
  },
  { 
    id: 'block-6', 
    name: 'Block 6', 
    description: 'Academic block 6',
    coordinates: [77.43810, 12.86325],
    type: 'academic' 
  },
  { 
    id: 'residential-pu-block', 
    name: 'Residential PU Block', 
    description: 'Residential Pre-University block',
    coordinates: [77.43780, 12.86290],
    type: 'residential' 
  },

  // Food and Dining
  { 
    id: 'punjabi-bites', 
    name: 'Punjabi Bites', 
    description: 'Punjabi food restaurant',
    coordinates: [77.43800, 12.86340],
    type: 'food' 
  },
  { 
    id: 'kns', 
    name: 'KNS', 
    description: 'KNS Food outlet',
    coordinates: [77.43770, 12.86318],
    type: 'food' 
  },
  { 
    id: 'north-canteen', 
    name: 'North Canteen', 
    description: 'North campus canteen',
    coordinates: [77.43808, 12.86295],
    type: 'food' 
  },

  // Sports Facilities
  { 
    id: 'basketball-court', 
    name: 'Basketball Court', 
    description: 'Outdoor basketball court',
    coordinates: [77.43765, 12.86310],
    type: 'sports' 
  },
  { 
    id: 'tennis-court', 
    name: 'Tennis Court', 
    description: 'Tennis court facility',
    coordinates: [77.43760, 12.86305],
    type: 'sports' 
  },
  { 
    id: 'football-ground', 
    name: 'Football Ground', 
    description: 'Football playing field',
    coordinates: [77.43755, 12.86315],
    type: 'sports' 
  },

  // Natural Areas and Gardens
  { 
    id: 'coconut-grove', 
    name: 'Coconut Grove', 
    description: 'Coconut tree grove area',
    coordinates: [77.43750, 12.86322],
    type: 'garden' 
  },
  { 
    id: 'dove-lake', 
    name: 'Dove Lake', 
    description: 'Campus lake area',
    coordinates: [77.43792, 12.86318],
    type: 'landmark' 
  },
  { 
    id: 'goose-lake', 
    name: 'Goose Lake', 
    description: 'Campus lake area',
    coordinates: [77.43815, 12.86312],
    type: 'landmark' 
  },
  { 
    id: 'devadan-garden', 
    name: 'Devadan Garden', 
    description: 'Garden area on campus',
    coordinates: [77.43803, 12.86298],
    type: 'garden' 
  },
];

// Default center coordinate for the map (Christ University Kengeri Campus)
export const DEFAULT_LOCATION = {
  latitude: 12.86313,
  longitude: 77.43789,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};

// Default camera settings for the map
export const DEFAULT_CAMERA_SETTINGS = {
  centerCoordinate: [77.43789, 12.86313], // [longitude, latitude]
  zoomLevel: 17,
  animationDuration: 1000,
  navigationZoomLevel: 18,
};