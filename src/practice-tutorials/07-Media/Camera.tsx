import { CameraType, CameraView, useCameraPermissions } from 'expo-camera'
import { useState } from 'react'
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const Camera = () => {
    const { styles } = useStyles(stylesheet)
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) {
        return <View />
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        )
    }
    const toggleCameraFacing = () => {
        setFacing(current => current === 'back' ? 'front' : 'back');
    }
    return (
        <View style={styles.container}>
            <CameraView style={styles.camera}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                        <Text style={styles.text}>Flip campera</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    )
}

export default Camera

const stylesheet = createStyleSheet(theme => ({
    container: {
        flex: 1,
        // justifyContent: 'center',
        borderWidth:2,
        borderColor:'red'
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
}))
