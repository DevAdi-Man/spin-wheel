# Day 6: Complex Interactions & Advanced Patterns 🎯

## Multi-Gesture Handling

Complex apps mein multiple gestures ko simultaneously handle karna padta hai. Reanimated aur Gesture Handler ka combination ye possible banata hai.

## Gesture Composition Patterns

### 1. Simultaneous Gestures
```javascript
import { Gesture } from 'react-native-gesture-handler';

const panGesture = Gesture.Pan()
  .onUpdate((event) => {
    translateX.value = event.translationX;
    translateY.value = event.translationY;
  });

const pinchGesture = Gesture.Pinch()
  .onUpdate((event) => {
    scale.value = event.scale;
  });

const rotationGesture = Gesture.Rotation()
  .onUpdate((event) => {
    rotation.value = event.rotation;
  });

// Combine all gestures
const combinedGesture = Gesture.Simultaneous(
  panGesture,
  pinchGesture,
  rotationGesture
);
```

### 2. Exclusive Gestures
```javascript
const tapGesture = Gesture.Tap()
  .onEnd(() => {
    console.log('Tapped');
  });

const longPressGesture = Gesture.LongPress()
  .onStart(() => {
    console.log('Long pressed');
  });

// Only one gesture can be active at a time
const exclusiveGesture = Gesture.Exclusive(tapGesture, longPressGesture);
```

### 3. Race Gestures
```javascript
const swipeLeft = Gesture.Pan()
  .activeOffsetX([-10, 10])
  .onEnd(() => {
    console.log('Swiped left');
  });

const swipeRight = Gesture.Pan()
  .activeOffsetX([-10, 10])
  .onEnd(() => {
    console.log('Swiped right');
  });

// First gesture to activate wins
const raceGesture = Gesture.Race(swipeLeft, swipeRight);
```

## Advanced Gesture Patterns

### 1. Photo Viewer with Multi-touch
```javascript
const PhotoViewer = ({ imageUri }) => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  
  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withSpring(1);
        savedScale.value = 1;
      } else if (scale.value > 3) {
        scale.value = withSpring(3);
        savedScale.value = 3;
      } else {
        savedScale.value = scale.value;
      }
    });
  
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });
  
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value === 1) {
        scale.value = withSpring(2);
        savedScale.value = 2;
      } else {
        scale.value = withSpring(1);
        savedScale.value = 1;
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      }
    });
  
  const composed = Gesture.Simultaneous(
    Gesture.Simultaneous(pinchGesture, panGesture),
    doubleTap
  );
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));
  
  return (
    <GestureDetector gesture={composed}>
      <Animated.Image
        source={{ uri: imageUri }}
        style={[styles.image, animatedStyle]}
        resizeMode="contain"
      />
    </GestureDetector>
  );
};
```

### 2. Swipeable Card Stack
```javascript
const SwipeableCardStack = ({ cards, onSwipe }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      
      // Rotation based on horizontal movement
      rotation.value = (event.translationX / 300) * 30;
      
      // Scale down slightly while dragging
      const distance = Math.sqrt(
        event.translationX ** 2 + event.translationY ** 2
      );
      scale.value = Math.max(0.9, 1 - distance / 1000);
    })
    .onEnd((event) => {
      const { translationX, velocityX } = event;
      const shouldSwipe = Math.abs(translationX) > 100 || Math.abs(velocityX) > 500;
      
      if (shouldSwipe) {
        // Swipe animation
        const direction = translationX > 0 ? 1 : -1;
        translateX.value = withTiming(direction * 500, { duration: 300 });
        rotation.value = withTiming(direction * 45, { duration: 300 });
        scale.value = withTiming(0.8, { duration: 300 });
        
        // Call onSwipe callback
        runOnJS(onSwipe)(direction > 0 ? 'right' : 'left');
        
        // Reset for next card
        setTimeout(() => {
          translateX.value = 0;
          translateY.value = 0;
          rotation.value = 0;
          scale.value = 1;
          runOnJS(setCurrentIndex)(currentIndex + 1);
        }, 300);
      } else {
        // Return to center
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        rotation.value = withSpring(0);
        scale.value = withSpring(1);
      }
    });
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));
  
  if (currentIndex >= cards.length) {
    return <Text>No more cards!</Text>;
  }
  
  return (
    <View style={styles.cardContainer}>
      {/* Background cards */}
      {cards.slice(currentIndex + 1, currentIndex + 3).map((card, index) => (
        <View
          key={card.id}
          style={[
            styles.card,
            {
              zIndex: -index,
              transform: [{ scale: 1 - index * 0.05 }],
              opacity: 1 - index * 0.3,
            },
          ]}
        >
          <Text>{card.title}</Text>
        </View>
      ))}
      
      {/* Active card */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <Text>{cards[currentIndex].title}</Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};
```

