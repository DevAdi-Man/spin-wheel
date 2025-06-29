import { Text, View } from "react-native";
import React from "react";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import Wheel from "../components/Wheel";

const HomeScreen = () => {
  const { styles } = useStyles(stylesSheet);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>HomeScreen</Text>
      <Wheel
        size={250}
        segments={8}
        colors={[
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#F44336",
          "#9C27B0",
        ]}
      />
    </View>
  );
};

export default HomeScreen;

const stylesSheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  text: {
    color: theme.colors.text,
  },
}));
