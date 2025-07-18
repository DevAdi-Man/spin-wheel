# Day 7: Real World Projects & Best Practices 🏆

## Complete Project Examples

Aaj hum real-world applications mein use hone wale complete animated components banayenge. Ye projects production-ready hain aur best practices follow karte hain.

## Project 1: Instagram-like Stories Viewer

### Features:
- Tap to pause/resume
- Swipe up for details
- Automatic progression
- Progress indicators
- Smooth transitions

```javascript
const StoriesViewer = ({ stories, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progress = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  
  const STORY_DURATION = 5000; // 5 seconds per story
  
  // Auto progress animation
  useEffect(() => {
    if (!isPaused && currentIndex < stories.length) {
      progress.value = withTiming(1, {
        duration: STORY_DURATION,
      }, (finished) => {
        if (finished) {
          runOnJS(nextStory)();
        }
      });
    }
  }, [currentIndex, isPaused]);
  
  const nextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      progress.value = 0;
    } else {
      onClose();
    }
  };
  
  const prevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      progress.value = 0;
    }
  };
  
  // Gesture handlers
  const tapGesture = Gesture.Tap()
    .onStart((event) => {
      const { x } = event;
      const screenWidth = Dimensions.get('window').width;
      
      if (x < screenWidth / 2) {
        runOnJS(prevStory)();
      } else {
        runOnJS(nextStory)();
      }
    });
  
  const longPressGesture = Gesture.LongPress()
    .minDuration(200)
    .onStart(() => {
      runOnJS(setIsPaused)(true);
      cancelAnimation(progress);
    })
    .onEnd(() => {
      runOnJS(setIsPaused)(false);
    });
  
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY < 0) {
        translateY.value = event.translationY;
        scale.value = 1 + Math.abs(event.translationY) / 1000;
      }
    })
    .onEnd((event) => {
      if (event.translationY < -100) {
        // Show story details
        translateY.value = withTiming(-400);
        scale.value = withTiming(1.2);
      } else {
        translateY.value = withSpring(0);
        scale.value = withSpring(1);
      }
    });
  
  const combinedGesture = Gesture.Simultaneous(
    Gesture.Race(tapGesture, longPressGesture),
    panGesture
  );
  
  const storyStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));
  
  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));
  
  return (
    <View style={styles.storiesContainer}>
      {/* Progress indicators */}
      <View style={styles.progressContainer}>
        {stories.map((_, index) => (
          <View key={index} style={styles.progressBar}>
            {index === currentIndex && (
              <Animated.View style={[styles.progressFill, progressStyle]} />
            )}
            {index < currentIndex && (
              <View style={[styles.progressFill, { width: '100%' }]} />
            )}
          </View>
        ))}
      </View>
      
      {/* Story content */}
      <GestureDetector gesture={combinedGesture}>
        <Animated.View style={[styles.storyContent, storyStyle]}>
          <Image
            source={{ uri: stories[currentIndex]?.image }}
            style={styles.storyImage}
          />
          <Text style={styles.storyText}>
            {stories[currentIndex]?.text}
          </Text>
        </Animated.View>
      </GestureDetector>
      
      {/* Close button */}
      <Pressable onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeText}>✕</Text>
      </Pressable>
    </View>
  );
};
```

## Project 2: Tinder-like Card Swiper

### Features:
- Smooth card swiping
- Stack effect
- Like/dislike indicators
- Velocity-based decisions
- Card regeneration

