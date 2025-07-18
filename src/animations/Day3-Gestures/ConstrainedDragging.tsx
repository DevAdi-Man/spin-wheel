import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles'


const {width:SCREEN_WIDTH,height:SCREEN_HEIGHT} = Dimensions.get('window');

const BOX_SIZE = 100;
const BOUNDS = {
    minX: 0,
    maxX: 300,
    minY: 0,
    maxY: 500,
};

const ConstrainedDragging = () => {
    const { styles } = useStyles(stylesheet);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const context = useSharedValue({ x: 0, y: 0 });

    const gesture = Gesture.Pan()
        .onBegin(() => {
            context.value.x = translateX.value
            context.value.y = translateY.value
        })
        .onUpdate((e) => {
            translateX.value = Math.max(BOUNDS.minX, Math.min(BOUNDS.maxX, context.value.x + e.translationX));
            translateY.value = Math.max(BOUNDS.minY, Math.min(BOUNDS.maxY, context.value.y + e.translationY));
        })
        .onEnd(() => {
            translateX.value = withSpring(context.value.x);
            translateY.value = withSpring(context.value.y);
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value }
        ]
    }))
    return (
        <View style={styles.container}>
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.box,animatedStyle]} />
            </GestureDetector>
        </View>
    )
}

export default ConstrainedDragging

const stylesheet = createStyleSheet(theme => ({
    container: {
        flex: 1,
        // alignSelf: 'center',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: theme.colors.bg,
        borderWidth:2,
        width:SCREEN_WIDTH - 50
    },
    box: {
        width: BOX_SIZE,
        height: BOX_SIZE,
        backgroundColor: theme.colors.info,
        // position: 'absolute',
        borderRadius: 80,
        borderWidth:2
    }
}))
