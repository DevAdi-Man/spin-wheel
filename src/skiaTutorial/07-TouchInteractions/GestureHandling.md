# 07 - Touch Interactions and Gesture Handling

## What are Touch Interactions? (English Definition)
Touch interactions are user input events that occur when users interact with the screen through touches, taps, drags, pinches, and other gestures. In React Native Skia, these interactions can be captured and used to manipulate graphics in real-time.

## Hinglish Explanation:
Touch interactions matlab user ke screen pe touch karne se jo events generate hote hain. Jaise tap, drag, pinch, swipe wagaira. Skia mein aap in gestures ko capture karke graphics ko real-time mein change kar sakte hain, jaise drawing apps mein hota hai.

## Basic Touch Events:

### 1. Touch Detection
```typescript
import React from 'react';
import {Canvas, Circle, useTouchHandler} from '@shopify/react-native-skia';

export const BasicTouch = () => {
  const touchHandler = useTouchHandler({
    onStart: (event) => {
      console.log('Touch started at:', event.x, event.y);
    },
    onActive: (event) => {
      console.log('Touch moving at:', event.x, event.y);
    },
    onEnd: (event) => {
      console.log('Touch ended at:', event.x, event.y);
    },
  });
  
  return (
    <Canvas style={{width: 300, height: 300}} onTouch={touchHandler}>
      <Circle cx={150} cy={150} r={50} color="blue" />
    </Canvas>
  );
};
```

### 2. Interactive Circle (Follow Touch)
```typescript
import React from 'react';
import {Canvas, Circle, useValue, useTouchHandler} from '@shopify/react-native-skia';

export const FollowTouch = () => {
  const cx = useValue(150);
  const cy = useValue(150);
  
  const touchHandler = useTouchHandler({
    onActive: (event) => {
      cx.current = event.x;
      cy.current = event.y;
    },
  });
  
  return (
    <Canvas style={{width: 300, height: 300}} onTouch={touchHandler}>
      <Circle cx={cx} cy={cy} r={30} color="red" />
    </Canvas>
  );
};
```

### 3. Tap to Create Circles
```typescript
import React, {useState} from 'react';
import {Canvas, Circle, useTouchHandler} from '@shopify/react-native-skia';

interface CircleData {
  id: number;
  x: number;
  y: number;
  color: string;
}

export const TapToCreate = () => {
  const [circles, setCircles] = useState<CircleData[]>([]);
  
  const colors = ['red', 'blue', 'green', 'orange', 'purple'];
  
  const touchHandler = useTouchHandler({
    onEnd: (event) => {
      const newCircle: CircleData = {
        id: Date.now(),
        x: event.x,
        y: event.y,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
      setCircles(prev => [...prev, newCircle]);
    },
  });
  
  return (
    <Canvas style={{width: 300, height: 300}} onTouch={touchHandler}>
      {circles.map(circle => (
        <Circle
          key={circle.id}
          cx={circle.x}
          cy={circle.y}
          r={20}
          color={circle.color}
        />
      ))}
    </Canvas>
  );
};
```

## Drawing with Touch:

### 4. Simple Drawing
```typescript
import React, {useState} from 'react';
import {Canvas, Path, useTouchHandler} from '@shopify/react-native-skia';

export const SimpleDrawing = () => {
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  
  const touchHandler = useTouchHandler({
    onStart: (event) => {
      setCurrentPath(`M ${event.x} ${event.y}`);
    },
    onActive: (event) => {
      setCurrentPath(prev => `${prev} L ${event.x} ${event.y}`);
    },
    onEnd: () => {
      if (currentPath) {
        setPaths(prev => [...prev, currentPath]);
        setCurrentPath('');
      }
    },
  });
  
  return (
    <Canvas style={{width: 300, height: 300}} onTouch={touchHandler}>
      {/* Completed paths */}
      {paths.map((path, index) => (
        <Path
          key={index}
          path={path}
          style="stroke"
          strokeWidth={3}
          color="black"
        />
      ))}
      
      {/* Current drawing path */}
      {currentPath && (
        <Path
          path={currentPath}
          style="stroke"
          strokeWidth={3}
          color="red"
        />
      )}
    </Canvas>
  );
};
```

