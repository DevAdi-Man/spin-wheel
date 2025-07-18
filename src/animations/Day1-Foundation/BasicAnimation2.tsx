import { Pressable, Text, View } from "react-native";
import React, { useEffect } from "react";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import PulseEffect from "./PulseEffect";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import Dot from "./Dot";
import SlideToggle from "./SideToggle";
import Interpolation from "../Day2-AnimatedStyles/Interpolation";
import InterpolationExamples from "../Day2-AnimatedStyles/InterpolationExamples";
const BasicAnimation2 = () => {
    const { styles } = useStyles(stylessheet);
    const transtionX = useSharedValue(0);
    const opacity = useSharedValue(1);
    const scale = useSharedValue(1);
    const rotation = useSharedValue(0);
    const rotateY = useSharedValue(0);
    const radius = useSharedValue(0);

    const animationStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { perspective: 1000 },
                { translateX: transtionX.value },
                { rotate: `${rotation.value}deg` },
                { rotateY: `${rotateY.value}deg` },
                { scale: scale.value },
            ],
            opacity: opacity.value,
            borderRadius: radius.value,
        };
    });

    //Animation Fuctions
    const move = () => {
        transtionX.value = withTiming(transtionX.value === 0 ? 200 : 0, {
            duration: 1000,
        });
    };

    const fadebox = () => {
        opacity.value = withTiming(opacity.value === 1 ? 0.4 : 0.2, {
            duration: 1000,
        });
    };

    const scaleBox = () => {
        scale.value = withTiming(scale.value === 1 ? 2.5 : 0, {
            duration: 600,
        });
    };

    const rotateBoxY = () => {
        rotateY.value = withTiming(rotateY.value + 180, { duration: 3000 });
    };

    const rotateBox = () => {
        rotation.value = withTiming((rotation.value + 360) * 2, { duration: 500 });
    };

    // Multiple boxes ko different directions mein move karo
    const radiusBox = () => {
        opacity.value = withTiming(opacity.value === 1 ? 0.6 : 0.2, {
            duration: 500,
        });
        radius.value = withTiming(radius.value === 10 ? 50 : 10, { duration: 700 });
        scale.value = withTiming(scale.value === 1 ? 2.0 : 0.7, { duration: 1000 });
        transtionX.value = withTiming(transtionX.value === 0 ? 150 : -200, {
            duration: 1200,
        });
    };

    // 🔥 Challenge Animations
    //   Breathing Button
    useEffect(() => {
        scale.value = withRepeat(
            withSequence(
                withTiming(1.2, { duration: 700 }),
                withTiming(1.0, { duration: 700 })
            ),
            -1, //means infinite
            true
        );
    }, []);
    const resetAll = () => {
        transtionX.value = withTiming(0);
        opacity.value = withTiming(1);
        scale.value = withTiming(1);
        rotation.value = withTiming(0);
        radius.value = withTiming(0);
    };
    return (
        <View style={styles.container}>
            <Animated.View style={[styles.box, animationStyle]}>
                <Text style={styles.title}>Box</Text>
            </Animated.View>
            <View style={styles.buttonContainer}>
                <Pressable style={styles.button} onPress={move}>
                    <Text style={styles.title}>move</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={fadebox}>
                    <Text style={styles.title}>Fade</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={scaleBox}>
                    <Text style={styles.title}>Scale</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={resetAll}>
                    <Text style={styles.title}>ResetAll</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={rotateBox}>
                    <Text style={styles.title}>rotate</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={rotateBoxY}>
                    <Text style={styles.title}>rotateY</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={radiusBox}>
                    <Text style={styles.title}>radiusBox</Text>
                </Pressable>
            </View>
            <Animated.View style={[styles.box, animationStyle]}>
                <Pressable onPress={() => console.log("Pressed")}>
                    <Text>Breating button</Text>
                </Pressable>
            </Animated.View>
            <View style={styles.dotContainer}>
                {/* <Dot delay={300} />
        <Dot delay={200} />
        <Dot delay={100} />
        <Dot delay={0} /> */}
                <Dot delay={100} />
                <Dot delay={200} />
                <Dot delay={300} />
            </View>
            <SlideToggle />
            <PulseEffect />
            <Interpolation />
            {/* <InterpolationExamples /> */}
        </View>
    );
};

export default BasicAnimation2;

const stylessheet = createStyleSheet((theme) => ({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.primary,
    },
    box: {
        width: 100,
        height: 100,
        backgroundColor: theme.colors.background,
        borderRadius: 10,
        marginBottom: 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        color: theme.colors.text,
        // margin:50,
        fontWeight: "800",
    },
    buttonContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 10,
    },
    button: {
        backgroundColor: "#2ecc71",
        paddingHorizontal: 20,
        paddingVertical: 10,
        margin: 5,
        borderRadius: 10,
    },
    dotContainer: {
        flexDirection: 'row',
        // flexWrap:'wrap',
        height: 50,
        // borderWidth:2,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5
    }
}));
