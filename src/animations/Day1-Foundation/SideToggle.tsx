import { Pressable, Text, View } from 'react-native'
import React, { useState } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const SlideToggle = () => {
    const { styles } = useStyles(stylesheet);
    const toggleValue = useSharedValue(0);
    const [toggleState,setToggleState] = useState(0);

    const animatedStyle = useAnimatedStyle(()=>{
        return {
            left: withTiming(toggleValue.value === 0 ? 47 : 0,{duration:250}),
        };
    })

    const handleToggle = ()=>{
        const newValue = toggleValue.value === 1 ? 0 : 1;
        toggleValue.value = newValue;

        runOnJS(setToggleState)(newValue);
    }
    return (
        <Pressable onPress={handleToggle} style={styles.container}>
            <Animated.View style={[styles.slideContainer,animatedStyle]}>
             <Text style={styles.title}>{toggleState === 1 ? 'On' : 'Off'}</Text>
            </Animated.View>
        </Pressable>
    )
}

export default SlideToggle

const stylesheet = createStyleSheet(theme => ({
    container: {
        flexDirection: 'row',
        borderWidth: 2,
        paddingHorizontal: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ccc',
        padding: 2,
        width: 100,
        alignItems: 'center',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '500',
        paddingHorizontal: 10,
        //paddingVertical:5,
    },
    slideContainer: {
        position: 'absolute', // for animation later
        left: 2,              // will animate this later
        width: 50,
        height: 36,
        backgroundColor: '#0000FF',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    }
}))
