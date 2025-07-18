import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const DoubleTap = () => {
    const { styles } = useStyles(stylesheet);
    const scale = useSharedValue(1);

    const doubleGesture = Gesture.Tap()
        .numberOfTaps(2)
        .onEnd((_, success) => {
            if (success) {
                scale.value = withTiming(0.5, { duration: 300 }, () => {
                    scale.value = withTiming(1, { duration: 300 })
                })
            }
        });

    const animationStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }))
    return (
        <View style={styles.container}>
            <GestureDetector gesture={doubleGesture} >
                <Animated.View style={[styles.box, animationStyle]} />
            </GestureDetector>
        </View>
    )
}

export default DoubleTap

const stylesheet = createStyleSheet(theme => ({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.bg
    },
    box: {
        width: 200,
        height: 200,
        backgroundColor: theme.colors.primary,
        borderRadius: 40,
    },
}))
