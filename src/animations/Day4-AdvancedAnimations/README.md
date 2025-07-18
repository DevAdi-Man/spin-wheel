# Day 4: Advanced Animation Functions 🚀

## Animation Functions Overview

Reanimated mein different types ke animation functions hain jo different use cases ke liye optimize hain:

1. **withTiming** - Linear aur custom easing animations
2. **withSpring** - Physics-based spring animations
3. **withDecay** - Momentum-based animations
4. **withSequence** - Sequential animations
5. **withRepeat** - Loop animations
6. **withDelay** - Delayed animations

## withTiming - Precise Control

`withTiming` sabse basic animation function hai jo precise control deta hai.

### Basic Syntax
```javascript
withTiming(toValue, config, callback)
```

### Parameters:
- `toValue`: Final value
- `config`: Animation configuration
- `callback`: Completion callback (optional)

### Configuration Options:
```javascript
{
  duration: 1000,           // Animation duration in ms
  easing: Easing.bezier(),  // Easing function
  reduceMotion: true,       // Accessibility support
}
```

### Examples:
```javascript
// Simple timing
translateX.value = withTiming(100, { duration: 500 });

// With easing
translateX.value = withTiming(100, {
  duration: 800,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
});

// With callback
translateX.value = withTiming(100, { duration: 500 }, (finished) => {
  if (finished) {
    console.log('Animation completed!');
  }
});
```

## withSpring - Natural Motion

`withSpring` physics-based animations provide karta hai jo natural feel dete hain.

### Basic Syntax
```javascript
withSpring(toValue, config, callback)
```

### Configuration Options:
```javascript
{
  damping: 10,              // Spring damping (1-100)
  mass: 1,                  // Spring mass
  stiffness: 100,           // Spring stiffness
  overshootClamping: false, // Prevent overshoot
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
  velocity: 0,              // Initial velocity
}
```

### Spring Presets:
```javascript
// Gentle spring
withSpring(100, { damping: 15, stiffness: 150 })

// Bouncy spring
withSpring(100, { damping: 8, stiffness: 100 })

// Quick spring
withSpring(100, { damping: 20, stiffness: 300 })

// No overshoot
withSpring(100, { damping: 15, overshootClamping: true })
```

## withDecay - Momentum Animations

`withDecay` velocity-based animations ke liye use hota hai, jaise scroll momentum.

### Basic Syntax
```javascript
withDecay(config, callback)
```

### Configuration:
```javascript
{
  velocity: 500,           // Initial velocity
  deceleration: 0.998,     // Deceleration rate (0-1)
  clamp: [min, max],       // Value constraints
  velocityFactor: 1,       // Velocity multiplier
}
```

### Example:
```javascript
const panGesture = Gesture.Pan()
  .onEnd((event) => {
    translateX.value = withDecay({
      velocity: event.velocityX,
      clamp: [-200, 200],
    });
  });
```

## withSequence - Sequential Animations

Multiple animations ko sequence mein run karne ke liye.

### Basic Usage:
```javascript
translateX.value = withSequence(
  withTiming(100, { duration: 500 }),
  withTiming(0, { duration: 500 }),
  withSpring(-50),
  withTiming(0)
);
```

### Complex Sequence:
```javascript
const animateSequence = () => {
  scale.value = withSequence(
    withTiming(1.2, { duration: 200 }),
    withTiming(0.8, { duration: 200 }),
    withSpring(1, { damping: 10 })
  );

  opacity.value = withSequence(
    withTiming(0.5, { duration: 300 }),
    withDelay(200, withTiming(1, { duration: 300 }))
  );
};
```

## withRepeat - Loop Animations

Animations ko repeat karne ke liye.

### Basic Syntax:
```javascript
withRepeat(animation, numberOfReps, reverse, callback)
```

### Parameters:
- `animation`: Jo animation repeat karni hai
- `numberOfReps`: Kitni baar repeat karna hai (-1 for infinite)
- `reverse`: Reverse direction mein bhi play karna hai
- `callback`: Completion callback

