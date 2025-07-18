import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const PulseEffect = () => {
    const {styles} = useStyles(stylesheet);
    const scale = useSharedValue(0);


    useEffect(()=>{
        scale.value = withRepeat(
            withSequence(
                withTiming(1.3,{duration:500}),
                withTiming(1,{duration:500}),
            ),
            -1,
            true
        )
    },[]);
    const animatedStyle = useAnimatedStyle(()=>{
        return {
            transform: [{scale:scale.value}]
        }
    })
  return (
    <View style={styles.container}>
        <Animated.View style={[animatedStyle,styles.pulse]}/>
    </View>
  )
}

export default PulseEffect

const stylesheet = createStyleSheet(theme => ({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:'center',
        backgroundColor:theme.colors.primary
    },
    pulse:{
        width:60,
        height:60,
        borderRadius:30,
        backgroundColor:"#4cd137",
    }
}))
