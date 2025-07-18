import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import Animated, { useAnimatedStyle, useSharedValue, withDecay, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

const Dot = ({delay}: {delay:number}) => {
    const {styles} = useStyles(stylessheet);
    const transitionY = useSharedValue(0);

    useEffect(()=>{
        transitionY.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(-8,{duration:300}),
                    withTiming(0,{duration:300})
                ),
                -1,
                true,
            )
        )
    },[delay]);

    const animationStyle = useAnimatedStyle(()=>{
        return {
            transform : [{translateY:transitionY.value}]
        }
    })
  return (
    <Animated.View style={[styles.container,animationStyle]} />
)
}

export default Dot

const stylessheet = createStyleSheet(theme=> ( {
    container : {
        width:20,
        height:20,
        borderRadius:10,
        backgroundColor:theme.colors.secondary
    }
}))