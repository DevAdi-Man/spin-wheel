import { Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const FadeInOut = () => {
    const {styles} = useStyles(stylesheet);

    const opacity = useSharedValue(0);

    //Animation
    const animatedStyle = useAnimatedStyle(()=>({
        opacity:opacity.value
    }));


    //Function
    const fade_In = ()=>{
        opacity.value = withTiming(1,{duration:250});
    }

    const fade_Out = ()=>{
        opacity.value = withTiming(0,{duration:250});
    }
    return (
    <View style={styles.container}>
        <Animated.View style={[styles.card,animatedStyle]} />

        <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={fade_In}>
                <Text style={styles.text}>fadeIn</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={fade_Out}>
                <Text style={styles.text}>FadeOut</Text>
            </Pressable>
        </View>
    </View>
  )
}

export default FadeInOut

const stylesheet = createStyleSheet(theme => ({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    card:{
        width:300,
        height:300,
        backgroundColor:theme.colors.primary
    },
    buttonContainer:{
        flexDirection:'row',
        marginTop:20
    },
    button:{
        marginHorizontal:10,
        paddingHorizontal:10,
        paddingVertical:15,
        backgroundColor:theme.colors.danger,
        borderRadius:10,
        borderWidth:2,
    },
    text:{
        fontSize:20,
    }
}))
