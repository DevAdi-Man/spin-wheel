# 08 - Advanced Techniques and Optimization

## What are Advanced Techniques? (English Definition)
Advanced techniques in React Native Skia involve complex graphics operations, performance optimizations, custom shaders, image processing, and sophisticated animation patterns that push the boundaries of what's possible with mobile graphics.

## Hinglish Explanation:
Advanced techniques matlab complex graphics banane ke tarike aur performance optimize karne ke methods. Jaise custom shaders, image processing, complex animations, memory management wagaira. Ye techniques professional-level apps banane ke liye zaroori hain.

## Performance Optimization:

### 1. Memoization and Caching
```typescript
import React, {useMemo, useCallback} from 'react';
import {Canvas, Circle, Path} from '@shopify/react-native-skia';

export const OptimizedComponent = () => {
  // Memoize expensive calculations
  const complexPath = useMemo(() => {
    let path = 'M 50 50';
    for (let i = 0; i < 100; i++) {
      const x = 50 + i * 2;
      const y = 50 + Math.sin(i * 0.1) * 30;
      path += ` L ${x} ${y}`;
    }
    return path;
  }, []);
  
  // Memoize static properties
  const circleProps = useMemo(() => ({
    cx: 150,
    cy: 150,
    r: 50,
    color: 'blue'
  }), []);
  
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Circle {...circleProps} />
      <Path 
        path={complexPath} 
        style="stroke" 
        strokeWidth={2} 
        color="red" 
      />
    </Canvas>
  );
};
```

### 2. Shared Values for Performance
```typescript
import React, {useEffect} from 'react';
import {Canvas, Circle, useSharedValue, useDerivedValue} from '@shopify/react-native-skia';
import {useSharedValue as useReanimatedSharedValue} from 'react-native-reanimated';

export const SharedValueOptimization = () => {
  const progress = useReanimatedSharedValue(0);
  
  // Derived values for complex calculations
  const circleX = useDerivedValue(() => {
    return 50 + progress.value * 200;
  });
  
  const circleY = useDerivedValue(() => {
    return 150 + Math.sin(progress.value * Math.PI * 2) * 50;
  });
  
  const circleColor = useDerivedValue(() => {
    const red = Math.floor(255 * progress.value);
    const blue = Math.floor(255 * (1 - progress.value));
    return `rgb(${red}, 0, ${blue})`;
  });
  
  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {duration: 2000}),
      -1,
      true
    );
  }, []);
  
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Circle 
        cx={circleX} 
        cy={circleY} 
        r={30} 
        color={circleColor} 
      />
    </Canvas>
  );
};
```

### 3. Batch Operations
```typescript
import React from 'react';
import {Canvas, Group, Circle} from '@shopify/react-native-skia';

export const BatchedOperations = () => {
  // Group related operations together
  const circles = useMemo(() => {
    return Array.from({length: 50}, (_, i) => ({
      id: i,
      cx: (i % 10) * 30 + 15,
      cy: Math.floor(i / 10) * 30 + 15,
      r: 10,
      color: `hsl(${i * 7}, 70%, 50%)`
    }));
  }, []);
  
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Group>
        {circles.map(circle => (
          <Circle
            key={circle.id}
            cx={circle.cx}
            cy={circle.cy}
            r={circle.r}
            color={circle.color}
          />
        ))}
      </Group>
    </Canvas>
  );
};
```

## Custom Shaders:

### 4. Fragment Shader
```typescript
import React from 'react';
import {Canvas, Rect, Shader, Skia} from '@shopify/react-native-skia';

export const CustomShader = () => {
  const shader = Skia.RuntimeEffect.Make(`
    uniform float time;
    uniform vec2 resolution;
    
    half4 main(vec2 fragCoord) {
      vec2 uv = fragCoord / resolution;
      
      // Create animated gradient
      float r = sin(time + uv.x * 3.14159) * 0.5 + 0.5;
      float g = sin(time + uv.y * 3.14159) * 0.5 + 0.5;
      float b = sin(time + (uv.x + uv.y) * 3.14159) * 0.5 + 0.5;
      
      return half4(r, g, b, 1.0);
    }
  `);
  
  const uniforms = useMemo(() => ({
    time: 0,
    resolution: [300, 300]
  }), []);
  
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Rect x={0} y={0} width={300} height={300}>
        <Shader source={shader} uniforms={uniforms} />
      </Rect>
    </Canvas>
  );
};
```

