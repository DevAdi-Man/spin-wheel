# 04 - Colors and Gradients

## What are Colors and Gradients? (English Definition)
Colors in computer graphics are numerical representations of visual perception. Gradients are smooth transitions between two or more colors, creating visual effects like depth, lighting, and artistic appeal.

## Hinglish Explanation:
Colors matlab rang jo aap screen pe dekhte hain. Ye numbers ke form mein store hote hain. Gradients matlab ek color se dusre color mein smooth transition, jaise sunset mein colors change hote hain. Ye aapke graphics ko beautiful aur professional look dete hain.

## Color Systems in Skia:

### 1. Named Colors
```typescript
import {Canvas, Circle, Fill} from '@shopify/react-native-skia';

export const NamedColors = () => {
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Fill color="lightblue" />
      
      <Circle cx={75} cy={75} r={30} color="red" />
      <Circle cx={150} cy={75} r={30} color="green" />
      <Circle cx={225} cy={75} r={30} color="blue" />
      <Circle cx={75} cy={150} r={30} color="yellow" />
      <Circle cx={150} cy={150} r={30} color="purple" />
      <Circle cx={225} cy={150} r={30} color="orange" />
    </Canvas>
  );
};
```

### 2. Hex Colors
```typescript
export const HexColors = () => {
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Fill color="#F0F8FF" /> {/* Alice Blue */}
      
      <Circle cx={100} cy={100} r={40} color="#FF6B6B" /> {/* Coral */}
      <Circle cx={200} cy={100} r={40} color="#4ECDC4" /> {/* Turquoise */}
      <Circle cx={150} cy={180} r={40} color="#45B7D1" /> {/* Sky Blue */}
    </Canvas>
  );
};
```

### 3. RGB and RGBA Colors
```typescript
export const RGBColors = () => {
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Fill color="white" />
      
      {/* RGB: Red, Green, Blue (0-255) */}
      <Circle cx={100} cy={100} r={40} color="rgb(255, 99, 71)" />
      
      {/* RGBA: Red, Green, Blue, Alpha (0-1) */}
      <Circle cx={200} cy={100} r={40} color="rgba(75, 192, 192, 0.7)" />
      <Circle cx={150} cy={180} r={40} color="rgba(153, 102, 255, 0.5)" />
    </Canvas>
  );
};
```

### 4. HSL Colors
```typescript
export const HSLColors = () => {
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Fill color="hsl(0, 0%, 95%)" /> {/* Light gray */}
      
      {/* HSL: Hue (0-360), Saturation (0-100%), Lightness (0-100%) */}
      <Circle cx={100} cy={100} r={40} color="hsl(0, 100%, 50%)" />   {/* Red */}
      <Circle cx={200} cy={100} r={40} color="hsl(120, 100%, 50%)" /> {/* Green */}
      <Circle cx={150} cy={180} r={40} color="hsl(240, 100%, 50%)" /> {/* Blue */}
    </Canvas>
  );
};
```

## Linear Gradients:

### Basic Linear Gradient
```typescript
import {Canvas, Rect, LinearGradient, vec} from '@shopify/react-native-skia';

export const BasicLinearGradient = () => {
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Rect x={50} y={50} width={200} height={100}>
        <LinearGradient
          start={vec(0, 0)}        // Start point
          end={vec(200, 0)}        // End point (horizontal)
          colors={["red", "blue"]} // Color array
        />
      </Rect>
    </Canvas>
  );
};
```

### Multi-Color Linear Gradient
```typescript
export const MultiColorGradient = () => {
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Rect x={50} y={50} width={200} height={200}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(0, 200)}  // Vertical gradient
          colors={[
            "#FF6B6B",  // Light red
            "#4ECDC4",  // Turquoise  
            "#45B7D1",  // Sky blue
            "#96CEB4"   // Mint green
          ]}
          positions={[0, 0.3, 0.7, 1]} // Optional: color stop positions
        />
      </Rect>
    </Canvas>
  );
};
```

