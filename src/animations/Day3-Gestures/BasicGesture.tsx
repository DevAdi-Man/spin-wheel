import { StyleSheet, Text, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const BasicGesture = () => {
    const { styles } = useStyles(stylesheet);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const context = useSharedValue({ x: 0, y: 0 });

    const gesture = Gesture.Pan().onStart(() => {
        context.value = { x: translateX.value, y: translateY.value };
    }).onUpdate((event) => {
        translateX.value = context.value.x + event.translationX;
        translateY.value = context.value.y + event.translationY;
    }).onEnd(() => {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
    });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value }
        ]
    }));

    return (
        <View style={styles.container}>
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.box, animatedStyle]} />
            </GestureDetector>
        </View>
    )
}

export default BasicGesture

const stylesheet = createStyleSheet(theme => ({
    container: {
        flex: 1,
        backgroundColor: theme.colors.bg,
        borderWidth:2
    },
    box: {
        width: 200,
        height: 200,
        borderRadius: 50,
        backgroundColor: theme.colors.primary
    }
}))
