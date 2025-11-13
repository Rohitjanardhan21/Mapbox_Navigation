#!/bin/bash

echo "🚀 Campus Navigation Setup Script"
echo "=================================="
echo ""

# Check Node version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18 or higher is required. Current version: $(node -v)"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"
echo ""

# Clean previous installations
echo "🧹 Cleaning previous installations..."
rm -rf node_modules
rm -rf .expo
rm -f package-lock.json
echo "✅ Cleaned"
echo ""

# Install dependencies
echo "📥 Installing dependencies..."
npm install --legacy-peer-deps
if [ $? -ne 0 ]; then
    echo "❌ Installation failed. Trying with --force..."
    npm install --force
fi
echo "✅ Dependencies installed"
echo ""

# Install AsyncStorage
echo "📥 Installing AsyncStorage..."
npx expo install @react-native-async-storage/async-storage
echo "✅ AsyncStorage installed"
echo ""

# Verify installation
echo "🔍 Verifying installation..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules exists"
else
    echo "❌ node_modules not found"
    exit 1
fi
echo ""

echo "✅ Setup complete!"
echo ""
echo "📱 Next steps:"
echo "1. Run: npx expo start"
echo "2. Scan QR code with Expo Go app"
echo "3. Or press 'a' for Android emulator"
echo ""
echo "📖 For troubleshooting, see docs/TROUBLESHOOTING.md"