### Examples:
```javascript
// Infinite rotation
rotation.value = withRepeat(
  withTiming(360, { duration: 2000 }),
  -1, // Infinite
  false // Don't reverse
);

// Pulse effect
scale.value = withRepeat(
  withSequence(
    withTiming(1.2, { duration: 500 }),
    withTiming(1, { duration: 500 })
  ),
  -1, // Infinite
  false
);

// Shake effect
translateX.value = withRepeat(
  withSequence(
    withTiming(10, { duration: 50 }),
    withTiming(-10, { duration: 50 }),
    withTiming(0, { duration: 50 })
  ),
  3, // 3 times
  false
);
```

## withDelay - Delayed Animations

Animation ko delay ke saath start karne ke liye.

### Basic Usage:
```javascript
// 1 second delay ke baad animate
translateX.value = withDelay(1000, withTiming(100));

// Multiple delays
const staggeredAnimation = () => {
  box1X.value = withDelay(0, withTiming(100));
  box2X.value = withDelay(200, withTiming(100));
  box3X.value = withDelay(400, withTiming(100));
};
```

## Custom Easing Functions

### Built-in Easing:
```javascript
import { Easing } from 'react-native-reanimated';

// Linear
Easing.linear

// Ease functions
Easing.ease
Easing.quad
Easing.cubic

// Bezier curves
Easing.bezier(0.25, 0.1, 0.25, 1)

// Bounce
Easing.bounce

// Elastic
Easing.elastic(1)

// Back
Easing.back(1.5)
```

### Custom Easing:
```javascript
const customEasing = (t) => {
  'worklet';
  return t * t * (3 - 2 * t); // Smoothstep function
};

translateX.value = withTiming(100, {
  duration: 1000,
  easing: customEasing,
});
```

## Advanced Animation Patterns

### 1. Staggered Animations
```javascript
const StaggeredBoxes = () => {
  const boxes = Array.from({ length: 5 }, () => useSharedValue(0));

  const animateStaggered = () => {
    boxes.forEach((box, index) => {
      box.value = withDelay(
        index * 100,
        withSpring(Math.random() * 200 - 100)
      );
    });
  };

  return (
    <View>
      {boxes.map((box, index) => {
        const animatedStyle = useAnimatedStyle(() => ({
          transform: [{ translateX: box.value }],
        }));

        return (
          <Animated.View key={index} style={[styles.box, animatedStyle]} />
        );
      })}
    </View>
  );
};
```

### 2. Chain Animations
```javascript
const chainAnimations = () => {
  translateX.value = withTiming(100, { duration: 500 }, (finished) => {
    if (finished) {
      translateY.value = withTiming(100, { duration: 500 }, (finished) => {
        if (finished) {
          scale.value = withSpring(1.5);
        }
      });
    }
  });
};
```

### 3. Conditional Animations
```javascript
const conditionalAnimation = (condition) => {
  if (condition) {
    translateX.value = withSpring(100);
  } else {
    translateX.value = withTiming(0, { duration: 300 });
  }
};
```

### 4. Interrupted Animations
```javascript
const interruptibleAnimation = () => {
  // Cancel current animation and start new one
  cancelAnimation(translateX);
  translateX.value = withTiming(200);
};
```

## Performance Optimization

### 1. Use Appropriate Animation Types
```javascript
// ✅ Use spring for natural interactions
scale.value = withSpring(1.2);

// ✅ Use timing for precise control
opacity.value = withTiming(0, { duration: 300 });

// ✅ Use decay for momentum
translateX.value = withDecay({ velocity: event.velocityX });
```

### 2. Avoid Unnecessary Re-animations
```javascript
// ❌ Animation har render pe trigger hota hai
useEffect(() => {
  translateX.value = withTiming(100);
}, [someValue]);

// ✅ Conditional animation
useEffect(() => {
  if (shouldAnimate) {
    translateX.value = withTiming(100);
  }
}, [shouldAnimate]);
```

