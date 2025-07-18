import { Text, View } from 'react-native'
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const ParallaxEffect = () => {
    const { styles } = useStyles(stylesheet);
    const scrollY = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        }
    });

    const headerStyle = useAnimatedStyle(() => {
        const translateY = interpolate(
            scrollY.value,
            [0, 200],
            [0, -100],
            'clamp'
        );

        const scale = interpolate(
            scrollY.value,
            [0, 200],
            [0, 1.2],
            'clamp'
        );

        return {
            transform: [
                { translateY },
                { scale },
            ]
        }
    })
    return (
        <View style={styles.container}>
            <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
                <Animated.View style={[styles.header,headerStyle]}>
                    <Text style={styles.headerText}>ParallaxEffect Example</Text>
                </Animated.View>
                <View style={styles.box}>
                    <Text style={styles.headerText}>Box</Text>
                </View>


                <View style={styles.box}>
                    <Text style={styles.headerText}>Box</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.headerText}>Box</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.headerText}>Box</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.headerText}>Box</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.headerText}>Box</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.headerText}>Box</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.headerText}>Box</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.headerText}>Box</Text>
                </View>
            </Animated.ScrollView>
        </View>
    )
}

export default ParallaxEffect

const stylesheet = createStyleSheet(theme => ({
    container: {
        flex: 1,
        backgroundColor:theme.colors.bg,
        borderWidth:4
    },
    header:{
        height:200,
        backgroundColor:theme.colors.danger,
        justifyContent:'center',
        alignItems:'center',
    },
    headerText:{
        fontSize:28,
        fontWeight:'bold',
        color:theme.colors.textMuted,
        textAlign:'center'
    },
    box:{
        height:100,
        width:100,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        backgroundColor:theme.colors.secondary,
        borderColor:theme.colors.border,
        borderWidth:2
    }
}))