```javascript
const CardSwiper = ({ cards, onSwipe, onEmpty }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const likeOpacity = useSharedValue(0);
  const nopeOpacity = useSharedValue(0);
  
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      
      // Rotation based on horizontal movement
      rotation.value = (event.translationX / 300) * 15;
      
      // Scale effect
      const distance = Math.sqrt(
        event.translationX ** 2 + event.translationY ** 2
      );
      scale.value = Math.max(0.95, 1 - distance / 1000);
      
      // Like/Nope indicators
      if (event.translationX > 50) {
        likeOpacity.value = Math.min(1, event.translationX / 150);
        nopeOpacity.value = 0;
      } else if (event.translationX < -50) {
        nopeOpacity.value = Math.min(1, Math.abs(event.translationX) / 150);
        likeOpacity.value = 0;
      } else {
        likeOpacity.value = 0;
        nopeOpacity.value = 0;
      }
    })
    .onEnd((event) => {
      const { translationX, velocityX } = event;
      const shouldSwipe = Math.abs(translationX) > 120 || Math.abs(velocityX) > 800;
      
      if (shouldSwipe) {
        const direction = translationX > 0 ? 'right' : 'left';
        const targetX = direction === 'right' ? 400 : -400;
        
        // Animate card out
        translateX.value = withTiming(targetX, { duration: 300 });
        rotation.value = withTiming(direction === 'right' ? 30 : -30, { duration: 300 });
        scale.value = withTiming(0.8, { duration: 300 });
        
        // Call swipe callback
        runOnJS(onSwipe)(direction, cards[currentIndex]);
        
        // Move to next card
        setTimeout(() => {
          runOnJS(moveToNextCard)();
        }, 300);
      } else {
        // Return to center
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        rotation.value = withSpring(0);
        scale.value = withSpring(1);
        likeOpacity.value = withTiming(0);
        nopeOpacity.value = withTiming(0);
      }
    });
  
  const moveToNextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(nextIndex);
      setNextIndex(nextIndex + 1);
    } else {
      onEmpty();
    }
    
    // Reset animations
    translateX.value = 0;
    translateY.value = 0;
    rotation.value = 0;
    scale.value = 1;
    likeOpacity.value = 0;
    nopeOpacity.value = 0;
  };
  
  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));
  
  const likeStyle = useAnimatedStyle(() => ({
    opacity: likeOpacity.value,
  }));
  
  const nopeStyle = useAnimatedStyle(() => ({
    opacity: nopeOpacity.value,
  }));
  
  if (currentIndex >= cards.length) {
    return (
      <View style={styles.emptyState}>
        <Text>No more cards!</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.swiperContainer}>
      {/* Background cards */}
      {nextIndex < cards.length && (
        <View style={[styles.card, styles.backgroundCard]}>
          <Image
            source={{ uri: cards[nextIndex].image }}
            style={styles.cardImage}
          />
          <Text style={styles.cardTitle}>{cards[nextIndex].title}</Text>
        </View>
      )}
      
      {/* Active card */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.card, cardStyle]}>
          <Image
            source={{ uri: cards[currentIndex].image }}
            style={styles.cardImage}
          />
          <Text style={styles.cardTitle}>{cards[currentIndex].title}</Text>
          
          {/* Like indicator */}
          <Animated.View style={[styles.likeIndicator, likeStyle]}>
            <Text style={styles.likeText}>LIKE</Text>
          </Animated.View>
          
          {/* Nope indicator */}
          <Animated.View style={[styles.nopeIndicator, nopeStyle]}>
            <Text style={styles.nopeText}>NOPE</Text>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};
```

## Project 3: Advanced Bottom Sheet

### Features:
- Multiple snap points
- Backdrop interaction
- Keyboard handling
- Smooth gestures
- Portal rendering

```javascript
const AdvancedBottomSheet = ({
  children,
  snapPoints = ['25%', '50%', '90%'],
  initialSnapPoint = 0,
  onClose,
  backdropOpacity = 0.5,
}) => {
  const { height: SCREEN_HEIGHT } = Dimensions.get('window');
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const [isVisible, setIsVisible] = useState(false);
  const [currentSnapPoint, setCurrentSnapPoint] = useState(initialSnapPoint);
  
  // Convert percentage snap points to pixel values
  const snapPointsPixels = snapPoints.map(point => {
    if (typeof point === 'string' && point.includes('%')) {
      return SCREEN_HEIGHT * (1 - parseInt(point) / 100);
    }
    return SCREEN_HEIGHT - point;
  });
  
  useEffect(() => {
    setIsVisible(true);
    translateY.value = withSpring(snapPointsPixels[initialSnapPoint]);
  }, []);
  
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newY = snapPointsPixels[currentSnapPoint] + event.translationY;
      translateY.value = Math.max(snapPointsPixels[snapPointsPixels.length - 1], newY);
    })
    .onEnd((event) => {
      const { translationY, velocityY } = event;
      const currentY = translateY.value;
      
      // Find closest snap point
      let closestSnapPoint = 0;
      let minDistance = Math.abs(currentY - snapPointsPixels[0]);
      
      snapPointsPixels.forEach((point, index) => {
        const distance = Math.abs(currentY - point);
        if (distance < minDistance) {
          minDistance = distance;
          closestSnapPoint = index;
        }
      });
      
      // Consider velocity for snap decision
      if (velocityY > 500 && closestSnapPoint > 0) {
        closestSnapPoint = Math.max(0, closestSnapPoint - 1);
      } else if (velocityY < -500 && closestSnapPoint < snapPointsPixels.length - 1) {
        closestSnapPoint = Math.min(snapPointsPixels.length - 1, closestSnapPoint + 1);
      }
      
      // Check if should close
      if (translationY > 100 && velocityY > 300) {
        translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 });
        runOnJS(onClose)();
        return;
      }
      
      // Animate to snap point
      translateY.value = withSpring(snapPointsPixels[closestSnapPoint]);
      runOnJS(setCurrentSnapPoint)(closestSnapPoint);
    });
  
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  
  const backdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [snapPointsPixels[snapPointsPixels.length - 1], SCREEN_HEIGHT],
      [backdropOpacity, 0],
      'clamp'
    );
    
    return {
      opacity,
      pointerEvents: opacity > 0 ? 'auto' : 'none',
    };
  });
  
  if (!isVisible) return null;
  
  return (
    <Portal>
      <View style={styles.bottomSheetContainer}>
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={onClose}
          />
        </Animated.View>
        
        {/* Bottom Sheet */}
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.bottomSheet, sheetStyle]}>
            {/* Handle */}
            <View style={styles.handle} />
            
            {/* Content */}
            <ScrollView
              style={styles.sheetContent}
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
          </Animated.View>
        </GestureDetector>
      </View>
    </Portal>
  );
};
```

