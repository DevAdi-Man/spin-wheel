# 06 - Filters and Effects

## What are Filters and Effects? (English Definition)
Filters and effects are image processing techniques that modify the appearance of graphics by applying mathematical transformations to pixels. They can create visual enhancements like blur, shadows, color adjustments, and artistic effects.

## Hinglish Explanation:
Filters aur effects matlab aapke graphics ko modify karna, jaise photo editing apps mein hota hai. Aap blur, shadow, glow, color changes wagaira kar sakte hain. Ye sab GPU pe process hote hain, isliye performance bhi achhi rehti hai.

## Basic Filters:

### 1. Blur Effect
```typescript
import React from 'react';
import {Canvas, Circle, Blur} from '@shopify/react-native-skia';

export const BlurEffect = () => {
  return (
    <Canvas style={{width: 300, height: 300}}>
      {/* Normal circle */}
      <Circle cx={100} cy={150} r={40} color="red" />
      
      {/* Blurred circle */}
      <Circle cx={200} cy={150} r={40} color="blue">
        <Blur blur={10} />  {/* Blur radius */}
      </Circle>
    </Canvas>
  );
};
```

### 2. Drop Shadow
```typescript
import React from 'react';
import {Canvas, Circle, DropShadow} from '@shopify/react-native-skia';

export const DropShadowEffect = () => {
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Circle cx={150} cy={150} r={50} color="orange">
        <DropShadow
          dx={5}           // Horizontal offset
          dy={5}           // Vertical offset  
          blur={10}        // Shadow blur
          color="black"    // Shadow color
          opacity={0.5}    // Shadow opacity
        />
      </Circle>
    </Canvas>
  );
};
```

### 3. Inner Shadow
```typescript
import React from 'react';
import {Canvas, Circle, InnerShadow} from '@shopify/react-native-skia';

export const InnerShadowEffect = () => {
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Circle cx={150} cy={150} r={60} color="lightblue">
        <InnerShadow
          dx={-3}
          dy={-3}
          blur={8}
          color="darkblue"
          opacity={0.7}
        />
      </Circle>
    </Canvas>
  );
};
```

## Color Filters:

### 4. Color Matrix Filter
```typescript
import React from 'react';
import {Canvas, Image, ColorMatrix} from '@shopify/react-native-skia';

export const ColorMatrixEffect = () => {
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Circle cx={150} cy={150} r={60} color="red">
        <ColorMatrix
          matrix={[
            // R  G  B  A  Offset
            1, 0, 0, 0, 0,    // Red channel
            0, 1, 0, 0, 0,    // Green channel  
            0, 0, 1, 0, 0,    // Blue channel
            0, 0, 0, 0.5, 0   // Alpha channel (50% opacity)
          ]}
        />
      </Circle>
    </Canvas>
  );
};
```

### 5. Sepia Effect
```typescript
export const SepiaEffect = () => {
  const sepiaMatrix = [
    0.393, 0.769, 0.189, 0, 0,
    0.349, 0.686, 0.168, 0, 0,
    0.272, 0.534, 0.131, 0, 0,
    0, 0, 0, 1, 0
  ];
  
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Circle cx={150} cy={150} r={60} color="blue">
        <ColorMatrix matrix={sepiaMatrix} />
      </Circle>
    </Canvas>
  );
};
```

### 6. Grayscale Effect
```typescript
export const GrayscaleEffect = () => {
  const grayscaleMatrix = [
    0.299, 0.587, 0.114, 0, 0,
    0.299, 0.587, 0.114, 0, 0,
    0.299, 0.587, 0.114, 0, 0,
    0, 0, 0, 1, 0
  ];
  
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Circle cx={150} cy={150} r={60} color="rainbow">
        <ColorMatrix matrix={grayscaleMatrix} />
      </Circle>
    </Canvas>
  );
};
```

## Advanced Effects:

### 7. Morphology (Dilate/Erode)
```typescript
import React from 'react';
import {Canvas, Circle, Morphology} from '@shopify/react-native-skia';

export const MorphologyEffect = () => {
  return (
    <Canvas style={{width: 300, height: 300}}>
      {/* Original */}
      <Circle cx={100} cy={150} r={30} color="red" />
      
      {/* Dilated (expanded) */}
      <Circle cx={200} cy={150} r={30} color="blue">
        <Morphology operator="dilate" radius={5} />
      </Circle>
    </Canvas>
  );
};
```

### 8. Displacement Map
```typescript
import React from 'react';
import {Canvas, Circle, DisplacementMap, Turbulence} from '@shopify/react-native-skia';

export const DisplacementEffect = () => {
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Circle cx={150} cy={150} r={60} color="green">
        <DisplacementMap
          channelX="r"     // Use red channel for X displacement
          channelY="g"     // Use green channel for Y displacement
          scale={20}       // Displacement strength
        >
          <Turbulence
            freqX={0.01}
            freqY={0.01}
            octaves={2}
          />
        </DisplacementMap>
      </Circle>
    </Canvas>
  );
};
```