### 5. Smooth Drawing with Curves
```typescript
import React, {useState, useRef} from 'react';
import {Canvas, Path, useTouchHandler} from '@shopify/react-native-skia';

interface Point {
  x: number;
  y: number;
}

export const SmoothDrawing = () => {
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const lastPoint = useRef<Point | null>(null);
  
  const createSmoothPath = (points: Point[]): string => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlX = (current.x + next.x) / 2;
      const controlY = (current.y + next.y) / 2;
      
      path += ` Q ${current.x} ${current.y} ${controlX} ${controlY}`;
    }
    
    return path;
  };
  
  const touchHandler = useTouchHandler({
    onStart: (event) => {
      lastPoint.current = {x: event.x, y: event.y};
      setCurrentPath(`M ${event.x} ${event.y}`);
    },
    onActive: (event) => {
      if (lastPoint.current) {
        const midX = (lastPoint.current.x + event.x) / 2;
        const midY = (lastPoint.current.y + event.y) / 2;
        
        setCurrentPath(prev => 
          `${prev} Q ${lastPoint.current!.x} ${lastPoint.current!.y} ${midX} ${midY}`
        );
        
        lastPoint.current = {x: event.x, y: event.y};
      }
    },
    onEnd: () => {
      if (currentPath) {
        setPaths(prev => [...prev, currentPath]);
        setCurrentPath('');
      }
      lastPoint.current = null;
    },
  });
  
  return (
    <Canvas style={{width: 300, height: 300}} onTouch={touchHandler}>
      {paths.map((path, index) => (
        <Path
          key={index}
          path={path}
          style="stroke"
          strokeWidth={4}
          strokeCap="round"
          strokeJoin="round"
          color="blue"
        />
      ))}
      
      {currentPath && (
        <Path
          path={currentPath}
          style="stroke"
          strokeWidth={4}
          strokeCap="round"
          strokeJoin="round"
          color="red"
        />
      )}
    </Canvas>
  );
};
```

## Advanced Interactions:

### 6. Draggable Objects
```typescript
import React, {useState} from 'react';
import {Canvas, Circle, useTouchHandler} from '@shopify/react-native-skia';

interface DraggableCircle {
  id: number;
  x: number;
  y: number;
  color: string;
  isDragging: boolean;
}

export const DraggableCircles = () => {
  const [circles, setCircles] = useState<DraggableCircle[]>([
    {id: 1, x: 100, y: 100, color: 'red', isDragging: false},
    {id: 2, x: 200, y: 150, color: 'blue', isDragging: false},
    {id: 3, x: 150, y: 200, color: 'green', isDragging: false},
  ]);
  
  const [dragOffset, setDragOffset] = useState({x: 0, y: 0});
  
  const findCircleAtPoint = (x: number, y: number): DraggableCircle | null => {
    return circles.find(circle => {
      const distance = Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2);
      return distance <= 30; // Circle radius
    }) || null;
  };
  
  const touchHandler = useTouchHandler({
    onStart: (event) => {
      const circle = findCircleAtPoint(event.x, event.y);
      if (circle) {
        setDragOffset({
          x: event.x - circle.x,
          y: event.y - circle.y
        });
        
        setCircles(prev => prev.map(c => 
          c.id === circle.id 
            ? {...c, isDragging: true}
            : {...c, isDragging: false}
        ));
      }
    },
    onActive: (event) => {
      setCircles(prev => prev.map(circle => 
        circle.isDragging
          ? {
              ...circle,
              x: event.x - dragOffset.x,
              y: event.y - dragOffset.y
            }
          : circle
      ));
    },
    onEnd: () => {
      setCircles(prev => prev.map(circle => 
        ({...circle, isDragging: false})
      ));
    },
  });
  
  return (
    <Canvas style={{width: 300, height: 300}} onTouch={touchHandler}>
      {circles.map(circle => (
        <Circle
          key={circle.id}
          cx={circle.x}
          cy={circle.y}
          r={30}
          color={circle.isDragging ? 'yellow' : circle.color}
          opacity={circle.isDragging ? 0.8 : 1}
        />
      ))}
    </Canvas>
  );
};
```

