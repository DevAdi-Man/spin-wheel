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
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Subtle breathing animation
  useEffect(() => {
    const breathe = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.02,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );
    breathe.start();
    return () => breathe.stop();
  }, []);

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
    const textRadius = radius * 0.75;
    const x = radius + textRadius * Math.cos(textAngle);
    const y = radius + textRadius * Math.sin(textAngle);
    return { x, y, angle: textAngle };
  };

  // Batting app style colors - vibrant and professional
  const getBattingColors = (index: number) => {
    const battingPalette = [
      { start: '#FF6B6B', end: '#EE5A52' }, // Red
      { start: '#4ECDC4', end: '#44A08D' }, // Teal
      { start: '#45B7D1', end: '#2980B9' }, // Blue
      { start: '#96CEB4', end: '#52B788' }, // Green
      { start: '#FFEAA7', end: '#FDCB6E' }, // Yellow
      { start: '#DDA0DD', end: '#B19CD9' }, // Purple
      { start: '#98D8C8', end: '#6C5CE7' }, // Mint
      { start: '#F7DC6F', end: '#F39C12' }, // Orange
    ];
    return battingPalette[index % battingPalette.length];
  };

  return (
    <View style={styles.container}>
      {/* Main Wheel Container */}
      <Animated.View 
        style={[
          styles.wheelContainer,
          {
            width: size,
            height: size,
            transform: [
              { scale: scaleAnim },
              ...(spinValue ? [{ rotate: spinValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg']
              })}] : [])
            ]
          }
        ]}
      >
        {/* Outer Ring Shadow */}
        <View style={[styles.outerRing, { width: size + 16, height: size + 16 }]} />
        
        <Svg width={size} height={size} style={styles.wheel}>
          <Defs>
            {Array.from({ length: segments }).map((_, i) => {
              const colors = getBattingColors(i);
              return (
                <LinearGradient
                  key={`gradient-${i}`}
                  id={`gradient-${i}`}
                  x1="30%"
                  y1="0%"
                  x2="70%"
                  y2="100%"
                >
                  <Stop offset="0%" stopColor={colors.start} />
                  <Stop offset="100%" stopColor={colors.end} />
                </LinearGradient>
              );
            })}
            
            {/* Center gradient */}
            <LinearGradient id="centerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#2C3E50" />
              <Stop offset="100%" stopColor="#34495E" />
            </LinearGradient>
          </Defs>
          
          <G>
            {/* Wheel segments */}
            {Array.from({ length: segments }).map((_, i) => (
              <Path
                key={i}
                d={createARC(i)}
                fill={`url(#gradient-${i})`}
                stroke="#FFFFFF"
                strokeWidth={2}
                strokeLinejoin="round"
              />
            ))}
            
            {/* Segment Labels */}
            {showLabels && labels.length > 0 && Array.from({ length: segments }).map((_, i) => {
              const textPos = getTextPosition(i);
              const label = labels[i % labels.length] || `${i + 1}`;
              return (
                <SvgText
                  key={`text-${i}`}
                  x={textPos.x}
                  y={textPos.y}
                  fontSize={Math.max(12, size * 0.035)}
                  fontWeight="700"
                  fill="#FFFFFF"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  stroke="#000000"
                  strokeWidth={0.8}
                  fontFamily="System"
                >
                  {label}
                </SvgText>
              );
            })}
            
            {/* Center Hub */}
            <Circle
              cx={radius}
              cy={radius}
              r={innerRadius}
              fill="url(#centerGradient)"
              stroke="#FFFFFF"
              strokeWidth={3}
            />
            
            {/* Center Logo/Icon */}
            <Circle
              cx={radius}
              cy={radius}
              r={innerRadius * 0.4}
              fill="#FFFFFF"
            />
            <Circle
              cx={radius}
              cy={radius}
              r={innerRadius * 0.2}
              fill="#2C3E50"
            />
          </G>
        </Svg>
      </Animated.View>
      
      {/* Top Pointer - Batting App Style */}
      <View style={styles.topPointer}>
        <View style={styles.pointerShadow} />
        <View style={styles.pointerBody}>
          <View style={styles.pointerTip} />
        </View>
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
  outerRing: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: 'rgba(44, 62, 80, 0.1)',
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 20,
  },
  wheel: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 25,
  },
  topPointer: {
    position: 'absolute',
    top: -25,
    alignItems: 'center',
    zIndex: 10,
  },
  pointerShadow: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 25,
    top: 5,
  },
  pointerBody: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
    borderWidth: 2,
    borderColor: '#E74C3C',
  },
  pointerTip: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderTopWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#E74C3C',
    marginTop: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});

export default Wheel;
