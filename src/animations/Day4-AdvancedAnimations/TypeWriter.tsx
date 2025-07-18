import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles'

interface TypeWriterProps {
    text: string;
    speed?: number;
    showcursor?: boolean
}

const TypeWriter: React.FC<TypeWriterProps> = ({ text, speed, showcursor }) => {
    const [displayText, setDisplayText] = useState('');
    const [index, setIndex] = useState(0);
    const cursorOpacity = useSharedValue(1);
    const { styles } = useStyles(stylesheet);

    // TypeWriter effect
    useEffect(() => {
        if (index < text.length) {
            const timer = setTimeout(() => {
                setDisplayText(prev => prev + text[index]);
                setIndex(prev => prev + 1);
            }, speed);

            return () => clearTimeout(timer);
        }
    }, [index, text, speed]);

    //cursor animation
    useEffect(() => {
        if (showcursor) {
            cursorOpacity.value = withRepeat(
                withSequence(
                    withTiming(0, { duration: 500 }),
                    withTiming(1, { duration: 500 })
                ),
                -1,
                true
            );
        }
    }, [showcursor]);

    const cursorStyle = useAnimatedStyle(() => ({
        opacity: cursorOpacity.value
    }));

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                {displayText}
                {showcursor && (
                    <Animated.Text style={[styles.cursor, cursorStyle]}>
                        |
                    </Animated.Text>
                )}
            </Text>
        </View>
    )
}

export default TypeWriter

const stylesheet = createStyleSheet(theme => ({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: theme.colors.secondary,
    },
    cursor: {
        fontSize: 18,
        color: theme.colors.secondary,
        fontWeight: 'bold',
    }
}))
