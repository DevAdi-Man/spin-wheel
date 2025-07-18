import Animated, {
  withTiming,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { View, Text } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

export const Animate = () => {
  const { styles } = useStyles(stylesheet);
  const opacityValue = useSharedValue(1);

  const gesture = Gesture.Tap()
    .onBegin(() => {
      console.log('Tap began!'); // Debug log
      opacityValue.value = withTiming(0.5, { duration: 200 }); // ✅ Animate to 0.5
    })
    .onFinalize(() => {
      console.log('Tap finalized!'); // Debug log
      opacityValue.value = withTiming(1, { duration: 100 });   // ✅ Animate to 1
    });

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacityValue.value,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tap the box below</Text>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.box, animatedStyle]} />
      </GestureDetector>
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    padding: 20,
  },
  title: {
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 30,
    textAlign: 'center',
  },
  box: {
    width: 200,
    height: 200,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
  },
}));
