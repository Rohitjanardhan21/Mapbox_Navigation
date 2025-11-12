/**
 * Campus Buildings Database
 * Add your actual campus buildings here with coordinates
 */

export const campusBuildings = [
  {
    id: 'library',
    name: 'Main Library',
    type: 'academic',
    coordinates: [77.4375, 12.8632],
    facilities: ['Study Rooms', 'Computer Lab', 'Printing', 'WiFi'],
    openHours: '8:00 AM - 10:00 PM',
    floors: 4,
    hasElevator: true,
    hasRamp: true
  },
  {
    id: 'engineering',
    name: 'Engineering Building',
    type: 'academic',
    coordinates: [77.4380, 12.8628],
    facilities: ['Labs', 'Classrooms', 'Workshop'],
    openHours: '7:00 AM - 8:00 PM',
    floors: 5,
    hasElevator: true,
    hasRamp: true
  },
  {
    id: 'cafeteria',
    name: 'Student Cafeteria',
    type: 'dining',
    coordinates: [77.4372, 12.8635],
    facilities: ['Food Court', 'Seating', 'ATM'],
    openHours: '7:00 AM - 9:00 PM',
    floors: 2,
    hasElevator: false,
    hasRamp: true
  },
  {
    id: 'admin',
    name: 'Administration Building',
    type: 'administrative',
    coordinates: [77.4385, 12.8630],
    facilities: ['Admissions', 'Accounts', 'Records'],
    openHours: '9:00 AM - 5:00 PM',
    floors: 3,
    hasElevator: true,
    hasRamp: true
  },
  {
    id: 'sports',
    name: 'Sports Complex',
    type: 'recreation',
    coordinates: [77.4368, 12.8625],
    facilities: ['Gym', 'Courts', 'Track', 'Pool'],
    openHours: '6:00 AM - 9:00 PM',
    floors: 2,
    hasElevator: false,
    hasRamp: true
  },
  {
    id: 'hostel-a',
    name: 'Hostel Block A',
    type: 'residential',
    coordinates: [77.4390, 12.8638],
    facilities: ['Rooms', 'Common Room', 'Laundry'],
    openHours: '24/7',
    floors: 4,
    hasElevator: true,
    hasRamp: true
  },
  {
    id: 'medical',
    name: 'Medical Center',
    type: 'health',
    coordinates: [77.4378, 12.8633],
    facilities: ['Clinic', 'Pharmacy', 'Emergency'],
    openHours: '24/7',
    floors: 1,
    hasElevator: false,
    hasRamp: true
  },
  {
    id: 'auditorium',
    name: 'Main Auditorium',
    type: 'event',
    coordinates: [77.4382, 12.8627],
    facilities: ['Hall', 'Stage', 'Green Room'],
    openHours: 'Event Based',
    floors: 2,
    hasElevator: true,
    hasRamp: true
  }
];

export const buildingTypes = {
  academic: { icon: 'school', color: '#4285F4' },
  dining: { icon: 'restaurant', color: '#EA4335' },
  administrative: { icon: 'business', color: '#FBBC04' },
  recreation: { icon: 'fitness', color: '#34A853' },
  residential: { icon: 'home', color: '#9C27B0' },
  health: { icon: 'medical', color: '#E91E63' },
  event: { icon: 'calendar', color: '#FF9800' }
};

export const getBuildingsByType = (type) => {
  return campusBuildings.filter(building => building.type === type);
};

export const searchBuildings = (query) => {
  const lowerQuery = query.toLowerCase();
  return campusBuildings.filter(building => 
    building.name.toLowerCase().includes(lowerQuery) ||
    building.type.toLowerCase().includes(lowerQuery) ||
    building.facilities.some(f => f.toLowerCase().includes(lowerQuery))
  );
};

export const getNearbyBuildings = (userCoords, radiusKm = 0.5) => {
  return campusBuildings.filter(building => {
    const distance = calculateDistance(userCoords, building.coordinates);
    return distance <= radiusKm;
  });
};

const calculateDistance = (coords1, coords2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (coords2[1] - coords1[1]) * Math.PI / 180;
  const dLon = (coords2[0] - coords1[0]) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coords1[1] * Math.PI / 180) * Math.cos(coords2[1] * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};