### 5. Animated Shader
```typescript
import React, {useEffect} from 'react';
import {Canvas, Rect, Shader, Skia, useValue, withRepeat, withTiming} from '@shopify/react-native-skia';

export const AnimatedShader = () => {
  const time = useValue(0);
  
  useEffect(() => {
    time.current = withRepeat(
      withTiming(10, {duration: 5000}),
      -1,
      false
    );
  }, []);
  
  const shader = Skia.RuntimeEffect.Make(`
    uniform float time;
    uniform vec2 resolution;
    
    half4 main(vec2 fragCoord) {
      vec2 uv = fragCoord / resolution;
      vec2 center = vec2(0.5, 0.5);
      
      float dist = distance(uv, center);
      float wave = sin(dist * 20.0 - time * 3.0) * 0.5 + 0.5;
      
      vec3 color = vec3(wave, wave * 0.5, 1.0 - wave);
      return half4(color, 1.0);
    }
  `);
  
  const uniforms = useDerivedValue(() => ({
    time: time.current,
    resolution: [300, 300]
  }));
  
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Rect x={0} y={0} width={300} height={300}>
        <Shader source={shader} uniforms={uniforms} />
      </Rect>
    </Canvas>
  );
};
```

## Image Processing:

### 6. Image Filters
```typescript
import React from 'react';
import {Canvas, Image, ColorMatrix, Blur, useImage} from '@shopify/react-native-skia';

export const ImageProcessing = () => {
  const image = useImage(require('./assets/sample-image.jpg'));
  
  if (!image) return null;
  
  return (
    <Canvas style={{width: 300, height: 300}}>
      {/* Original image */}
      <Image 
        image={image} 
        x={0} 
        y={0} 
        width={150} 
        height={150} 
        fit="cover"
      />
      
      {/* Processed image */}
      <Image 
        image={image} 
        x={150} 
        y={0} 
        width={150} 
        height={150} 
        fit="cover"
      >
        <ColorMatrix
          matrix={[
            1.2, 0, 0, 0, 0,    // Increase red
            0, 1.1, 0, 0, 0,    // Increase green
            0, 0, 0.8, 0, 0,    // Decrease blue
            0, 0, 0, 1, 0       // Keep alpha
          ]}
        />
        <Blur blur={2} />
      </Image>
    </Canvas>
  );
};
```

### 7. Real-time Image Effects
```typescript
import React, {useEffect} from 'react';
import {Canvas, Image, ColorMatrix, useValue, withRepeat, withTiming, useImage} from '@shopify/react-native-skia';

export const RealTimeEffects = () => {
  const image = useImage(require('./assets/sample-image.jpg'));
  const hueRotation = useValue(0);
  
  useEffect(() => {
    hueRotation.current = withRepeat(
      withTiming(360, {duration: 3000}),
      -1,
      false
    );
  }, []);
  
  const colorMatrix = useDerivedValue(() => {
    const angle = (hueRotation.current * Math.PI) / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    
    return [
      0.213 + cos * 0.787 - sin * 0.213, 0.715 - cos * 0.715 - sin * 0.715, 0.072 - cos * 0.072 + sin * 0.928, 0, 0,
      0.213 - cos * 0.213 + sin * 0.143, 0.715 + cos * 0.285 + sin * 0.140, 0.072 - cos * 0.072 - sin * 0.283, 0, 0,
      0.213 - cos * 0.213 - sin * 0.787, 0.715 - cos * 0.715 + sin * 0.715, 0.072 + cos * 0.928 + sin * 0.072, 0, 0,
      0, 0, 0, 1, 0
    ];
  });
  
  if (!image) return null;
  
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Image 
        image={image} 
        x={0} 
        y={0} 
        width={300} 
        height={300} 
        fit="cover"
      >
        <ColorMatrix matrix={colorMatrix} />
      </Image>
    </Canvas>
  );
};
```

## Complex Animations:

### 8. Physics-based Animation
```typescript
import React, {useEffect} from 'react';
import {Canvas, Circle, useValue, runSpring} from '@shopify/react-native-skia';

export const PhysicsAnimation = () => {
  const ballY = useValue(50);
  const velocityY = useValue(0);
  const gravity = 0.5;
  const bounce = 0.8;
  const groundY = 250;
  
  useEffect(() => {
    const animate = () => {
      // Apply gravity
      velocityY.current += gravity;
      ballY.current += velocityY.current;
      
      // Bounce off ground
      if (ballY.current >= groundY) {
        ballY.current = groundY;
        velocityY.current *= -bounce;
      }
      
      // Continue animation
      requestAnimationFrame(animate);
    };
    
    animate();
  }, []);
  
  return (
    <Canvas style={{width: 300, height: 300}}>
      <Circle cx={150} cy={ballY} r={20} color="red" />
      {/* Ground */}
      <Rect x={0} y={270} width={300} height={30} color="brown" />
    </Canvas>
  );
};
```

