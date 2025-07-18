 Day 3: Gestures & Touch Interactions 👆

## Gesture Handling in Reanimated

React Native Reanimated gesture handling ke liye `react-native-gesture-handler` library ke saath integrate hota hai. Ye combination bahut powerful animations banane mein help karta hai.

## Installation
```bash
npm install react-native-gesture-handler
# iOS ke liye
cd ios && pod install
```

## Core Gesture Concepts

### 1. Gesture Handler Setup
```javascript
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// App.js mein wrap karna zaroori hai
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Your app content */}
    </GestureHandlerRootView>
  );
}
```

### 2. useAnimatedGestureHandler (Deprecated but Important)
```javascript
import { useAnimatedGestureHandler } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

const gestureHandler = useAnimatedGestureHandler({
  onStart: (event, context) => {
    // Gesture start hone pe
    context.startX = translateX.value;
  },
  onActive: (event, context) => {
    // Gesture active state mein
    translateX.value = context.startX + event.translationX;
  },
  onEnd: (event) => {
    // Gesture end hone pe
    translateX.value = withSpring(0);
  },
});
```

### 3. New Gesture API (Recommended)
```javascript
import { Gesture } from 'react-native-gesture-handler';

const panGesture = Gesture.Pan()
  .onStart(() => {
    // Gesture start
  })
  .onUpdate((event) => {
    // Gesture update
    translateX.value = event.translationX;
  })
  .onEnd(() => {
    // Gesture end
    translateX.value = withSpring(0);
  });
```

## Pan Gesture - Drag & Drop

Pan gesture sabse common gesture hai jo dragging ke liye use hota hai.

### Basic Pan Implementation
```javascript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const DraggableBox = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const context = useSharedValue({ x: 0, y: 0 });

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: translateX.value, y: translateY.value };
    })
    .onUpdate((event) => {
      translateX.value = context.value.x + event.translationX;
      translateY.value = context.value.y + event.translationY;
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.box, animatedStyle]} />
    </GestureDetector>
  );
};
```

## Complete Gesture Properties Reference 📚

### **Tap Gesture Properties**

#### Basic Properties:
```javascript
const tapGesture = Gesture.Tap()
  .numberOfTaps(1)           // Kitne taps chahiye (default: 1)
  .maxDuration(500)          // Max time between taps (ms)
  .maxDistance(10)           // Max distance finger move kar sakta hai
  .maxDelayBetweenTaps(300)  // Double tap ke liye max delay
  .minPointers(1)            // Minimum fingers required
  .maxPointers(1)            // Maximum fingers allowed
  .shouldCancelWhenOutside(true) // Cancel if finger goes outside
  .enabled(true)             // Gesture enable/disable
  .hitSlop({ top: 10, bottom: 10, left: 10, right: 10 }) // Touch area extend
  .simultaneousWithExternalGesture(otherGesture) // Other gestures ke saath
  .requireExternalGestureToFail(otherGesture);   // Wait for other gesture to fail
```

#### Tap Examples:
```javascript
// Single Tap
const singleTap = Gesture.Tap()
  .onBegin(() => console.log('Single tap started'))
  .onFinalize(() => console.log('Single tap finished'));

// Double Tap
const doubleTap = Gesture.Tap()
  .numberOfTaps(2)
  .maxDelayBetweenTaps(300)
  .onEnd(() => console.log('Double tapped!'));

// Long Press (using maxDuration)
const longPress = Gesture.Tap()
  .maxDuration(1000)
  .onTouchesDown(() => console.log('Press started'))
  .onTouchesUp(() => console.log('Press ended'));
```

### **Pan Gesture Properties**

#### Movement & Direction:
```javascript
const panGesture = Gesture.Pan()
  .minDistance(10)           // Minimum distance to start pan
  .minVelocity(50)          // Minimum velocity to trigger
  .minPointers(1)           // Minimum fingers
  .maxPointers(1)           // Maximum fingers
  .averageTouches(false)    // Average multiple touches
  .enableTrackpadTwoFingerGesture(true) // Trackpad support
  .activeOffsetX([-10, 10]) // X-axis activation threshold
  .activeOffsetY([-10, 10]) // Y-axis activation threshold
  .failOffsetX([-5, 5])     // X-axis failure threshold
  .failOffsetY([-5, 5])     // Y-axis failure threshold
  .activateAfterLongPress(500); // Activate after long press
```

