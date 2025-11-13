@echo off
echo ========================================
echo Campus Navigation Setup Script (Windows)
echo ========================================
echo.

REM Check Node version
echo Checking Node.js version...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js version:
node --version
echo.

REM Clean previous installations
echo Cleaning previous installations...
if exist node_modules rmdir /s /q node_modules
if exist .expo rmdir /s /q .expo
if exist package-lock.json del /f package-lock.json
echo Cleaned
echo.

REM Install dependencies
echo Installing dependencies...
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo Installation failed. Trying with --force...
    call npm install --force
)
echo Dependencies installed
echo.

REM Install AsyncStorage
echo Installing AsyncStorage...
call npx expo install @react-native-async-storage/async-storage
echo AsyncStorage installed
echo.

REM Verify installation
echo Verifying installation...
if exist node_modules (
    echo node_modules exists
) else (
    echo ERROR: node_modules not found
    pause
    exit /b 1
)
echo.

echo ========================================
echo Setup complete!
echo ========================================
echo.
echo Next steps:
echo 1. Run: npx expo start
echo 2. Scan QR code with Expo Go app
echo 3. Or press 'a' for Android emulator
echo.
echo For troubleshooting, see docs\TROUBLESHOOTING.md
echo.
pause