### 9. Particle System
```typescript
import React, {useEffect, useState} from 'react';
import {Canvas, Circle} from '@shopify/react-native-skia';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export const ParticleSystem = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  const createParticle = (x: number, y: number): Particle => ({
    id: Math.random(),
    x,
    y,
    vx: (Math.random() - 0.5) * 10,
    vy: (Math.random() - 0.5) * 10,
    life: 1,
    color: `hsl(${Math.random() * 360}, 70%, 50%)`
  });
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Add new particles
      const newParticles = Array.from({length: 5}, () => 
        createParticle(150, 150)
      );
      
      setParticles(prev => {
        // Update existing particles
        const updated = prev
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 0.02
          }))
          .filter(particle => particle.life > 0);
        
        return [...updated, ...newParticles].slice(-100); // Limit particles
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Canvas style={{width: 300, height: 300}}>
      {particles.map(particle => (
        <Circle
          key={particle.id}
          cx={particle.x}
          cy={particle.y}
          r={particle.life * 5}
          color={particle.color}
          opacity={particle.life}
        />
      ))}
    </Canvas>
  );
};
```

## Memory Management:

### 10. Resource Cleanup
```typescript
import React, {useEffect, useRef} from 'react';
import {Canvas, Image, useImage} from '@shopify/react-native-skia';

export const ResourceManagement = () => {
  const image = useImage(require('./assets/large-image.jpg'));
  const animationRef = useRef<number>();
  
  useEffect(() => {
    // Cleanup animation on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Dispose image when component unmounts
  useEffect(() => {
    return () => {
      if (image) {
        // Image cleanup is handled automatically by Skia
      }
    };
  }, [image]);
  
  return (
    <Canvas style={{width: 300, height: 300}}>
      {image && (
        <Image 
          image={image} 
          x={0} 
          y={0} 
          width={300} 
          height={300} 
          fit="cover"
        />
      )}
    </Canvas>
  );
};
```

## Performance Monitoring:

### 11. FPS Counter
```typescript
import React, {useEffect, useState} from 'react';
import {Canvas, Text, useFont} from '@shopify/react-native-skia';

export const FPSCounter = () => {
  const [fps, setFps] = useState(0);
  const font = useFont(require('./assets/font.ttf'), 16);
  
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const countFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(countFPS);
    };
    
    countFPS();
  }, []);
  
  return (
    <Canvas style={{width: 300, height: 300}}>
      {font && (
        <Text
          x={10}
          y={30}
          text={`FPS: ${fps}`}
          font={font}
          color="black"
        />
      )}
    </Canvas>
  );
};
```

## Best Practices:

1. **Minimize Re-renders**: Use memoization and shared values
2. **Batch Operations**: Group related graphics operations
3. **Optimize Images**: Use appropriate image sizes and formats
4. **Clean Up Resources**: Dispose unused resources properly
5. **Monitor Performance**: Track FPS and memory usage
6. **Use Hardware Acceleration**: Leverage GPU for complex operations

## Common Performance Issues:
1. **Too Many Elements**: Limit number of rendered elements
2. **Complex Paths**: Simplify path calculations
3. **Frequent Updates**: Debounce rapid state changes
4. **Memory Leaks**: Clean up event listeners and animations
5. **Large Images**: Optimize image sizes and compression

## Exercise 1: Performance Benchmark
Create a performance test that:
- Renders 1000+ animated circles
- Measures FPS
- Compares optimized vs unoptimized versions

## Exercise 2: Custom Shader Effect
Create a custom shader that:
- Implements a water ripple effect
- Responds to touch interactions
- Uses time-based animations

## Exercise 3: Image Processing App
Build an app that:
- Applies real-time filters to camera feed
- Allows filter intensity adjustment
- Maintains 60 FPS performance

## Exercise 4: Particle Explosion
Create a particle system that:
- Explodes on touch
- Uses physics simulation
- Handles 500+ particles smoothly

Next chapter mein hum real-world examples dekhenge!