### 3. Interactive Drawer
```javascript
const InteractiveDrawer = ({ children, drawerContent }) => {
  const translateX = useSharedValue(0);
  const [isOpen, setIsOpen] = useState(false);
  const drawerWidth = 280;
  
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newTranslateX = isOpen 
        ? drawerWidth + event.translationX 
        : event.translationX;
      
      translateX.value = Math.max(0, Math.min(drawerWidth, newTranslateX));
    })
    .onEnd((event) => {
      const { translationX, velocityX } = event;
      const currentPosition = translateX.value;
      const shouldOpen = currentPosition > drawerWidth / 2 || velocityX > 500;
      
      if (shouldOpen) {
        translateX.value = withSpring(drawerWidth);
        runOnJS(setIsOpen)(true);
      } else {
        translateX.value = withSpring(0);
        runOnJS(setIsOpen)(false);
      }
    });
  
  const mainContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  
  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value - drawerWidth }],
  }));
  
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: translateX.value / drawerWidth,
    pointerEvents: translateX.value > 0 ? 'auto' : 'none',
  }));
  
  return (
    <View style={styles.container}>
      {/* Drawer */}
      <Animated.View style={[styles.drawer, drawerStyle]}>
        {drawerContent}
      </Animated.View>
      
      {/* Main content */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.mainContent, mainContentStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
      
      {/* Overlay */}
      <Animated.View style={[styles.overlay, overlayStyle]} />
    </View>
  );
};
```

## Advanced Animation Patterns

### 1. Physics-based Animations
```javascript
const PhysicsAnimation = () => {
  const ballY = useSharedValue(0);
  const ballX = useSharedValue(0);
  const velocityY = useSharedValue(0);
  const velocityX = useSharedValue(0);
  
  const gravity = 0.5;
  const bounce = 0.8;
  const friction = 0.99;
  
  const animate = () => {
    const frame = () => {
      // Apply gravity
      velocityY.value += gravity;
      
      // Update position
      ballY.value += velocityY.value;
      ballX.value += velocityX.value;
      
      // Bounce off bottom
      if (ballY.value > 400) {
        ballY.value = 400;
        velocityY.value *= -bounce;
      }
      
      // Bounce off sides
      if (ballX.value < 0 || ballX.value > 300) {
        velocityX.value *= -bounce;
        ballX.value = Math.max(0, Math.min(300, ballX.value));
      }
      
      // Apply friction
      velocityX.value *= friction;
      
      // Continue animation
      if (Math.abs(velocityY.value) > 0.1 || Math.abs(velocityX.value) > 0.1) {
        requestAnimationFrame(frame);
      }
    };
    
    frame();
  };
  
  const throwBall = () => {
    velocityY.value = -15;
    velocityX.value = Math.random() * 10 - 5;
    animate();
  };
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: ballX.value },
      { translateY: ballY.value },
    ],
  }));
  
  return (
    <View style={styles.physicsContainer}>
      <Animated.View style={[styles.ball, animatedStyle]} />
      <Pressable onPress={throwBall} style={styles.throwButton}>
        <Text>Throw Ball</Text>
      </Pressable>
    </View>
  );
};
```

