import "./src/style/unistyles";
import {
  NavigationContainer,
  NavigationContext,
} from "@react-navigation/native";
import AppStack from "./src/navigation/AppStack";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AppStack />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