## Glow Effects:

### 9. Outer Glow
```typescript
import React from 'react';
import {Canvas, Circle, Group} from '@shopify/react-native-skia';

export const OuterGlow = () => {
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Group>
        {/* Glow layers (multiple blurred circles) */}
        <Circle cx={150} cy={150} r={70} color="rgba(255, 0, 0, 0.1)">
          <Blur blur={20} />
        </Circle>
        <Circle cx={150} cy={150} r={60} color="rgba(255, 0, 0, 0.2)">
          <Blur blur={15} />
        </Circle>
        <Circle cx={150} cy={150} r={50} color="rgba(255, 0, 0, 0.3)">
          <Blur blur={10} />
        </Circle>
        
        {/* Main circle */}
        <Circle cx={150} cy={150} r={40} color="red" />
      </Group>
    </Canvas>
  );
};
```

### 10. Neon Effect
```typescript
export const NeonEffect = () => {
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Group>
        {/* Outer glow */}
        <Circle cx={150} cy={150} r={80} color="rgba(0, 255, 255, 0.1)">
          <Blur blur={25} />
        </Circle>
        
        {/* Middle glow */}
        <Circle cx={150} cy={150} r={60} color="rgba(0, 255, 255, 0.3)">
          <Blur blur={15} />
        </Circle>
        
        {/* Inner glow */}
        <Circle cx={150} cy={150} r={45} color="rgba(0, 255, 255, 0.6)">
          <Blur blur={8} />
        </Circle>
        
        {/* Core */}
        <Circle cx={150} cy={150} r={35} color="cyan" />
      </Group>
    </Canvas>
  );
};
```

## Animated Effects:

### 11. Pulsing Glow
```typescript
import React, {useEffect} from 'react';
import {Canvas, Circle, Group, useValue, withRepeat, withTiming} from '@shopify/react-native-skia';

export const PulsingGlow = () => {
  const glowRadius = useValue(60);
  const glowOpacity = useValue(0.3);
  
  useEffect(() => {
    glowRadius.current = withRepeat(
      withTiming(80, {duration: 1500}),
      -1,
      true
    );
    
    glowOpacity.current = withRepeat(
      withTiming(0.1, {duration: 1500}),
      -1,
      true
    );
  }, []);
  
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Group>
        {/* Animated glow */}
        <Circle 
          cx={150} 
          cy={150} 
          r={glowRadius} 
          color={`rgba(255, 0, 255, ${glowOpacity.current})`}
        >
          <Blur blur={20} />
        </Circle>
        
        {/* Core circle */}
        <Circle cx={150} cy={150} r={40} color="magenta" />
      </Group>
    </Canvas>
  );
};
```

## Combining Multiple Effects:

### 12. Glass Effect
```typescript
export const GlassEffect = () => {
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Group>
        {/* Background */}
        <Circle cx={150} cy={150} r={80} color="rgba(255, 255, 255, 0.1)">
          <Blur blur={10} />
        </Circle>
        
        {/* Glass surface */}
        <Circle cx={150} cy={150} r={70} color="rgba(255, 255, 255, 0.2)">
          <InnerShadow
            dx={2}
            dy={2}
            blur={5}
            color="white"
            opacity={0.5}
          />
        </Circle>
        
        {/* Highlight */}
        <Circle cx={130} cy={130} r={20} color="rgba(255, 255, 255, 0.4)">
          <Blur blur={8} />
        </Circle>
      </Group>
    </Canvas>
  );
};
```

## Performance Tips:
1. **Limit Filter Complexity**: Zyada complex filters avoid karein
2. **Use Groups**: Related effects ko group mein rakhein
3. **Cache Effects**: Static effects ko cache karein
4. **Optimize Blur Radius**: Zyada blur radius performance affect karta hai

## How Filters Work Internally:
1. **GPU Shaders**: Filters GPU shaders use karte hain
2. **Pixel Processing**: Har pixel pe mathematical operations
3. **Multi-pass Rendering**: Complex effects multiple passes mein render hote hain
4. **Memory Usage**: Filters extra memory use karte hain

## Exercise 1: Glowing Button
Create a button with:
- Outer glow effect
- Inner shadow for depth
- Animated pulsing glow

## Exercise 2: Frosted Glass Card
Create a card with:
- Semi-transparent background
- Blur effect
- Subtle inner shadow
- White highlight

## Exercise 3: Neon Sign
Create a neon sign effect with:
- Multiple glow layers
- Animated flickering
- Color transitions

## Exercise 4: Photo Filter
Create a photo filter that combines:
- Color matrix for mood
- Blur for softness
- Vignette effect (dark edges)

Next chapter mein hum touch interactions seekhenge!
