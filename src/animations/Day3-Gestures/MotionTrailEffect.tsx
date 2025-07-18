import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDecay,
  withSpring,
} from 'react-native-reanimated';

const MotionTrailEffect = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  
  // Trail positions for motion trail effect
  const [trailPositions, setTrailPositions] = useState([]);
  const TRAIL_LENGTH = 6;

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
      
      // Create motion trail effect
      const velocity = Math.sqrt(e.velocityX ** 2 + e.velocityY ** 2);
      
      // Only create trail when moving fast
      if (velocity > 200) {
        const newPosition = { 
          x: e.translationX, 
          y: e.translationY,
          timestamp: Date.now()
        };
        
        setTrailPositions(prev => 
          [newPosition, ...prev.slice(0, TRAIL_LENGTH - 1)]
        );
      }
    })
    .onEnd((e) => {
      // Velocity-based decay animation
      translateX.value = withDecay({
        velocity: e.velocityX,
        clamp: [-200, 200],
      });
      
      translateY.value = withDecay({
        velocity: e.velocityY,
        clamp: [-300, 300],
      });
      
      // Clear trail after gesture ends
      setTimeout(() => setTrailPositions([]), 500);
    });

  // Double tap to reset
  const resetGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      setTrailPositions([]);
    });

  const combinedGesture = Gesture.Simultaneous(gesture, resetGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value }, 
      { translateY: translateY.value }
    ]
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Motion Trail Effect</Text>
      <Text style={styles.instruction}>
        Drag fast to see motion trail effect.{'\n'}
        Double tap to reset position.
      </Text>
      
      <View style={styles.gestureArea}>
        {/* Render trail copies with decreasing opacity */}
        {trailPositions.map((pos, index) => (
          <Animated.View
            key={`${pos.timestamp}-${index}`}
            style={[
              styles.trailBox,
              {
                opacity: (TRAIL_LENGTH - index) / TRAIL_LENGTH * 0.6,
                transform: [
                  { translateX: pos.x },
                  { translateY: pos.y },
                  { scale: 1 - (index * 0.1) } // Decreasing size
                ]
              }
            ]}
          />
        ))}
        
        {/* Main draggable box */}
        <GestureDetector gesture={combinedGesture}>
          <Animated.View style={[styles.box, animatedStyle]}>
            <Text style={styles.boxText}>Drag Fast!</Text>
          </Animated.View>
        </GestureDetector>
      </View>
      
      <View style={styles.info}>
        <Text style={styles.infoText}>
          Trail Length: {TRAIL_LENGTH}{'\n'}
          Velocity Threshold: 200px/s{'\n'}
          Active Trails: {trailPositions.length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#fff',
  },
  instruction: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#ccc',
    lineHeight: 22,
  },
  gestureArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    margin: 10,
    position: 'relative',
  },
  box: {
    width: 60,
    height: 60,
    backgroundColor: '#00ff88',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  trailBox: {
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#00ff88',
    borderRadius: 30,
    top: '50%',
    left: '50%',
    marginTop: -30,
    marginLeft: -30,
  },
  boxText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 10,
  },
  info: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  infoText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
});

export default MotionTrailEffect;
