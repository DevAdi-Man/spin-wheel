# Performance & Optimization ⚡

## 🚀 Overview

Performance optimization React Native apps ki success ke liye crucial hai. Is tutorial mein aap seekhenge ki app performance kaise improve karte hain, memory leaks kaise avoid karte hain, aur bundle size kaise optimize karte hain.

## 🎯 What You'll Learn

- React Native performance fundamentals
- Memory management and leak prevention
- Bundle size optimization
- Image and asset optimization
- Navigation performance
- List rendering optimization
- Native module performance
- Profiling and debugging tools

## 📚 Core Concepts

### 1. **React Performance Optimization**
```jsx
import React, { memo, useMemo, useCallback } from 'react';

// Memoize components to prevent unnecessary re-renders
const OptimizedComponent = memo(({ data, onPress }) => {
  // Memoize expensive calculations
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: expensiveCalculation(item)
    }));
  }, [data]);

  // Memoize callback functions
  const handlePress = useCallback((id) => {
    onPress(id);
  }, [onPress]);

  return (
    <View>
      {processedData.map(item => (
        <TouchableOpacity
          key={item.id}
          onPress={() => handlePress(item.id)}
        >
          <Text>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
});

// Use React.memo with custom comparison
const SmartComponent = memo(({ user, posts }) => {
  return (
    <View>
      <Text>{user.name}</Text>
      {posts.map(post => <Text key={post.id}>{post.title}</Text>)}
    </View>
  );
}, (prevProps, nextProps) => {
  // Custom comparison logic
  return prevProps.user.id === nextProps.user.id &&
         prevProps.posts.length === nextProps.posts.length;
});
```

### 2. **FlatList Optimization**
```jsx
import React, { useCallback } from 'react';
import { FlatList } from 'react-native';

const OptimizedList = ({ data }) => {
  // Optimize item rendering
  const renderItem = useCallback(({ item }) => (
    <ListItem item={item} />
  ), []);

  // Optimize key extraction
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  // Get item layout for better performance
  const getItemLayout = useCallback((data, index) => ({
    length: 80, // Fixed item height
    offset: 80 * index,
    index,
  }), []);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      // Performance props
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      windowSize={10}
      // Memory optimization
      onEndReachedThreshold={0.5}
      onEndReached={loadMoreData}
    />
  );
};

// Memoized list item
const ListItem = memo(({ item }) => (
  <View style={styles.listItem}>
    <Text>{item.title}</Text>
    <Text>{item.description}</Text>
  </View>
));
```

### 3. **Image Optimization**
```jsx
import FastImage from 'react-native-fast-image';

const OptimizedImage = ({ source, style }) => {
  return (
    <FastImage
      style={style}
      source={{
        uri: source,
        priority: FastImage.priority.normal,
        cache: FastImage.cacheControl.immutable,
      }}
      resizeMode={FastImage.resizeMode.cover}
      onLoadStart={() => console.log('Image loading started')}
      onLoad={() => console.log('Image loaded')}
      onError={() => console.log('Image load error')}
    />
  );
};

// Image caching strategy
const ImageCache = {
  preloadImages: (urls) => {
    FastImage.preload(
      urls.map(url => ({
        uri: url,
        priority: FastImage.priority.high,
      }))
    );
  },

  clearCache: () => {
    FastImage.clearMemoryCache();
    FastImage.clearDiskCache();
  },
};
```

## 🛠️ Essential Libraries

### **Performance Libraries**
```bash
# Image optimization
npm install react-native-fast-image

# Performance monitoring
npm install @react-native-firebase/perf
npm install flipper-plugin-react-native-performance

# Memory profiling
npm install react-native-memory-profiler

# Bundle analysis
npm install react-native-bundle-visualizer
```

### **Development Tools**
```bash
# Performance profiler
npm install --save-dev @react-native-community/cli-plugin-metro

# Flipper plugins
npm install --save-dev flipper-plugin-performance
npm install --save-dev flipper-plugin-memory
```

