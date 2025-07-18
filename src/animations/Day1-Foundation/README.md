# Day 1: Foundation & Setup 🏗️

## Reanimated Kya Hai?

React Native Reanimated ek powerful animation library hai jo:
- **60 FPS** smooth animations provide karti hai
- **UI Thread** pe animations run karti hai (JavaScript thread pe nahi)
- **Native performance** deti hai
- **Gesture handling** ke liye best hai

## Why Reanimated over Animated API?

### Traditional Animated API Problems:
```javascript
// Ye JavaScript thread pe run hota hai
const fadeAnim = useRef(new Animated.Value(0)).current;

Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 1000,
  useNativeDriver: true, // Sirf kuch properties ke liye
}).start();
```

### Reanimated Benefits:
- **Better Performance**: UI thread pe run hota hai
- **More Control**: Complex animations easily banaye ja sakte hain
- **Gesture Integration**: Touch events seamlessly handle kar sakte hain
- **Declarative**: Code zyada readable aur maintainable hai

## Core Concepts

### 1. useSharedValue Hook

```javascript
import { useSharedValue } from 'react-native-reanimated';

const MyComponent = () => {
  // Shared value create karte hain
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  // Ye values UI thread pe accessible hain
  return <View />;
};
```

**Kya hai useSharedValue?**
- Ye ek special value hai jo UI aur JS thread dono mein accessible hai
- Direct modify kar sakte hain: `translateX.value = 100`
- Re-render trigger nahi karta (performance benefit)

### 2. useAnimatedStyle Hook

```javascript
import { useAnimatedStyle } from 'react-native-reanimated';

const animatedStyle = useAnimatedStyle(() => {
  return {
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  };
});
```

**Kya karta hai useAnimatedStyle?**
- Shared values ko style object mein convert karta hai
- UI thread pe run hota hai
- Automatically re-calculate hota hai jab shared values change hote hain

### 3. Animated Components

```javascript
import Animated from 'react-native-reanimated';

// Ye components animated styles accept kar sakte hain
<Animated.View style={[styles.box, animatedStyle]} />
<Animated.Text style={animatedStyle} />
<Animated.Image style={animatedStyle} />
```

## Basic Animation Example

```javascript
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const BasicAnimation = () => {
  // Step 1: Shared value create karo
  const translateX = useSharedValue(0);

  // Step 2: Animated style banao
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  // Step 3: Animation trigger karo
  const moveBox = () => {
    translateX.value = withTiming(translateX.value === 0 ? 200 : 0, {
      duration: 1000,
    });
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={moveBox}>
        <Animated.View style={[styles.box, animatedStyle]} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: 'blue',
    borderRadius: 10,
  },
});
```

## withTiming Function

```javascript
withTiming(toValue, config, callback)
```

**Parameters:**
- `toValue`: Final value jahan animation pohunchni hai
- `config`: Animation configuration (duration, easing)
- `callback`: Animation complete hone pe call hota hai

**Example:**
```javascript
translateX.value = withTiming(100, {
  duration: 500,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
});
```

## Common Mistakes to Avoid

1. **Direct value access in render:**
```javascript
// ❌ Wrong
<Text>{translateX.value}</Text>

// ✅ Correct
const animatedProps = useAnimatedProps(() => ({
  text: translateX.value.toString(),
}));
```

2. **Forgetting Animated component:**
```javascript
// ❌ Wrong
<View style={animatedStyle} />

// ✅ Correct
<Animated.View style={animatedStyle} />
```

## Practice Exercises

1. **Fade Animation**: Opacity 0 se 1 tak animate karo
2. **Scale Animation**: Size change karo
3. **Rotation Animation**: 360 degree rotate karo
4. **Combined Animation**: Multiple properties together animate karo

## Next Day Preview
Kal hum seekhenge:
- Advanced useAnimatedStyle patterns
- Interpolation techniques
- Color animations
- Multiple shared values handling

## Homework 📝

### Practice Tasks:
- Basic animation example ko implement karo
- Different easing functions try karo
- Animation duration change karke dekho
- Multiple boxes ko different directions mein move karo

### 🎯 Animation Examples to Copy & Practice:

#### 1. **Expo Snack Examples**
- **Fade Animation**: https://snack.expo.dev/@reanimated/fade-in-out
- **Move Animation**: https://snack.expo.dev/@reanimated/basic-move
- **Scale Animation**: https://snack.expo.dev/@reanimated/scale-bounce

#### 2. **Interactive Playgrounds**
- **Reanimated Playground**: https://docs.swmansion.com/react-native-reanimated/examples/basic-animations
- **CodeSandbox Template**: https://codesandbox.io/s/react-native-reanimated-basic-forked

#### 3. **YouTube Tutorials to Follow**
- **Basic Animations**: Search "React Native Reanimated basic animation tutorial"
- **useSharedValue Examples**: Search "useSharedValue useAnimatedStyle tutorial"

#### 4. **GitHub Repositories**
- **Reanimated Examples**: https://github.com/software-mansion/react-native-reanimated/tree/main/Example
- **Animation Collection**: https://github.com/oblador/react-native-animatable

### 🔥 Challenge Animations to Try:
1. **Breathing Button**: Button jo continuously scale hota rahe
2. **Loading Dots**: 3 dots jo sequence mein bounce kare
3. **Slide Toggle**: Switch animation banao
4. **Pulse Effect**: Ripple effect jaise WhatsApp mein hota hai

### 📱 Test on Expo Snack:
```javascript
// Ye code Expo Snack mein paste karo aur test karo
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const MyAnimation = () => {
  const opacity = useSharedValue(0.3);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[{ width: 100, height: 100, backgroundColor: 'blue' }, animatedStyle]} />
  );
};
```
