import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import ButtonShadow from '../components/ButtonShadow';

const ProfileScreen = () => {
   const {styles} = useStyles(stylesheet);

    const handlePress = async ()=>{
        console.log('clear')
        await AsyncStorage.clear();
    }
  return (
    <View style={styles.container}>
      {/* <Pressable style={styles.button} onPress={handlePress}> */}
      {/*   <Text>clear Async</Text> */}
      {/* </Pressable> */}
      <ButtonShadow />
      {/* <Text>Profile</Text> */}
    </View>
  )
}

export default ProfileScreen

const  stylesheet = createStyleSheet(theme=>({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    button:{
        paddingHorizontal:15,
        paddingVertical:20,
        borderRadius:15,
        backgroundColor:theme.colors.success,
        marginTop:15
    }
}))
