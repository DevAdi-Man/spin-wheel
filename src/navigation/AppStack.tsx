import { StyleSheet, Text, View } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screen/HomeScreen';

export type RootStackParamList = {
    Home:undefined;
}
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name='Home' component={HomeScreen}  />
    </Stack.Navigator>
  )
}

export default AppStack

const styles = StyleSheet.create({})