#### Pan Direction Control:
```javascript
// Horizontal only pan
const horizontalPan = Gesture.Pan()
  .activeOffsetX([-10, 10])
  .failOffsetY([-5, 5]);

// Vertical only pan
const verticalPan = Gesture.Pan()
  .activeOffsetY([-10, 10])
  .failOffsetX([-5, 5]);

// Directional pan with thresholds
const directionalPan = Gesture.Pan()
  .activeOffsetX(20)    // Only right swipe
  .failOffsetX(-10);    // Fail on left swipe
```

### **Pinch Gesture Properties**

```javascript
const pinchGesture = Gesture.Pinch()
  .minPointers(2)           // Minimum 2 fingers
  .maxPointers(2)           // Maximum 2 fingers
  .minScale(0.5)            // Minimum scale value
  .maxScale(3.0)            // Maximum scale value
  .scaleVelocityFactor(1.0) // Scale velocity multiplier
  .onUpdate((event) => {
    console.log('Scale:', event.scale);
    console.log('Velocity:', event.velocity);
    console.log('Focal Point:', event.focalX, event.focalY);
  });
```

### **Rotation Gesture Properties**

```javascript
const rotationGesture = Gesture.Rotation()
  .minPointers(2)           // Minimum fingers
  .maxPointers(2)           // Maximum fingers
  .rotationVelocityFactor(1.0) // Rotation velocity multiplier
  .onUpdate((event) => {
    console.log('Rotation:', event.rotation); // In radians
    console.log('Velocity:', event.velocity);
    console.log('Anchor:', event.anchorX, event.anchorY);
  });
```

### **Fling Gesture Properties**

```javascript
const flingGesture = Gesture.Fling()
  .direction(Directions.RIGHT | Directions.LEFT) // Allowed directions
  .numberOfPointers(1)      // Number of fingers
  .minVelocity(500)        // Minimum velocity to trigger
  .onEnd((event) => {
    console.log('Fling velocity:', event.velocityX, event.velocityY);
  });

// Direction constants
import { Directions } from 'react-native-gesture-handler';
// Directions.UP, Directions.DOWN, Directions.LEFT, Directions.RIGHT
```

### **LongPress Gesture Properties**

```javascript
const longPressGesture = Gesture.LongPress()
  .minDuration(500)         // Minimum press duration (ms)
  .maxDistance(10)          // Max finger movement allowed
  .numberOfPointers(1)      // Number of fingers required
  .onStart(() => console.log('Long press started'))
  .onEnd(() => console.log('Long press ended'));
```

### **Force Touch Properties** (iOS only)

```javascript
const forceTouchGesture = Gesture.ForceTouch()
  .minForce(0.2)           // Minimum force required
  .maxForce(1.0)           // Maximum force
  .feedbackOnActivation(true) // Haptic feedback
  .onUpdate((event) => {
    console.log('Force:', event.force);
  });
```

## **Universal Gesture Properties** 🌐

Ye properties sare gestures mein available hain:

### **State Management:**
```javascript
const gesture = Gesture.Tap()
  .enabled(true)            // Enable/disable gesture
  .shouldCancelWhenOutside(true) // Cancel when touch goes outside
  .cancelsTouchesInView(true)    // Cancel other touches
  .delaysTouchesBegan(false)     // Delay touch events
  .delaysTouchesEnded(false)     // Delay touch end events
  .requiresExclusiveTouchType(false); // Require specific touch type
```

### **Hit Testing:**
```javascript
const gesture = Gesture.Tap()
  .hitSlop({
    top: 10,
    bottom: 10,
    left: 10,
    right: 10
  })                        // Extend touchable area
  .hitSlopHorizontal(10)    // Horizontal hit slop only
  .hitSlopVertical(10)      // Vertical hit slop only
  .hitSlopTop(10)           // Top hit slop
  .hitSlopBottom(10)        // Bottom hit slop
  .hitSlopLeft(10)          // Left hit slop
  .hitSlopRight(10);        // Right hit slop
```

### **Gesture Relationships:**
```javascript
const gesture1 = Gesture.Tap();
const gesture2 = Gesture.Pan();

const mainGesture = Gesture.Tap()
  .simultaneousWithExternalGesture(gesture1)     // Run simultaneously
  .requireExternalGestureToFail(gesture2)       // Wait for other to fail
  .blocksExternalGesture(gesture1)              // Block other gesture
  .runOnJS(true);                               // Run callbacks on JS thread
```

