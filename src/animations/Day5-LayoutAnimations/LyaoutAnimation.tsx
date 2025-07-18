import { StyleSheet, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { Easing, BounceIn, FadeIn, SlideInLeft, SlideInUp, ZoomIn } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const CustomLyaoutAnimation = () => {
    const { styles } = useStyles(stylesheet);
    return (
        <View style={styles.container}>
            <ScrollView>
                <Animated.View entering={FadeIn} style={[styles.Box, styles.FadeInStyle]}>
                    <Text>Fade in Animation</Text>
                </Animated.View>

                <Animated.View entering={SlideInUp.duration(800)} style={[styles.Box, styles.SlideInUp]}>
                    <Text>Slide in with custom duration </Text>
                </Animated.View>

                <Animated.View entering={ZoomIn.delay(500)} style={[styles.Box, styles.ZoomIn]}>
                    <Text>Zoom in with custom duration </Text>
                </Animated.View>

                <Animated.View entering={BounceIn.easing(Easing.bezier(0.25, 0.1, 0.25, 1))} style={[styles.Box, styles.BounceIn]}>
                    <Text>Bounce in with custom easing</Text>
                </Animated.View>

                <Animated.View entering={SlideInLeft.duration(600).delay(200).springify()} style={[styles.Box, styles.SlideInLeft]}>
                    <Text>Complex entering animation</Text>
                </Animated.View>
            </ScrollView>
        </View>
    )
}

export default CustomLyaoutAnimation

const stylesheet = createStyleSheet(theme => ({
    container: {
        flex: 1,
        backgroundColor: theme.colors.bg,
        justifyContent: 'center',
        alignItems: 'center'
    },
    Box: {
        width: 200,
        height: 200,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    FadeInStyle: {
        backgroundColor: '#32a852',
    },
    SlideInUp: {
        backgroundColor: '#6fa832',
    },
    ZoomIn: {
        backgroundColor: '#6fa832',
    },
    BounceIn: {
        backgroundColor: '#6fa832',
    },
    SlideInLeft: {
        backgroundColor: '#6fa832',
    },
}))
