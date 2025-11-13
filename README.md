# Campus Navigation System 🎓🗺️

An intelligent AI-powered navigation system designed specifically for campus environments.

## ✨ Key Features

### 🤖 AI-Powered Route Selection
- Analyzes multiple routes and selects the best one
- Campus-specific factors: pedestrian traffic, path quality, accessibility
- Time-aware routing (avoids crowds during class changes, prioritizes safety at night)
- Transparent AI scoring and explanations

### 📚 Campus Buildings Database
- Comprehensive building information
- Search and filter by type
- Opening hours, facilities, accessibility info
- 8 pre-configured buildings (customizable)

### 🚀 Quick Access Features
- One-tap navigation to buildings
- Saved routes and favorites
- Recent search history
- Category-based building browser

### 📥 Offline Capability
- Download campus maps for offline use
- Navigate without internet connection
- 4 campus regions available

### 🚨 Emergency Panel
- Quick dial emergency contacts
- Navigate to emergency locations
- Campus security, medical, fire, police

## 🚀 Quick Start

### Installation
```bash
# Install dependencies
npm install

# Install AsyncStorage
npx expo install @react-native-async-storage/async-storage

# Start the app
npx expo start
```

### Build APK
```bash
# Generate Android project
npx expo prebuild --platform android

# Build release APK
cd android
.\gradlew assembleRelease
```

APK location: `android\app\build\outputs\apk\release\app-release.apk`

## 📖 Documentation

Comprehensive documentation is available in the [`docs/`](./docs) folder:

- **[Quick Start Guide](./docs/QUICK_START_CAMPUS.md)** - Get started quickly
- **[Complete Feature List](./docs/COMPLETE_FEATURE_LIST.md)** - All features overview
- **[AI Route Selection](./docs/AI_ROUTE_SELECTION.md)** - How AI routing works
- **[Campus AI Navigation](./docs/CAMPUS_AI_NAVIGATION.md)** - Campus-specific features
- **[New Features](./docs/NEW_FEATURES.md)** - Recently added features
- **[Usage Examples](./docs/USAGE_EXAMPLE.md)** - Code examples

## 🎯 Perfect For

- **Students**: Never late to class, avoid crowds, safe night navigation
- **Visitors**: Easy campus navigation with clear directions
- **Campus Admin**: Better traffic distribution, improved safety

## 🛠️ Tech Stack

- React Native + Expo
- Mapbox Maps & Directions API
- Custom AI scoring algorithm
- AsyncStorage for data persistence

## 📱 Features at a Glance

✅ AI-powered multi-route selection  
✅ Campus buildings database  
✅ Saved routes & favorites  
✅ Offline map downloads  
✅ Emergency panel  
✅ Recent searches  
✅ Route comparison with AI scores  
✅ Time-aware routing  
✅ Accessibility features  
✅ Campus-specific optimizations  

## 🔧 Customization

1. **Update Building Coordinates**: Edit `utils/campusBuildings.js`
2. **Emergency Contacts**: Edit `components/EmergencyPanel.jsx`
3. **Map Regions**: Edit `components/OfflineMapDownloader.jsx`

## 📊 AI Route Scoring

Routes are scored based on 5 factors:
- **Distance** (30%) - Walking distance
- **Duration** (25%) - Time to destination
- **Pedestrian Traffic** (20%) - Crowd levels
- **Path Quality** (15%) - Paved, lit, covered paths
- **Accessibility** (10%) - Ramps, elevators, smooth surfaces

## 🎓 Campus-Specific Intelligence

- Detects class change times automatically
- Avoids crowded paths during peak hours
- Prioritizes well-lit routes at night
- Considers accessibility needs
- Adapts to campus schedule