## 💻 Practical Examples

### **Example 1: Memory Leak Prevention** ⭐
```jsx
import React, { useEffect, useRef, useState } from 'react';

const MemoryOptimizedComponent = () => {
  const [data, setData] = useState([]);
  const isMountedRef = useRef(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Cleanup function to prevent memory leaks
    return () => {
      isMountedRef.current = false;
      
      // Clear timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Clear intervals
      // clearInterval(intervalRef.current);
      
      // Cleanup event listeners
      // removeEventListener();
    };
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.example.com/data');
      const result = await response.json();
      
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setData(result);
      }
    } catch (error) {
      if (isMountedRef.current) {
        console.error('Fetch error:', error);
      }
    }
  };

  const delayedAction = () => {
    timeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        // Perform action only if component is mounted
        console.log('Delayed action executed');
      }
    }, 5000);
  };

  return (
    <View>
      {/* Component content */}
    </View>
  );
};
```

### **Example 2: Bundle Size Optimization** ⭐⭐⭐
```jsx
// Use dynamic imports for code splitting
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

// Conditional imports
const loadHeavyLibrary = async () => {
  if (Platform.OS === 'ios') {
    const { default: iOSLibrary } = await import('./ios-specific-library');
    return iOSLibrary;
  } else {
    const { default: AndroidLibrary } = await import('./android-specific-library');
    return AndroidLibrary;
  }
};

// Tree shaking optimization
import { debounce } from 'lodash/debounce'; // Instead of entire lodash
import { format } from 'date-fns/format'; // Instead of entire date-fns

// Bundle analyzer configuration
// metro.config.js
module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true, // Enable inline requires for better performance
      },
    }),
  },
  resolver: {
    alias: {
      // Create aliases for commonly used paths
      '@components': './src/components',
      '@utils': './src/utils',
      '@assets': './src/assets',
    },
  },
};
```

### **Example 3: Navigation Performance** ⭐⭐⭐⭐
```jsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';

// Enable native screens for better performance
enableScreens();

const Stack = createStackNavigator();

const OptimizedNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        // Optimize header rendering
        headerMode: 'screen',
        // Enable gesture handling optimization
        gestureEnabled: true,
        // Optimize transitions
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          // Lazy load screens
          lazy: true,
          // Optimize header
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          lazy: true,
          // Preload screen for better UX
          freezeOnBlur: true,
        }}
      />
    </Stack.Navigator>
  );
};

// Screen optimization
const OptimizedScreen = () => {
  // Use InteractionManager for heavy operations
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      // Heavy operations after screen transition
      performHeavyOperation();
    });

    return () => task.cancel();
  }, []);

  return <View>{/* Screen content */}</View>;
};
```

### **Example 4: Performance Monitoring** ⭐⭐⭐⭐⭐
```jsx
import perf from '@react-native-firebase/perf';
import { Performance } from 'react-native-performance';

const PerformanceMonitor = {
  // Track screen rendering time
  trackScreenRender: async (screenName) => {
    const trace = await perf().startTrace(`screen_${screenName}`);
    
    return {
      stop: () => trace.stop(),
      putAttribute: (key, value) => trace.putAttribute(key, value),
      putMetric: (key, value) => trace.putMetric(key, value),
    };
  },

  // Track API call performance
  trackApiCall: async (apiName) => {
    const trace = await perf().startTrace(`api_${apiName}`);
    const startTime = Performance.now();
    
    return {
      stop: (success = true) => {
        const duration = Performance.now() - startTime;
        trace.putMetric('duration', duration);
        trace.putAttribute('success', success.toString());
        trace.stop();
      },
    };
  },

  // Monitor memory usage
  monitorMemory: () => {
    const memoryInfo = Performance.memory;
    console.log('Memory usage:', {
      used: memoryInfo.usedJSHeapSize,
      total: memoryInfo.totalJSHeapSize,
      limit: memoryInfo.jsHeapSizeLimit,
    });
  },

  // Track user interactions
  trackUserInteraction: (action) => {
    const startTime = Performance.now();
    
    return () => {
      const duration = Performance.now() - startTime;
      console.log(`${action} took ${duration}ms`);
    };
  },
};

// Usage in components
const MonitoredComponent = () => {
  useEffect(() => {
    const screenTrace = PerformanceMonitor.trackScreenRender('Home');
    
    return () => screenTrace.stop();
  }, []);

  const handleApiCall = async () => {
    const apiTrace = await PerformanceMonitor.trackApiCall('fetchUserData');
    
    try {
      const response = await fetch('/api/user');
      const data = await response.json();
      apiTrace.stop(true);
      return data;
    } catch (error) {
      apiTrace.stop(false);
      throw error;
    }
  };

  return <View>{/* Component content */}</View>;
};
```

