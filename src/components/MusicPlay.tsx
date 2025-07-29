import { useAudioPlayer } from 'expo-audio';
import { Button, StyleSheet, Text, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles';


const audioSource = require('../../assets/ThatGirl.mp3');


const MusicPlay = () => {
    const { styles } = useStyles(stylesheet);
    const player = useAudioPlayer(audioSource);

    return (
        <View style={styles.container}>
            <Button title='Play sound' onPress={() => player.play()} />
            <Button title='Replay sound' onPress={() => {
                player.seekTo(0)
                player.play();
            }} />
            <Button title="Pause Sound" onPress={() => player.pause()} />
        </View>
    )
}

export default MusicPlay

const stylesheet = createStyleSheet(theme => ({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ecf0f1',
        padding: 10
    },
    button:{
        marginTop:15
    }
}))
