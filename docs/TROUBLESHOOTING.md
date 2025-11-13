# Troubleshooting Guide

## Common Compatibility Issues and Solutions

### 🔴 Issue 1: Dependency Installation Fails

**Error:**
```
npm ERR! ERESOLVE unable to resolve dependency tree
npm ERR! peer dependency conflicts
```

**Solutions:**

**Option A: Use legacy peer deps (Recommended)**
```bash
npm install --legacy-peer-deps
```

**Option B: Force install**
```bash
npm install --force
```

**Option C: Clean install**
```bash
rm -rf node_modules
rm package-lock.json
npm install --legacy-peer-deps
```

---

### 🔴 Issue 2: React Native Version Mismatch

**Error:**
```
Error: React Native version mismatch
```

**Solution:**
```bash
# Clear cache
npx expo start --clear

# Or reset everything
rm -rf node_modules
rm -rf .expo
rm package-lock.json
npm install --legacy-peer-deps
```

---

### 🔴 Issue 3: Metro Bundler Issues

**Error:**
```
Error: Metro bundler failed to start
Port 8081 already in use
```

**Solution:**
```bash
# Kill existing Metro processes
# On Windows:
taskkill /F /IM node.exe

# On Mac/Linux:
killall node

# Then restart
npx expo start --clear
```

---

### 🔴 Issue 4: Android Build Fails

**Error:**
```
Execution failed for task ':app:mergeDebugResources'
```

**Solution:**
```bash
cd android
.\gradlew clean
cd ..
npx expo prebuild --clean
npx expo run:android
```

---

### 🔴 Issue 5: Mapbox Not Loading

**Error:**
```
Map not displaying or blank screen
```

**Solutions:**

1. **Check Mapbox Token:**
   - Verify token in `app.json`
   - Ensure token is valid at https://account.mapbox.com/

2. **Check Internet Connection:**
   - Maps require internet to load tiles

3. **Check Permissions:**
   - Ensure location permissions are granted

---

### 🔴 Issue 6: AsyncStorage Not Found

**Error:**
```
Cannot find module '@react-native-async-storage/async-storage'
```

**Solution:**
```bash
npx expo install @react-native-async-storage/async-storage
```

---

### 🔴 Issue 7: Expo Router Issues

**Error:**
```
Error: expo-router not configured correctly
```

**Solution:**

1. **Check babel.config.js:**
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
    ],
  };
};
```

2. **Clear cache:**
```bash
npx expo start --clear
```

---

### 🔴 Issue 8: Node Version Issues

**Error:**
```
Error: Node version not supported
```

**Solution:**

1. **Check Node version:**
```bash
node --version
```

2. **Install Node 18 or higher:**
   - Download from https://nodejs.org/
   - Or use nvm:
   ```bash
   nvm install 18
   nvm use 18
   ```

---

### 🔴 Issue 9: Gradle Build Timeout

**Error:**
```
Gradle build timed out
```

**Solution:**

1. **Increase Gradle memory:**
   Edit `android/gradle.properties`:
   ```properties
   org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=512m
   org.gradle.daemon=true
   org.gradle.parallel=true
   ```

2. **Clean and rebuild:**
   ```bash
   cd android
   .\gradlew clean
   .\gradlew assembleDebug
   ```

---

### 🔴 Issue 10: Reanimated Plugin Error

**Error:**
```
Reanimated 2 failed to create a worklet
```

**Solution:**

1. **Ensure plugin is last in babel.config.js:**
```javascript
plugins: [
  // other plugins...
  'react-native-reanimated/plugin', // MUST BE LAST
],
```

2. **Clear cache:**
```bash
npx expo start --clear
```

---

## 🔧 Complete Reset Procedure

If nothing else works, try this complete reset:

### Step 1: Clean Everything
```bash
# Remove all generated files
rm -rf node_modules
rm -rf .expo
rm -rf android/build
rm -rf android/.gradle
rm package-lock.json
```

### Step 2: Reinstall Dependencies
```bash
npm install --legacy-peer-deps
```

### Step 3: Rebuild Android (if needed)
```bash
npx expo prebuild --clean --platform android
```

### Step 4: Start Fresh
```bash
npx expo start --clear
```

---

## 📱 Device-Specific Issues

### Android Emulator Not Detected

**Solution:**
```bash
# Check ADB
adb devices

