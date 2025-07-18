# 09 - Real World Examples and Practical Projects

## What are Real World Examples? (English Definition)
Real world examples are practical applications and complete projects that demonstrate how React Native Skia can be used to build production-ready features like charts, games, image editors, and interactive visualizations that users actually encounter in mobile apps.

## Hinglish Explanation:
Real world examples matlab actual apps mein jo features hote hain, unhe Skia se kaise banate hain. Jaise charts, games, photo editors, interactive graphics wagaira. Ye examples aapko production-ready apps banane mein help karenge.

## Project 1: Interactive Chart Component

### Line Chart with Animation
```typescript
import React, {useEffect, useMemo} from 'react';
import {Canvas, Path, Circle, Text, Line, useValue, withTiming, useFont} from '@shopify/react-native-skia';

interface DataPoint {
  x: number;
  y: number;
  label: string;
}

interface LineChartProps {
  data: DataPoint[];
  width: number;
  height: number;
  color?: string;
}

export const AnimatedLineChart: React.FC<LineChartProps> = ({
  data,
  width,
  height,
  color = 'blue'
}) => {
  const animationProgress = useValue(0);
  const font = useFont(require('./assets/font.ttf'), 12);
  
  useEffect(() => {
    animationProgress.current = withTiming(1, {duration: 2000});
  }, [data]);
  
  const chartData = useMemo(() => {
    if (data.length === 0) return {path: '', points: []};
    
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const maxY = Math.max(...data.map(d => d.y));
    const minY = Math.min(...data.map(d => d.y));
    const rangeY = maxY - minY || 1;
    
    const points = data.map((point, index) => ({
      x: padding + (index / (data.length - 1)) * chartWidth,
      y: padding + ((maxY - point.y) / rangeY) * chartHeight,
      originalY: point.y,
      label: point.label
    }));
    
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    
    return {path, points, maxY, minY};
  }, [data, width, height]);
  
  const animatedPath = useDerivedValue(() => {
    const progress = animationProgress.current;
    if (progress === 0) return '';
    
    const totalLength = chartData.points.length;
    const visiblePoints = Math.floor(totalLength * progress);
    
    if (visiblePoints < 2) return '';
    
    let path = `M ${chartData.points[0].x} ${chartData.points[0].y}`;
    for (let i = 1; i < visiblePoints; i++) {
      path += ` L ${chartData.points[i].x} ${chartData.points[i].y}`;
    }
    
    return path;
  });
  
  return (
    <Canvas style={{width, height}}>
      {/* Grid lines */}
      {Array.from({length: 5}, (_, i) => (
        <Line
          key={`grid-${i}`}
          p1={{x: 40, y: 40 + (i * (height - 80) / 4)}}
          p2={{x: width - 40, y: 40 + (i * (height - 80) / 4)}}
          color="rgba(0,0,0,0.1)"
          strokeWidth={1}
        />
      ))}
      
      {/* Chart line */}
      <Path
        path={animatedPath}
        style="stroke"
        strokeWidth={3}
        color={color}
        strokeCap="round"
        strokeJoin="round"
      />
      
      {/* Data points */}
      {chartData.points.map((point, index) => (
        <Circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={4}
          color={color}
          opacity={animationProgress.current > index / chartData.points.length ? 1 : 0}
        />
      ))}
      
      {/* Labels */}
      {font && chartData.points.map((point, index) => (
        <Text
          key={`label-${index}`}
          x={point.x - 10}
          y={height - 20}
          text={point.label}
          font={font}
          color="black"
        />
      ))}
    </Canvas>
  );
};

// Usage Example
export const ChartExample = () => {
  const sampleData = [
    {x: 0, y: 10, label: 'Jan'},
    {x: 1, y: 25, label: 'Feb'},
    {x: 2, y: 15, label: 'Mar'},
    {x: 3, y: 35, label: 'Apr'},
    {x: 4, y: 30, label: 'May'},
    {x: 5, y: 45, label: 'Jun'},
  ];
  
  return (
    <AnimatedLineChart
      data={sampleData}
      width={350}
      height={250}
      color="blue"
    />
  );
};
```

## Project 2: Drawing/Signature App

