import { Text, View, StyleSheet, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import Svg, {
  G,
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from "react-native-svg";

type WheelProps = {
  size: number;
  segments: number;
  colors: Array<string>;
  labels?: Array<string>;
  showLabels?: boolean;
  spinValue?: Animated.Value;
};

const Wheel: React.FC<WheelProps> = ({
  size,
  segments,
  colors,
  labels = [],
  showLabels = true,
  spinValue,
}) => {
  const radius = size / 2;
  const innerRadius = radius * 0.15; // Inner circle for better look
  const angle = (2 * Math.PI) / segments;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for the wheel
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const createARC = (index: number) => {
    const startAngle = angle * index;
    const endAngle = startAngle + angle;

    // Outer arc points
    const x1 = radius + radius * Math.cos(startAngle);
    const y1 = radius + radius * Math.sin(startAngle);
    const x2 = radius + radius * Math.cos(endAngle);
    const y2 = radius + radius * Math.sin(endAngle);

    // Inner arc points
    const x3 = radius + innerRadius * Math.cos(endAngle);
    const y3 = radius + innerRadius * Math.sin(endAngle);
    const x4 = radius + innerRadius * Math.cos(startAngle);
    const y4 = radius + innerRadius * Math.sin(startAngle);

    const largeArcFlag = angle > Math.PI ? 1 : 0;

    return `
      M ${radius + innerRadius * Math.cos(startAngle)} ${
      radius + innerRadius * Math.sin(startAngle)
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
    const textRadius = radius * 0.7;
    const x = radius + textRadius * Math.cos(textAngle);
    const y = radius + textRadius * Math.sin(textAngle);
    return { x, y, angle: textAngle };
  };

  const getGradientColors = (baseColor: string, index: number) => {
    // Create gradient effect for each segment
    const hue = (index * 360) / segments;
    return {
      start: `hsl(${hue}, 80%, 60%)`,
      end: `hsl(${hue}, 90%, 40%)`,
    };
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.wheelContainer,
          {
            width: size,
            height: size,
            transform: [
              { scale: pulseAnim },
              ...(spinValue
                ? [
                    {
                      rotate: spinValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "360deg"],
                      }),
                    },
                  ]
                : []),
            ],
          },
        ]}
      >
        {/* Outer glow effect */}
        <View
          style={[styles.glowEffect, { width: size + 20, height: size + 20 }]}
        />

        <Svg width={size} height={size} style={styles.wheel}>
          <Defs>
            {Array.from({ length: segments }).map((_, i) => {
              const gradientColors = getGradientColors(
                colors[i % colors.length],
                i
              );
              return (
                <LinearGradient
                  key={`gradient-${i}`}
                  id={`gradient-${i}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <Stop offset="0%" stopColor={gradientColors.start} />
                  <Stop offset="100%" stopColor={gradientColors.end} />
                </LinearGradient>
              );
            })}
          </Defs>

          <G>
            {/* Wheel segments */}
            {Array.from({ length: segments }).map((_, i) => (
              <Path
                key={i}
                d={createARC(i)}
                fill={`url(#gradient-${i})`}
                stroke="#ffffff"
                strokeWidth={3}
                strokeLinejoin="round"
              />
            ))}

            {/* Labels */}
            {showLabels &&
              labels.length > 0 &&
              Array.from({ length: segments }).map((_, i) => {
                const textPos = getTextPosition(i);
                const label = labels[i % labels.length] || `${i + 1}`;
                return (
                  <SvgText
                    key={`text-${i}`}
                    x={textPos.x}
                    y={textPos.y}
                    fontSize={size * 0.04}
                    fontWeight="bold"
                    fill="#ffffff"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    stroke="#000000"
                    strokeWidth={0.5}
                  >
                    {label}
                  </SvgText>
                );
              })}

            {/* Center circle */}
            <Circle
              cx={radius}
              cy={radius}
              r={innerRadius}
              fill="url(#gradient-0)"
              stroke="#ffffff"
              strokeWidth={4}
            />

            {/* Center dot */}
            <Circle
              cx={radius}
              cy={radius}
              r={innerRadius * 0.3}
              fill="#ffffff"
            />
          </G>
        </Svg>
      </Animated.View>

      {/* Pointer/Arrow */}
      <View style={[styles.pointer, { top: -35 }]}>
        <View style={styles.pointerContainer}>
          <View style={styles.pointerTriangle} />
          <View style={styles.pointerBase} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  wheelContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  glowEffect: {
    position: "absolute",
    borderRadius: 1000,
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 15,
  },
  wheel: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 20,
  },
  pointer: {
    position: "absolute",
    alignItems: "center",
    zIndex: 10,
  },
  pointerContainer: {
    alignItems: "center",
    transform: [{ rotate: "180deg" }],
    // Remove rotation - triangle will point upward by default
  },
  pointerTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 35, // Changed from borderTopWidth to borderBottomWidth
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#FF4757", // Changed from borderTopColor to borderBottomColor
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 8,
  },
  pointerBase: {
    width: 12,
    height: 25,
    backgroundColor: "#FF4757",
    borderRadius: 6,
    marginBottom: 2, // Base aur triangle ke beech gap
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default Wheel;