## **Event Properties** 📊

Har gesture event mein ye properties available hain:

### **Common Event Properties:**
```javascript
.onUpdate((event) => {
  // Position
  console.log('X:', event.x);           // Touch X coordinate
  console.log('Y:', event.y);           // Touch Y coordinate
  console.log('AbsoluteX:', event.absoluteX); // Screen X coordinate
  console.log('AbsoluteY:', event.absoluteY); // Screen Y coordinate

  // State
  console.log('State:', event.state);    // Gesture state
  console.log('NumberOfPointers:', event.numberOfPointers);

  // Timing
  console.log('Duration:', event.duration); // Gesture duration
})
```

### **Pan Specific Event Properties:**
```javascript
.onUpdate((event) => {
  // Translation
  console.log('TranslationX:', event.translationX);
  console.log('TranslationY:', event.translationY);

  // Velocity
  console.log('VelocityX:', event.velocityX);
  console.log('VelocityY:', event.velocityY);

  // Change since last update
  console.log('ChangeX:', event.changeX);
  console.log('ChangeY:', event.changeY);
})
```

### **Pinch Specific Event Properties:**
```javascript
.onUpdate((event) => {
  console.log('Scale:', event.scale);        // Current scale
  console.log('Velocity:', event.velocity);  // Scale velocity
  console.log('FocalX:', event.focalX);      // Pinch center X
  console.log('FocalY:', event.focalY);      // Pinch center Y
})
```

### **Rotation Specific Event Properties:**
```javascript
.onUpdate((event) => {
  console.log('Rotation:', event.rotation);  // Rotation in radians
  console.log('Velocity:', event.velocity);  // Rotation velocity
  console.log('AnchorX:', event.anchorX);    // Rotation anchor X
  console.log('AnchorY:', event.anchorY);    // Rotation anchor Y
})
```

## **Advanced Configuration Examples** 🚀

### **Custom Button with Multiple States:**
```javascript
const CustomButton = () => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const buttonGesture = Gesture.Tap()
    .numberOfTaps(1)
    .maxDuration(2000)
    .maxDistance(20)
    .hitSlop({ top: 10, bottom: 10, left: 10, right: 10 })
    .onTouchesDown(() => {
      // Press effect
      scale.value = withSpring(0.95);
      opacity.value = withTiming(0.7);
    })
    .onTouchesUp(() => {
      // Release effect
      scale.value = withSpring(1);
      opacity.value = withTiming(1);
    })
    .onEnd(() => {
      console.log('Button clicked!');
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <GestureDetector gesture={buttonGesture}>
      <Animated.View style={[styles.button, animatedStyle]}>
        <Text>Custom Button</Text>
      </Animated.View>
    </GestureDetector>
  );
};
```

### **Advanced Swipe Detection:**
```javascript
const AdvancedSwipe = () => {
  const translateX = useSharedValue(0);

  const swipeGesture = Gesture.Pan()
    .minDistance(20)              // Minimum 20px movement
    .minVelocity(300)            // Minimum velocity
    .activeOffsetX([-20, 20])    // Activate after 20px horizontal movement
    .failOffsetY([-30, 30])      // Fail if vertical movement > 30px
    .maxPointers(1)              // Only single finger
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      const { velocityX, translationX } = event;

      // Determine swipe direction and strength
      if (Math.abs(velocityX) > 500) {
        if (velocityX > 0) {
          console.log('Fast right swipe');
          translateX.value = withSpring(200);
        } else {
          console.log('Fast left swipe');
          translateX.value = withSpring(-200);
        }
      } else if (Math.abs(translationX) > 100) {
        if (translationX > 0) {
          console.log('Slow right swipe');
          translateX.value = withSpring(100);
        } else {
          console.log('Slow left swipe');
          translateX.value = withSpring(-100);
        }
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={swipeGesture}>
      <Animated.View style={[styles.swipeBox, animatedStyle]} />
    </GestureDetector>
  );
};
```