### Complete Drawing App
```typescript
import React, {useState, useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {Canvas, Path, useTouchHandler} from '@shopify/react-native-skia';

interface DrawingPath {
  path: string;
  color: string;
  strokeWidth: number;
}

export const DrawingApp = () => {
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [currentColor, setCurrentColor] = useState<string>('black');
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  
  const colors = ['black', 'red', 'blue', 'green', 'purple', 'orange'];
  const strokeWidths = [1, 3, 5, 8, 12];
  
  const touchHandler = useTouchHandler({
    onStart: (event) => {
      setIsDrawing(true);
      setCurrentPath(`M ${event.x} ${event.y}`);
    },
    onActive: (event) => {
      if (isDrawing) {
        setCurrentPath(prev => `${prev} L ${event.x} ${event.y}`);
      }
    },
    onEnd: () => {
      if (currentPath && isDrawing) {
        setPaths(prev => [...prev, {
          path: currentPath,
          color: currentColor,
          strokeWidth: strokeWidth
        }]);
        setCurrentPath('');
      }
      setIsDrawing(false);
    },
  });
  
  const clearCanvas = useCallback(() => {
    setPaths([]);
    setCurrentPath('');
  }, []);
  
  const undoLastPath = useCallback(() => {
    setPaths(prev => prev.slice(0, -1));
  }, []);
  
  return (
    <View style={styles.container}>
      {/* Drawing Canvas */}
      <Canvas style={styles.canvas} onTouch={touchHandler}>
        {/* Completed paths */}
        {paths.map((pathData, index) => (
          <Path
            key={index}
            path={pathData.path}
            style="stroke"
            strokeWidth={pathData.strokeWidth}
            strokeCap="round"
            strokeJoin="round"
            color={pathData.color}
          />
        ))}
        
        {/* Current drawing path */}
        {currentPath && (
          <Path
            path={currentPath}
            style="stroke"
            strokeWidth={strokeWidth}
            strokeCap="round"
            strokeJoin="round"
            color={currentColor}
          />
        )}
      </Canvas>
      
      {/* Color Palette */}
      <View style={styles.colorPalette}>
        {colors.map(color => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorButton,
              {backgroundColor: color},
              currentColor === color && styles.selectedColor
            ]}
            onPress={() => setCurrentColor(color)}
          />
        ))}
      </View>
      
      {/* Stroke Width Selector */}
      <View style={styles.strokeWidthContainer}>
        {strokeWidths.map(width => (
          <TouchableOpacity
            key={width}
            style={[
              styles.strokeButton,
              strokeWidth === width && styles.selectedStroke
            ]}
            onPress={() => setStrokeWidth(width)}
          >
            <View 
              style={[
                styles.strokePreview,
                {width: width * 2, height: width * 2, borderRadius: width}
              ]} 
            />
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.button} onPress={undoLastPath}>
          <Text style={styles.buttonText}>Undo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={clearCanvas}>
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  canvas: {
    flex: 1,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    elevation: 3,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  colorPalette: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: 'gray',
  },
  strokeWidthContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  strokeButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedStroke: {
    borderColor: 'blue',
  },
  strokePreview: {
    backgroundColor: 'black',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  button: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
```

## Project 3: Interactive Game - Bubble Pop

