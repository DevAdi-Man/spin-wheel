import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withRepeat,
  withDelay,
  withDecay,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

const AnimationShowcase = () => {
  // Shared values for different animations
  const timingX = useSharedValue(0);
  const springScale = useSharedValue(1);
  const sequenceY = useSharedValue(0);
  const repeatRotation = useSharedValue(0);
  const staggeredBoxes = Array.from({ length: 5 }, () => useSharedValue(0));
  const pulseScale = useSharedValue(1);
  const shakeX = useSharedValue(0);
  const waveY = Array.from({ length: 6 }, () => useSharedValue(0));
  
  // Auto-start some animations
  useEffect(() => {
    // Pulse animation
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      false
    );
    
    // Wave animation
    const startWave = () => {
      waveY.forEach((wave, index) => {
        wave.value = withDelay(
          index * 100,
          withRepeat(
            withSequence(
              withTiming(-20, { duration: 400 }),
              withTiming(0, { duration: 400 })
            ),
            -1,
            false
          )
        );
      });
    };
    startWave();
    
    return () => {
      // Cleanup animations
      cancelAnimation(pulseScale);
      waveY.forEach(wave => cancelAnimation(wave));
    };
  }, []);
  
  // Animation functions
  const runTimingAnimation = () => {
    timingX.value = withTiming(
      timingX.value === 0 ? 150 : 0,
      {
        duration: 1000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }
    );
  };
  
  const runSpringAnimation = () => {
    springScale.value = withSpring(
      springScale.value === 1 ? 1.5 : 1,
      {
        damping: 8,
        stiffness: 100,
      }
    );
  };
  
  const runSequenceAnimation = () => {
    sequenceY.value = withSequence(
      withTiming(-50, { duration: 300 }),
      withTiming(50, { duration: 300 }),
      withSpring(0, { damping: 10 })
    );
  };
  
  const runRepeatAnimation = () => {
    if (repeatRotation.value === 0) {
      repeatRotation.value = withRepeat(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        3,
        false,
        () => {
          repeatRotation.value = 0;
        }
      );
    } else {
      cancelAnimation(repeatRotation);
      repeatRotation.value = withTiming(0);
    }
  };
  
  const runStaggeredAnimation = () => {
    staggeredBoxes.forEach((box, index) => {
      box.value = withDelay(
        index * 100,
        withSequence(
          withTiming(100, { duration: 300 }),
          withTiming(0, { duration: 300 })
        )
      );
    });
  };
  
  const runShakeAnimation = () => {
    shakeX.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      ),
      2,
      false
    );
  };
  
  // Animated styles
  const timingStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: timingX.value }],
  }));
  
  const springStyle = useAnimatedStyle(() => ({
    transform: [{ scale: springScale.value }],
  }));
  
  const sequenceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sequenceY.value }],
  }));
  
  const repeatStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${repeatRotation.value}deg` }],
  }));
  
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));
  
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Advanced Animation Showcase</Text>
      
      {/* Timing Animation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>withTiming - Bezier Easing</Text>
        <View style={styles.animationContainer}>
          <Animated.View style={[styles.box, styles.timingBox, timingStyle]} />
        </View>
        <Pressable style={styles.button} onPress={runTimingAnimation}>
          <Text style={styles.buttonText}>Run Timing</Text>
        </Pressable>
      </View>
      
      {/* Spring Animation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>withSpring - Bouncy Scale</Text>
        <View style={styles.animationContainer}>
          <Animated.View style={[styles.box, styles.springBox, springStyle]} />
        </View>
        <Pressable style={styles.button} onPress={runSpringAnimation}>
          <Text style={styles.buttonText}>Run Spring</Text>
        </Pressable>
      </View>
      
      {/* Sequence Animation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>withSequence - Multi-step</Text>
        <View style={styles.animationContainer}>
          <Animated.View style={[styles.box, styles.sequenceBox, sequenceStyle]} />
        </View>
        <Pressable style={styles.button} onPress={runSequenceAnimation}>
          <Text style={styles.buttonText}>Run Sequence</Text>
        </Pressable>
      </View>
      
      {/* Repeat Animation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>withRepeat - Rotation</Text>
        <View style={styles.animationContainer}>
          <Animated.View style={[styles.box, styles.repeatBox, repeatStyle]} />
        </View>
        <Pressable style={styles.button} onPress={runRepeatAnimation}>
          <Text style={styles.buttonText}>Toggle Repeat</Text>
        </Pressable>
      </View>
      
      {/* Staggered Animation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>withDelay - Staggered</Text>
        <View style={[styles.animationContainer, styles.staggeredContainer]}>
          {staggeredBoxes.map((box, index) => {
            const staggeredStyle = useAnimatedStyle(() => ({
              transform: [{ translateY: box.value }],
            }));
            
            return (
              <Animated.View
                key={index}
                style={[styles.smallBox, styles.staggeredBox, staggeredStyle]}
              />
            );
          })}
        </View>
        <Pressable style={styles.button} onPress={runStaggeredAnimation}>
          <Text style={styles.buttonText}>Run Staggered</Text>
        </Pressable>
      </View>
      
      {/* Auto Pulse Animation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Auto Pulse - Infinite Loop</Text>
        <View style={styles.animationContainer}>
          <Animated.View style={[styles.box, styles.pulseBox, pulseStyle]} />
        </View>
        <Text style={styles.autoText}>Runs automatically</Text>
      </View>
      
      {/* Shake Animation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shake Effect</Text>
        <View style={styles.animationContainer}>
          <Animated.View style={[styles.box, styles.shakeBox, shakeStyle]} />
        </View>
        <Pressable style={styles.button} onPress={runShakeAnimation}>
          <Text style={styles.buttonText}>Shake It!</Text>
        </Pressable>
      </View>
      
      {/* Wave Animation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wave Effect - Auto Loop</Text>
        <View style={[styles.animationContainer, styles.waveContainer]}>
          {waveY.map((wave, index) => {
            const waveStyle = useAnimatedStyle(() => ({
              transform: [{ translateY: wave.value }],
            }));
            
            return (
              <Animated.View
                key={index}
                style={[styles.waveBar, waveStyle]}
              />
            );
          })}
        </View>
        <Text style={styles.autoText}>Continuous wave motion</Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Experiment with different animation combinations!
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#2d3436',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2d3436',
    textAlign: 'center',
  },
  animationContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  staggeredContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  waveContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 60,
  },
  box: {
    width: 60,
    height: 60,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  smallBox: {
    width: 30,
    height: 30,
    borderRadius: 5,
  },
  timingBox: {
    backgroundColor: '#74b9ff',
  },
  springBox: {
    backgroundColor: '#00b894',
  },
  sequenceBox: {
    backgroundColor: '#fd79a8',
  },
  repeatBox: {
    backgroundColor: '#fdcb6e',
  },
  staggeredBox: {
    backgroundColor: '#6c5ce7',
  },
  pulseBox: {
    backgroundColor: '#e17055',
  },
  shakeBox: {
    backgroundColor: '#a29bfe',
  },
  waveBar: {
    width: 8,
    height: 30,
    backgroundColor: '#00cec9',
    borderRadius: 4,
  },
  button: {
    backgroundColor: '#0984e3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  autoText: {
    textAlign: 'center',
    color: '#636e72',
    fontStyle: 'italic',
    fontSize: 14,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#74b9ff',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default AnimationShowcase;