## 🎯 Practice Exercises

### **Beginner Level** ⭐
1. **Basic Memoization** - Use React.memo and useMemo for simple components
2. **Image Optimization** - Replace Image with FastImage

### **Intermediate Level** ⭐⭐⭐
3. **FlatList Optimization** - Optimize large lists with proper props
4. **Memory Leak Prevention** - Implement proper cleanup in useEffect

### **Advanced Level** ⭐⭐⭐⭐
5. **Bundle Analysis** - Analyze and reduce bundle size
6. **Navigation Optimization** - Implement lazy loading and screen optimization

### **Expert Level** ⭐⭐⭐⭐⭐
7. **Performance Monitoring** - Implement comprehensive performance tracking
8. **Custom Native Modules** - Optimize performance-critical operations

## 🔧 Performance Tools

### **Profiling Tools**
```bash
# React Native Performance Monitor
npx react-native run-android --variant=release
npx react-native run-ios --configuration=Release

# Bundle analyzer
npx react-native-bundle-visualizer

# Memory profiler
# Use Flipper with Memory plugin
```

### **Monitoring Setup**
```jsx
// Performance monitoring configuration
import { Performance } from 'react-native-performance';

Performance.setResourceTimingBufferSize(200);
Performance.mark('app-start');

// Measure app startup time
setTimeout(() => {
  Performance.mark('app-ready');
  Performance.measure('app-startup', 'app-start', 'app-ready');
}, 0);
```

## 📊 Performance Metrics

### **Key Metrics to Track**
- **Time to Interactive (TTI)** - When app becomes fully interactive
- **First Contentful Paint (FCP)** - When first content appears
- **Memory Usage** - RAM consumption patterns
- **Bundle Size** - JavaScript bundle size
- **Frame Rate** - UI smoothness (60 FPS target)
- **Network Performance** - API response times

### **Performance Benchmarks**
```jsx
const PerformanceBenchmarks = {
  // Target metrics
  TARGET_TTI: 3000, // 3 seconds
  TARGET_FCP: 1500, // 1.5 seconds
  TARGET_MEMORY: 100, // 100MB
  TARGET_BUNDLE_SIZE: 2, // 2MB
  TARGET_FPS: 60,

  // Measurement functions
  measureTTI: () => {
    const startTime = Performance.now();
    return () => Performance.now() - startTime;
  },

  measureMemory: () => {
    if (Performance.memory) {
      return Performance.memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return 0;
  },
};
```

## 🔗 Resources

- [React Native Performance](https://reactnative.dev/docs/performance)
- [Flipper Performance Plugin](https://fbflipper.com/docs/features/react-native/)
- [Firebase Performance Monitoring](https://firebase.google.com/docs/perf-mon)
- [Metro Bundler Optimization](https://facebook.github.io/metro/)

Performance optimization ek continuous process hai - regular monitoring aur improvement zaroori hai! ⚡🚀