### Bubble Pop Game
```typescript
import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Canvas, Circle, useTouchHandler, useValue, withTiming, withSpring} from '@shopify/react-native-skia';

interface Bubble {
  id: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  speed: number;
  scale: any;
}

export const BubblePopGame = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  
  const canvasWidth = 350;
  const canvasHeight = 500;
  
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink'];
  
  const createBubble = useCallback((): Bubble => {
    const radius = 20 + Math.random() * 30;
    return {
      id: Date.now() + Math.random(),
      x: radius + Math.random() * (canvasWidth - radius * 2),
      y: canvasHeight + radius,
      radius,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 2 + Math.random() * 3,
      scale: useValue(1)
    };
  }, []);
  
  const startGame = useCallback(() => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(30);
    setBubbles([]);
  }, []);
  
  const endGame = useCallback(() => {
    setGameActive(false);
    setBubbles([]);
  }, []);
  
  // Game timer
  useEffect(() => {
    if (!gameActive) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameActive, endGame]);
  
  // Bubble spawning
  useEffect(() => {
    if (!gameActive) return;
    
    const spawnInterval = setInterval(() => {
      setBubbles(prev => [...prev, createBubble()]);
    }, 800);
    
    return () => clearInterval(spawnInterval);
  }, [gameActive, createBubble]);
  
  // Bubble movement
  useEffect(() => {
    if (!gameActive) return;
    
    const moveInterval = setInterval(() => {
      setBubbles(prev => 
        prev
          .map(bubble => ({
            ...bubble,
            y: bubble.y - bubble.speed
          }))
          .filter(bubble => bubble.y > -bubble.radius) // Remove bubbles that went off screen
      );
    }, 16); // ~60 FPS
    
    return () => clearInterval(moveInterval);
  }, [gameActive]);
  
  const popBubble = useCallback((bubble: Bubble) => {
    // Animate bubble pop
    bubble.scale.current = withSpring(0, {
      damping: 10,
      stiffness: 200
    });
    
    // Remove bubble and increase score
    setTimeout(() => {
      setBubbles(prev => prev.filter(b => b.id !== bubble.id));
    }, 200);
    
    setScore(prev => prev + Math.floor(bubble.radius));
  }, []);
  
  const touchHandler = useTouchHandler({
    onStart: (event) => {
      if (!gameActive) return;
      
      // Check if touch hit any bubble
      const hitBubble = bubbles.find(bubble => {
        const distance = Math.sqrt(
          Math.pow(event.x - bubble.x, 2) + 
          Math.pow(event.y - bubble.y, 2)
        );
        return distance <= bubble.radius;
      });
      
      if (hitBubble) {
        popBubble(hitBubble);
      }
    },
  });
  
  return (
    <View style={styles.container}>
      {/* Game Header */}
      <View style={styles.header}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.timerText}>Time: {timeLeft}s</Text>
      </View>
      
      {/* Game Canvas */}
      <Canvas 
        style={[styles.canvas, {width: canvasWidth, height: canvasHeight}]} 
        onTouch={touchHandler}
      >
        {bubbles.map(bubble => (
          <Circle
            key={bubble.id}
            cx={bubble.x}
            cy={bubble.y}
            r={bubble.radius * bubble.scale.current}
            color={bubble.color}
            opacity={0.8}
          />
        ))}
      </Canvas>
      
      {/* Game Controls */}
      <View style={styles.controls}>
        {!gameActive ? (
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.buttonText}>
              {score > 0 ? `Game Over! Final Score: ${score}` : 'Start Game'}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.instructionText}>Tap bubbles to pop them!</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 350,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
  canvas: {
    backgroundColor: 'lightblue',
    borderRadius: 10,
    elevation: 5,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  controls: {
    marginTop: 20,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: 'green',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
});
```

## Project 4: Progress Indicators

### Animated Progress Ring
```typescript
import React, {useEffect} from 'react';
import {Canvas, Circle, Text, useValue, withTiming, useFont} from '@shopify/react-native-skia';

interface ProgressRingProps {
  progress: number; // 0 to 100
  size: number;
  strokeWidth: number;
  color: string;
  backgroundColor?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size,
  strokeWidth,
  color,
  backgroundColor = 'lightgray'
}) => {
  const animatedProgress = useValue(0);
  const font = useFont(require('./assets/font.ttf'), 24);
  
  useEffect(() => {
    animatedProgress.current = withTiming(progress / 100, {
      duration: 1500
    });
  }, [progress]);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const strokeDasharray = useDerivedValue(() => {
    const progressLength = circumference * animatedProgress.current;
    return `${progressLength} ${circumference}`;
  });
  
  return (
    <Canvas style={{width: size, height: size}}>
      {/* Background circle */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        style="stroke"
        strokeWidth={strokeWidth}
        color={backgroundColor}
      />
      
      {/* Progress circle */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        style="stroke"
        strokeWidth={strokeWidth}
        color={color}
        strokeCap="round"
        strokeDasharray={strokeDasharray}
        transform={[{rotate: -90}]} // Start from top
        origin={{x: size / 2, y: size / 2}}
      />
      
      {/* Progress text */}
      {font && (
        <Text
          x={size / 2 - 20}
          y={size / 2 + 8}
          text={`${Math.round(progress)}%`}
          font={font}
          color="black"
        />
      )}
    </Canvas>
  );
};

// Usage Example
export const ProgressExample = () => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + 10));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <View style={{alignItems: 'center', padding: 50}}>
      <ProgressRing
        progress={progress}
        size={150}
        strokeWidth={12}
        color="blue"
      />
    </View>
  );
};
```

