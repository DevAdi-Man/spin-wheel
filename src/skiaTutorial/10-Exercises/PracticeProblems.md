# 10 - Exercises and Practice Problems

## What are Practice Exercises? (English Definition)
Practice exercises are hands-on coding challenges designed to reinforce learning concepts, test understanding, and build practical skills through progressive difficulty levels from beginner to advanced implementations.

## Hinglish Explanation:
Practice exercises matlab hands-on coding problems jo aapki learning ko strong banate hain. Ye beginner se advanced level tak ke problems hain jo step-by-step aapki skills improve karte hain. Har exercise ke saath solution bhi diya gaya hai.

## Beginner Level Exercises:

### Exercise 1: Color Palette Generator
**Problem**: Create a color palette that shows different shades of a base color.

**Requirements**:
- Display 5 circles in a row
- Each circle should be a different shade of the same color
- Add smooth fade animation when component loads

**Hints**:
- Use HSL color format for easy shade generation
- Use withTiming for fade animation
- Calculate opacity or lightness values

**Solution**:
```typescript
import React, {useEffect} from 'react';
import {Canvas, Circle, useValue, withTiming, withDelay} from '@shopify/react-native-skia';

export const ColorPaletteGenerator = () => {
  const baseHue = 240; // Blue
  const opacity = useValue(0);
  
  useEffect(() => {
    opacity.current = withTiming(1, {duration: 1000});
  }, []);
  
  const shades = Array.from({length: 5}, (_, i) => ({
    lightness: 20 + (i * 15), // 20%, 35%, 50%, 65%, 80%
    x: 50 + (i * 60),
    delay: i * 200
  }));
  
  return (
    <Canvas style={{width: 350, height: 150}}>
      {shades.map((shade, index) => (
        <Circle
          key={index}
          cx={shade.x}
          cy={75}
          r={25}
          color={`hsl(${baseHue}, 70%, ${shade.lightness}%)`}
          opacity={opacity}
        />
      ))}
    </Canvas>
  );
};
```

### Exercise 2: Animated Loading Dots
**Problem**: Create three dots that animate in sequence to show loading state.

**Requirements**:
- Three dots in a row
- Each dot should scale up and down in sequence
- Animation should loop infinitely
- Use spring animation for bouncy effect

**Solution**:
```typescript
import React, {useEffect} from 'react';
import {Canvas, Circle, useValue, withRepeat, withDelay, withSpring} from '@shopify/react-native-skia';

export const AnimatedLoadingDots = () => {
  const scale1 = useValue(1);
  const scale2 = useValue(1);
  const scale3 = useValue(1);
  
  useEffect(() => {
    const animationConfig = {
      damping: 10,
      stiffness: 200,
    };
    
    scale1.current = withRepeat(
      withSpring(1.5, animationConfig),
      -1,
      true
    );
    
    scale2.current = withDelay(200, withRepeat(
      withSpring(1.5, animationConfig),
      -1,
      true
    ));
    
    scale3.current = withDelay(400, withRepeat(
      withSpring(1.5, animationConfig),
      -1,
      true
    ));
  }, []);
  
  return (
    <Canvas style={{width: 200, height: 100}}>
      <Circle cx={50} cy={50} r={scale1.current * 15} color="blue" />
      <Circle cx={100} cy={50} r={scale2.current * 15} color="blue" />
      <Circle cx={150} cy={50} r={scale3.current * 15} color="blue" />
    </Canvas>
  );
};
```

### Exercise 3: Simple Thermometer
**Problem**: Create a thermometer that shows temperature with animated mercury rise.

**Requirements**:
- Vertical rectangle for thermometer body
- Circle at bottom for bulb
- Animated fill based on temperature value
- Temperature text display

