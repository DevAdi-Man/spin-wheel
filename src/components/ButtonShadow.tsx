import { Pressable, StyleSheet, Text, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const ButtonShadow = () => {
    const { styles } = useStyles(stylesheet);
    return (
        <View style={styles.shadowWrapper}>
            <Pressable style={styles.button}>
                <Text style={styles.text}>I'm Done</Text>
            </Pressable>
        </View>
    )
}

export default ButtonShadow

const stylesheet = createStyleSheet(theme => ({
    button: {
        backgroundColor:'#FFD600',
        paddingVertical:12,
        paddingHorizontal:32,
        borderRadius:10,
        alignItems:'center',
        zIndex:2,
    },
    text: {
        fontWeight:'bold',
        fontSize:16,
        color:'#000'
    },
    shadowWrapper:{
        shadowColor:'#000000',
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 8,

    }
}))
