import { Text, View } from "react-native";
import React from "react";
import Svg, { G, Path } from "react-native-svg";
type WheelProps = {
  size: number;
  segments: number;
  colors: Array<string>;
};

const Wheel: React.FC<WheelProps> = ({ size, segments, colors }) => {
  const radius = size / 2;
  const angle = (2 * Math.PI) / segments; // svg mai hum deg mai nhi radians mai mangte hai (eg 360 deg = 2pi radians)

  const createARC = (index: number) => {
    const startAngle = angle * index;
    const endAngle = startAngle + angle;

    const x1 = radius + radius * Math.cos(startAngle);
    const y1 = radius + radius * Math.sin(startAngle);
    const x2 = radius + radius * Math.cos(endAngle);
    const y2 = radius + radius * Math.sin(endAngle);

    const largeArcFlag = angle > Math.PI ? 1 : 0; // agra angle badha hai to 1 nhi 0 value ho ga

    return `
            M ${radius} ${radius}
            L ${x1} ${y1}
            A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
            Z
        `;
  };
  return (
    <View style={{ width: size + 8, height: size + 8,borderWidth:4,borderRadius:999 }}>
      <Svg width={size} height={size}>
        <G>
          {Array.from({ length: segments }).map((_, i) => (
            <Path
              key={i}
              d={createARC(i)}
              fill={colors[i % colors.length] || `hsl(${(i * 360) / segments}, 70%, 50%)`}
              stroke="#fff"
              strokeWidth={2}
            />
          ))}
        </G>
      </Svg>
    </View>
  );
};

export default Wheel;