### Diagonal Gradient
```typescript
export const DiagonalGradient = () => {
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Rect x={50} y={50} width={200} height={200}>
        <LinearGradient
          start={vec(0, 0)}      // Top-left
          end={vec(200, 200)}    // Bottom-right (diagonal)
          colors={["#667eea", "#764ba2"]}
        />
      </Rect>
    </Canvas>
  );
};
```

## Radial Gradients:

### Basic Radial Gradient
```typescript
import {Canvas, Circle, RadialGradient, vec} from '@shopify/react-native-skia';

export const BasicRadialGradient = () => {
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Circle cx={150} cy={150} r={100}>
        <RadialGradient
          c={vec(150, 150)}  // Center point
          r={100}            // Radius
          colors={["yellow", "red"]}
        />
      </Circle>
    </Canvas>
  );
};
```

### Multi-Color Radial Gradient
```typescript
export const SunsetRadialGradient = () => {
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Circle cx={150} cy={150} r={120}>
        <RadialGradient
          c={vec(150, 150)}
          r={120}
          colors={[
            "#FFE066",  // Light yellow (center)
            "#FF6B35",  // Orange
            "#F7931E",  // Dark orange
            "#C5282F"   // Red (outer)
          ]}
          positions={[0, 0.4, 0.8, 1]}
        />
      </Circle>
    </Canvas>
  );
};
```

## Sweep/Conic Gradients:

### Basic Sweep Gradient
```typescript
import {Canvas, Circle, SweepGradient, vec} from '@shopify/react-native-skia';

export const BasicSweepGradient = () => {
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Circle cx={150} cy={150} r={100}>
        <SweepGradient
          c={vec(150, 150)}  // Center point
          colors={[
            "red", 
            "yellow", 
            "green", 
            "cyan", 
            "blue", 
            "magenta", 
            "red"
          ]}
        />
      </Circle>
    </Canvas>
  );
};
```

## Advanced Gradient Techniques:

### Gradient with Opacity
```typescript
export const GradientWithOpacity = () => {
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Fill color="black" />
      
      <Rect x={50} y={50} width={200} height={200}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(200, 200)}
          colors={[
            "rgba(255, 255, 255, 1)",   // Fully opaque white
            "rgba(255, 255, 255, 0.5)", // Semi-transparent
            "rgba(255, 255, 255, 0)"    // Fully transparent
          ]}
        />
      </Rect>
    </Canvas>
  );
};
```

### Multiple Gradients (Layering)
```typescript
export const LayeredGradients = () => {
  return (
    <Canvas style={{width: 300, height: 300}}>
      {/* Background gradient */}
      <Rect x={0} y={0} width={300} height={300}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(0, 300)}
          colors={["#667eea", "#764ba2"]}
        />
      </Rect>
      
      {/* Overlay gradient */}
      <Circle cx={150} cy={150} r={80}>
        <RadialGradient
          c={vec(150, 150)}
          r={80}
          colors={["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 0)"]}
        />
      </Circle>
    </Canvas>
  );
};
```

## Color Theory Tips:
1. **Complementary Colors**: Opposite colors on color wheel (red-green, blue-orange)
2. **Analogous Colors**: Adjacent colors on color wheel
3. **Monochromatic**: Different shades of same color
4. **Triadic**: Three colors equally spaced on color wheel

## Performance Considerations:
1. **Gradient Complexity**: Complex gradients GPU pe load dalte hain
2. **Color Stops**: Zyada color stops avoid karein
3. **Reuse Gradients**: Same gradients ko reuse karein

## How Gradients Work Internally:
1. **Interpolation**: Colors ke beech mathematical interpolation
2. **GPU Shaders**: Gradients GPU shaders use karte hain
3. **Texture Mapping**: Gradients textures ki tarah apply hote hain

## Exercise 1: Rainbow Circle
Create a circle with rainbow sweep gradient (ROYGBIV colors).

## Exercise 2: Sunset Background
Create a sunset effect using:
- Radial gradient for sun
- Linear gradient for sky
- Layer them properly

## Exercise 3: Glass Effect
Create a glass/frosted effect using:
- Semi-transparent gradients
- Multiple layers
- Proper opacity values

Next chapter mein hum animations seekhenge!
