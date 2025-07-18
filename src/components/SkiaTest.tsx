import { Canvas, Group ,Circle} from '@shopify/react-native-skia';
import { StyleSheet, Text, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const SkiaTest = () => {
    const { styles } = useStyles(stylesheet);
    const width = 256;
    const height = 256;
    const r = width * 0.33;
    return (
        <Canvas style={[{ width, height },styles.container]}>
            <Group blendMode="multiply">
                <Circle cx={r} cy={r} r={r} color="cyan" />
                <Circle cx={width - r} cy={r} r={r} color="magenta" />
                <Circle cx={width / 2} cy={width - r} r={r} color="yellow" />
            </Group>
        </Canvas>
    );
}

export default SkiaTest

const stylesheet = createStyleSheet(theme => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    // height: 256,
    // width: 256,
  },
}));