### **Multi-Touch Gesture Combination:**
```javascript
const MultiTouchExample = () => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Pan gesture (1 finger)
  const panGesture = Gesture.Pan()
    .maxPointers(1)
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    });

  // Pinch gesture (2 fingers)
  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = event.scale;
    });

  // Rotation gesture (2 fingers)
  const rotationGesture = Gesture.Rotation()
    .onUpdate((event) => {
      rotation.value = event.rotation;
    });

  // Combine all gestures
  const composedGesture = Gesture.Simultaneous(
    panGesture,
    Gesture.Simultaneous(pinchGesture, rotationGesture)
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}rad` },
    ],
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={[styles.multiTouchBox, animatedStyle]} />
    </GestureDetector>
  );
};
```

## **Performance Properties** ⚡

### **Thread Management:**
```javascript
const gesture = Gesture.Pan()
  .runOnJS(false)           // Run on UI thread (default, faster)
  .manualActivation(true)   // Manual gesture activation
  .withTestId('pan-gesture') // For testing purposes
  .onUpdate((event) => {
    'worklet';              // Ensure worklet context
    translateX.value = event.translationX;
  });
```

### **Memory Management:**
```javascript
const gesture = Gesture.Pan()
  .onBegin(() => {
    'worklet';
    // Setup phase - minimal work
  })
  .onUpdate((event) => {
    'worklet';
    // High frequency updates - keep lightweight
    translateX.value = event.translationX;
  })
  .onFinalize(() => {
    'worklet';
    // Cleanup phase
    translateX.value = withSpring(0);
  });
```

## **Debugging Properties** 🐛

### **Debug Information:**
```javascript
const debugGesture = Gesture.Pan()
  .withTestId('debug-pan')
  .onBegin(() => {
    console.log('Gesture began');
  })
  .onUpdate((event) => {
    console.log('Update:', {
      x: event.x,
      y: event.y,
      translationX: event.translationX,
      translationY: event.translationY,
      velocityX: event.velocityX,
      velocityY: event.velocityY,
      state: event.state,
      numberOfPointers: event.numberOfPointers,
    });
  })
  .onEnd((event) => {
    console.log('Gesture ended with final values:', event);
  });
```

Bhai, ye complete reference hai sare gesture properties ka! Har property ka use case aur example bhi diya hai. Ab tumhe pata chal gaya hoga ki kitni powerful properties available hain gestures mein! 🚀

Gesture Handler mein different events available hain, lekin sab equally reliable nahi hain:

### Event Types & Reliability:

#### ✅ **Recommended Events** (Most Reliable):
```javascript
const gesture = Gesture.Tap()
  .onBegin(() => {
    // 🟢 Always fires when gesture detection starts
    // Most reliable for starting animations
    scale.value = withSpring(0.9);
  })
  .onFinalize(() => {
    // 🟢 Always fires when gesture completely ends
    // Most reliable for cleanup/final animations
    scale.value = withSpring(1);
  });
```

#### ⚠️ **Less Reliable Events** (Can Miss):
```javascript
const gesture = Gesture.Tap()
  .onStart(() => {
    // 🟡 Sometimes doesn't fire properly
    // Can be delayed or missed on some devices
  })
  .onEnd(() => {
    // 🟡 Can miss this event
    // Not guaranteed to fire in all scenarios
  });
```

### **Why onBegin/onFinalize are Better?**

| Event | Reliability | Use Case |
|-------|-------------|----------|
| `onBegin` | 🟢 High | Start animations, initial setup |
| `onStart` | 🟡 Medium | Complex gesture start logic |
| `onUpdate` | 🟢 High | Continuous updates (pan, pinch) |
| `onEnd` | 🟡 Medium | Basic cleanup |
| `onFinalize` | 🟢 High | Final cleanup, reset animations |

### **Complete Event Lifecycle:**
```javascript
const gesture = Gesture.Pan()
  .onBegin(() => {
    console.log('1. Gesture detection started');
    // Setup initial values
  })
  .onStart(() => {
    console.log('2. Gesture actually started');
    // More complex start logic
  })
  .onUpdate((event) => {
    console.log('3. Gesture updating');
    // Continuous updates
  })
  .onEnd(() => {
    console.log('4. Gesture ended');
    // Basic end logic
  })
  .onFinalize(() => {
    console.log('5. Gesture completely finished');
    // Final cleanup, reset states
  });
```

## Tap Gesture

Tap gestures simple touch interactions ke liye use hote hain.

### Single Tap (Recommended Pattern)
```javascript
const tapGesture = Gesture.Tap()
  .onBegin(() => {
    // ✅ Reliable start
    scale.value = withSpring(0.9);
  })
  .onFinalize(() => {
    // ✅ Reliable end
    scale.value = withSpring(1);
  });
