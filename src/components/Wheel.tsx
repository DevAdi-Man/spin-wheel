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
  const innerRadius = radius * 0.15;
  const ballRadius = 8; // Ball size on edges
  const angle = (2 * Math.PI) / segments;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Continuous rotation for edge balls
  useEffect(() => {
    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    );
    
    const scale = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.03,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    );
    
    rotate.start();
    scale.start();
    
    return () => {
      rotate.stop();
      scale.stop();
    };
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
    const textRadius = radius * 0.7;
    const x = radius + textRadius * Math.cos(textAngle);
    const y = radius + textRadius * Math.sin(textAngle);
    return { x, y, angle: textAngle };
  };

  const getBallPosition = (index: number) => {
    const ballAngle = (angle * index) + (angle / 2);
    const ballDistance = radius + ballRadius + 5;
    const x = radius + ballDistance * Math.cos(ballAngle);
    const y = radius + ballDistance * Math.sin(ballAngle);
    return { x, y };
  };

  // Premium color palette
  const getPremiumColors = (index: number) => {
    const premiumPalette = [
      { start: '#FF6B6B', end: '#FF5252', accent: '#FF8A80' }, // Red
      { start: '#4ECDC4', end: '#26A69A', accent: '#80CBC4' }, // Teal
      { start: '#45B7D1', end: '#1976D2', accent: '#64B5F6' }, // Blue
      { start: '#96CEB4', end: '#388E3C', accent: '#81C784' }, // Green
      { start: '#FFEAA7', end: '#FFA000', accent: '#FFD54F' }, // Amber
      { start: '#DDA0DD', end: '#7B1FA2', accent: '#BA68C8' }, // Purple
      { start: '#98D8C8', end: '#00695C', accent: '#4DB6AC' }, // Cyan
      { start: '#F7DC6F', end: '#F57C00', accent: '#FFB74D' }, // Orange
    ];
    return premiumPalette[index % premiumPalette.length];
  };

  return (
    <View style={styles.container}>
      {/* Outer Glow Effect */}
      <View style={[styles.outerGlow, { width: size + 40, height: size + 40 }]} />
      
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
        <Svg width={size} height={size} style={styles.wheel}>
          <Defs>
            {/* Segment Gradients */}
            {Array.from({ length: segments }).map((_, i) => {
              const colors = getPremiumColors(i);
              return (
                <RadialGradient
                  key={`gradient-${i}`}
                  id={`gradient-${i}`}
                  cx="50%"
                  cy="30%"
                  r="70%"
                >
                  <Stop offset="0%" stopColor={colors.accent} />
                  <Stop offset="60%" stopColor={colors.start} />
                  <Stop offset="100%" stopColor={colors.end} />
                </RadialGradient>
              );
            })}
            
            {/* Ball Gradients */}
            {Array.from({ length: segments }).map((_, i) => {
              const colors = getPremiumColors(i);
              return (
                <RadialGradient
                  key={`ballGradient-${i}`}
                  id={`ballGradient-${i}`}
                  cx="30%"
                  cy="30%"
                  r="70%"
                >
                  <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                  <Stop offset="40%" stopColor={colors.start} />
                  <Stop offset="100%" stopColor={colors.end} />
                </RadialGradient>
              );
            })}
            
            {/* Center Gradient */}
            <RadialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#FFFFFF" />
              <Stop offset="30%" stopColor="#ECF0F1" />
              <Stop offset="100%" stopColor="#BDC3C7" />
            </RadialGradient>
          </Defs>
          
          <G>
            {/* Wheel segments */}
            {Array.from({ length: segments }).map((_, i) => (
              <Path
                key={i}
                d={createARC(i)}
                fill={`url(#gradient-${i})`}
                stroke="#FFFFFF"
                strokeWidth={3}
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
                  fontSize={Math.max(14, size * 0.04)}
                  fontWeight="800"
                  fill="#FFFFFF"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  stroke="#2C3E50"
                  strokeWidth={1}
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
              r={innerRadius + 5}
              fill="url(#centerGradient)"
              stroke="#34495E"
              strokeWidth={4}
            />
            
            {/* Center Icon */}
            <Circle
              cx={radius}
              cy={radius}
              r={innerRadius * 0.6}
              fill="#E74C3C"
              stroke="#FFFFFF"
              strokeWidth={2}
            />
            <Circle
              cx={radius}
              cy={radius}
              r={innerRadius * 0.3}
              fill="#FFFFFF"
            />
          </G>
        </Svg>
      </Animated.View>
      
      {/* Edge Balls - Rotating */}
      <Animated.View 
        style={[
          styles.ballsContainer,
          {
            width: size + (ballRadius * 4),
            height: size + (ballRadius * 4),
            transform: [
              { rotate: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg']
              })}
            ]
          }
        ]}
      >
        {Array.from({ length: segments }).map((_, i) => {
          const ballPos = getBallPosition(i);
          const colors = getPremiumColors(i);
          return (
            <View
              key={`ball-${i}`}
              style={[
                styles.edgeBall,
                {
                  left: ballPos.x - ballRadius,
                  top: ballPos.y - ballRadius,
                  backgroundColor: colors.start,
                  shadowColor: colors.end,
                }
              ]}
            >
              <View style={[styles.ballHighlight, { backgroundColor: colors.accent }]} />
            </View>
          );
        })}
      </Animated.View>
      
      {/* Premium Pointer */}
      <View style={styles.pointer}>
        <View style={styles.pointerShadow} />
        <View style={styles.pointerBody}>
          <View style={styles.pointerGem} />
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
  outerGlow: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    shadowColor: '#E74C3C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 25,
  },
  wheel: {
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 30,
  },
  ballsContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  edgeBall: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 15,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  ballHighlight: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    top: 2,
    left: 2,
    opacity: 0.8,
  },
  pointer: {
    position: 'absolute',
    top: -30,
    alignItems: 'center',
    zIndex: 15,
  },
  pointerShadow: {
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 30,
    top: 8,
  },
  pointerBody: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 20,
    borderWidth: 3,
    borderColor: '#E74C3C',
  },
  pointerGem: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E74C3C',
    marginBottom: 4,
    shadowColor: '#C0392B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 8,
  },
  pointerTip: {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderTopWidth: 25,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#E74C3C',
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 12,
  },
});

export default Wheel;