**Solution**:
```typescript
import React, {useEffect} from 'react';
import {Canvas, Rect, Circle, Text, useValue, withTiming, useFont} from '@shopify/react-native-skia';

interface ThermometerProps {
  temperature: number; // 0 to 100
}

export const SimpleThermometer: React.FC<ThermometerProps> = ({temperature}) => {
  const fillHeight = useValue(0);
  const font = useFont(require('./assets/font.ttf'), 16);
  
  useEffect(() => {
    fillHeight.current = withTiming(temperature * 2, {duration: 1500});
  }, [temperature]);
  
  return (
    <Canvas style={{width: 150, height: 300}}>
      {/* Thermometer body */}
      <Rect 
        x={60} 
        y={50} 
        width={30} 
        height={200} 
        rx={15}
        color="lightgray"
        style="stroke"
        strokeWidth={2}
      />
      
      {/* Mercury fill */}
      <Rect 
        x={65} 
        y={245 - fillHeight.current} 
        width={20} 
        height={fillHeight.current + 20}
        rx={10}
        color="red"
      />
      
      {/* Bulb */}
      <Circle 
        cx={75} 
        cy={265} 
        r={20} 
        color="red"
      />
      
      {/* Temperature text */}
      {font && (
        <Text
          x={100}
          y={150}
          text={`${temperature}°C`}
          font={font}
          color="black"
        />
      )}
    </Canvas>
  );
};
```

## Intermediate Level Exercises:

### Exercise 4: Interactive Slider
**Problem**: Create a custom slider component with touch interaction.

**Requirements**:
- Horizontal track
- Draggable thumb
- Value display
- Smooth animations
- Touch handling

**Solution**:
```typescript
import React, {useState} from 'react';
import {Canvas, Rect, Circle, Text, useTouchHandler, useFont} from '@shopify/react-native-skia';

interface CustomSliderProps {
  min: number;
  max: number;
  value: number;
  onValueChange: (value: number) => void;
  width: number;
}

export const CustomSlider: React.FC<CustomSliderProps> = ({
  min,
  max,
  value,
  onValueChange,
  width
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const font = useFont(require('./assets/font.ttf'), 14);
  
  const trackHeight = 6;
  const thumbRadius = 15;
  const trackY = 30;
  
  const valueToPosition = (val: number) => {
    return ((val - min) / (max - min)) * (width - 40) + 20;
  };
  
  const positionToValue = (pos: number) => {
    const ratio = (pos - 20) / (width - 40);
    return Math.max(min, Math.min(max, min + ratio * (max - min)));
  };
  
  const thumbX = valueToPosition(value);
  
  const touchHandler = useTouchHandler({
    onStart: (event) => {
      const distance = Math.abs(event.x - thumbX);
      if (distance <= thumbRadius) {
        setIsDragging(true);
      }
    },
    onActive: (event) => {
      if (isDragging) {
        const newValue = positionToValue(event.x);
        onValueChange(Math.round(newValue));
      }
    },
    onEnd: () => {
      setIsDragging(false);
    },
  });
  
  return (
    <Canvas style={{width, height: 80}} onTouch={touchHandler}>
      {/* Track background */}
      <Rect
        x={20}
        y={trackY}
        width={width - 40}
        height={trackHeight}
        rx={trackHeight / 2}
        color="lightgray"
      />
      
      {/* Track fill */}
      <Rect
        x={20}
        y={trackY}
        width={thumbX - 20}
        height={trackHeight}
        rx={trackHeight / 2}
        color="blue"
      />
      
      {/* Thumb */}
      <Circle
        cx={thumbX}
        cy={trackY + trackHeight / 2}
        r={thumbRadius}
        color={isDragging ? "darkblue" : "blue"}
      />
      
      {/* Value text */}
      {font && (
        <Text
          x={thumbX - 10}
          y={65}
          text={value.toString()}
          font={font}
          color="black"
        />
      )}
    </Canvas>
  );
};

// Usage Example
export const SliderExample = () => {
  const [sliderValue, setSliderValue] = useState(50);
  
  return (
    <CustomSlider
      min={0}
      max={100}
      value={sliderValue}
      onValueChange={setSliderValue}
      width={300}
    />
  );
};
```

### Exercise 5: Pie Chart Component
**Problem**: Create an interactive pie chart with animated segments.

