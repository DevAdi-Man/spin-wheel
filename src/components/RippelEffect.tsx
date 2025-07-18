import React, { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
// import { StyleProps } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles'


interface RippleProps {
    style?: StyleProp<ViewStyle>;
    onTap?: () => void;
}

const RippelEffect: React.FC<PropsWithChildren<RippleProps>> = ({ style, onTap, children }) => {
    const { styles } = useStyles(stylesheet);
    return (
        <View style={styles.container}>
            <View style={styles.ripple}>
                {children}
            </View>
        </View>
    )
}

export default RippelEffect

const stylesheet = createStyleSheet(theme => ({
    container: {
        flex: 1,
        backgroundColor: theme.colors.bg,
        justifyContent: 'center',
        alignItems: 'center'
    },
    ripple: {
        width: 250,
        height: 250,
        backgroundColor: theme.colors.info,
        elevation: 5,
        borderRadius: 20,
    }
}))
