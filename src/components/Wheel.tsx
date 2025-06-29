import { Text, View, StyleSheet, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import Svg, { G, Path, Circle, Defs, LinearGradient, Stop, Text as SvgText } from "react-native-svg";

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
  spinValue 
}) => {
  const radius = size / 2;
  const innerRadius = radius * 0.2;
  const angle = (2 * Math.PI) / segments;

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
      M ${radius + innerRadius * Math.cos(startAngle)} ${radius + innerRadius * Math.sin(startAngle)}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
      Z
    `;
  };

  const getTextPosition = (index: number) => {
    const textAngle = angle * index + angle / 2;
    const textRadius = radius * 0.65;
    const x = radius + textRadius * Math.cos(textAngle);
    const y = radius + textRadius * Math.sin(textAngle);
    return { x, y };
  };

  // Simple, clean colors
  const getCleanColors = (index: number) => {
    const cleanPalette = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
      '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
    ];
    return cleanPalette[index % cleanPalette.length];
  };

  return (
    <View style={styles.container}>
      {/* Main Wheel */}
      <Animated.View 
        style={[
          styles.wheelContainer,
          {
            width: size,
            height: size,
            transform: spinValue ? [{ rotate: spinValue.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg']
            })}] : []
          }
        ]}
      >
        <Svg width={size} height={size} style={styles.wheel}>
          <Defs>
            {Array.from({ length: segments }).map((_, i) => (
              <LinearGradient
                key={`gradient-${i}`}
                id={`gradient-${i}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop offset="0%" stopColor={getCleanColors(i)} stopOpacity="0.9" />
                <Stop offset="100%" stopColor={getCleanColors(i)} stopOpacity="1" />
              </LinearGradient>
            ))}
          </Defs>
          
          <G>
            {/* Wheel segments */}
            {Array.from({ length: segments }).map((_, i) => (
              <Path
                key={i}
                d={createARC(i)}
                fill={`url(#gradient-${i})`}
                stroke="#FFFFFF"
                strokeWidth={4}
                strokeLinejoin="round"
              />
            ))}
            
            {/* Labels */}
            {showLabels && labels.length > 0 && Array.from({ length: segments }).map((_, i) => {
              const textPos = getTextPosition(i);
              const label = labels[i % labels.length] || `${i + 1}`;
              return (
                <SvgText
                  key={`text-${i}`}
                  x={textPos.x}
                  y={textPos.y}
                  fontSize={size * 0.045}
                  fontWeight="bold"
                  fill="#FFFFFF"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  stroke="#333333"
                  strokeWidth={1}
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
              fill="#2C3E50"
              stroke="#FFFFFF"
              strokeWidth={4}
            />
            
            {/* Center dot */}
            <Circle
              cx={radius}
              cy={radius}
              r={innerRadius * 0.3}
              fill="#FFFFFF"
            />
          </G>
        </Svg>
      </Animated.View>
      
      {/* Fixed Pointer - Won't rotate with wheel */}
      <View style={styles.pointer}>
        <View style={styles.pointerTriangle} />
      </View>
      
      {/* Fixed Decorative Balls - Won't rotate with wheel */}
      <View style={styles.fixedBallsContainer}>
        {[0, 1, 2, 3].map((i) => {
          const ballAngle = (Math.PI * 2 * i) / 4; // 4 balls at 90 degree intervals
          const ballDistance = radius + 25;
          const x = ballDistance * Math.cos(ballAngle);
          const y = ballDistance * Math.sin(ballAngle);
          
          return (
            <View
              key={`fixed-ball-${i}`}
              style={[
                styles.decorativeBall,
                {
                  left: radius + x - 8,
                  top: radius + y - 8,
                  backgroundColor: getCleanColors(i * 2),
                }
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  wheelContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheel: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 20,
  },
  pointer: {
    position: 'absolute',
    top: -20,
    alignItems: 'center',
    zIndex: 10,
  },
  pointerTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 18,
    borderRightWidth: 18,
    borderTopWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#E74C3C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 10,
  },
  fixedBallsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  decorativeBall: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 8,
  },
});

export default Wheel;
