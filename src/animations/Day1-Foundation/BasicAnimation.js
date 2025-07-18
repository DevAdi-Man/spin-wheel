import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const BasicAnimation = () => {
  // Shared values - ye UI thread pe accessible hain
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  // Animated style - ye automatically update hota hai jab shared values change hote hain
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  // Animation functions
  const moveBox = () => {
    translateX.value = withTiming(translateX.value === 0 ? 200 : 0, {
      duration: 1000,
    });
  };

  const fadeBox = () => {
    opacity.value = withTiming(opacity.value === 1 ? 0.3 : 1, {
      duration: 800,
    });
  };

  const scaleBox = () => {
    scale.value = withTiming(scale.value === 1 ? 1.5 : 1, {
      duration: 600,
    });
  };

  const resetAll = () => {
    translateX.value = withTiming(0);
    opacity.value = withTiming(1);
    scale.value = withTiming(1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Basic Animations</Text>

      {/* Animated Box */}
      <Animated.View style={[styles.box, animatedStyle]} />

      {/* Control Buttons */}
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={moveBox}>
          <Text style={styles.buttonText}>Move</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={fadeBox}>
          <Text style={styles.buttonText}>Fade</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={scaleBox}>
          <Text style={styles.buttonText}>Scale</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.resetButton]} onPress={resetAll}>
          <Text style={styles.buttonText}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 50,
    color: '#333',
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: '#3498db',
    borderRadius: 10,
    marginBottom: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  button: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    margin: 5,
  },
  resetButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default BasicAnimation;
