import React from "react";
import { View, Text } from "react-native";

const TestComponent = () => {
  const name = "World";
  
  return (
    <View>
      <Text>Hello {name}!</Text>
      <Text>This is a test component</Text>
    </View>
  );
};

export default TestComponent;