```

### Single Tap (Old Pattern - Avoid)
```javascript
const tapGesture = Gesture.Tap()
  .onStart(() => {
    // ❌ Can miss on some devices
    scale.value = withSpring(0.9);
  })
  .onEnd(() => {
    // ❌ Not guaranteed to fire
    scale.value = withSpring(1);
  });
```

### Double Tap
```javascript
const doubleTap = Gesture.Tap()
  .numberOfTaps(2)
  .onEnd(() => {
    scale.value = withSpring(scale.value === 1 ? 2 : 1);
  });
```

## Advanced Gesture Patterns

### 1. Constrained Dragging
```javascript
const constrainedGesture = Gesture.Pan()
  .onUpdate((event) => {
    // X-axis pe sirf move karne ke liye
    translateX.value = Math.max(
      -100,
      Math.min(100, context.value.x + event.translationX)
    );
  });
```

### 2. Velocity-based Animation
```javascript
const velocityGesture = Gesture.Pan()
  .onEnd((event) => {
    const { velocityX, velocityY } = event;

    translateX.value = withDecay({
      velocity: velocityX,
      clamp: [-200, 200],
    });

    translateY.value = withDecay({
      velocity: velocityY,
      clamp: [-300, 300],
    });
  });
```

### 3. Snap to Grid
```javascript
const snapToGrid = (value, gridSize = 50) => {
  'worklet';
  return Math.round(value / gridSize) * gridSize;
};

const snapGesture = Gesture.Pan()
  .onEnd(() => {
    translateX.value = withSpring(snapToGrid(translateX.value));
    translateY.value = withSpring(snapToGrid(translateY.value));
  });
```

## **Gesture Composition Patterns** 🔗

### **Simultaneous Gestures:**
```javascript
// Multiple gestures at same time
const panGesture = Gesture.Pan().onUpdate(/* ... */);
const tapGesture = Gesture.Tap().onEnd(/* ... */);

const simultaneousGesture = Gesture.Simultaneous(panGesture, tapGesture);
```

### **Exclusive Gestures:**
```javascript
// Only one gesture can be active
const panGesture = Gesture.Pan().onUpdate(/* ... */);
const tapGesture = Gesture.Tap().onEnd(/* ... */);

const exclusiveGesture = Gesture.Exclusive(panGesture, tapGesture);
```

### **Race Gestures:**
```javascript
// First gesture to activate wins
const panGesture = Gesture.Pan().onUpdate(/* ... */);
const tapGesture = Gesture.Tap().onEnd(/* ... */);

const raceGesture = Gesture.Race(panGesture, tapGesture);
```

### **Complex Composition Example:**
```javascript
const ComplexGestureExample = () => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);

  // Single tap - reset all transforms
  const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => {
      scale.value = withSpring(1);
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      rotation.value = withSpring(0);
    });

  // Double tap - scale toggle
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      scale.value = withSpring(scale.value === 1 ? 2 : 1);
    });

  // Pan - move around
  const pan = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    });

  // Pinch - scale
  const pinch = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = event.scale;
    });

  // Rotation - rotate
  const rotate = Gesture.Rotation()
    .onUpdate((event) => {
      rotation.value = event.rotation;
    });

  // Compose all gestures
  const composedGesture = Gesture.Race(
    doubleTap,
    Gesture.Simultaneous(
      singleTap,
      pan,
      Gesture.Simultaneous(pinch, rotate)
    )
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}rad` },
    ],
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={[styles.complexBox, animatedStyle]} />
    </GestureDetector>
  );
};
```

## **Platform-Specific Properties** 📱

### **iOS Specific:**
```javascript
const iosGesture = Gesture.Pan()
  .cancelsTouchesInView(true)      // Cancel other iOS touches
  .delaysTouchesBegan(false)       // iOS touch delay
  .delaysTouchesEnded(false)       // iOS touch end delay
  .requiresExclusiveTouchType(false) // iOS touch type
  .shouldRecognizeSimultaneously(true); // iOS simultaneous recognition
```

### **Android Specific:**
```javascript
const androidGesture = Gesture.Pan()
  .enableTrackpadTwoFingerGesture(true) // Android trackpad
  .touchAction('none')                  // CSS touch-action equivalent
  .userSelect('none');                  // Prevent text selection
```

## **Gesture State Management** 🔄

