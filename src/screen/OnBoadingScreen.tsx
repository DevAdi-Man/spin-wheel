import { useCallback, useRef } from 'react';
import { ImageURISource, StyleSheet, Text, View, ViewToken } from 'react-native'
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import ListThings from '../components/ListThings';
import PaginationElement from '../components/PaginationElement';
import Button from '../components/Button';

const pages = [
    {
        text: 'Trusted by millions of people, part of one part',
        image: require('../../assets/Energy Rocket.json'),
    },
    {
        text: 'Spend money abroad, and track your expense',
        image: require('../../assets/YogaDeveloper.json'),
    },
    {
        text: 'Receive Money From Anywhere In The World',
        image: require('../../assets/Virtualassistant.json'),
    },
];

const OnBoadingScreen = () => {
    const { styles } = useStyles(stylesheet);
    const flatListRef = useRef<Animated.FlatList<{
        text: string,
        image: ImageURISource
    }> | null
    >(null);
    const x = useSharedValue(0);
    const flatListIndex = useSharedValue(0);

    const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        flatListIndex.value = viewableItems[0].index ?? 0;
    }, []);
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            x.value = event.contentOffset.x;
        }
    });

    const renderItem = useCallback(
        (
            {
                item,
                index,
            }: {
                item: { text: string, image: ImageURISource };
                index: number
            }
        ) => {
            return <ListThings item={item} index={index} x={x} />;
        },
        [x]
    )

    return (
        <SafeAreaView style={styles.container}>
            <Animated.FlatList
                ref={flatListRef}
                onScroll={scrollHandler}
                horizontal
                scrollEventThrottle={16}
                pagingEnabled={true}
                data={pages}
                keyExtractor={(_, index) => index.toString()}
                bounces={false}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
            />
            <View style={styles.buttonContainer}>
                <PaginationElement length={pages.length} x={x} />
                <Button
                    currentIndex={flatListIndex}
                    length={pages.length}
                    flatListRef={flatListRef}
                />
            </View>
        </SafeAreaView >
    )
}

export default OnBoadingScreen

const stylesheet = createStyleSheet(theme => ({
    container: {
        flex: 1
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20
    }
}))
