# Day 2: Animated Styles & Interpolation 🎨

## useAnimatedStyle Deep Dive

`useAnimatedStyle` hook ka main purpose hai shared values ko style objects mein convert karna. Ye UI thread pe run hota hai, isliye performance bahut achhi hoti hai.

### Basic Syntax
```javascript
const animatedStyle = useAnimatedStyle(() => {
  return {
    // Style properties jo animate honi hain
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  };
});
```

### Key Points:
- **Function return karta hai**: Style object return karna zaroori hai
- **UI Thread execution**: Ye JavaScript thread ko block nahi karta
- **Automatic updates**: Shared values change hone pe automatically re-run hota hai
- **Performance optimized**: Sirf zaroori re-calculations hoti hain

## Interpolation - Values Ko Transform Karna

Interpolation ka matlab hai ek range of values ko dusre range mein convert karna.

### interpolate Function

```javascript
import { interpolate } from 'react-native-reanimated';

const animatedStyle = useAnimatedStyle(() => {
  const rotation = interpolate(
    scrollY.value,        // Input value
    [0, 100, 200],       // Input range
    [0, 180, 360],       // Output range
    'clamp'              // Extrapolation (optional)
  );

  return {
    transform: [{ rotate: `${rotation}deg` }],
  };
});
```

### Interpolate Parameters:
1. **Input Value**: Jo value interpolate karni hai
2. **Input Range**: Input ki minimum aur maximum values
3. **Output Range**: Corresponding output values
4. **Extrapolation**: Input range se bahar ki values kaise handle karni hain

### Extrapolation Types:
- `'clamp'`: Values ko range mein limit kar deta hai
- `'extend'`: Linear progression continue karta hai
- `'identity'`: Input value ko as-is return karta hai

## Color Interpolation

Colors ko bhi interpolate kar sakte hain:

```javascript
import { interpolateColor } from 'react-native-reanimated';

const animatedStyle = useAnimatedStyle(() => {
  const backgroundColor = interpolateColor(
    progress.value,
    [0, 0.5, 1],
    ['#ff0000', '#00ff00', '#0000ff'] // Red -> Green -> Blue
  );

  return {
    backgroundColor,
  };
});
```

## Advanced useAnimatedStyle Patterns

### 1. Multiple Transformations
```javascript
const animatedStyle = useAnimatedStyle(() => {
  return {
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  };
});
```

### 2. Conditional Styling
```javascript
const animatedStyle = useAnimatedStyle(() => {
  return {
    backgroundColor: isPressed.value ? '#ff0000' : '#0000ff',
    transform: [
      {
        scale: withTiming(isPressed.value ? 0.95 : 1, { duration: 100 })
      },
    ],
  };
});
```

### 3. Complex Calculations
```javascript
const animatedStyle = useAnimatedStyle(() => {
  // Complex mathematical operations
  const progress = Math.min(scrollY.value / 200, 1);
  const opacity = 1 - progress;
  const scale = 0.8 + (0.2 * (1 - progress));

  return {
    opacity,
    transform: [{ scale }],
  };
});
```

## Practical Examples

### 1. Parallax Effect
```javascript
const ParallaxView = ({ scrollY }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 300],
      [0, -150],
      'clamp'
    );

    return {
      transform: [{ translateY }],
    };
  });

  return <Animated.View style={[styles.parallax, animatedStyle]} />;
};
```

### 2. Progress Bar
```javascript
const ProgressBar = ({ progress }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const width = interpolate(
      progress.value,
      [0, 1],
      [0, 300], // Full width
      'clamp'
    );

    return {
      width,
    };
  });

  return (
    <View style={styles.progressContainer}>
      <Animated.View style={[styles.progressBar, animatedStyle]} />
    </View>
  );
};
```

### 3. Card Flip Animation
```javascript
const FlipCard = () => {
  const rotateY = useSharedValue(0);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(
      rotateY.value,
      [0, 1],
      [0, 180],
      'clamp'
    );

    return {
      transform: [{ rotateY: `${rotateValue}deg` }],
      backfaceVisibility: 'hidden',
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(
      rotateY.value,
      [0, 1],
      [180, 360],
      'clamp'
    );

    return {
      transform: [{ rotateY: `${rotateValue}deg` }],
      backfaceVisibility: 'hidden',
    };
  });

  const flip = () => {
    rotateY.value = withTiming(rotateY.value === 0 ? 1 : 0, {
      duration: 400,
    });
  };

  return (
    <Pressable onPress={flip}>
      <View style={styles.cardContainer}>
        <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
          <Text>Front</Text>
        </Animated.View>
        <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
          <Text>Back</Text>
        </Animated.View>
      </View>
    </Pressable>
  );
};
```

