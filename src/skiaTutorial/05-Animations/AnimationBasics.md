# 05 - Animations in React Native Skia

## What are Animations? (English Definition)
Animations are sequences of images or frames displayed in rapid succession to create the illusion of movement. In React Native Skia, animations are smooth transitions of properties like position, size, color, and rotation over time using hardware acceleration.

## Hinglish Explanation:
Animations matlab movement ka illusion create karna. Jaise cartoon mein characters move karte hain, waise hi aap Skia mein shapes, colors, aur positions ko smoothly change kar sakte hain. Skia mein animations GPU pe chalti hain, isliye bahut smooth aur fast hoti hain.

## Animation Types in Skia:

### 1. Value Animations (useValue)
```typescript
import React, {useEffect} from 'react';
import {Canvas, Circle, useValue} from '@shopify/react-native-skia';

export const BasicValueAnimation = () => {
  const cx = useValue(50); // Initial value
  
  useEffect(() => {
    // Animate from 50 to 250 in 2 seconds
    cx.current = 250;
  }, []);
  
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Circle 
        cx={cx}     // Animated value
        cy={150} 
        r={30} 
        color="red" 
      />
    </Canvas>
  );
};
```

### 2. Timing Animations (withTiming)
```typescript
import React, {useEffect} from 'react';
import {Canvas, Circle, useValue, withTiming, Easing} from '@shopify/react-native-skia';

export const TimingAnimation = () => {
  const cx = useValue(50);
  
  useEffect(() => {
    cx.current = withTiming(250, {
      duration: 2000,           // 2 seconds
      easing: Easing.inOut(Easing.quad), // Smooth easing
    });
  }, []);
  
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Circle cx={cx} cy={150} r={30} color="blue" />
    </Canvas>
  );
};
```

### 3. Spring Animations (withSpring)
```typescript
import React, {useEffect} from 'react';
import {Canvas, Circle, useValue, withSpring} from '@shopify/react-native-skia';

export const SpringAnimation = () => {
  const cy = useValue(50);
  
  useEffect(() => {
    cy.current = withSpring(250, {
      damping: 10,      // Bounce control
      stiffness: 100,   // Spring strength
      mass: 1,          // Object mass
    });
  }, []);
  
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Circle cx={150} cy={cy} r={30} color="green" />
    </Canvas>
  );
};
```

### 4. Repeat Animations (withRepeat)
```typescript
import React, {useEffect} from 'react';
import {Canvas, Circle, useValue, withRepeat, withTiming} from '@shopify/react-native-skia';

export const RepeatAnimation = () => {
  const scale = useValue(1);
  
  useEffect(() => {
    scale.current = withRepeat(
      withTiming(1.5, {duration: 1000}), // Scale up to 1.5x
      -1,    // Infinite repeat (-1)
      true   // Reverse animation (yoyo effect)
    );
  }, []);
  
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Circle 
        cx={150} 
        cy={150} 
        r={scale.current * 30}  // Animated radius
        color="purple" 
      />
    </Canvas>
  );
};
```

## Complex Animations:

### 5. Multiple Property Animation
```typescript
import React, {useEffect} from 'react';
import {Canvas, Circle, useValue, withTiming, withDelay} from '@shopify/react-native-skia';

export const MultiPropertyAnimation = () => {
  const cx = useValue(50);
  const cy = useValue(50);
  const r = useValue(20);
  
  useEffect(() => {
    // Animate position
    cx.current = withTiming(250, {duration: 2000});
    cy.current = withDelay(500, withTiming(250, {duration: 1500}));
    
    // Animate size
    r.current = withDelay(1000, withTiming(50, {duration: 1000}));
  }, []);
  
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Circle cx={cx} cy={cy} r={r} color="orange" />
    </Canvas>
  );
};
```

### 6. Color Animation
```typescript
import React, {useEffect} from 'react';
import {Canvas, Circle, useValue, withTiming, interpolateColor} from '@shopify/react-native-skia';

export const ColorAnimation = () => {
  const progress = useValue(0);
  
  useEffect(() => {
    progress.current = withRepeat(
      withTiming(1, {duration: 2000}),
      -1,
      true
    );
  }, []);
  
  // Color interpolation
  const animatedColor = interpolateColor(
    progress,
    [0, 1],
    ["red", "blue"]
  );
  
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Circle 
        cx={150} 
        cy={150} 
        r={50} 
        color={animatedColor} 
      />
    </Canvas>
  );
};
```

