import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { TaskInterface } from './SwipToDelete'
import React from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { FontAwesome5 } from '@expo/vector-icons';

interface ListItemsProps {
    task: TaskInterface;
    onDismiss?: (taks: TaskInterface) => void;
}
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TRANSLATE_X_THRESTHOLD = -SCREEN_WIDTH * 0.3;

const LISTITEM_HEIGHT = 70;

const ListItems: React.FC<ListItemsProps> = ({ task, onDismiss }) => {
    const { styles } = useStyles(stylesheet);
    const translateX = useSharedValue(0);
    const itemHeight = useSharedValue(LISTITEM_HEIGHT);
    const marginVertical = useSharedValue(10);
    const opacity = useSharedValue(1);

    const gesture = Gesture.Pan()
        .activeOffsetX([-10, 10])
        .failOffsetY([-5, 5])
        .onUpdate((event) => {
            translateX.value = event.translationX;
            // console.log(translateX.value);
        })
        .onEnd(() => {
            const shouldBeDismissed = translateX.value < TRANSLATE_X_THRESTHOLD;
            if (shouldBeDismissed) {
                translateX.value = withTiming(-SCREEN_WIDTH);
                itemHeight.value = withTiming(0);
                marginVertical.value = withTiming(0);
                opacity.value = withTiming(0, undefined, (isFinisted) => {
                    if (isFinisted && onDismiss) {
                        runOnJS(onDismiss)(task)
                    }
                });
            } else {
                translateX.value = withTiming(0, { duration: 100 });
            }
        });
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }]
    }));

    const rIconAnimatedStyle = useAnimatedStyle(() => {
        const opacity = withTiming(translateX.value < TRANSLATE_X_THRESTHOLD ? 1 : 0);
        return {
            opacity
        }
    });

    const rTaskContainerStyle = useAnimatedStyle(() => {

        return {
            height: itemHeight.value,
            marginVertical: marginVertical.value,
            opacity: opacity.value
        }
    })
    return (
        <Animated.View style={[styles.taskContainer, rTaskContainerStyle]}>
            <Animated.View style={[styles.iconContainer, rIconAnimatedStyle]}>
                <FontAwesome5 name={'trash-alt'} size={70 * 0.4} color={'red'} />
            </Animated.View>
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.task, animatedStyle]}>
                    <Text>{task.title}</Text>
                </Animated.View>
            </GestureDetector>
        </Animated.View>
    )
}

export default ListItems

const stylesheet = createStyleSheet(theme => ({
    taskContainer: {
        width: '100%',
        alignItems: 'center',
    },
    task: {
        width: '90%',
        height: LISTITEM_HEIGHT,
        backgroundColor: theme.colors.bg,
        paddingLeft: 20,
        justifyContent: 'center',
        shadowOpacity: 0.09,
        borderRadius: 10,
        elevation: 6
    },
    taskTitle: {
        fontSize: 18,
    },
    iconContainer: {
        width: LISTITEM_HEIGHT,
        height: LISTITEM_HEIGHT,
        position: 'absolute',
        right: '10%',
        alignItems: 'center',
        justifyContent: 'center'
    }
}))
