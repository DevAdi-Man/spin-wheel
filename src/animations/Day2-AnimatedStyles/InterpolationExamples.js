import React from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedScrollHandler,
    interpolate,
    interpolateColor,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const InterpolationExamples = () => {
    const scrollY = useSharedValue(0);

    // Scroll handler
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    // Header animation - Parallax effect
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
            [1, 1.2],
            'clamp'
        );

        return {
            transform: [
                { translateY },
                { scale },
            ],
        };
    });

    // Color interpolation example
    const colorBoxStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            scrollY.value,
            [0, 150, 300, 450],
            ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4']
        );

        return {
            backgroundColor,
        };
    });

    // Rotation with scroll
    const rotatingBoxStyle = useAnimatedStyle(() => {
        const rotation = interpolate(
            scrollY.value,
            [0, 500],
            [0, 360],
            'extend'
        );

        return {
            transform: [{ rotate: `${rotation}deg` }],
        };
    });

    // Opacity fade effect
    const fadeBoxStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [100, 300],
            [1, 0],
            'clamp'
        );

        return {
            opacity,
        };
    });

    // Scale animation
    const scaleBoxStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            scrollY.value,
            [200, 400],
            [0.5, 1.5],
            'clamp'
        );

        return {
            transform: [{ scale }],
        };
    });

    // Progress bar
    const progressStyle = useAnimatedStyle(() => {
        const width = interpolate(
            scrollY.value,
            [0, 800],
            [0, SCREEN_WIDTH - 40],
            'clamp'
        );

        return {
            width,
        };
    });

    // Multiple transformations
    const complexBoxStyle = useAnimatedStyle(() => {
        const translateX = interpolate(
            scrollY.value,
            [300, 600],
            [-100, 100],
            'clamp'
        );

        const translateY = interpolate(
            scrollY.value,
            [300, 600],
            [0, -50],
            'clamp'
        );

        const rotation = interpolate(
            scrollY.value,
            [300, 600],
            [0, 180],
            'clamp'
        );

        const scale = interpolate(
            scrollY.value,
            [300, 600],
            [1, 0.8],
            'clamp'
        );

        return {
            transform: [
                { translateX },
                { translateY },
                { rotate: `${rotation}deg` },
                { scale },
            ],
        };
    });

    return (
        <View style={styles.container}>
            {/* Fixed Progress Bar */}
            <View style={styles.progressContainer}>
                <Animated.View style={[styles.progressBar, progressStyle]} />
            </View>

            <Animated.ScrollView
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >
                {/* Header with Parallax */}
                <Animated.View style={[styles.header, headerStyle]}>
                    <Text style={styles.headerText}>Interpolation Examples</Text>
                </Animated.View>

                <View style={styles.content}>
                    {/* Color Interpolation */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Color Interpolation</Text>
                        <Animated.View style={[styles.box, colorBoxStyle]} />
                        <Text style={styles.description}>
                            Scroll karne pe colors change hote hain
                        </Text>
                    </View>

                    {/* Rotation */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Rotation Animation</Text>
                        <Animated.View style={[styles.box, styles.blueBox, rotatingBoxStyle]} />
                        <Text style={styles.description}>
                            Continuous rotation with scroll
                        </Text>
                    </View>

                    {/* Fade Effect */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Fade Effect</Text>
                        <Animated.View style={[styles.box, styles.greenBox, fadeBoxStyle]} />
                        <Text style={styles.description}>
                            Opacity change hoti hai scroll ke saath
                        </Text>
                    </View>

                    {/* Scale Animation */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Scale Animation</Text>
                        <Animated.View style={[styles.box, styles.purpleBox, scaleBoxStyle]} />
                        <Text style={styles.description}>
                            Size change hota hai scroll position ke according
                        </Text>
                    </View>

                    {/* Complex Animation */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Complex Animation</Text>
                        <Animated.View style={[styles.box, styles.orangeBox, complexBoxStyle]} />
                        <Text style={styles.description}>
                            Multiple transformations ek saath
                        </Text>
                    </View>

                    {/* Spacer for more scrolling */}
                    <View style={styles.spacer} />
                </View>
            </Animated.ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    progressContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: '#e9ecef',
        zIndex: 1000,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#007bff',
    },
    header: {
        height: 200,
        backgroundColor: '#6c5ce7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    content: {
        padding: 20,
    },
    section: {
        marginBottom: 50,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#2d3436',
    },
    box: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    blueBox: {
        backgroundColor: '#74b9ff',
    },
    greenBox: {
        backgroundColor: '#00b894',
    },
    purpleBox: {
        backgroundColor: '#a29bfe',
    },
    orangeBox: {
        backgroundColor: '#fd79a8',
    },
    description: {
        fontSize: 14,
        color: '#636e72',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    spacer: {
        height: 200,
    },
});

export default InterpolationExamples;
