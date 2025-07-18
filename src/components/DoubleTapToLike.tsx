import React, { useState } from 'react';
import { ImageSourcePropType, StyleSheet, Text, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withDelay, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles'
type DoubleTapToLikeProps = {
    imageUrl: string
}

const DoubleTapToLike: React.FC<DoubleTapToLikeProps> = ({ imageUrl }) => {
    const { styles } = useStyles(stylesheet);

    const scale = useSharedValue(0);
    const opacity = useSharedValue(0);

    const LikeGesture = Gesture.Tap()
        .numberOfTaps(2)
        .onEnd((event, success) => {
            'worklet';
            if (success) {
                console.log('DoubleTabed');
                //show heart

                // Instagram-style bounce animation
                scale.value = withSequence(
                    withSpring(0.8, { damping: 15, stiffness: 400 }),  // Quick shrink
                    withSpring(1.2, { damping: 15, stiffness: 400 }),  // Pop up
                    withSpring(1.0, { damping: 15, stiffness: 400 }),  // Settle
                    withDelay(600, withSpring(0, { damping: 15 }))     // Fade out after delay
                );

                // Smooth opacity animation
                opacity.value = withSequence(
                    withTiming(1, { duration: 150 }),                  // Quick appear
                    withDelay(700, withTiming(0, { duration: 400 }))   // Slow fade out
                );
            }
        })


    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value }
        ],
        opacity: opacity.value
    }))
    return (
        <View style={styles.container}>
            <GestureDetector gesture={LikeGesture}>
                <Animated.Image style={styles.Imagecontainer} source={{ uri: imageUrl } as ImageSourcePropType} />
            </GestureDetector>
            <Animated.Image style={[styles.heartContainer, animatedStyle]} source={require('../../assets/heart.png')} />
        </View>
    )
}

export default DoubleTapToLike

const stylesheet = createStyleSheet(theme => ({
    container: {
        flex: 1,
        // borderWidth:2
    },
    Imagecontainer: {
        width: '100%',
        height: '100%',
    },
    heartContainer: {
        position: 'absolute',
        zIndex: 1,
        width: 100,
        height: 100,
        top: '45%',
        left: '41%'
    },

}))
