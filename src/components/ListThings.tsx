import React from 'react';
import LottieView from 'lottie-react-native';
import { View, useWindowDimensions } from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    SharedValue
} from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

type Props = {
    item: { text: string; image: any }; // Lottie JSON
    index: number;
    x: SharedValue<number>;
};

const ListThings = ({ item, index, x }: Props) => {
    const { styles } = useStyles(stylesheet);
    const { width: SCREEN_WIDTH } = useWindowDimensions();

    const rnImageStyle = useAnimatedStyle(() => {
        const translateY = interpolate(
            x.value,
            [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
            [100, 0, 100],
            Extrapolation.CLAMP
        );
        const opacity = interpolate(
            x.value,
            [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
            [0, 1, 0],
            Extrapolation.CLAMP
        );
        return {
            opacity,
            width: SCREEN_WIDTH * 0.7,
            height: SCREEN_WIDTH * 0.7,
            transform: [{ translateY }],
        };
    });

    const rnTextStyle = useAnimatedStyle(() => {
        const translateY = interpolate(
            x.value,
            [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
            [100, 0, 100],
            Extrapolation.CLAMP
        );
        const opacity = interpolate(
            x.value,
            [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
            [0, 1, 0],
            Extrapolation.CLAMP
        );
        return {
            opacity,
            transform: [{ translateY }],
        };
    });

    return (
        <View style={[styles.itemContainer, { width: SCREEN_WIDTH }]}>
            <Animated.View style={[rnImageStyle,styles.border]}>
                <LottieView
                    source={item.image}
                    autoPlay
                    loop
                    resizeMode="cover"
                    style={{ width: '100%', height: '100%' }}
                />
            </Animated.View>

            <Animated.Text style={[styles.textItem, rnTextStyle]}>
                {item.text}
            </Animated.Text>
        </View>
    );
};

export default React.memo(ListThings);

const stylesheet = createStyleSheet(() => ({
    itemContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    textItem: {
        fontWeight: '600',
        lineHeight: 41,
        fontSize: 34,
        textAlign: 'center',
        paddingHorizontal: 24,
    },
    border:{
        borderWidth:2
    }
}));