## Project 5: Image Filter App

### Real-time Image Filters
```typescript
import React, {useState} from 'react';
import {View, ScrollView, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Canvas, Image, ColorMatrix, Blur, useImage} from '@shopify/react-native-skia';

interface Filter {
  name: string;
  matrix?: number[];
  blur?: number;
}

export const ImageFilterApp = () => {
  const image = useImage(require('./assets/sample-photo.jpg'));
  const [selectedFilter, setSelectedFilter] = useState<Filter>({name: 'Original'});
  
  const filters: Filter[] = [
    {name: 'Original'},
    {
      name: 'Sepia',
      matrix: [
        0.393, 0.769, 0.189, 0, 0,
        0.349, 0.686, 0.168, 0, 0,
        0.272, 0.534, 0.131, 0, 0,
        0, 0, 0, 1, 0
      ]
    },
    {
      name: 'Grayscale',
      matrix: [
        0.299, 0.587, 0.114, 0, 0,
        0.299, 0.587, 0.114, 0, 0,
        0.299, 0.587, 0.114, 0, 0,
        0, 0, 0, 1, 0
      ]
    },
    {
      name: 'Vintage',
      matrix: [
        1.2, 0, 0, 0, 0,
        0, 1.1, 0, 0, 0,
        0, 0, 0.8, 0, 0,
        0, 0, 0, 1, 0
      ]
    },
    {
      name: 'Blur',
      blur: 5
    },
    {
      name: 'High Contrast',
      matrix: [
        2, 0, 0, 0, -128,
        0, 2, 0, 0, -128,
        0, 0, 2, 0, -128,
        0, 0, 0, 1, 0
      ]
    }
  ];
  
  if (!image) return null;
  
  return (
    <View style={styles.container}>
      {/* Image Display */}
      <Canvas style={styles.imageCanvas}>
        <Image 
          image={image} 
          x={0} 
          y={0} 
          width={350} 
          height={350} 
          fit="cover"
        >
          {selectedFilter.matrix && (
            <ColorMatrix matrix={selectedFilter.matrix} />
          )}
          {selectedFilter.blur && (
            <Blur blur={selectedFilter.blur} />
          )}
        </Image>
      </Canvas>
      
      {/* Filter Selection */}
      <ScrollView 
        horizontal 
        style={styles.filterScroll}
        showsHorizontalScrollIndicator={false}
      >
        {filters.map((filter, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.filterButton,
              selectedFilter.name === filter.name && styles.selectedFilter
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter.name === filter.name && styles.selectedFilterText
            ]}>
              {filter.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 50,
  },
  imageCanvas: {
    width: 350,
    height: 350,
    borderRadius: 10,
    elevation: 5,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  filterScroll: {
    marginTop: 20,
    maxHeight: 60,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: 'lightgray',
  },
  selectedFilter: {
    backgroundColor: 'blue',
  },
  filterText: {
    color: 'black',
    fontWeight: 'bold',
  },
  selectedFilterText: {
    color: 'white',
  },
});
```

## Performance Tips for Real World Apps:

1. **Optimize Re-renders**: Use React.memo and useMemo
2. **Lazy Loading**: Load images and resources when needed
3. **Memory Management**: Clean up resources properly
4. **Batch Updates**: Group state updates together
5. **Use Native Driver**: For animations when possible

## Common Real World Use Cases:

1. **Data Visualization**: Charts, graphs, dashboards
2. **Gaming**: 2D games, interactive experiences
3. **Image Processing**: Filters, effects, editing
4. **UI Components**: Custom buttons, progress indicators
5. **Interactive Art**: Creative applications, drawing tools

## Exercise 1: Weather Dashboard
Create a weather app with:
- Animated weather icons
- Temperature charts
- Interactive radar map
- Smooth transitions

## Exercise 2: Photo Editor
Build a photo editing app with:
- Multiple filter options
- Brightness/contrast controls
- Crop functionality
- Save/share features

## Exercise 3: Data Visualization
Create a dashboard with:
- Multiple chart types
- Real-time data updates
- Interactive legends
- Export functionality

## Exercise 4: Mini Game
Develop a complete game with:
- Player movement
- Collision detection
- Score system
- Sound effects integration

Next chapter mein hum exercises aur practice problems dekhenge!
