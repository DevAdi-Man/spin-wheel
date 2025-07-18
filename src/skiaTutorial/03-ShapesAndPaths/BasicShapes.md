# 03 - Shapes and Paths

## What are Shapes in Skia? (English Definition)
Shapes are geometric figures like circles, rectangles, lines, and polygons that can be drawn on the canvas. Paths are more complex shapes created by combining lines, curves, and arcs to form custom geometric figures.

## Hinglish Explanation:
Shapes matlab geometric figures jaise circle, rectangle, triangle wagaira. Skia mein aap basic shapes easily bana sakte hain. Paths zyada complex shapes hain jo aap custom bana sakte hain lines aur curves combine karke.

## Basic Shapes:

### 1. Circle
```typescript
import {Canvas, Circle, Fill} from '@shopify/react-native-skia';

export const CircleExample = () => {
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Fill color="white" />
      
      {/* Basic Circle */}
      <Circle 
        cx={150}    // Center X coordinate
        cy={150}    // Center Y coordinate  
        r={50}      // Radius
        color="red" // Fill color
      />
      
      {/* Circle with stroke only */}
      <Circle 
        cx={150} 
        cy={150} 
        r={80} 
        style="stroke"  // Only border, no fill
        strokeWidth={3}
        color="blue" 
      />
    </Canvas>
  );
};
```

### 2. Rectangle
```typescript
import {Canvas, Rect, Fill} from '@shopify/react-native-skia';

export const RectangleExample = () => {
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Fill color="lightgray" />
      
      {/* Basic Rectangle */}
      <Rect 
        x={50}        // X position
        y={50}        // Y position
        width={100}   // Width
        height={80}   // Height
        color="green"
      />
      
      {/* Rounded Rectangle */}
      <Rect 
        x={50} 
        y={150} 
        width={100} 
        height={80}
        rx={10}       // X-axis radius for rounded corners
        ry={10}       // Y-axis radius for rounded corners
        color="purple"
      />
    </Canvas>
  );
};
```

### 3. Line
```typescript
import {Canvas, Line, Fill} from '@shopify/react-native-skia';

export const LineExample = () => {
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Fill color="white" />
      
      {/* Simple Line */}
      <Line 
        p1={{x: 50, y: 50}}    // Start point
        p2={{x: 250, y: 100}}  // End point
        color="black"
        strokeWidth={2}
      />
      
      {/* Thick colored line */}
      <Line 
        p1={{x: 50, y: 150}} 
        p2={{x: 250, y: 200}} 
        color="red"
        strokeWidth={5}
        strokeCap="round"  // Line endings: "butt", "round", "square"
      />
    </Canvas>
  );
};
```

### 4. Oval/Ellipse
```typescript
import {Canvas, Oval, Fill} from '@shopify/react-native-skia';

export const OvalExample = () => {
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Fill color="lightblue" />
      
      {/* Oval/Ellipse */}
      <Oval 
        x={50}        // X position
        y={50}        // Y position
        width={150}   // Width
        height={100}  // Height
        color="orange"
      />
    </Canvas>
  );
};
```

## Shape Properties:

### Color Properties:
```typescript
// Solid colors
color="red"
color="#FF5733"
color="rgb(255, 87, 51)"
color="rgba(255, 87, 51, 0.8)"

// HSL colors
color="hsl(120, 100%, 50%)"
color="hsla(120, 100%, 50%, 0.8)"
```

### Style Properties:
```typescript
// Fill (default)
style="fill"

// Stroke only
style="stroke"
strokeWidth={3}
strokeCap="round"     // "butt", "round", "square"
strokeJoin="round"    // "miter", "round", "bevel"

// Both fill and stroke
style="fill"
// Add another shape with stroke for border effect
```

## Custom Paths:

### Basic Path
```typescript
import {Canvas, Path, Fill} from '@shopify/react-native-skia';

export const PathExample = () => {
  // Path string using SVG path syntax
  const pathString = "M 50 50 L 150 50 L 100 150 Z"; // Triangle
  
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Fill color="white" />
      
      <Path 
        path={pathString}
        color="green"
        style="fill"
      />
    </Canvas>
  );
};
```

### Advanced Path with Curves
```typescript
import {Canvas, Path, Fill} from '@shopify/react-native-skia';

export const CurvedPath = () => {
  // Heart shape path
  const heartPath = `
    M 150,200 
    C 150,180 130,160 100,160 
    C 70,160 50,180 50,210 
    C 50,240 150,280 150,280 
    C 150,280 250,240 250,210 
    C 250,180 230,160 200,160 
    C 170,160 150,180 150,200 Z
  `;
  
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Fill color="pink" />
      
      <Path 
        path={heartPath}
        color="red"
        style="fill"
      />
    </Canvas>
  );
};
```

## Path Commands (SVG Syntax):
- **M x y**: Move to point (x, y)
- **L x y**: Line to point (x, y)
- **C x1 y1 x2 y2 x y**: Cubic Bezier curve
- **Q x1 y1 x y**: Quadratic Bezier curve
- **A rx ry rotation large-arc sweep x y**: Arc
- **Z**: Close path

## How Shapes Work Internally:
1. **Vector Graphics**: Shapes mathematical equations se define hote hain
2. **Rasterization**: GPU shapes ko pixels mein convert karta hai
3. **Anti-aliasing**: Smooth edges ke liye
4. **Clipping**: Canvas boundaries ke andar hi draw hota hai

## Performance Tips:
1. **Reuse Paths**: Complex paths ko reuse karein
2. **Avoid Too Many Shapes**: Zyada shapes performance affect karte hain
3. **Use Simple Shapes**: Complex paths se bachein jahan possible ho

## Exercise 1: Traffic Light
Create a traffic light using three circles:
- Red circle at top
- Yellow circle in middle  
- Green circle at bottom
- Black rectangle background

## Exercise 2: House Drawing
Create a simple house using:
- Rectangle for base
- Triangle for roof
- Rectangle for door
- Two small rectangles for windows

## Exercise 3: Custom Logo
Create a custom logo using Path component with curves and lines.

Next chapter mein hum colors aur gradients seekhenge!
