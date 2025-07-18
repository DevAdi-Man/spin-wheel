# 01 - Basic Setup & Installation

## What is Skia? (English Definition)
Skia is an open-source 2D graphics library written in C++ that provides common APIs that work across a variety of hardware and software platforms. It serves as the graphics engine for Google Chrome, Chrome OS, Android, Flutter, and many other products.

## Hinglish Explanation:
Skia ek powerful graphics library hai jo Google ne banaya hai. Ye library hardware acceleration use karti hai, matlab aapke phone ka GPU use karke graphics render karti hai. Isse aapke animations aur drawings bahut smooth aur fast hote hain.

## Installation Steps (2025):

### Step 1: Install the Package
```bash
# Using npm
npm install @shopify/react-native-skia@latest

# Using yarn
yarn add @shopify/react-native-skia@latest

# Using pnpm
pnpm add @shopify/react-native-skia@latest
```

### Step 2: iOS Setup
```bash
cd ios
pod install
cd ..
```

### Step 3: Android Setup (Auto-linking)
React Native 0.60+ mein auto-linking hai, so Android setup automatic ho jayega.

### Step 4: Metro Configuration (Optional but Recommended)
Create/update `metro.config.js`:
```javascript
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    assetExts: [...defaultConfig.resolver.assetExts, 'skia'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
```

## Verification Test:
Create a simple test file to verify installation:

```typescript
import React from 'react';
import {Canvas, Circle, Fill} from '@shopify/react-native-skia';
import {View, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export const SkiaTest = () => {
  return (
    <View style={{flex: 1}}>
      <Canvas style={{width, height}}>
        <Fill color="lightblue" />
        <Circle cx={width / 2} cy={height / 2} r={50} color="red" />
      </Canvas>
    </View>
  );
};
```

## Common Issues & Solutions:

### Issue 1: Pod Install Fails
```bash
# Solution
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
```

### Issue 2: Metro Bundle Error
```bash
# Clear cache
npx react-native start --reset-cache
```

### Issue 3: Android Build Error
```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npx react-native run-android
```

## How It Works Internally:
1. **Native Bridge**: Skia library C++ code se JavaScript bridge banata hai
2. **GPU Acceleration**: Graphics GPU pe render hote hain, CPU pe nahi
3. **Canvas API**: HTML5 Canvas jaisa API provide karta hai
4. **Cross Platform**: Same code iOS aur Android dono pe chalti hai

## Next Steps:
Installation complete hone ke baad, next chapter mein hum Canvas basics seekhenge!