### **Manual Gesture Control:**
```javascript
const ManualGestureControl = () => {
  const gestureRef = useRef();
  const isActive = useSharedValue(false);

  const manualGesture = Gesture.Pan()
    .manualActivation(true)
    .onTouchesDown(() => {
      // Custom activation logic
      if (someCondition) {
        gestureRef.current?.activate();
        isActive.value = true;
      }
    })
    .onUpdate((event) => {
      if (isActive.value) {
        // Handle updates only when manually activated
        translateX.value = event.translationX;
      }
    })
    .onEnd(() => {
      isActive.value = false;
    })
    .withRef(gestureRef);

  return (
    <GestureDetector gesture={manualGesture}>
      <Animated.View style={styles.manualBox} />
    </GestureDetector>
  );
};
```

### **Conditional Gesture Activation:**
```javascript
const ConditionalGesture = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [gestureMode, setGestureMode] = useState('pan');

  const panGesture = Gesture.Pan()
    .enabled(isEnabled && gestureMode === 'pan')
    .onUpdate((event) => {
      translateX.value = event.translationX;
    });

  const tapGesture = Gesture.Tap()
    .enabled(isEnabled && gestureMode === 'tap')
    .onEnd(() => {
      scale.value = withSpring(scale.value === 1 ? 1.5 : 1);
    });

  const activeGesture = gestureMode === 'pan' ? panGesture : tapGesture;

  return (
    <View>
      <Button title="Toggle Mode" onPress={() =>
        setGestureMode(mode => mode === 'pan' ? 'tap' : 'pan')
      } />
      <GestureDetector gesture={activeGesture}>
        <Animated.View style={styles.conditionalBox} />
      </GestureDetector>
    </View>
  );
};
```

## **Error Handling & Edge Cases** ⚠️

### **Safe Gesture Implementation:**
```javascript
const SafeGesture = () => {
  const translateX = useSharedValue(0);
  const isGestureActive = useSharedValue(false);

  const safeGesture = Gesture.Pan()
    .onBegin(() => {
      'worklet';
      isGestureActive.value = true;
    })
    .onUpdate((event) => {
      'worklet';
      if (!isGestureActive.value) return;

      // Boundary checks
      const maxTranslation = 200;
      const newTranslation = Math.max(
        -maxTranslation,
        Math.min(maxTranslation, event.translationX)
      );

      translateX.value = newTranslation;
    })
    .onEnd(() => {
      'worklet';
      isGestureActive.value = false;

      // Safe reset with error handling
      try {
        translateX.value = withSpring(0);
      } catch (error) {
        console.warn('Animation error:', error);
        translateX.value = 0; // Fallback
      }
    })
    .onFinalize(() => {
      'worklet';
      // Ensure cleanup always happens
      isGestureActive.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  }, []);

  return (
    <GestureDetector gesture={safeGesture}>
      <Animated.View style={[styles.safeBox, animatedStyle]} />
    </GestureDetector>
  );
};
```

### **Memory Leak Prevention:**
```javascript
const MemoryOptimizedGesture = () => {
  const translateX = useSharedValue(0);
  const gestureRef = useRef();

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (gestureRef.current) {
        gestureRef.current.reset();
      }
    };
  }, []);

  const optimizedGesture = Gesture.Pan()
    .withRef(gestureRef)
    .onUpdate((event) => {
      'worklet';
      // Throttle updates for performance
      if (Math.abs(event.changeX) > 1) {
        translateX.value = event.translationX;
      }
    })
    .onEnd(() => {
      'worklet';
      translateX.value = withSpring(0, {}, (finished) => {
        'worklet';
        if (finished) {
          // Cleanup after animation
          console.log('Animation completed');
        }
      });
    });

  return (
    <GestureDetector gesture={optimizedGesture}>
      <Animated.View style={styles.optimizedBox} />
    </GestureDetector>
  );
};
```

## **Testing Gesture Properties** 🧪

### **Test-Friendly Gesture Setup:**
```javascript
const TestableGesture = ({ testID, onGestureEvent }) => {
  const gesture = Gesture.Pan()
    .withTestId(testID)
    .onBegin(() => {
      onGestureEvent?.('begin');
    })
    .onUpdate((event) => {
      onGestureEvent?.('update', {
        x: event.translationX,
        y: event.translationY,
      });
    })
    .onEnd(() => {
      onGestureEvent?.('end');
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        testID={`${testID}-view`}
        style={styles.testableBox}
      />
    </GestureDetector>
  );
};

// Usage in tests
const TestComponent = () => {
  const handleGestureEvent = (type, data) => {
    console.log(`Gesture ${type}:`, data);
  };

  return (
    <TestableGesture
      testID="pan-gesture-test"
      onGestureEvent={handleGestureEvent}
    />
  );
};
```