## Best Practices Consolidation

### 1. Performance Optimization

```javascript
// ✅ Use worklet for heavy calculations
const heavyCalculation = (value) => {
  'worklet';
  return Math.sin(value) * Math.cos(value) * Math.tan(value);
};

// ✅ Minimize runOnJS calls
const optimizedGesture = Gesture.Pan()
  .onUpdate((event) => {
    // Do calculations on UI thread
    translateX.value = event.translationX;
  })
  .onEnd((event) => {
    // Call JS only when necessary
    if (Math.abs(event.translationX) > 100) {
      runOnJS(handleSwipe)();
    }
  });

// ✅ Cancel animations on unmount
useEffect(() => {
  return () => {
    cancelAnimation(translateX);
    cancelAnimation(translateY);
  };
}, []);
```

### 2. Memory Management

```javascript
// ✅ Proper cleanup
const useAnimatedValue = (initialValue) => {
  const value = useSharedValue(initialValue);
  
  useEffect(() => {
    return () => {
      // Cleanup if needed
      cancelAnimation(value);
    };
  }, []);
  
  return value;
};

// ✅ Avoid memory leaks in listeners
useEffect(() => {
  const listener = sharedValue.addListener((value) => {
    console.log('Value changed:', value);
  });
  
  return () => {
    sharedValue.removeListener(listener);
  };
}, []);
```

### 3. Error Handling

```javascript
// ✅ Safe animation execution
const safeAnimate = (callback) => {
  try {
    callback();
  } catch (error) {
    console.warn('Animation error:', error);
    // Fallback behavior
  }
};

// ✅ Conditional animations
const conditionalAnimation = (shouldAnimate) => {
  if (shouldAnimate && translateX.value !== undefined) {
    translateX.value = withTiming(100);
  }
};
```

### 4. Accessibility

```javascript
// ✅ Respect reduced motion preference
const respectReducedMotion = () => {
  const shouldAnimate = !AccessibilityInfo.isReduceMotionEnabled();
  
  if (shouldAnimate) {
    translateX.value = withSpring(100);
  } else {
    translateX.value = 100; // Instant change
  }
};

// ✅ Provide accessibility labels
<Animated.View
  accessible={true}
  accessibilityLabel="Draggable card"
  accessibilityHint="Swipe left or right to interact"
>
```

## Troubleshooting Guide

### Common Issues & Solutions

1. **Animations not working**
```javascript
// ❌ Problem: Not using Animated component
<View style={animatedStyle} />

// ✅ Solution: Use Animated component
<Animated.View style={animatedStyle} />
```

2. **Performance issues**
```javascript
// ❌ Problem: Heavy calculations in useAnimatedStyle
const animatedStyle = useAnimatedStyle(() => {
  const heavyResult = expensiveFunction(value.value);
  return { opacity: heavyResult };
});

// ✅ Solution: Pre-calculate or optimize
const animatedStyle = useAnimatedStyle(() => {
  const optimizedValue = value.value * 0.01;
  return { opacity: optimizedValue };
});
```

3. **Gesture conflicts**
```javascript
// ❌ Problem: Conflicting gestures
const gesture1 = Gesture.Pan().onUpdate(/* ... */);
const gesture2 = Gesture.Pan().onUpdate(/* ... */);

// ✅ Solution: Proper gesture composition
const combinedGesture = Gesture.Exclusive(gesture1, gesture2);
```

## Production Checklist

- [ ] Performance tested on low-end devices
- [ ] Accessibility features implemented
- [ ] Error boundaries added
- [ ] Memory leaks checked
- [ ] Reduced motion support
- [ ] Gesture conflicts resolved
- [ ] Animation cleanup implemented
- [ ] Cross-platform testing done

## Final Project: Complete App