# Restart ADB
adb kill-server
adb start-server

# Check emulator
emulator -list-avds
```

### Physical Device Not Connecting

**Solution:**
1. Enable USB Debugging on device
2. Install device drivers (Windows)
3. Use `npx expo start --tunnel` for remote connection

---

## 🌐 Network Issues

### Cannot Connect to Metro Bundler

**Solution:**
```bash
# Use tunnel mode
npx expo start --tunnel

# Or use LAN
npx expo start --lan
```

### Firewall Blocking Connection

**Solution:**
- Allow Node.js through firewall
- Allow ports 8081, 19000, 19001, 19002

---

## 💾 Storage Issues

### Saved Routes Not Persisting

**Solution:**
1. Check AsyncStorage is installed
2. Clear app data and reinstall
3. Check device storage space

---

## 🗺️ Map-Specific Issues

### Map Tiles Not Loading

**Solution:**
1. Check internet connection
2. Verify Mapbox token
3. Check if Mapbox services are down: https://status.mapbox.com/

### Location Not Updating

**Solution:**
1. Grant location permissions
2. Enable GPS on device
3. Check location services in device settings

---

## 🔍 Debugging Tips

### Enable Debug Mode

1. **Check Console Logs:**
   - Open Chrome DevTools
   - Press `j` in Expo CLI to open debugger

2. **Enable Remote Debugging:**
   - Shake device
   - Select "Debug"

3. **Check Native Logs:**
   ```bash
   # Android
   adb logcat

   # Filter for React Native
   adb logcat | grep ReactNative
   ```

### Common Log Errors

**"Unable to resolve module"**
- Clear cache: `npx expo start --clear`
- Reinstall dependencies

**"Task failed with an exception"**
- Clean Android build: `cd android && .\gradlew clean`

**"Metro bundler has encountered an error"**
- Restart Metro: Kill node processes and restart

---

## 📋 Compatibility Checklist

Before running on a new device, verify:

- [ ] Node.js 18+ installed
- [ ] npm or yarn installed
- [ ] Expo CLI installed (`npm install -g expo-cli`)
- [ ] Android Studio installed (for Android)
- [ ] Java JDK 17+ installed
- [ ] Android SDK installed
- [ ] Environment variables set (ANDROID_HOME, JAVA_HOME)
- [ ] Git installed
- [ ] Internet connection available

---

## 🆘 Still Having Issues?

### Check These Files:

1. **package.json** - Correct dependencies
2. **babel.config.js** - Proper configuration
3. **metro.config.js** - Metro bundler config
4. **app.json** - Expo configuration
5. **.npmrc** - NPM configuration

### Get Help:

1. Check GitHub Issues
2. Review Expo documentation: https://docs.expo.dev/
3. Check React Native docs: https://reactnative.dev/
4. Mapbox docs: https://docs.mapbox.com/

---

## 🎯 Quick Fix Commands

```bash
# Complete reset
rm -rf node_modules package-lock.json .expo
npm install --legacy-peer-deps
npx expo start --clear

# Android build issues
cd android
.\gradlew clean
cd ..
npx expo prebuild --clean

# Metro bundler issues
taskkill /F /IM node.exe  # Windows
killall node              # Mac/Linux
npx expo start --clear

# Dependency issues
npm install --legacy-peer-deps --force
```

---

## ✅ Verification Steps

After fixing issues, verify:

1. **App starts:** `npx expo start`
2. **No errors in console**
3. **Map loads correctly**
4. **Location works**
5. **Navigation functions**
6. **AI routing works**

---

**If you've tried everything and still have issues, please provide:**
- Error message (full text)
- Node version (`node --version`)
- npm version (`npm --version`)
- Operating system
- Device/emulator details