### 7. Pinch to Zoom
```typescript
import React from 'react';
import {Canvas, Circle, Group, useValue, useTouchHandler} from '@shopify/react-native-skia';

export const PinchToZoom = () => {
  const scale = useValue(1);
  const translateX = useValue(0);
  const translateY = useValue(0);
  
  let initialDistance = 0;
  let initialScale = 1;
  
  const getDistance = (touches: any[]) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].x - touches[1].x;
    const dy = touches[0].y - touches[1].y;
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  const touchHandler = useTouchHandler({
    onStart: (event) => {
      if (event.numberOfTouches === 2) {
        initialDistance = getDistance([event, event]); // Simplified
        initialScale = scale.current;
      }
    },
    onActive: (event) => {
      if (event.numberOfTouches === 2) {
        const currentDistance = getDistance([event, event]); // Simplified
        const scaleChange = currentDistance / initialDistance;
        scale.current = initialScale * scaleChange;
      } else if (event.numberOfTouches === 1) {
        // Pan gesture
        translateX.current = event.x - 150;
        translateY.current = event.y - 150;
      }
    },
  });
  
  return (
    <Canvas style={{width: 300, height: 300}} onTouch={touchHandler}>
      <Group
        transform={[
          {translateX: translateX},
          {translateY: translateY},
          {scale: scale},
        ]}
      >
        <Circle cx={150} cy={150} r={50} color="purple" />
      </Group>
    </Canvas>
  );
};
```

## Touch Feedback Effects:

### 8. Ripple Effect
```typescript
import React, {useState} from 'react';
import {Canvas, Circle, useTouchHandler, useValue, withTiming} from '@shopify/react-native-skia';

interface Ripple {
  id: number;
  x: number;
  y: number;
  radius: any;
  opacity: any;
}

export const RippleEffect = () => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  
  const touchHandler = useTouchHandler({
    onStart: (event) => {
      const radius = useValue(0);
      const opacity = useValue(0.6);
      
      const newRipple: Ripple = {
        id: Date.now(),
        x: event.x,
        y: event.y,
        radius,
        opacity
      };
      
      // Animate ripple
      radius.current = withTiming(100, {duration: 600});
      opacity.current = withTiming(0, {duration: 600});
      
      setRipples(prev => [...prev, newRipple]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);
    },
  });
  
  return (
    <Canvas style={{width: 300, height: 300}} onTouch={touchHandler}>
      {ripples.map(ripple => (
        <Circle
          key={ripple.id}
          cx={ripple.x}
          cy={ripple.y}
          r={ripple.radius}
          color={`rgba(0, 150, 255, ${ripple.opacity.current})`}
          style="stroke"
          strokeWidth={2}
        />
      ))}
    </Canvas>
  );
};
```

## Performance Tips:
1. **Debounce Touch Events**: Zyada frequent events ko limit karein
2. **Use Shared Values**: Complex calculations ke liye
3. **Optimize Re-renders**: Unnecessary state updates avoid karein
4. **Memory Management**: Old touch data ko clean up karein

## How Touch Events Work:
1. **Native Bridge**: Touch events native se JavaScript bridge
2. **Event Batching**: Multiple events ko batch mein process
3. **Coordinate Transformation**: Screen coordinates ko canvas coordinates
4. **Hit Testing**: Kaunsa element touch hua hai determine karna

## Exercise 1: Paint App
Create a simple paint app with:
- Multiple brush sizes
- Different colors
- Clear canvas option
- Smooth drawing

## Exercise 2: Interactive Game
Create a simple game where:
- User taps to destroy falling objects
- Score tracking
- Particle effects on hit

## Exercise 3: Gesture Recognition
Create a shape recognition system:
- User draws shapes
- App recognizes circle, square, triangle
- Visual feedback for recognition

## Exercise 4: Multi-touch Drawing
Create an app that supports:
- Multiple fingers drawing simultaneously
- Different colors for each finger
- Pressure sensitivity (if available)

Next chapter mein hum advanced techniques seekhenge!