## **Performance Optimization Properties** 🚀

### **High-Performance Gesture:**
```javascript
const HighPerformanceGesture = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const performantGesture = Gesture.Pan()
    .runOnJS(false)                    // Keep on UI thread
    .averageTouches(false)             // Don't average multiple touches
    .enableTrackpadTwoFingerGesture(false) // Disable if not needed
    .minDistance(5)                    // Reduce sensitivity
    .onUpdate((event) => {
      'worklet';
      // Direct value assignment (fastest)
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      'worklet';
      // Use spring for smooth reset
      translateX.value = withSpring(0, {
        damping: 15,
        stiffness: 150
      });
      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 150
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }), []); // Empty dependency array for performance

  return (
    <GestureDetector gesture={performantGesture}>
      <Animated.View style={[styles.performantBox, animatedStyle]} />
    </GestureDetector>
  );
};
```

Bhai, ab tumhara README complete encyclopedia ban gaya hai gestures ka! 📚 Har possible property, use case, aur example cover kiya hai. Koi bhi developer isko padhke gesture master ban sakta hai! 🚀

## Practical Examples

### 1. Swipe to Delete
```javascript
const SwipeToDelete = ({ onDelete }) => {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = Math.min(0, event.translationX);
    })
    .onEnd((event) => {
      if (event.translationX < -100) {
        // Delete action
        translateX.value = withTiming(-300);
        opacity.value = withTiming(0, {}, () => {
          runOnJS(onDelete)();
        });
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.item, animatedStyle]}>
        {/* Item content */}
      </Animated.View>
    </GestureDetector>
  );
};
```

### 2. Pull to Refresh
```javascript
const PullToRefresh = ({ onRefresh, children }) => {
  const translateY = useSharedValue(0);
  const isRefreshing = useSharedValue(false);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY * 0.5;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 100 && !isRefreshing.value) {
        isRefreshing.value = true;
        runOnJS(onRefresh)();
        translateY.value = withTiming(60);
      } else {
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};
```

### 3. Pinch to Zoom
```javascript
const PinchToZoom = ({ children }) => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: Math.max(0.5, Math.min(scale.value, 3)) }],
  }));

  return (
    <GestureDetector gesture={pinchGesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};
```

## Performance Tips

### 1. Use 'worklet' for Complex Logic
```javascript
const complexCalculation = (value) => {
  'worklet';
  // Complex math operations
  return Math.sin(value) * Math.cos(value);
};
```

### 2. Minimize runOnJS Calls
```javascript
// ❌ Har update pe JS call
.onUpdate((event) => {
  runOnJS(updateState)(event.translationX);
})

// ✅ Sirf end pe call
.onEnd((event) => {
  runOnJS(handleGestureEnd)(event);
})
```

### 3. Use Context for State Management
```javascript
const gesture = Gesture.Pan()
  .onStart(() => {
    context.value = { startX: translateX.value };
  })
  .onUpdate((event) => {
    translateX.value = context.value.startX + event.translationX;
  });
```

## Common Patterns

### 1. Button Press Effect
```javascript
const pressGesture = Gesture.Tap()
  .onTouchesDown(() => {
    scale.value = withSpring(0.95);
  })
  .onTouchesUp(() => {
    scale.value = withSpring(1);
  });
```

### 2. Long Press
```javascript
const longPress = Gesture.LongPress()
  .minDuration(500)
  .onStart(() => {
    scale.value = withSpring(1.1);
  })
  .onEnd(() => {
    scale.value = withSpring(1);
  });
```

## Practice Exercises

1. **Draggable Card**: Card ko drag kar ke different positions mein move karo
2. **Swipe Navigation**: Left/right swipe se screens change karo
3. **Elastic Scroll**: Scroll boundaries pe elastic effect add karo
4. **Interactive Slider**: Custom slider banao gesture ke saath

## Homework 📝

### Practice Tasks:
- Pan gesture implement karo
- Tap aur double tap combine karo
- Swipe to delete functionality banao
- Velocity-based animations try karo

### 🎯 Animation Examples to Copy & Practice:

