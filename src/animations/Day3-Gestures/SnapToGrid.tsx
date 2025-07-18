import { StyleSheet, Text, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

const SnapToGrid = () => {
    const { styles } = useStyles(stylesheet);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const GRID_SIZE = 60; // Grid cell size

    const snapToGrid = (value: number): number => {
        'worklet'
        return Math.round(value / GRID_SIZE) * GRID_SIZE;
    };

    const gesture = Gesture.Pan()
        .onUpdate((e) => {
            translateX.value = e.translationX;
            translateY.value = e.translationY;
        })
        .onEnd((e) => {
            // Simple approach - use absoluteX and absoluteY for screen coordinates
            const screenX = e.absoluteX;
            const screenY = e.absoluteY;

            // Approximate container bounds on screen
            // You can adjust these values based on your screen
            const containerLeft = 80;   // Adjust based on your screen
            const containerTop = 150;   // Adjust based on your screen
            const containerRight = containerLeft + 240;
            const containerBottom = containerTop + 360;

            console.log('Screen position:', screenX, screenY);
            console.log('Container bounds:', containerLeft, containerTop, containerRight, containerBottom);

            // Check if dropped inside container
            if (screenX >= containerLeft && screenX <= containerRight - 50 &&
                screenY >= containerTop && screenY <= containerBottom - 50) {

                // Convert to local container coordinates
                const localX = screenX - containerLeft;
                const localY = screenY - containerTop;

                // Snap to grid
                const snappedX = snapToGrid(localX);
                const snappedY = snapToGrid(localY);

                // Calculate final translation needed
                const targetScreenX = containerLeft + snappedX;
                const targetScreenY = containerTop + snappedY;

                // Box original position is at (50, 450)
                const finalTranslateX = targetScreenX - 50;
                const finalTranslateY = targetScreenY - 450;

                translateX.value = withSpring(finalTranslateX);
                translateY.value = withSpring(finalTranslateY);
            } else {
                // Return to original position
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value }
        ]
    }));

    // Move renderGridDots inside component
    const renderGridDots = () => {
        const dots = [];
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 4; col++) {
                dots.push(
                    <View
                        key={`${row}-${col}`}
                        style={[
                            styles.gridDot,
                            {
                                left: col * GRID_SIZE,
                                top: row * GRID_SIZE
                            }
                        ]}
                    />
                );
            }
        }
        return dots;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Snap to Grid</Text>
            <Text style={styles.instruction}>Drag the box into the grid container</Text>

            {/* Grid container */}
            <View style={styles.gridContainer}>
                {renderGridDots()}
            </View>

            {/* Draggable Box - positioned outside container */}
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.box, animatedStyle]}>
                    <Text>📦</Text>
                </Animated.View>
            </GestureDetector>
        </View>
    )
}

export default SnapToGrid

const stylesheet = createStyleSheet(theme => ({
    container: {
        flex: 1,
        backgroundColor: theme.colors.warning,
        padding: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: theme.colors.text,
    },
    instruction: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: theme.colors.textMuted,
    },
    gridContainer: {
        width: 240,
        height: 360,
        borderRadius: 10,
        backgroundColor: theme.colors.primary,
        position: 'relative',
        alignSelf: 'center',
        marginTop: 20,
        borderWidth: 2,
        borderColor: theme.colors.secondary,
    },
    gridDot: {
        position: 'absolute',
        width: 6,
        height: 6,
        backgroundColor: theme.colors.danger,
        borderRadius: 3,
    },
    box: {
        position: 'absolute',
        width: 50,
        height: 50,
        backgroundColor: theme.colors.secondary,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        top: 450, // Position outside container
        left: 50,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    box2: {
        width: 50,
        height: 50,
        backgroundColor: '#FF5722',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 30,
    }
}))