### 3. Cancel Animations When Needed
```javascript
useEffect(() => {
  return () => {
    cancelAnimation(translateX);
    cancelAnimation(translateY);
  };
}, []);
```

## Real-world Examples

### 1. Loading Spinner
```javascript
const LoadingSpinner = () => {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return <Animated.View style={[styles.spinner, animatedStyle]} />;
};
```

### 2. Notification Toast
```javascript
const Toast = ({ visible, message }) => {
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      translateY.value = withSequence(
        withTiming(0, { duration: 300 }),
        withDelay(2000, withTiming(-100, { duration: 300 }))
      );
      opacity.value = withSequence(
        withTiming(1, { duration: 300 }),
        withDelay(2000, withTiming(0, { duration: 300 }))
      );
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.toast, animatedStyle]}>
      <Text>{message}</Text>
    </Animated.View>
  );
};
```

## Practice Exercises

1. **Breathing Animation**: Scale animation jo continuously pulse kare
2. **Wave Effect**: Multiple elements ko wave pattern mein animate karo
3. **Typewriter Effect**: Text ko character by character animate karo
4. **Morphing Shapes**: Shape ko gradually change karo

## Homework 📝

### Practice Tasks:
- Different animation functions ko combine karo
- Custom easing functions banao
- Staggered animations implement karo
- Performance optimization techniques practice karo

### 🎯 Animation Examples to Copy & Practice:

#### 1. **Expo Snack Examples**
- **Spring Animations**: https://snack.expo.dev/@reanimated/spring-animations
- **Sequence Animations**: https://snack.expo.dev/@reanimated/sequence-animation
- **Loop Animations**: https://snack.expo.dev/@reanimated/loop-animation
- **Staggered List**: https://snack.expo.dev/@reanimated/staggered-list

#### 2. **Advanced Animation Patterns**
- **Loading Spinners**: https://snack.expo.dev/@reanimated/loading-spinners
- **Morphing Shapes**: https://snack.expo.dev/@reanimated/morphing-shapes
- **Particle System**: https://github.com/wcandillon/react-native-redash

#### 3. **Real-world Examples**
- **Onboarding Screens**: https://github.com/jsamr/react-native-onboarding-swiper
- **Animated Charts**: https://github.com/rainbow-me/react-native-animated-charts
- **Page Transitions**: https://reactnavigation.org/docs/animations/

### 🔥 Challenge Animations to Try:
1. **Typewriter Effect**: Text character by character animate ho
2. **Breathing Animation**: Continuous pulse effect
3. **Wave Loading**: Multiple dots wave pattern mein move kare
4. **Morphing Button**: Shape aur size dono change ho

### 📱 Ready-to-Copy Animation Examples:

#### Staggered Animation:
```javascript
// Copy to Expo Snack
const staggeredAnimation = () => {
  boxes.forEach((box, index) => {
    box.value = withDelay(
      index * 100,
      withSpring(Math.random() * 200)
    );
  });
};
```

#### Loop Animation:
```javascript
const loopAnimation = () => {
  rotation.value = withRepeat(
    withTiming(360, { duration: 2000 }),
    -1, // Infinite
    false
  );
};
```

#### Custom Easing:
```javascript
const customEasing = (t) => {
  'worklet';
  return t * t * (3 - 2 * t); // Smoothstep
};
```

### 🎨 Animation Libraries for Inspiration:
- **Lottie Files**: https://lottiefiles.com/
- **React Spring**: https://react-spring.io/
- **Framer Motion**: https://www.framer.com/motion/

### 📺 Advanced Tutorial Videos:
- **William Candillon**: "React Native Animation" playlist
- **Catalin Miron**: Advanced animation patterns
- **Unsure Programmer**: Reanimated tutorials

### 🛠️ Animation Tools:
- **Rive**: https://rive.app/ (Interactive animations)
- **After Effects**: Export to Lottie
- **Figma**: Animation prototypes

## Next Day Preview
Kal hum seekhenge:
- Layout animations
- Entering/Exiting animations
- Shared element transitions
- Advanced layout techniques
