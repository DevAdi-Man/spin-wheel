import { Text, View, StyleSheet, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import Svg, { G, Path, Circle, Defs, LinearGradient, Stop, Text as SvgText, RadialGradient } from "react-native-svg";

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
  const innerRadius = radius * 0.12;
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
    const textRadius = radius * 0.7;
    const x = radius + textRadius * Math.cos(textAngle);
    const y = radius + textRadius * Math.sin(textAngle);
    return { x, y };
  };

  // Casino wheel colors - alternating red/yellow
  const getCasinoColors = (index: number) => {
    const isEven = index % 2 === 0;
    if (isEven) {
      return {
        start: '#FFD700', // Gold
        end: '#FFA500',   // Orange
        text: '#8B0000'   // Dark Red
      };
    } else {
      return {
        start: '#DC143C', // Crimson
        end: '#8B0000',   // Dark Red
        text: '#FFFFFF'   // White
      };
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Glow */}
      <View style={[styles.backgroundGlow, { width: size + 60, height: size + 60 }]} />
      
      {/* Outer Ring */}
      <View style={[styles.outerRing, { width: size + 30, height: size + 30 }]} />

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
            {/* Segment Gradients */}
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
            
            {/* Center Gradient */}
            <RadialGradient id="centerGradient" cx="50%" cy="30%" r="70%">
              <Stop offset="0%" stopColor="#FFD700" />
              <Stop offset="50%" stopColor="#DAA520" />
              <Stop offset="100%" stopColor="#B8860B" />
            </RadialGradient>
          </Defs>
          
          <G>
            {/* Wheel segments */}
            {Array.from({ length: segments }).map((_, i) => (
              <Path
                key={i}
                d={createARC(i)}
                fill={`url(#gradient-${i})`}
                stroke="#8B4513"
                strokeWidth={2}
                strokeLinejoin="round"
              />
            ))}
            
            {/* Segment Labels */}
            {showLabels && labels.length > 0 && Array.from({ length: segments }).map((_, i) => {
              const textPos = getTextPosition(i);
              const label = labels[i % labels.length] || `${i + 1}`;
              const colors = getCasinoColors(i);
              return (
                <SvgText
                  key={`text-${i}`}
                  x={textPos.x}
                  y={textPos.y}
                  fontSize={Math.max(16, size * 0.04)}
                  fontWeight="900"
                  fill={colors.text}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  stroke={colors.text === '#FFFFFF' ? '#000000' : '#FFFFFF'}
                  strokeWidth={0.5}
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
              r={innerRadius + 8}
              fill="url(#centerGradient)"
              stroke="#8B4513"
              strokeWidth={3}
            />
            
            {/* Center Metallic Circle */}
            <Circle
              cx={radius}
              cy={radius}
              r={innerRadius}
              fill="#C0C0C0"
              stroke="#808080"
              strokeWidth={2}
            />
            
            {/* Center Highlight */}
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
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backgroundGlow: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: 'rgba(255, 69, 0, 0.2)',
    shadowColor: '#FF4500',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 20,
  },
  outerRing: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: '#8B4513',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 20,
  },
  wheelContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheel: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 25,
  },
  pointer: {
    position: 'absolute',
    top: -45,
    alignItems: 'center',
    zIndex: 15,
  },
  pointerBody: {
    backgroundColor: '#DC143C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 15,
  },
  pointerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  pointerTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderTopWidth: 25,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#DC143C',
    marginTop: -2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 12,
  },
});

export default Wheel;