#### 1. **Expo Snack Examples**
- **Draggable Box**: https://snack.expo.dev/@reanimated/draggable-box
- **Swipe to Delete**: https://snack.expo.dev/@reanimated/swipe-to-delete
- **Pull to Refresh**: https://snack.expo.dev/@reanimated/pull-to-refresh
- **Pinch to Zoom**: https://snack.expo.dev/@reanimated/pinch-zoom

#### 2. **Gesture Handler Examples**
- **Official Examples**: https://docs.swmansion.com/react-native-gesture-handler/docs/examples
- **Pan Gesture**: https://snack.expo.dev/@gesture-handler/pan-gesture
- **Rotation Gesture**: https://snack.expo.dev/@gesture-handler/rotation

#### 3. **Advanced Gesture Patterns**
- **Tinder Cards**: https://github.com/alexbrillant/react-native-deck-swiper
- **Bottom Sheet**: https://github.com/gorhom/react-native-bottom-sheet
- **Image Viewer**: https://github.com/ascoders/react-native-image-viewer

### 🔥 Challenge Animations to Try:
1. **Instagram Stories**: Tap to pause, swipe for next
2. **Snapchat Camera**: Pinch zoom with pan
3. **Tinder Swipe**: Card stack with like/dislike
4. **Google Maps**: Pan, pinch, rotation combined

### 📱 Ready-to-Copy Gesture Examples:

#### Basic Drag Example:
```javascript
// Copy to Expo Snack
const panGesture = Gesture.Pan()
  .onUpdate((event) => {
    translateX.value = event.translationX;
    translateY.value = event.translationY;
  })
  .onEnd(() => {
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
  });
```

#### Swipe Detection:
```javascript
const swipeGesture = Gesture.Pan()
  .onEnd((event) => {
    if (Math.abs(event.velocityX) > 500) {
      const direction = event.velocityX > 0 ? 'right' : 'left';
      console.log('Swiped:', direction);
    }
  });
```

### 🎮 Interactive Playgrounds:
- **Gesture Handler Playground**: https://snack.expo.dev/@gesture-handler/playground
- **Reanimated + Gestures**: https://docs.swmansion.com/react-native-reanimated/examples/gestures

### 📺 Video Tutorials:
- **YouTube**: Search "React Native Gesture Handler tutorial"
- **William Candillon**: React Native animation tutorials
- **Catalin Miron**: Advanced gesture patterns

## **Quick Reference Cheat Sheet** 📋

### **Most Used Properties:**
```javascript
// ✅ Essential Properties (Use These Most)
.onBegin()              // Start gesture (reliable)
.onFinalize()           // End gesture (reliable)
.onUpdate()             // Continuous updates
.enabled(true/false)    // Enable/disable
.numberOfTaps(1)        // Tap count
.minDistance(10)        // Min movement to start
.maxDistance(20)        // Max movement allowed
.hitSlop({top:10})      // Extend touch area
.runOnJS(false)         // Keep on UI thread
```

### **Common Patterns:**
```javascript
// Button Press Effect
.onTouchesDown(() => scale.value = withSpring(0.9))
.onTouchesUp(() => scale.value = withSpring(1))

// Swipe Detection
.onEnd((event) => {
  if (Math.abs(event.velocityX) > 500) {
    // Handle swipe
  }
})

// Boundary Constraints
.onUpdate((event) => {
  translateX.value = Math.max(-100, Math.min(100, event.translationX));
})
```

### **Performance Tips:**
```javascript
// ✅ Do This
'worklet';                    // Add to callbacks
.runOnJS(false);             // Keep on UI thread
translateX.value = event.x;   // Direct assignment

// ❌ Avoid This
runOnJS(setState)(value);     // Frequent JS calls
console.log(event);          // Logging in onUpdate
```

### **Debugging Checklist:**
1. ✅ `GestureHandlerRootView` with `style={{flex:1}}`
2. ✅ Use `onBegin/onFinalize` instead of `onStart/onEnd`
3. ✅ Add `'worklet'` to gesture callbacks
4. ✅ Check console for gesture events
5. ✅ Verify gesture is `enabled(true)`

Bhai, ab tumhara Day3 README complete masterpiece hai! 🎯 Koi bhi gesture property ya pattern chahiye ho, sab yahan mil jayega! 🚀

## Next Day Preview
Kal hum seekhenge:
- Advanced animation functions
- Timing vs Spring animations
- Sequence animations
- Loop animations
- Custom easing functions
