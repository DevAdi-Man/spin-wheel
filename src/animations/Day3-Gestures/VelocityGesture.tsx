import { StyleSheet, Text, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue, withDecay, withDelay, withSpring } from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const VelocityGesture = () => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const { styles } = useStyles(stylesheet);

    const gesture = Gesture.Pan()
        .onUpdate((e) => {
            translateX.value = e.translationX;
            translateY.value = e.translationY;
        })
        .onEnd((e) => {
            translateX.value = withDecay({
                velocity: e.translationX,
                clamp: [-200, 200]
            });
            translateY.value = withDecay({
                velocity: e.translationY,
                clamp: [-300, 300]
            })
        });

    const tapgesture = Gesture.Tap()
        .numberOfTaps(2)
        .onEnd(() => {
            translateX.value = withSpring(0);
            translateY.value = withSpring(0);
        });

    const cominedGesture = Gesture.Simultaneous(gesture, tapgesture);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }, { translateY: translateY.value }]
    }))
    return (
        <GestureDetector gesture={cominedGesture}>
            <Animated.View style={[styles.box,animatedStyle]} />
        </GestureDetector>
    )
}

export default VelocityGesture

const stylesheet = createStyleSheet(theme => ({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    box: {
        width: 200,
        height: 200,
        backgroundColor: theme.colors.warning,
        borderRadius: 50,
    }
}))
