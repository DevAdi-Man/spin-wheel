import { useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Slides } from '../utils/data';
import { runOnJS } from 'react-native-reanimated';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

const OnBoarding2 = () => {
    const [currentIndex, setcurrentIndex] = useState(0);
    const flatListRef = useRef(null);
    const { styles } = useStyles(stylesheet);

    const handleScroll = (event) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / SCREEN_WIDTH);
        runOnJS(console.log)(index);
        setcurrentIndex(index);
    };

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={Slides}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                onMomentumScrollEnd={handleScroll}
                renderItem={({ item }) => (
                    <View style={styles.slide}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.desc}>{item.description}</Text>
                    </View>
                )}
            />

            <View style={styles.pagination}>
                {
                    Slides.map((_, index) => (
                        <View
                            key={index}
                            style={[styles.dot, currentIndex === index && styles.activeDot]}
                        />
                    ))
                }
            </View>
        </View>
    )
}

export default OnBoarding2

const stylesheet = createStyleSheet(theme => ({
    container: {
        flex: 1,
        backgroundColor: theme.colors.primary
    },
    slide: {
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    desc: {
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
        paddingHorizontal: 30
    },
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center'
    },
    dot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.warning,
        margin: 8,
    },
    activeDot: {
        backgroundColor: theme.colors.success,
        width: 12,
        height: 12
    }
}))
