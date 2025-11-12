# Navigation App

A modern React Native navigation app with real-time directions, voice guidance, and advanced UI features.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Android Studio (for Android development)
- Expo CLI

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Rohitjanardhan21/Mapbox_Navigation.git
cd Mapbox_Navigation
```

2. Install dependencies:
```bash
npm install
```

## Running the App

### Development Mode
```bash
npm start
```

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

### Web
```bash
npm run web
```

## Dependencies

All dependencies are listed in `package.json` and `requirements.txt`. Key packages include:

- **expo**: ~53.0.22
- **react-native**: 0.79.5
- **@rnmapbox/maps**: ^10.1.41 (Mapbox integration)
- **expo-location**: ~18.1.6 (Location services)
- **expo-speech**: ~13.1.7 (Voice guidance)
- **expo-router**: ~5.1.5 (Navigation routing)

## Features

- Real-time navigation with turn-by-turn directions
- Voice guidance
- Campus location search
- Modern glassmorphism UI
- Multiple map styles (Street, Satellite, Outdoor)
- Save and share routes
- Traffic layer support

## Configuration

The app uses Mapbox for maps. The access token is configured in `app.json`.

## Building for Production

### Android APK
```bash
npx expo run:android --variant release
```

The APK will be generated in `android/app/build/outputs/apk/release/`

## License

MIT
