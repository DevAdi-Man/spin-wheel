import React from 'react'
import { View, ImageSourcePropType } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'



type PinchToZoomProp = {
    imageUrl: string
}

const PinchToZoom: React.FC<PinchToZoomProp> = ({ imageUrl }) => {
    const { styles } = useStyles(stylesheet);
    const scale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const focusX = useSharedValue(0);
    const focusY = useSharedValue(0);

    const ImageGesture = Gesture.Pinch()
        .onBegin((event) => {
            focusX.value = event.focalX;
            focusY.value = event.focalY;
        })
        .onUpdate((event) => {
            //calculate the scale
            scale.value = event.scale;

            // Calculate translation based on focal point
            // This ensure pinch happened from the pinch point, not from center
            const deltaX = event.focalX - focusX.value;
            const deltaY = event.focalY - focusY.value;

            translateX.value = deltaX + (focusX.value - 250) * (event.scale - 1); //250 half of image width
            translateY.value = deltaY + (focusY.value - 250) * (event.scale - 1); //250 half of image height
        })
        .onEnd(() => {
            // Reset to original
            translateX.value = withSpring(0);
            translateY.value = withSpring(0);
            scale.value = withSpring(1);
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { translateX: translateX.value },
            { translateY: translateY.value }
        ]
    }))
    return (
        <GestureDetector gesture={ImageGesture}>
            <Animated.Image style={[styles.container, animatedStyle]} source={({ uri: imageUrl }) as ImageSourcePropType} />
        </GestureDetector>
    )
}

export default PinchToZoom

const stylesheet = createStyleSheet(theme => ({
    container: {
        flex: 1,
        width: 500,
        height: 500
    }
}))
