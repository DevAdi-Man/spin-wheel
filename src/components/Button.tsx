import {
    ImageURISource,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import React, { useCallback } from 'react';
import Animated, {
    useAnimatedStyle,
    withSpring,
    withTiming,
    SharedValue
} from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useNavigation } from '@react-navigation/native';

type Props = {
    currentIndex: SharedValue<number>;
    length: number;
    flatListRef: any;
};
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackProps } from '../navigation/Appstack2'; // import from the correct path
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationType = NativeStackNavigationProp<StackProps, 'onBoarding'>;

const Button = ({ currentIndex, length, flatListRef }: Props) => {
    const { styles } = useStyles(stylesheet);
    const navigation = useNavigation<NavigationType>();
    const rnBtnStyle = useAnimatedStyle(() => {
        return {
            width:
                currentIndex.value === length - 1 ? withSpring(140) : withSpring(60),
            height: 60,
        };
    }, [currentIndex, length]);

    const rnTextStyle = useAnimatedStyle(() => {
        return {
            opacity:
                currentIndex.value === length - 1 ? withTiming(1) : withTiming(0),
            transform: [
                {
                    translateX:
                        currentIndex.value === length - 1 ? withTiming(0) : withTiming(100),
                },
            ],
        };
    }, [currentIndex, length]);

    const imageAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity:
                currentIndex.value !== length - 1 ? withTiming(1) : withTiming(0),
            transform: [
                {
                    translateX:
                        currentIndex.value !== length - 1 ? withTiming(0) : withTiming(100),
                },
            ],
        };
    }, [currentIndex, length]);

    const onPress = useCallback(async () => {
        if (currentIndex.value === length - 1) {
            console.log('Get Started');
            await AsyncStorage.setItem('hasOnboarded', 'true');
            navigation.navigate('Main');
        } else {
            flatListRef?.current?.scrollToIndex({
                index: currentIndex.value + 1,
            });
        }
    }, []);
    return (
        <AnimatedPressable style={[styles.container, rnBtnStyle]} onPress={onPress}>
            <Animated.Text style={[styles.textStyle, rnTextStyle]}>
                Get Started
            </Animated.Text>
            <Animated.Image
                source={require('../../assets/arrow.png')}
                style={[styles.imageStyle, imageAnimatedStyle]}
            />
        </AnimatedPressable>
    );
};

export default Button;

const stylesheet = createStyleSheet(theme => ({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 100,
        backgroundColor: '#304FFE',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    textStyle: {
        color: 'white',
        position: 'absolute',
        fontWeight: '600',
        fontSize: 16,
    },
    imageStyle: {
        width: 24,
        height: 24,
        position: 'absolute',
    },
}))
