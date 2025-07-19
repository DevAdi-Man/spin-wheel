import { StyleSheet, Text, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const login = () => {
    const {styles} = useStyles(stylesheet);
  return (
    <View>
      <Text></Text>
    </View>
  )
}

export default login

const stylesheet = createStyleSheet(theme=>({
    container:{
        flex:1
    }
}))
