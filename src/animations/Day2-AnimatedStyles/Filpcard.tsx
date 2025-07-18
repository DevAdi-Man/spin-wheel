import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles'


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const card_width = SCREEN_WIDTH * 0.7;
const card_height = SCREEN_HEIGHT * 1.2;


const Filpcard = () => {
    const { styles } = useStyles(stylesheet);
    const rotateY = useSharedValue(0);

    const frontAnimatedStyle = useAnimatedStyle(()=>{
        const rotateValue = interpolate(
            rotateY.value,
            [0,1],
            [0,180],
            'clamp'
        );

        return {
            transform : [
                {rotateY: `${rotateValue}deg`}
            ],
            backfaceVisibility:'hidden'
        }
    });

    const backAnimatedStyle = useAnimatedStyle(()=>{
        const rotateValue = interpolate(
            rotateY.value,
            [0,1],
            [180,360],
            'clamp'
        );

        return {
            transform :[
                {rotateY: `${rotateValue}deg`}
            ],
            backfaceVisibility:'hidden'
        }
    });

    const flipcard = ()=>{
        rotateY.value = withTiming(rotateY.value === 0 ? 1 : 0,{duration:7000});
    }
    return (
        <Pressable onPress={flipcard}>
            <View style={styles.Cardcontainer}>
                <Animated.View style={[styles.card,styles.cardFront,frontAnimatedStyle]}>
                    <Text>font</Text>
                </Animated.View>
                <Animated.View style={[styles.card,styles.cardBack,backAnimatedStyle]}>
                    <Text>back</Text>
                </Animated.View>
            </View>
        </Pressable>
    )
}

export default Filpcard

const stylesheet = createStyleSheet(theme => ({
    Cardcontainer: {
        width:300,
        height: 500,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 40,
        perspective: 1000,
    },
    card: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent:'center',
        borderRadius:16,
        // backfaceVisibility:'hidden',
    },
    cardFront:{
        backgroundColor:theme.colors.primary,
    },
    cardBack:{
        backgroundColor:theme.colors.secondary,
    }
}))
