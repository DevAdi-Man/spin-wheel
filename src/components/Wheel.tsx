// Wheel.tsx
import { Text, View, StyleSheet, Pressable } from "react-native";
import React, { useEffect } from "react";
import Svg, {
    G,
    Path,
    Circle,
    Defs,
    Stop,
    Text as SvgText,
    RadialGradient,
    Image as SvgImage,
} from "react-native-svg";
import Animated, {
    useAnimatedStyle,
    runOnJS,
    useDerivedValue,
    SharedValue,
} from "react-native-reanimated";

type WheelProps = {
    size: number;
    segments: number;
    colors: Array<string>;
    labels?: Array<string>;
    images?: Array<string>;
    showLabels?: boolean;
    showImages?: boolean;
    spinValue: SharedValue<number>; // REQUIRED as sharedValue
    onSpinEnd?: (winner: string, index: number) => void;
};

const Wheel: React.FC<WheelProps> = ({
    size,
    segments,
    colors,
    labels = [],
    images = [],
    showLabels = true,
    showImages = true,
    spinValue,
    onSpinEnd,
}) => {
    const radius = size / 2;
    const innerRadius = radius * 0.12;
    const angle = (2 * Math.PI) / segments;
    const segmentAngleDeg = 360 / segments;

    const createARC = (index: number) => {
        const startAngle = angle * index;
        const endAngle = startAngle + angle;

        const x1 = radius + radius * Math.cos(startAngle);
        const y1 = radius + radius * Math.sin(startAngle);
        const x2 = radius + radius * Math.cos(endAngle);
        const y2 = radius + radius * Math.sin(endAngle);

        const x3 = radius + innerRadius * Math.cos(endAngle);
        const y3 = radius + innerRadius * Math.sin(endAngle);
        const x4 = radius + innerRadius * Math.cos(startAngle);
        const y4 = radius + innerRadius * Math.sin(startAngle);

        const largeArcFlag = angle > Math.PI ? 1 : 0;

        return `
      M ${radius + innerRadius * Math.cos(startAngle)} ${radius + innerRadius * Math.sin(startAngle)
            }
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
      Z
    `;
    };

    const getTextPosition = (index: number) => {
        const textAngle = angle * index + angle / 2;
        const textRadius = radius * 0.85;
        const x = radius + textRadius * Math.cos(textAngle);
        const y = radius + textRadius * Math.sin(textAngle);
        return { x, y };
    };

    const getImagePosition = (index: number) => {
        const imageAngle = angle * index + angle / 2;
        const imageRadius = radius * 0.55;
        const x = radius + imageRadius * Math.cos(imageAngle);
        const y = radius + imageRadius * Math.sin(imageAngle);
        return { x, y, angle: imageAngle };
    };

    const getCasinoColors = (index: number) => {
        const isEven = index % 2 === 0;
        return isEven
            ? {
                start: "#FFD700",
                end: "#FFA500",
                text: "#8B0000",
            }
            : {
                start: "#DC143C",
                end: "#8B0000",
                text: "#FFFFFF",
            };
    };

    // 🧠 Reanimated Rotation Style
    const animatedWheelStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${spinValue.value}deg` }],
        };
    });

    // 🎯 Detect winning segment on spin end
    useDerivedValue(() => {
        const normalized = spinValue.value % 360;
        const corrected = (360 - normalized) % 360;
        const index = Math.floor(corrected / segmentAngleDeg);

        if (onSpinEnd && spinValue.value !== 0) {
            runOnJS(onSpinEnd)(labels[index % labels.length] || `Segment ${index + 1}`, index);
        }
    });

    return (
        <View style={styles.container}>
            <View style={[styles.backgroundGlow, { width: size + 60, height: size + 60 }]} />
            <View style={[styles.outerRing, { width: size + 30, height: size + 30 }]} />
            <Animated.View style={[styles.wheelContainer, { width: size, height: size }, animatedWheelStyle]}>
                <Svg width={size} height={size} style={styles.wheel}>
                    <Defs>
                        {Array.from({ length: segments }).map((_, i) => {
                            const colors = getCasinoColors(i);
                            return (
                                <RadialGradient
                                    key={`gradient-${i}`}
                                    id={`gradient-${i}`}
                                    cx="50%"
                                    cy="30%"
                                    r="80%"
                                >
                                    <Stop offset="0%" stopColor={colors.start} />
                                    <Stop offset="70%" stopColor={colors.start} />
                                    <Stop offset="100%" stopColor={colors.end} />
                                </RadialGradient>
                            );
                        })}
                        <RadialGradient id="centerGradient" cx="50%" cy="30%" r="70%">
                            <Stop offset="0%" stopColor="#FFD700" />
                            <Stop offset="50%" stopColor="#DAA520" />
                            <Stop offset="100%" stopColor="#B8860B" />
                        </RadialGradient>
                    </Defs>

                    <G>
                        {Array.from({ length: segments }).map((_, i) => (
                            <Path
                                key={i}
                                d={createARC(i)}
                                fill={`url(#gradient-${i})`}
                                stroke="#8B4513"
                                strokeWidth={2}
                            />
                        ))}

                        {showImages &&
                            images.length > 0 &&
                            Array.from({ length: segments }).map((_, i) => {
                                const { x, y } = getImagePosition(i);
                                const imageUrl = images[i % images.length];
                                const imageSize = Math.min(40, size * 0.08);

                                if (!imageUrl) return null;

                                return (
                                    <G key={`image-${i}`}>
                                        <Circle
                                            cx={x}
                                            cy={y}
                                            r={imageSize / 2 + 4}
                                            fill="#FFFFFF"
                                            fillOpacity={0.9}
                                            stroke="#333333"
                                            strokeWidth={1}
                                        />
                                        <SvgImage
                                            x={x - imageSize / 2}
                                            y={y - imageSize / 2}
                                            width={imageSize}
                                            height={imageSize}
                                            href={imageUrl}
                                        />
                                    </G>
                                );
                            })}

                        {showLabels &&
                            labels.length > 0 &&
                            Array.from({ length: segments }).map((_, i) => {
                                const { x, y } = getTextPosition(i);
                                const label = labels[i % labels.length] || `${i + 1}`;
                                const colors = getCasinoColors(i);
                                return (
                                    <SvgText
                                        key={`text-${i}`}
                                        x={x}
                                        y={y}
                                        fontSize={Math.max(12, size * 0.03)}
                                        fontWeight="900"
                                        fill={colors.text}
                                        textAnchor="middle"
                                        alignmentBaseline="middle"
                                        stroke={colors.text === "#FFFFFF" ? "#000000" : "#FFFFFF"}
                                        strokeWidth={0.5}
                                    >
                                        {label}
                                    </SvgText>
                                );
                            })}

                        {/* Center hub */}
                        <Circle
                            cx={radius}
                            cy={radius}
                            r={innerRadius + 8}
                            fill="url(#centerGradient)"
                            stroke="#8B4513"
                            strokeWidth={3}
                        />
                        <Circle
                            cx={radius}
                            cy={radius}
                            r={innerRadius}
                            fill="#C0C0C0"
                            stroke="#808080"
                            strokeWidth={2}
                        />
                        <Circle
                            cx={radius - innerRadius * 0.3}
                            cy={radius - innerRadius * 0.3}
                            r={innerRadius * 0.3}
                            fill="#FFFFFF"
                            opacity={0.6}
                        />
                    </G>
                </Svg>
            </Animated.View>

            {/* Fixed Pointer */}
            <View style={styles.pointer}>
                <View style={styles.pointerBody}>
                    <Text style={styles.pointerText}>JACKPOT</Text>
                </View>
                <View style={styles.pointerTriangle} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { alignItems: "center", justifyContent: "center", position: "relative" },
    backgroundGlow: {
        position: "absolute",
        borderRadius: 1000,
        backgroundColor: "rgba(255, 69, 0, 0.2)",
    },
    outerRing: {
        position: "absolute",
        borderRadius: 1000,
        backgroundColor: "#8B4513",
    },
    wheelContainer: {
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
    },
    wheel: { elevation: 25 },
    pointer: {
        position: "absolute",
        top: -45,
        alignItems: "center",
        zIndex: 15,
    },
    pointerBody: {
        backgroundColor: "#DC143C",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "#FFD700",
    },
    pointerText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "bold",
    },
    pointerTriangle: {
        width: 0,
        height: 0,
        borderLeftWidth: 15,
        borderRightWidth: 15,
        borderTopWidth: 25,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: "#DC143C",
        marginTop: -2,
    },
});

export default Wheel;

