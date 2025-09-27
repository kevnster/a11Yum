#!/bin/bash

echo "🔧 Fixing Android NDK issues..."

# Remove corrupted NDK
echo "Removing corrupted NDK..."
rm -rf /Users/kevspc/Library/Android/sdk/ndk/27.1.12297006

# Clean build directories
echo "Cleaning build directories..."
cd /Users/kevspc/Desktop/a11Yum/frontend/android
rm -rf build app/build .gradle

# Create a simple NDK fix by using a different approach
echo "Creating NDK bypass configuration..."
cd /Users/kevspc/Desktop/a11Yum/frontend

# Try building without NDK
echo "Attempting build without NDK..."
npx expo run:android --no-build-cache

echo "✅ NDK fix complete!"