**Requirements**:
- Multiple data segments
- Different colors for each segment
- Animated drawing
- Touch interaction to highlight segments
- Legend display

**Solution**:
```typescript
import React, {useEffect, useState} from 'react';
import {Canvas, Path, Text, useTouchHandler, useValue, withTiming, useFont} from '@shopify/react-native-skia';

interface PieData {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieData[];
  size: number;
}

export const PieChart: React.FC<PieChartProps> = ({data, size}) => {
  const [selectedSegment, setSelectedSegment] = useState<number>(-1);
  const animationProgress = useValue(0);
  const font = useFont(require('./assets/font.ttf'), 12);
  
  useEffect(() => {
    animationProgress.current = withTiming(1, {duration: 2000});
  }, []);
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 20;
  
  const segments = data.map((item, index) => {
    const percentage = item.value / total;
    const angle = percentage * 2 * Math.PI;
    return {
      ...item,
      percentage,
      angle,
      index
    };
  });
  
  const createPiePath = (startAngle: number, endAngle: number, isSelected: boolean) => {
    const outerRadius = isSelected ? radius + 10 : radius;
    const x1 = centerX + Math.cos(startAngle) * outerRadius;
    const y1 = centerY + Math.sin(startAngle) * outerRadius;
    const x2 = centerX + Math.cos(endAngle) * outerRadius;
    const y2 = centerY + Math.sin(endAngle) * outerRadius;
    
    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };
  
  const touchHandler = useTouchHandler({
    onStart: (event) => {
      const dx = event.x - centerX;
      const dy = event.y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= radius) {
        let angle = Math.atan2(dy, dx);
        if (angle < 0) angle += 2 * Math.PI;
        
        let currentAngle = 0;
        for (let i = 0; i < segments.length; i++) {
          const segmentEndAngle = currentAngle + segments[i].angle;
          if (angle >= currentAngle && angle <= segmentEndAngle) {
            setSelectedSegment(i);
            break;
          }
          currentAngle = segmentEndAngle;
        }
      } else {
        setSelectedSegment(-1);
      }
    },
  });
  
  let currentAngle = 0;
  
  return (
    <Canvas style={{width: size, height: size}} onTouch={touchHandler}>
      {segments.map((segment, index) => {
        const startAngle = currentAngle;
        const endAngle = currentAngle + segment.angle * animationProgress.current;
        const isSelected = selectedSegment === index;
        
        const path = createPiePath(startAngle, endAngle, isSelected);
        
        currentAngle += segment.angle;
        
        return (
          <Path
            key={index}
            path={path}
            color={segment.color}
            opacity={isSelected ? 0.8 : 1}
          />
        );
      })}
      
      {/* Labels */}
      {font && segments.map((segment, index) => {
        const angle = (index === 0 ? 0 : segments.slice(0, index).reduce((sum, s) => sum + s.angle, 0)) + segment.angle / 2;
        const labelRadius = radius * 0.7;
        const x = centerX + Math.cos(angle) * labelRadius - 15;
        const y = centerY + Math.sin(angle) * labelRadius + 5;
        
        return (
          <Text
            key={`label-${index}`}
            x={x}
            y={y}
            text={`${Math.round(segment.percentage * 100)}%`}
            font={font}
            color="white"
          />
        );
      })}
    </Canvas>
  );
};
```

## Advanced Level Exercises:

### Exercise 6: Physics Simulation
**Problem**: Create a bouncing balls simulation with realistic physics.

**Requirements**:
- Multiple balls with different properties
- Gravity simulation
- Collision detection with walls
- Ball-to-ball collisions
- Energy loss on bounces

