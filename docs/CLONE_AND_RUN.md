# Clone and Run Instructions

## ✅ Repository Ready for Cloning

This repository is fully configured and ready to be cloned on any device.

## 📦 What's Included

### Core Files
- ✅ `package.json` - All dependencies listed
- ✅ `babel.config.js` - Babel configuration
- ✅ `app.json` - Expo configuration
- ✅ `eas.json` - EAS build configuration
- ✅ `.gitignore` - Properly configured

### Source Code
- ✅ All app files (`app/`)
- ✅ All components (`components/`)
- ✅ All hooks (`hooks/`)
- ✅ All utilities (`utils/`)
- ✅ All styles (`styles/`)
- ✅ All constants (`constants/`)

### Android Build Files
- ✅ Complete Android project (`android/`)
- ✅ Gradle configuration
- ✅ Release keystore (`android/app/my-release-key.keystore`)
- ✅ Build scripts

### Documentation
- ✅ Main README.md
- ✅ Complete documentation in `docs/` folder
- ✅ AI route selection guide
- ✅ Campus navigation guide
- ✅ Feature documentation

---

## 🚀 How to Clone and Run

### Step 1: Clone the Repository
```bash
git clone https://github.com/Rohitjanardhan21/Mapbox_Navigation.git
cd Mapbox_Navigation
```

### Step 2: Install Dependencies
```bash
npm install
```

Or if you prefer yarn:
```bash
yarn install
```

### Step 3: Install AsyncStorage (if not auto-installed)
```bash
npx expo install @react-native-async-storage/async-storage
```

### Step 4: Start the Development Server
```bash
npx expo start
```

### Step 5: Run on Device/Emulator

**Option A: Android Emulator**
```bash
npx expo run:android
```

**Option B: Physical Device**
- Scan QR code with Expo Go app
- Or use `npx expo start --tunnel` for remote connection

**Option C: Web Browser**
```bash
npx expo start --web
```

---

## 📱 Build Production APK

### Method 1: Local Build (Recommended)

```bash
# Generate Android project (if not already done)
npx expo prebuild --platform android

# Build release APK
cd android
.\gradlew assembleRelease
```

APK location: `android\app\build\outputs\apk\release\app-release.apk`

### Method 2: EAS Build (Cloud)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build APK
eas build --platform android --profile production
```

---

## 🔧 Configuration

### Mapbox Access Token
The app uses Mapbox for maps and routing. The token is already configured in:
- `app.json` (for Android)
- Source code files

**To use your own token:**
1. Get a token from [Mapbox](https://account.mapbox.com/)
2. Replace in `app.json`:
   ```json
   "config": {
     "mapbox": {
       "accessToken": "YOUR_TOKEN_HERE"
     }
   }
   ```
3. Replace in source files where `MapboxGL.setAccessToken()` is called

### Campus Buildings
Customize campus buildings in `utils/campusBuildings.js`:
- Update coordinates
- Add/remove buildings
- Modify building information

### Emergency Contacts
Update emergency contacts in `components/EmergencyPanel.jsx`:
- Change phone numbers
- Add/remove contacts
- Update emergency locations

---

## ✅ Verification Checklist

After cloning, verify these work:

### Basic Functionality
- [ ] App starts without errors
- [ ] Map loads correctly
- [ ] Location permission requested
- [ ] User location shows on map
- [ ] Search functionality works

### AI Features
- [ ] Route calculation works
- [ ] Multiple routes displayed
- [ ] AI scoring visible in console
- [ ] Route comparison available

### Campus Features
- [ ] Buildings database accessible
- [ ] Quick access panel opens
- [ ] Emergency panel works
- [ ] Offline downloader accessible

### Build
- [ ] Development build runs
- [ ] Production APK builds successfully
- [ ] APK installs on device
- [ ] App runs from installed APK

---

## 🐛 Troubleshooting

### Issue: Metro bundler port conflict
**Solution:**
```bash
npx expo start --clear
```

### Issue: Android build fails
**Solution:**
```bash
cd android
.\gradlew clean
.\gradlew assembleRelease
```

### Issue: Dependencies not installing
**Solution:**
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Issue: Expo Go not connecting
**Solution:**
```bash
npx expo start --tunnel
```

### Issue: Map not loading
**Solution:**
- Check internet connection
- Verify Mapbox token is valid
- Check console for errors

---

## 📊 System Requirements

### Development
- Node.js 18+ 
- npm or yarn
- Expo CLI
- Android Studio (for emulator)
- Git

### For Android Build
- JDK 17+
- Android SDK
- Gradle 8.13+

### For Device Testing
- Android 7.0+ (API 24+)
- iOS 13+ (for iOS builds)

---

## 📁 Project Structure

```
Mapbox_Navigation/
├── app/                    # App screens
├── components/             # React components
├── hooks/                  # Custom hooks
├── utils/                  # Utility functions
│   ├── aiRouteSelector.js # AI routing logic
│   ├── campusBuildings.js # Buildings database
│   └── savedRoutes.js     # Storage management
├── styles/                 # Style definitions
├── constants/              # App constants
├── android/                # Android native project
├── docs/                   # Documentation
├── package.json           # Dependencies
├── babel.config.js        # Babel config
├── app.json              # Expo config
└── README.md             # Main readme

```

---

## 🎯 Key Features Available

1. **AI-Powered Route Selection** - Automatically selects best routes
2. **Campus Buildings Database** - 8 pre-configured buildings
3. **Quick Access Panel** - Fast navigation to buildings
4. **Saved Routes & Favorites** - Persistent storage
5. **Offline Maps** - Download for offline use
6. **Emergency Panel** - Quick access to emergency services
7. **Route Comparison** - Visual AI score breakdown

---

## 📞 Support

If you encounter issues:
1. Check the documentation in `docs/` folder
2. Review console logs for errors
3. Verify all dependencies are installed
4. Ensure Mapbox token is valid
5. Check Android SDK is properly configured

---

## 🎉 Ready to Go!

Your repository is fully configured and ready to clone. All necessary files are included, and the app should work out of the box after running `npm install`.

**Happy Coding!** 🚀