### 2. Morphing Animations
```javascript
const MorphingShape = () => {
  const morphProgress = useSharedValue(0);
  
  const animatedStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      morphProgress.value,
      [0, 0.5, 1],
      [0, 50, 0]
    );
    
    const width = interpolate(
      morphProgress.value,
      [0, 0.5, 1],
      [100, 150, 100]
    );
    
    const height = interpolate(
      morphProgress.value,
      [0, 0.5, 1],
      [100, 100, 150]
    );
    
    const backgroundColor = interpolateColor(
      morphProgress.value,
      [0, 0.5, 1],
      ['#ff6b6b', '#4ecdc4', '#45b7d1']
    );
    
    return {
      width,
      height,
      borderRadius,
      backgroundColor,
    };
  });
  
  const startMorph = () => {
    morphProgress.value = withSequence(
      withTiming(1, { duration: 1000 }),
      withTiming(0, { duration: 1000 })
    );
  };
  
  return (
    <View style={styles.morphContainer}>
      <Animated.View style={[styles.morphShape, animatedStyle]} />
      <Pressable onPress={startMorph} style={styles.morphButton}>
        <Text>Start Morph</Text>
      </Pressable>
    </View>
  );
};
```

### 3. Particle System
```javascript
const ParticleSystem = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    x: useSharedValue(0),
    y: useSharedValue(0),
    opacity: useSharedValue(0),
    scale: useSharedValue(0),
  }));
  
  const explode = (centerX, centerY) => {
    particles.forEach((particle, index) => {
      const angle = (index / particles.length) * Math.PI * 2;
      const distance = 100 + Math.random() * 50;
      const targetX = centerX + Math.cos(angle) * distance;
      const targetY = centerY + Math.sin(angle) * distance;
      
      // Reset particle
      particle.x.value = centerX;
      particle.y.value = centerY;
      particle.opacity.value = 1;
      particle.scale.value = 1;
      
      // Animate outward
      particle.x.value = withTiming(targetX, { duration: 1000 });
      particle.y.value = withTiming(targetY, { duration: 1000 });
      particle.opacity.value = withTiming(0, { duration: 1000 });
      particle.scale.value = withTiming(0, { duration: 1000 });
    });
  };
  
  return (
    <View style={styles.particleContainer}>
      {particles.map((particle, index) => {
        const animatedStyle = useAnimatedStyle(() => ({
          position: 'absolute',
          left: particle.x.value,
          top: particle.y.value,
          opacity: particle.opacity.value,
          transform: [{ scale: particle.scale.value }],
        }));
        
        return (
          <Animated.View
            key={index}
            style={[styles.particle, animatedStyle]}
          />
        );
      })}
      
      <Pressable
        onPress={() => explode(150, 300)}
        style={styles.explodeButton}
      >
        <Text>💥 Explode</Text>
      </Pressable>
    </View>
  );
};
```

## Performance Optimization

### 1. Gesture Optimization
```javascript
// ✅ Use appropriate gesture configurations
const optimizedPan = Gesture.Pan()
  .minDistance(10) // Avoid accidental triggers
  .activeOffsetX([-10, 10]) // Define active area
  .failOffsetY([-20, 20]) // Fail if moving vertically
  .onUpdate((event) => {
    // Minimize calculations in onUpdate
    translateX.value = event.translationX;
  });
```

### 2. Animation Batching
```javascript
// ✅ Batch related animations
const batchedAnimation = () => {
  'worklet';
  translateX.value = withTiming(100);
  translateY.value = withTiming(100);
  scale.value = withTiming(1.2);
  opacity.value = withTiming(0.8);
};
```

### 3. Memory Management
```javascript
// ✅ Cleanup animations on unmount
useEffect(() => {
  return () => {
    cancelAnimation(translateX);
    cancelAnimation(translateY);
    cancelAnimation(scale);
  };
}, []);
```

## Common Patterns & Best Practices

### 1. State Synchronization
```javascript
const useSyncedState = (sharedValue) => {
  const [state, setState] = useState(sharedValue.value);
  
  useEffect(() => {
    const listener = sharedValue.addListener((value) => {
      setState(value);
    });
    
    return () => {
      sharedValue.removeListener(listener);
    };
  }, [sharedValue]);
  
  return state;
};
```

### 2. Gesture State Management
```javascript
const useGestureState = () => {
  const isActive = useSharedValue(false);
  const context = useSharedValue({});
  
  const resetGesture = () => {
    'worklet';
    isActive.value = false;
    context.value = {};
  };
  
  return { isActive, context, resetGesture };
};
```

