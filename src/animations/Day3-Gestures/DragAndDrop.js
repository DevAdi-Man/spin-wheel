import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const DragAndDrop = () => {
  // Shared values for position
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  
  // Context to store initial values
  const context = useSharedValue({ x: 0, y: 0 });
  
  // State for feedback
  const [gestureInfo, setGestureInfo] = React.useState('Drag the box!');
  
  // Update gesture info
  const updateGestureInfo = (info) => {
    setGestureInfo(info);
  };
  
  // Snap to grid function
  const snapToGrid = (value, gridSize = 50) => {
    'worklet';
    return Math.round(value / gridSize) * gridSize;
  };
  
  // Check boundaries
  const constrainToBounds = (value, min, max) => {
    'worklet';
    return Math.max(min, Math.min(max, value));
  };
  
  // Pan gesture with advanced features
  const panGesture = Gesture.Pan()
    .onStart(() => {
      // Store initial position
      context.value = { x: translateX.value, y: translateY.value };
      
      // Visual feedback
      scale.value = withSpring(1.1);
      opacity.value = withTiming(0.8);
      
      runOnJS(updateGestureInfo)('Dragging...');
    })
    .onUpdate((event) => {
      // Calculate new position with constraints
      const newX = constrainToBounds(
        context.value.x + event.translationX,
        -SCREEN_WIDTH / 2 + 50,
        SCREEN_WIDTH / 2 - 50
      );
      
      const newY = constrainToBounds(
        context.value.y + event.translationY,
        -SCREEN_HEIGHT / 2 + 100,
        SCREEN_HEIGHT / 2 - 100
      );
      
      translateX.value = newX;
      translateY.value = newY;
    })
    .onEnd((event) => {
      // Reset visual feedback
      scale.value = withSpring(1);
      opacity.value = withTiming(1);
      
      // Check velocity for fling effect
      const { velocityX, velocityY } = event;
      const hasHighVelocity = Math.abs(velocityX) > 500 || Math.abs(velocityY) > 500;
      
      if (hasHighVelocity) {
        // Fling animation
        runOnJS(updateGestureInfo)('Fling detected!');
        
        // Calculate final position based on velocity
        const finalX = constrainToBounds(
          translateX.value + velocityX * 0.001,
          -SCREEN_WIDTH / 2 + 50,
          SCREEN_WIDTH / 2 - 50
        );
        
        const finalY = constrainToBounds(
          translateY.value + velocityY * 0.001,
          -SCREEN_HEIGHT / 2 + 100,
          SCREEN_HEIGHT / 2 - 100
        );
        
        translateX.value = withSpring(finalX, { damping: 10 });
        translateY.value = withSpring(finalY, { damping: 10 });
      } else {
        // Snap to grid
        runOnJS(updateGestureInfo)('Snapping to grid...');
        
        translateX.value = withSpring(snapToGrid(translateX.value));
        translateY.value = withSpring(snapToGrid(translateY.value));
      }
      
      // Reset info after delay
      setTimeout(() => {
        runOnJS(updateGestureInfo)('Drag the box!');
      }, 1500);
    });
  
  // Double tap to reset
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      runOnJS(updateGestureInfo)('Reset to center!');
      
      setTimeout(() => {
        runOnJS(updateGestureInfo)('Drag the box!');
      }, 1000);
    });
  
  // Long press for special effect
  const longPressGesture = Gesture.LongPress()
    .minDuration(800)
    .onStart(() => {
      scale.value = withSpring(1.3);
      runOnJS(updateGestureInfo)('Long press detected!');
    })
    .onEnd(() => {
      scale.value = withSpring(1);
      setTimeout(() => {
        runOnJS(updateGestureInfo)('Drag the box!');
      }, 1000);
    });
  
  // Combine gestures
  const combinedGesture = Gesture.Simultaneous(
    panGesture,
    doubleTapGesture,
    longPressGesture
  );
  
  // Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));
  
  // Grid lines style
  const gridStyle = useAnimatedStyle(() => ({
    opacity: scale.value > 1 ? 0.3 : 0,
  }));
  
  return (
    <View style={styles.container}>
      {/* Grid lines for visual feedback */}
      <Animated.View style={[styles.grid, gridStyle]}>
        {Array.from({ length: 20 }, (_, i) => (
          <View key={`v-${i}`} style={[styles.gridLine, { left: i * 50 }]} />
        ))}
        {Array.from({ length: 30 }, (_, i) => (
          <View key={`h-${i}`} style={[styles.gridLineH, { top: i * 50 }]} />
        ))}
      </Animated.View>
      
      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.title}>Drag & Drop Demo</Text>
        <Text style={styles.subtitle}>{gestureInfo}</Text>
        <Text style={styles.hint}>
          • Drag to move{'\n'}
          • Double tap to reset{'\n'}
          • Long press for effect{'\n'}
          • Fling for momentum
        </Text>
      </View>
      
      {/* Draggable box */}
      <GestureDetector gesture={combinedGesture}>
        <Animated.View style={[styles.box, animatedStyle]}>
          <Text style={styles.boxText}>📦</Text>
        </Animated.View>
      </GestureDetector>
      
      {/* Position indicator */}
      <View style={styles.positionIndicator}>
        <Text style={styles.positionText}>
          X: {Math.round(translateX.value || 0)}, Y: {Math.round(translateY.value || 0)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#dee2e6',
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#dee2e6',
  },
  instructions: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#636e72',
    marginBottom: 15,
    fontWeight: '500',
  },
  hint: {
    fontSize: 14,
    color: '#74b9ff',
    textAlign: 'center',
    lineHeight: 20,
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: '#6c5ce7',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  boxText: {
    fontSize: 30,
  },
  positionIndicator: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  positionText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'monospace',
  },
});

export default DragAndDrop;
