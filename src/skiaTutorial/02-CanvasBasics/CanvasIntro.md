# 02 - Canvas Basics

## What is Canvas? (English Definition)
Canvas is a rectangular area on a web page or mobile screen where you can draw graphics using scripting. In React Native Skia, Canvas is the main component that provides a drawing surface for all graphics operations.

## Hinglish Explanation:
Canvas ek drawing board ki tarah hai jahan aap graphics draw kar sakte hain. Ye ek rectangular area hai jismein aap shapes, lines, images, animations sab kuch bana sakte hain. Skia mein Canvas component sabse important hai kyunki iske bina kuch bhi draw nahi kar sakte.

## Basic Canvas Component:

```typescript
import React from 'react';
import {Canvas, Fill} from '@shopify/react-native-skia';
import {View, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export const BasicCanvas = () => {
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Canvas style={{width, height}}>
        {/* Yahan aap graphics draw karenge */}
        <Fill color="lightblue" />
      </Canvas>
    </View>
  );
};
```

## Canvas Properties:

### 1. Style Property
```typescript
<Canvas 
  style={{
    width: 300,
    height: 400,
    backgroundColor: 'transparent' // Optional
  }}
>
  {/* Content */}
</Canvas>
```

### 2. Debug Mode (Development)
```typescript
<Canvas 
  style={{width: 300, height: 400}}
  debug={true} // Shows performance metrics
>
  {/* Content */}
</Canvas>
```

## Fill Component:
Fill component pura canvas ko ek color se fill kar deta hai.

```typescript
import {Canvas, Fill} from '@shopify/react-native-skia';

// Solid color fill
<Canvas style={{width: 300, height: 300}}>
  <Fill color="red" />
</Canvas>

// Transparent fill
<Canvas style={{width: 300, height: 300}}>
  <Fill color="rgba(255, 0, 0, 0.5)" />
</Canvas>

// Hex color fill
<Canvas style={{width: 300, height: 300}}>
  <Fill color="#FF5733" />
</Canvas>
```

## Coordinate System:
Canvas mein coordinate system left-top corner se start hota hai:
- (0, 0) = Top-left corner
- X-axis = Left se right (horizontal)
- Y-axis = Top se bottom (vertical)

```typescript
// Example coordinates
<Canvas style={{width: 300, height: 300}}>
  <Fill color="white" />
  {/* Top-left: (0, 0) */}
  {/* Top-right: (300, 0) */}
  {/* Bottom-left: (0, 300) */}
  {/* Bottom-right: (300, 300) */}
  {/* Center: (150, 150) */}
</Canvas>
```

## Multiple Elements in Canvas:
Canvas mein multiple elements add kar sakte hain:

```typescript
import {Canvas, Fill, Circle, Rect} from '@shopify/react-native-skia';

export const MultipleElements = () => {
  return (
    <Canvas style={{width: 300, height: 300}}>
      {/* Background */}
      <Fill color="lightgray" />
      
      {/* Rectangle */}
      <Rect x={50} y={50} width={100} height={80} color="blue" />
      
      {/* Circle */}
      <Circle cx={200} cy={100} r={40} color="red" />
    </Canvas>
  );
};
```

## Canvas Performance Tips:
1. **Fixed Dimensions**: Canvas ko fixed width/height dein
2. **Avoid Re-renders**: Unnecessary re-renders se bachein
3. **Use Memoization**: Complex calculations ko memoize karein

```typescript
import React, {useMemo} from 'react';

export const OptimizedCanvas = () => {
  const canvasSize = useMemo(() => ({
    width: Dimensions.get('window').width,
    height: 400
  }), []);

  return (
    <Canvas style={canvasSize}>
      <Fill color="white" />
    </Canvas>
  );
};
```

## How Canvas Works Internally:
1. **Native Rendering**: Canvas directly GPU pe render hota hai
2. **Component Tree**: Canvas ke andar jo bhi components hain, wo render tree banate hain
3. **Batching**: Multiple draw calls ko batch karke performance optimize karta hai
4. **Memory Management**: Automatically memory manage karta hai

## Common Mistakes:
1. Canvas ke bina elements use karna
2. Dynamic dimensions without memoization
3. Too many nested components
4. Not handling screen rotations

## Exercise 1: Basic Canvas
Create a canvas with:
- Light blue background
- Canvas size: 350x350
- Center it on screen

## Exercise 2: Multiple Backgrounds
Create a canvas with:
- Gradient-like effect using multiple Fill components with different opacities
- Size: Full screen width, 200 height

Next chapter mein hum shapes aur paths seekhenge!
