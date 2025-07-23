import { createNativeStackNavigator } from '@react-navigation/native-stack'
import OnBoadingScreen from '../screen/OnBoadingScreen';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppTab from './AppStack';


export type StackProps = {
    onBoarding: undefined,
    Main:undefined
}
const Stack = createNativeStackNavigator<StackProps>();

const RootNavigation = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isOnboarded, setIsOnboarded] = useState(false);

    useEffect(() => {
        const checkOnboarding = async () => {
            const onboarded = await AsyncStorage.getItem('hasOnboarded');
            setIsOnboarded(onboarded === 'true');
            setIsLoading(false);
        };
        checkOnboarding();
    }, []);

    if (isLoading) return null; // Or SplashScreen
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!isOnboarded ? (
                <Stack.Screen name="onBoarding" component={OnBoadingScreen} />
            ) : (
                <Stack.Screen name="Main" component={AppTab} />
            )}
        </Stack.Navigator>
    )
}

export default RootNavigation
