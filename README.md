# 🗺️ Navigation - Campus Map App

A modern, feature-rich campus navigation app built with React Native and Expo, featuring Google Maps-style UI and advanced navigation capabilities.

## ✨ Features

### 🔍 **Enhanced Search**
- **Auto-suggestions** as you type
- **Voice search** capability
- **Smart shortcuts** based on time of day
- **Search history** with recent locations

### 🎨 **Modern UI/UX**
- **Google Maps-inspired** design
- **Dark/Light mode** toggle
- **Professional search bar** with animations
- **Bottom navigation bar** with quick actions
- **Bottom sheet** for location details

### 🗺️ **Advanced Map Features**
- **Multiple map styles** (Street, Satellite, Terrain)
- **Real-time location tracking**
- **Custom markers** for different location types
- **Route calculation** and navigation
- **Voice guidance** for navigation

### 💾 **Smart Features**
- **Favorites system** with badges
- **Time-based quick access** (morning = academic, lunch = food)
- **Location sharing** functionality
- **Pull-to-refresh** capability
- **Offline-ready** architecture

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)
- Expo CLI

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rohitjanardhan21/Navigation.git
   cd Navigation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Prebuild for native platforms**
   ```bash
   npx expo prebuild
   ```

4. **Set up environment variables**
   - Add your Mapbox access token to `app.json`
   - Update the `MAPBOX_ACCESS_TOKEN` in the extra section

### 🏃‍♂️ Running the App

#### **Development Mode**
```bash
# Start the development server
npm start
# or
npx expo start
```

#### **Run on Android**
```bash
# Run on Android device/emulator
npm run android
# or
npx expo run:android
```

#### **Run on iOS** (macOS only)
```bash
# Run on iOS device/simulator
npm run ios
# or
npx expo run:ios
```

#### **Run on Web**
```bash
# Run in web browser
npm run web
# or
npx expo start --web
```

## 🛠️ Development Setup

### **Android Emulator Setup**
1. Install Android Studio
2. Create an AVD (Android Virtual Device)
3. Start the emulator before running the app

### **Physical Device Setup**
1. Enable Developer Options on your device
2. Enable USB Debugging
3. Connect via USB and run the app

## 📱 App Structure

```
Navigation/
├── app/                    # Main app screens
│   ├── index.jsx          # Home screen with map
│   └── _layout.jsx        # App layout
├── assets/                # Images and icons
├── constants/             # App constants and data
│   └── landmarks.js       # Campus landmarks data
├── styles/                # Styling files
│   ├── Design_Home.js     # Main styles
│   └── colour.js          # Color palette
├── android/               # Android native code
├── ios/                   # iOS native code
└── app.json              # Expo configuration
```

## 🎯 Key Components

### **Search Bar**
- Google Maps-style design
- Auto-suggestions dropdown
- Voice search integration
- Smart shortcuts based on time

### **Map Interface**
- Mapbox integration
- Multiple map styles
- Custom markers for different locations
- Real-time user location

### **Bottom Navigation**
- My Location - Center on user location
- Explore - Open search with shortcuts
- Directions - Get navigation to destinations
- Saved - View favorite locations

### **Location Details**
- Bottom sheet with location info
- Navigation and sharing options
- Add to favorites functionality

## 🔧 Configuration

### **Mapbox Setup**
1. Get a Mapbox access token from [Mapbox](https://www.mapbox.com/)
2. Add it to `app.json`:
   ```json
   {
     "expo": {
       "extra": {
         "MAPBOX_ACCESS_TOKEN": "your_token_here"
       }
     }
   }
   ```

### **Location Permissions**
The app requests location permissions for:
- Current location display
- Navigation functionality
- Location-based features

## 🎨 Customization

### **Adding New Landmarks**
Edit `constants/landmarks.js` to add new campus locations:
```javascript
{
  id: 'unique_id',
  name: 'Location Name',
  coordinates: [longitude, latitude],
  type: 'academic' // academic, food, sports, admin, library
}
```

### **Styling**
- Main styles: `styles/Design_Home.js`
- Colors: `styles/colour.js`
- Dark mode support built-in

## 📦 Dependencies

### **Core**
- React Native
- Expo
- @rnmapbox/maps (Mapbox integration)
- expo-location (Location services)
- expo-speech (Voice guidance)

### **UI/UX**
- @expo/vector-icons (Icons)
- react-native-gesture-handler (Gestures)
- react-native-reanimated (Animations)

## 🚀 Deployment

### **Build for Production**
```bash
# Build for Android
npx expo build:android

# Build for iOS
npx expo build:ios
```

### **EAS Build** (Recommended)
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Rohit Janardhan**
- GitHub: [@Rohitjanardhan21](https://github.com/Rohitjanardhan21)

## 🙏 Acknowledgments

- Mapbox for mapping services
- Expo team for the amazing development platform
- React Native community for continuous support

---

**Happy Navigating! 🧭**
