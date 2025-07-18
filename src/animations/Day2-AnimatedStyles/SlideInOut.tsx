
import { Pressable, Text, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const SlideInOut = () => {
    const {styles} = useStyles(stylesheet);

    const transitionX = useSharedValue(0);

    //Animation
    const animatedStyle = useAnimatedStyle(()=>({
       transform : [{translateX:transitionX.value}]
    }));


    //Function
    const Slide_In = ()=>{
        transitionX.value = withTiming(0,{duration:250});
    }

    const Slide_Out = ()=>{
        transitionX.value = withTiming(180,{duration:250});
    }
    return (
    <View style={styles.container}>
        <Animated.View style={[styles.card,animatedStyle]} />

        <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={Slide_In}>
                <Text style={styles.text}>SideIn</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={Slide_Out}>
                <Text style={styles.text}>SlideOut</Text>
            </Pressable>
        </View>
    </View>
  )
}

export default SlideInOut;

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