### 7. Path Animation
```typescript
import React, {useEffect} from 'react';
import {Canvas, Path, useValue, withTiming, interpolatePath} from '@shopify/react-native-skia';

export const PathAnimation = () => {
  const progress = useValue(0);
  
  const startPath = "M 50 150 L 150 50 L 250 150";
  const endPath = "M 50 150 Q 150 250 250 150";  // Curved path
  
  useEffect(() => {
    progress.current = withRepeat(
      withTiming(1, {duration: 3000}),
      -1,
      true
    );
  }, []);
  
  const animatedPath = interpolatePath(progress, [0, 1], [startPath, endPath]);
  
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Path 
        path={animatedPath} 
        style="stroke" 
        strokeWidth={3}
        color="green" 
      />
    </Canvas>
  );
};
```

## Easing Functions:
```typescript
import {Easing} from '@shopify/react-native-skia';

// Linear (no easing)
easing: Easing.linear

// Ease in/out
easing: Easing.inOut(Easing.quad)
easing: Easing.inOut(Easing.cubic)

// Bounce
easing: Easing.bounce

// Elastic
easing: Easing.elastic(2)

// Custom bezier
easing: Easing.bezier(0.25, 0.1, 0.25, 1)
```

## Animation Sequences:
```typescript
import React, {useEffect} from 'react';
import {Canvas, Circle, useValue, withTiming, withSequence} from '@shopify/react-native-skia';

export const SequenceAnimation = () => {
  const cx = useValue(50);
  
  useEffect(() => {
    cx.current = withSequence(
      withTiming(150, {duration: 1000}), // Move to center
      withTiming(250, {duration: 1000}), // Move to right
      withTiming(50, {duration: 1000})   // Move back to start
    );
  }, []);
  
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Circle cx={cx} cy={150} r={30} color="red" />
    </Canvas>
  );
};
```

## Performance Optimization:

### 1. Use Shared Values
```typescript
import {useSharedValue} from 'react-native-reanimated';
import {useValue} from '@shopify/react-native-skia';

// Skia values for animations
const skiaValue = useValue(0);

// Shared values for complex logic
const sharedValue = useSharedValue(0);
```

### 2. Avoid Frequent Re-renders
```typescript
import React, {useMemo} from 'react';

export const OptimizedAnimation = () => {
  const animatedValue = useValue(0);
  
  // Memoize static properties
  const staticProps = useMemo(() => ({
    cy: 150,
    r: 30,
    color: "blue"
  }), []);
  
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Circle cx={animatedValue} {...staticProps} />
    </Canvas>
  );
};
```

## How Animations Work Internally:
1. **GPU Acceleration**: Animations GPU pe chalti hain, CPU pe nahi
2. **Interpolation**: Values ke beech smooth transition
3. **Frame Rate**: 60 FPS pe smooth animations
4. **Native Thread**: UI thread block nahi hota

## Common Animation Patterns:

### Loading Spinner
```typescript
export const LoadingSpinner = () => {
  const rotation = useValue(0);
  
  useEffect(() => {
    rotation.current = withRepeat(
      withTiming(360, {duration: 1000}),
      -1,
      false
    );
  }, []);
  
  return (
    <Canvas style={{width: 100, height: 100}}>
      <Circle 
        cx={50} 
        cy={50} 
        r={30} 
        style="stroke"
        strokeWidth={4}
        color="blue"
        transform={[{rotate: rotation}]}
      />
    </Canvas>
  );
};
```

## Exercise 1: Bouncing Ball
Create a ball that bounces up and down continuously using spring animation.

## Exercise 2: Color Wheel
Create a circle that changes colors smoothly through rainbow spectrum.

## Exercise 3: Loading Animation
Create a loading animation with multiple circles appearing and disappearing in sequence.

## Exercise 4: Morphing Shape
Create a shape that morphs from circle to square using path interpolation.

Next chapter mein hum filters aur effects seekhenge!
