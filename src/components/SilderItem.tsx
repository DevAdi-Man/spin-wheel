import React from 'react';
import { Text, View, Image, Dimensions } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { ItemData } from './Carousel';
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';


type SliderItemProp = {
    item: ItemData,
    index: number,
    scrollX: SharedValue<number>
}
export const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SilderItem: React.FC<SliderItemProp> = ({ item, index, scrollX }) => {
    const { styles } = useStyles(stylesheet);

    const rAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: interpolate(
                        scrollX.value,
                        [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
                        [-SCREEN_WIDTH * 0.25, 0, SCREEN_WIDTH * 0.25],
                        Extrapolation.CLAMP
                    )
                },
                {
                    scale: interpolate(
                        scrollX.value,
                        [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
                        [0.9,1,0.9],
                        Extrapolation.CLAMP
                    )
                }
            ]
        }
    })
    return (
        <Animated.View style={[styles.container,rAnimatedStyle]}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.background}>
                <Text style={styles.text}>{item.description}</Text>
            </LinearGradient>

        </Animated.View>
    )
}

export default SilderItem

const stylesheet = createStyleSheet(theme => ({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: SCREEN_WIDTH - 8.5 ,
        flex:1,
        // gap:15,
        borderWidth:2,
        borderColor:'red'
    },
    image: {
        width: 300,
        height: 500,
        borderRadius: 20,
        // borderWidth:2
    },
    background: {
        position: 'absolute',
        height: 500,
        width: 300,
        padding: 20,
        borderRadius: 20,
        justifyContent: 'flex-end',
    },
    text: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600'
    }
}))
