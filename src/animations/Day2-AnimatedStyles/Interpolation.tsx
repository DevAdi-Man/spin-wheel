import { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import Animated, { interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
const Interpolation = ({ progress }: { progress: number }) => {
    const { styles } = useStyles(stylesheet);
    const progressValue = useSharedValue(0);

    useEffect(() => {
        progressValue.value = withTiming(progress, { duration: 600 });
    }, [progress]);
    const animatedStyle = useAnimatedStyle(() => {
        const height = interpolate(
            progressValue.value,
            [0, 1],
            [0, SCREEN_HEIGHT],
            'clamp'
        );

        const backgroundColor = interpolateColor(
            progressValue.value,
            [0, 0.5, 1],
            ['#dc2626', '#facc15', '#22c55e'],
        );

        return {
            height,
            backgroundColor,
        }
    })
    return (
        <View style={styles.container}>
            {/* process bar   */}
            <View style={styles.processBarContainer}>
                <Animated.View style={[styles.progressBar, animatedStyle]} />
            </View>
        </View>
    )
}

export default Interpolation

const stylesheet = createStyleSheet(theme => ({
    container: {
        flex: 1,
        // justifyContent:'center',
        // alignItems:'center'
        backgroundColor: "#ffc633",
    },
    processBarContainer: {
        width: 20,
        height: SCREEN_HEIGHT,
        backgroundColor: '#e9ecef',
        overflow: 'hidden',
        borderRadius: 10,
        position: 'relative',
    },
    progressBar: {
        position: 'absolute',
       top: 0, // so it grows upward
        width: '100%',
        borderRadius: 10,
    }
}))
