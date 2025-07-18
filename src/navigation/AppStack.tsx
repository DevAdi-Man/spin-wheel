import { StyleSheet, Text, View } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screen/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from '../screen/ProfileScreen';
import ReelScreen from '../screen/ReelScreen';
import SettingScreen from '../screen/SettingScreen';
import TabBar from '../components/TabBar';

export type RootStackParamList = {
    Home: undefined;
    Profile: undefined;
    Reel: undefined;
    Setting: undefined;
}
const Tab = createBottomTabNavigator<RootStackParamList>();

const AppStack = () => {
    return (
        <Tab.Navigator tabBar={prop => <TabBar {...prop}/>} screenOptions={{ headerShown: false }}>
            <Tab.Screen name='Home' component={HomeScreen} />
            <Tab.Screen name='Profile' component={ProfileScreen} />
            <Tab.Screen name='Reel' component={ReelScreen} />
            <Tab.Screen name='Setting' component={SettingScreen} />
        </Tab.Navigator>
    )
}

export default AppStack

const styles = StyleSheet.create({})
