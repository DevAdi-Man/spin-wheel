import { StyleSheet, Text, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import SilderItem from './SilderItem';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
const data = [
    {
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg',
        description: 'Stay on top of your health with the CoreFit Pro Band—your ultimate fitness companion. Track steps, heart rate, sleep cycles, and even oxygen levels in real-time. With a vibrant AMOLED display, water resistance up to 50 meters, and 10-day battery life, its built for both style and endurance.'
    },
    {
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg',
        description: 'Upgrade your workspace with the ErgoAlign Executive Chair, engineered for comfort and productivity. Featuring lumbar support, adjustable headrest, breathable mesh back, and smooth 360° rotation, it’s the perfect blend of function and form for long workdays.'
    },
    {
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg',
        description: 'Experience sound like never before with Auralite XPods. Featuring active noise cancellation, crystal-clear mic quality, and up to 24 hours of battery life with the case, these earbuds are perfect for both work and play—whether you’re on calls or deep into your playlist.'
    },
    {
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/TheLovers.jpg',
        description: 'Crafted from eco-friendly vegan leather, the Nomad Carry-All Backpack blends luxury with sustainability. It offers padded compartments for your laptop and accessories, RFID-protected pockets, and a sleek minimalist design ideal for professionals on the move.'
    },
    {
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg',
        description: 'Meet the Reflekt Pro—a smart mirror that transforms your daily routine. Check the weather, get fitness feedback, view your calendar, or stream workout tutorials, all while prepping for your day. Powered by AI and designed with a frameless aesthetic, it’s both smart and stunning.'
    },
    {
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg',
        description: 'Capture your world from above with the SkyNova Mini Drone. Equipped with a 4K ultra-HD camera, GPS-assisted flight, and real-time mobile streaming, it’s designed for both beginners and hobbyists. Foldable and lightweight, it fits easily in your backpack for every adventure.'
    }
];

export type ItemData = {
    imageUrl: string;
    description: string
}



const Carousel = () => {
    const { styles } = useStyles(stylesheet);
    const scrollX = useSharedValue(0);

    const onScrollHandler = useAnimatedScrollHandler({
        onScroll: (e) =>{
            scrollX.value = e.contentOffset.x
        }
    })
    return (
        <View style={styles.container}>
            <Animated.FlatList onScroll={onScrollHandler} data={data} renderItem={({ item, index }) => <SilderItem scrollX={scrollX} item={item} index={index}  />} horizontal showsHorizontalScrollIndicator={false} pagingEnabled={true}/>
        </View>
    )
}

export default Carousel

const stylesheet = createStyleSheet(theme => ({
    container: {
        flex: 1,
    }
}))
