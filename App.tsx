import "./src/style/unistyles";
import {
  NavigationContainer,
} from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RootNavigation from "./src/navigation/Appstack2";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <RootNavigation />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
