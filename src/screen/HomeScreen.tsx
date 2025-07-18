import { LayoutAnimation, Pressable, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import{ createStyleSheet, useStyles } from "react-native-unistyles";
import SlideInOut from "../animations/Day2-AnimatedStyles/SlideInOut";
import Wheel from "../components/Wheel";
import BasicAnimation2 from "../animations/Day1-Foundation/BasicAnimation2";
import Interpolation from "../animations/Day2-AnimatedStyles/Interpolation";
import ParallaxEffect from "../animations/Day2-AnimatedStyles/ParallaxEffect";
import Filpcard from "../animations/Day2-AnimatedStyles/Filpcard";
import FadeInOut from "../animations/Day2-AnimatedStyles/FadeInOut";
import BasicGesture from "../animations/Day3-Gestures/BasicGesture";
import { Animate } from "../animations/Day3-Gestures/SingleTap";
import { useSharedValue, withTiming, Easing } from "react-native-reanimated";
import DoubleTap from "../animations/Day3-Gestures/DoubleTap";
import ConstrainedDragging from "../animations/Day3-Gestures/ConstrainedDragging";
import VelocityGesture from "../animations/Day3-Gestures/VelocityGesture";
import MotionTrailEffect from "../animations/Day3-Gestures/MotionTrailEffect";
import SnapToGrid from "../animations/Day3-Gestures/SnapToGrid";
import SwipeToDelete from "../animations/Day3-Gestures/SwipeToDelete";
import { AnimationShowcase } from "../animations";
import TypeWriter from "../animations/Day4-AdvancedAnimations/TypeWriter";
import CustomLyaoutAnimation from "../animations/Day5-LayoutAnimations/LyaoutAnimation";
import PinchToZoom from "../components/PinchToZoom";
import DoubleTapToLike from "../components/DoubleTapToLike";
import SwipCard from "../components/SwipCard";
import SwipToDelete from "../components/SwipToDelete";
import RippelEffect from "../components/RippelEffect";
import SkiaTest from "../components/SkiaTest";
import Carousel from "../components/Carousel";

const pickIndexByProbability = (weights: number[]) => {
    const rnd = Math.random();
    let cumulative = 0;

    for (let i = 0; i < weights.length; i++) {
        cumulative += weights[i];
        if (rnd < cumulative) return i;
    }
    return weights.length - 1; // fallback
};
const HomeScreen = () => {
    const { styles } = useStyles(stylesSheet);
    const [progress, setProgress] = useState(0);
    const spinValue = useSharedValue(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => (prev < 1 ? prev + 0.1 : 1));
        }, 800);
        return () => clearInterval(interval);
    }, []);

    const probabilities = [0.1, 0.05, 0.15, 0.1, 0.1, 0.0001, 0.3, 0.1];
    const labels = ["Amazon", "Netflix", "Flipkart", "Cashback", "Recharge", "Try Again", "Gift Card", "Spin Again"];
    const triggerSpin = () => {
        const winningIndex = pickIndexByProbability(probabilities);

        const segmentAngle = 360 / labels.length;
        const segmentMidAngle = winningIndex * segmentAngle + segmentAngle / 2;
        const fullSpins = 6;
        const targetRotation = fullSpins * 360 + (360 - segmentMidAngle); // align pointer at top

        spinValue.value = withTiming(targetRotation, {
            duration: 4000,
            easing: Easing.out(Easing.exp),
        });
    };
    return (
        <View style={styles.container}>
            {/* <Text style={styles.text}>HomeScreen</Text> */}
            {/* <Wheel spinValue={spinValue} labels={["Amazon", "Netflix", "Flipkart", "Cashback", "Recharge", "Try Again", "Gift Card", "Spin Again"]} onSpinEnd={(winner, index) => { console.log('🎯 You got:', winner, 'at index:', index); }} size={250} segments={8} colors={["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#F44336", "#9C27B0",]} /> */}
            {/**/}
            {/* <Pressable style={styles.button} onPress={triggerSpin}> */}
            {/*     <Text style={styles.buttonText}>SPIN</Text> */}
            {/* </Pressable> */}
            {/* <Text>Hello</Text> */}
            {/* <Interpolation progress={progress} /> */}
            {/* <BasicAnimation2 /> */}
            {/* <ParallaxEffect /> */}
            {/* <Filpcard /> */}
            {/* <FadeInOut /> */}
            {/* <SlideInOut /> */}
            {/* <BasicGesture /> */}
            {/* <Animate /> */}
            {/* <DoubleTap /> */}
            {/* <ConstrainedDragging /> */}
            {/* <VelocityGesture /> */}
            {/* <MotionTrailEffect /> */}
            {/* <SnapToGrid /> */}
            {/* <SwipeToDelete /> */}
            {/* <AnimationShowcase /> */}
            {/* <TypeWriter text='Aditya raj' speed={200} showcursor={true} /> */}
            {/* <CustomLyaoutAnimation /> */}
            {/* <PinchToZoom imageUrl="https://i.pinimg.com/736x/2b/2f/36/2b2f36bbed5d28e7826cb3a0d8d0fad1.jpg" /> */}
            {/* <DoubleTapToLike imageUrl={'https://i.pinimg.com/736x/d7/23/08/d72308d22cea8d35d75c8e8f4fd828cd.jpg'}/> */}
            {/* <SwipCard /> */}
            {/* <SwipToDelete /> */}
            {/* <RippelEffect /> */}
            {/* <SkiaTest /> */}
            <Carousel />
        </View>
    );
};

export default HomeScreen;

const stylesSheet = createStyleSheet((theme) => ({
    container: {
        flex: 1,
        backgroundColor: theme.colors.bg,
        // justifyContent: 'center',
        // alignItems: 'center',
        borderWidth:4
    },
    text: {
        color: theme.colors.text,
    },
    button: {
        marginTop: 40,
        backgroundColor: '#FFD700',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#8B0000',
    },
}));