## Performance Tips

### 1. Avoid Heavy Calculations
```javascript
// ❌ Heavy calculation har frame mein
const animatedStyle = useAnimatedStyle(() => {
  const heavyCalculation = expensiveFunction(value.value);
  return { opacity: heavyCalculation };
});

// ✅ Pre-calculate or optimize
const animatedStyle = useAnimatedStyle(() => {
  const optimizedValue = value.value * 0.01; // Simple math
  return { opacity: optimizedValue };
});
```

### 2. Use runOnJS Sparingly
```javascript
// ❌ Avoid frequent JS thread calls
const animatedStyle = useAnimatedStyle(() => {
  runOnJS(updateState)(value.value); // Har frame mein JS thread call
  return { opacity: value.value };
});

// ✅ Use callbacks or separate handlers
```

## Common Patterns

### 1. Fade In/Out
```javascript
const fadeStyle = useAnimatedStyle(() => ({
  opacity: withTiming(isVisible.value ? 1 : 0, { duration: 300 }),
}));
```

### 2. Slide In/Out
```javascript
const slideStyle = useAnimatedStyle(() => ({
  transform: [
    { translateX: withTiming(isVisible.value ? 0 : -300, { duration: 400 }) }
  ],
}));
```

### 3. Bounce Effect
```javascript
const bounceStyle = useAnimatedStyle(() => ({
  transform: [
    { scale: withSpring(isPressed.value ? 0.9 : 1, { damping: 10 }) }
  ],
}));
```

## Practice Exercises

1. **Color Transition**: Background color ko smooth transition ke saath change karo
2. **Size Animation**: Width aur height dono ko simultaneously animate karo
3. **Rotation with Scale**: Rotate karte time scale bhi change karo
4. **Multi-step Animation**: Multiple stages mein animation complete karo

## Homework 📝

### Practice Tasks:
- Interpolation examples implement karo
- Color interpolation try karo
- Complex transformation combinations banao
- Performance optimization techniques practice karo

### 🎯 Animation Examples to Copy & Practice:

#### 1. **Expo Snack Examples**
- **Color Interpolation**: https://snack.expo.dev/@reanimated/color-interpolation
- **Parallax Scroll**: https://snack.expo.dev/@reanimated/parallax-scrollview
- **Progress Bar**: https://snack.expo.dev/@reanimated/animated-progress-bar
- **Card Flip**: https://snack.expo.dev/@reanimated/flip-card-animation

#### 2. **Interactive Demos**
- **Interpolation Playground**: https://docs.swmansion.com/react-native-reanimated/examples/interpolation
- **Color Animation**: https://codesandbox.io/s/react-native-color-animation

#### 3. **Advanced Examples**
- **Morphing Shapes**: https://github.com/wcandillon/react-native-redash/tree/master/example
- **Complex Interpolation**: https://snack.expo.dev/@reanimated/complex-interpolation

### 🔥 Challenge Animations to Try:
1. **Rainbow Progress Bar**: Color change karte time progress fill ho
2. **Morphing Button**: Shape change hote time color bhi change ho
3. **Parallax Header**: Scroll pe header transform ho with color change
4. **Wave Animation**: Sine wave pattern banao interpolation se

### 📱 Ready-to-Copy Code Examples:

#### Color Transition Example:
```javascript
// Expo Snack mein paste karo
const colorTransition = useAnimatedStyle(() => {
  const backgroundColor = interpolateColor(
    progress.value,
    [0, 0.5, 1],
    ['#ff6b6b', '#4ecdc4', '#45b7d1']
  );
  return { backgroundColor };
});
```

#### Parallax Example:
```javascript
// Scroll-based parallax effect
const parallaxStyle = useAnimatedStyle(() => {
  const translateY = interpolate(
    scrollY.value,
    [0, 300],
    [0, -150],
    'clamp'
  );
  return { transform: [{ translateY }] };
});
```

### 🎨 Design Inspiration:
- **Dribbble**: Search "mobile app animations"
- **UI Movement**: https://uimovement.com/tag/mobile/
- **Page Flows**: https://pageflows.com/

## Next Day Preview
Kal hum seekhenge:
- Gesture handling
- Touch interactions
- Pan gestures
- Drag & drop animations
