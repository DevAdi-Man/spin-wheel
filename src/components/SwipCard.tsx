import { Text, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const SwipCard = () => {
    const { styles } = useStyles(stylesheet);
    return (
        <View style={styles.container}>
            <Text>hi</Text>
        </View>
    )
}

export default SwipCard

const stylesheet = createStyleSheet(theme => ({
    container: {
        flex: 1,
        backgroundColor:theme.colors.bg
    },

}))