## Practice Exercises

1. **Multi-touch Drawing App**: Pan + pinch + rotation gestures
2. **Interactive Map**: Zoom, pan, and marker interactions
3. **Custom Slider**: Complex gesture handling with snapping
4. **Animated Game**: Physics-based interactions

## Homework 📝

### Practice Tasks:
- Multi-gesture combinations implement karo
- Complex UI interactions banao
- Performance optimization apply karo
- Custom gesture patterns create karo

### 🎯 Animation Examples to Copy & Practice:

#### 1. **Expo Snack Examples**
- **Photo Viewer**: https://snack.expo.dev/@reanimated/photo-viewer
- **Card Stack**: https://snack.expo.dev/@reanimated/card-stack
- **Interactive Drawer**: https://snack.expo.dev/@reanimated/drawer-navigation
- **Multi-touch Canvas**: https://snack.expo.dev/@reanimated/multi-touch

#### 2. **Advanced Interaction Patterns**
- **Tinder Clone**: https://github.com/alexbrillant/react-native-deck-swiper
- **Instagram Stories**: https://github.com/lukewalczak/react-native-instagram-stories
- **Bottom Sheet**: https://github.com/gorhom/react-native-bottom-sheet
- **Image Zoom**: https://github.com/ascoders/react-native-image-viewer

#### 3. **Complex Gesture Examples**
- **Map Interactions**: https://github.com/react-native-maps/react-native-maps
- **Drawing App**: https://github.com/terrylinla/react-native-sketch-canvas
- **Game Interactions**: https://github.com/bberak/react-native-game-engine

### 🔥 Challenge Animations to Try:
1. **WhatsApp Camera**: Pinch zoom + pan + tap to focus
2. **Spotify Player**: Swipe up for full screen + gesture controls
3. **Google Photos**: Pinch zoom + pan + double tap to zoom
4. **TikTok Interface**: Swipe up/down for videos + side gestures

### 📱 Ready-to-Copy Complex Examples:

#### Multi-gesture Photo Viewer:
```javascript
// Copy to Expo Snack
const pinchGesture = Gesture.Pinch()
  .onUpdate((event) => {
    scale.value = savedScale.value * event.scale;
  });

const panGesture = Gesture.Pan()
  .onUpdate((event) => {
    translateX.value = savedTranslateX.value + event.translationX;
    translateY.value = savedTranslateY.value + event.translationY;
  });

const composed = Gesture.Simultaneous(pinchGesture, panGesture);
```

#### Swipeable Card Stack:
```javascript
const swipeGesture = Gesture.Pan()
  .onUpdate((event) => {
    translateX.value = event.translationX;
    rotation.value = (event.translationX / 300) * 30;
  })
  .onEnd((event) => {
    if (Math.abs(event.translationX) > 120) {
      // Swipe animation
      const direction = event.translationX > 0 ? 1 : -1;
      translateX.value = withTiming(direction * 500);
    } else {
      // Return to center
      translateX.value = withSpring(0);
      rotation.value = withSpring(0);
    }
  });
```

### 🎮 Interactive Playgrounds:
- **Gesture Handler Examples**: https://docs.swmansion.com/react-native-gesture-handler/docs/examples
- **Reanimated Playground**: https://docs.swmansion.com/react-native-reanimated/examples
- **React Native Playground**: https://reactnative.dev/

### 📺 Advanced Interaction Tutorials:
- **William Candillon**: "Can it be done in React Native?" series
- **Catalin Miron**: Complex animation tutorials
- **Expo**: Advanced gesture handling videos

### 🛠️ Development Tools:
- **Flipper**: Debug animations and gestures
- **React Native Debugger**: Performance monitoring
- **Expo Dev Tools**: Real-time testing

### 🎨 Design Inspiration:
- **Mobbin**: https://mobbin.design/ (Mobile app patterns)
- **Page Flows**: https://pageflows.com/ (User flow animations)
- **UI Sources**: https://www.uisources.com/ (Mobile UI patterns)

## Next Day Preview
Kal hum banayenge:
- Complete real-world projects
- Best practices consolidation
- Troubleshooting techniques
- Production-ready components