**Solution**:
```typescript
import React, {useEffect, useState, useRef} from 'react';
import {Canvas, Circle} from '@shopify/react-native-skia';

interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  mass: number;
}

export const PhysicsSimulation = () => {
  const [balls, setBalls] = useState<Ball[]>([]);
  const animationRef = useRef<number>();
  const canvasWidth = 350;
  const canvasHeight = 500;
  const gravity = 0.5;
  const friction = 0.99;
  const bounce = 0.8;
  
  useEffect(() => {
    // Initialize balls
    const initialBalls: Ball[] = Array.from({length: 5}, (_, i) => ({
      id: i,
      x: 50 + Math.random() * (canvasWidth - 100),
      y: 50 + Math.random() * 200,
      vx: (Math.random() - 0.5) * 10,
      vy: Math.random() * 5,
      radius: 15 + Math.random() * 15,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      mass: 1 + Math.random() * 2
    }));
    
    setBalls(initialBalls);
  }, []);
  
  useEffect(() => {
    const animate = () => {
      setBalls(prevBalls => {
        return prevBalls.map(ball => {
          let newBall = {...ball};
          
          // Apply gravity
          newBall.vy += gravity;
          
          // Apply friction
          newBall.vx *= friction;
          newBall.vy *= friction;
          
          // Update position
          newBall.x += newBall.vx;
          newBall.y += newBall.vy;
          
          // Wall collisions
          if (newBall.x - newBall.radius <= 0) {
            newBall.x = newBall.radius;
            newBall.vx *= -bounce;
          }
          if (newBall.x + newBall.radius >= canvasWidth) {
            newBall.x = canvasWidth - newBall.radius;
            newBall.vx *= -bounce;
          }
          if (newBall.y - newBall.radius <= 0) {
            newBall.y = newBall.radius;
            newBall.vy *= -bounce;
          }
          if (newBall.y + newBall.radius >= canvasHeight) {
            newBall.y = canvasHeight - newBall.radius;
            newBall.vy *= -bounce;
          }
          
          return newBall;
        });
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  return (
    <Canvas style={{width: canvasWidth, height: canvasHeight, backgroundColor: 'lightblue'}}>
      {balls.map(ball => (
        <Circle
          key={ball.id}
          cx={ball.x}
          cy={ball.y}
          r={ball.radius}
          color={ball.color}
        />
      ))}
    </Canvas>
  );
};
```

### Exercise 7: Advanced Drawing App
**Problem**: Create a feature-rich drawing application.

**Requirements**:
- Multiple brush types (pen, marker, eraser)
- Pressure sensitivity simulation
- Layer system
- Undo/Redo functionality
- Save/Load drawings

**Hints**:
- Use different stroke caps for different brushes
- Implement command pattern for undo/redo
- Store drawing data in structured format

### Exercise 8: Data Visualization Dashboard
**Problem**: Create a comprehensive dashboard with multiple chart types.

**Requirements**:
- Line chart with multiple series
- Bar chart with animations
- Pie chart with interactions
- Real-time data updates
- Export functionality

### Exercise 9: Mini Game Engine
**Problem**: Build a simple game engine framework.

**Requirements**:
- Game loop management
- Sprite system
- Collision detection
- Scene management
- Input handling

### Exercise 10: AR-like Experience
**Problem**: Create an augmented reality-like experience using device sensors.

**Requirements**:
- Use device orientation
- 3D-like transformations
- Particle effects
- Smooth animations
- Performance optimization

## Challenge Projects:

### Challenge 1: Complete Photo Editor
Build a full-featured photo editing app with filters, adjustments, and effects.

### Challenge 2: Educational Game
Create an educational game that teaches concepts through interactive graphics.

### Challenge 3: Data Analysis Tool
Build a tool for visualizing and analyzing complex datasets.

### Challenge 4: Creative Art App
Develop an app for creating digital art with advanced brush engines.

## Tips for Solving Exercises:

1. **Start Simple**: Begin with basic functionality, then add features
2. **Break Down Problems**: Divide complex problems into smaller parts
3. **Test Frequently**: Test each feature as you build it
4. **Optimize Later**: Focus on functionality first, optimize performance later
5. **Learn from Mistakes**: Debug issues to understand concepts better

## Next Steps:
- Practice these exercises regularly
- Experiment with variations
- Build your own projects
- Share your creations with the community
- Keep learning new techniques

Congratulations! Aapne React Native Skia ka complete tutorial complete kar liya hai! 🎉