```javascript
// Complete animated app structure
const AnimatedApp = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Stories" component={StoriesScreen} />
          <Stack.Screen name="Swiper" component={SwiperScreen} />
          <Stack.Screen name="BottomSheet" component={BottomSheetScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};
```

## Congratulations! 🎉

Tumne successfully React Native Reanimated master kar liya hai! Ab tum:

- Complex animations bana sakte ho
- Gesture handling kar sakte ho
- Performance optimize kar sakte ho
- Production-ready components bana sakte ho
- Real-world projects implement kar sakte ho

## Next Steps

1. **Practice Projects**: Apne ideas implement karo
2. **Open Source**: Community mein contribute karo
3. **Advanced Topics**: Shared element transitions, custom native modules
4. **Performance**: Advanced optimization techniques
5. **Teaching**: Dusron ko sikhao jo tumne sikha hai

## Homework 📝

### Practice Tasks:
- Complete real-world projects implement karo
- Production-ready components banao
- Performance optimization apply karo
- Best practices follow karo

### 🎯 Complete Project Examples to Copy & Build:

#### 1. **Production-Ready Apps**
- **Instagram Clone**: https://github.com/iamvucms/react-native-instagram-clone
- **TikTok Clone**: https://github.com/catalinmiron/react-native-tiktok-clone
- **Spotify Clone**: https://github.com/catalinmiron/react-native-spotify-clone
- **WhatsApp Clone**: https://github.com/lukewalczak/react-native-whatsapp-clone

#### 2. **Complete Component Libraries**
- **UI Kitten**: https://akveo.github.io/react-native-ui-kitten/
- **NativeBase**: https://nativebase.io/
- **React Native Elements**: https://reactnativeelements.com/
- **Shoutem UI**: https://shoutem.github.io/docs/ui-toolkit/introduction

#### 3. **Advanced Animation Projects**
- **Animated Onboarding**: https://github.com/jsamr/react-native-onboarding-swiper
- **Complex Transitions**: https://github.com/react-navigation/react-navigation
- **Interactive Charts**: https://github.com/rainbow-me/react-native-animated-charts
- **Game Animations**: https://github.com/bberak/react-native-game-engine

### 🔥 Final Challenge Projects:
1. **Complete Social Media App**: Stories, posts, interactions
2. **E-commerce App**: Product gallery, cart animations, checkout flow
3. **Music Player**: Now playing screen, playlist animations
4. **Fitness App**: Progress animations, workout timers

### 📱 Production-Ready Code Templates:

#### Complete App Structure:
```javascript
// Copy this structure for your projects
const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};
```

#### Performance Optimized Component:
```javascript
const OptimizedComponent = React.memo(() => {
  const translateX = useSharedValue(0);
  
  useEffect(() => {
    return () => {
      cancelAnimation(translateX);
    };
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }), []);
  
  return <Animated.View style={animatedStyle} />;
});
```

### 🏆 Portfolio Projects:
Build these for your portfolio:

#### 1. **Instagram Stories Clone**
- **Features**: Tap to pause, swipe for next, progress indicators
- **GitHub**: https://github.com/lukewalczak/react-native-instagram-stories
- **Tutorial**: Follow step-by-step implementation

#### 2. **Tinder Card Swiper**
- **Features**: Swipe gestures, stack effect, like/dislike
- **GitHub**: https://github.com/alexbrillant/react-native-deck-swiper
- **Customization**: Add your own features

#### 3. **Advanced Bottom Sheet**
- **Features**: Multiple snap points, backdrop, keyboard handling
- **GitHub**: https://github.com/gorhom/react-native-bottom-sheet
- **Integration**: Use in your apps

### 🎨 Design Resources:
- **Figma Templates**: Search "React Native app templates"
- **Dribbble**: Mobile app designs for inspiration
- **Behance**: Complete app design systems
- **UI8**: Premium mobile app templates

### 📺 Complete Project Tutorials:
- **YouTube Playlists**: "React Native full app tutorial"
- **Udemy Courses**: Advanced React Native development
- **Pluralsight**: Professional React Native development

### 🛠️ Production Tools:
- **CodePush**: Over-the-air updates
- **Flipper**: Debugging and performance
- **Reactotron**: Development debugging
- **Sentry**: Error tracking and performance monitoring

### 🚀 Deployment & Publishing:
- **Expo EAS Build**: Build and deploy
- **App Store Connect**: iOS publishing
- **Google Play Console**: Android publishing
- **TestFlight**: iOS beta testing

### 📊 Performance Monitoring:
- **React Native Performance**: Built-in tools
- **Flipper Performance**: Real-time monitoring
- **Sentry Performance**: Production monitoring
- **Firebase Performance**: Analytics and monitoring

Keep animating! 🚀
