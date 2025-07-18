import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { 
  Easing, 
  BounceIn, 
  BounceOut,
  FadeIn, 
  FadeOut,
  SlideInLeft, 
  SlideOutRight,
  SlideInUp, 
  SlideOutDown,
  ZoomIn, 
  ZoomOut,
  Layout,
  LinearTransition,
  FadeInDown,
  FadeInUp,
  FadeInLeft,
  FadeInRight,
  SlideInDown,
  SlideInRight,
  StretchInX,
  StretchInY,
  StretchOutX,
  StretchOutY,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

const { width } = Dimensions.get('window');

interface AnimationItem {
  id: string;
  title: string;
  entering: any;
  exiting: any;
  color: string;
  description: string;
}

const animationData: AnimationItem[] = [
  {
    id: '1',
    title: 'Fade In/Out',
    entering: FadeIn.duration(800),
    exiting: FadeOut.duration(500),
    color: '#FF6B6B',
    description: 'Classic fade animation'
  },
  {
    id: '2',
    title: 'Slide Vertical',
    entering: SlideInUp.duration(600).springify(),
    exiting: SlideOutDown.duration(400),
    color: '#4ECDC4',
    description: 'Smooth vertical slide'
  },
  {
    id: '3',
    title: 'Slide Horizontal',
    entering: SlideInLeft.duration(700).damping(15),
    exiting: SlideOutRight.duration(500),
    color: '#45B7D1',
    description: 'Horizontal slide with damping'
  },
  {
    id: '4',
    title: 'Zoom Effect',
    entering: ZoomIn.delay(200).duration(800),
    exiting: ZoomOut.duration(600),
    color: '#96CEB4',
    description: 'Zoom with delay'
  },
  {
    id: '5',
    title: 'Bounce Animation',
    entering: BounceIn.duration(1000),
    exiting: BounceOut.duration(700),
    color: '#FFEAA7',
    description: 'Playful bounce effect'
  },
  {
    id: '6',
    title: 'Stretch X',
    entering: StretchInX.duration(800),
    exiting: StretchOutX.duration(600),
    color: '#DDA0DD',
    description: 'Horizontal stretch'
  },
  {
    id: '7',
    title: 'Stretch Y',
    entering: StretchInY.duration(900),
    exiting: StretchOutY.duration(500),
    color: '#F8BBD9',
    description: 'Vertical stretch'
  },
  {
    id: '8',
    title: 'Complex Chain',
    entering: FadeInDown.delay(300).duration(800).springify().damping(20),
    exiting: FadeInUp.duration(600),
    color: '#FFB347',
    description: 'Chained animations'
  },
];

interface AnimatedCardProps {
  item: AnimationItem;
  onRemove: (id: string) => void;
  index: number;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ item, onRemove, index }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePress = useCallback(() => {
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    
    // Add a slight delay before removing
    setTimeout(() => {
      runOnJS(onRemove)(item.id);
    }, 100);
  }, [item.id, onRemove, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      entering={item.entering.delay(index * 100)}
      exiting={item.exiting}
      layout={Layout.springify().damping(20).stiffness(100)}
      style={[animatedStyle]}
    >
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.card, { backgroundColor: item.color }]}
        activeOpacity={0.8}
      >
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.tapHint}>Tap to remove</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const AdvancedLayoutAnimation: React.FC = () => {
  const { styles } = useStyles(stylesheet);
  const [items, setItems] = useState<AnimationItem[]>(animationData);
  const [isResetting, setIsResetting] = useState(false);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const resetItems = useCallback(() => {
    setIsResetting(true);
    setItems([]);
    
    setTimeout(() => {
      setItems(animationData);
      setIsResetting(false);
    }, 500);
  }, []);

  const addRandomItem = useCallback(() => {
    const randomItem = animationData[Math.floor(Math.random() * animationData.length)];
    const newItem = {
      ...randomItem,
      id: Date.now().toString(),
    };
    setItems(prev => [...prev, newItem]);
  }, []);

  const shuffleItems = useCallback(() => {
    setItems(prev => [...prev].sort(() => Math.random() - 0.5));
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View 
        entering={FadeInDown.duration(800)}
        style={styles.header}
      >
        <Text style={styles.title}>Advanced Layout Animations</Text>
        <Text style={styles.subtitle}>Interactive Animation Showcase</Text>
      </Animated.View>

      {/* Control Buttons */}
      <Animated.View 
        entering={FadeInUp.delay(200).duration(600)}
        style={styles.controls}
      >
        <TouchableOpacity 
          onPress={resetItems} 
          style={[styles.controlButton, styles.resetButton]}
          disabled={isResetting}
        >
          <Text style={styles.controlButtonText}>
            {isResetting ? 'Resetting...' : 'Reset All'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={addRandomItem} 
          style={[styles.controlButton, styles.addButton]}
        >
          <Text style={styles.controlButtonText}>Add Item</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={shuffleItems} 
          style={[styles.controlButton, styles.shuffleButton]}
        >
          <Text style={styles.controlButtonText}>Shuffle</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Items List */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {items.length === 0 ? (
          <Animated.View 
            entering={FadeIn.delay(300)}
            style={styles.emptyState}
          >
            <Text style={styles.emptyText}>No items to display</Text>
            <Text style={styles.emptySubtext}>Tap "Reset All" to restore items</Text>
          </Animated.View>
        ) : (
          items.map((item, index) => (
            <AnimatedCard
              key={item.id}
              item={item}
              onRemove={removeItem}
              index={index}
            />
          ))
        )}
      </ScrollView>

      {/* Footer */}
      <Animated.View 
        entering={FadeInUp.delay(400).duration(600)}
        style={styles.footer}
      >
        <Text style={styles.footerText}>
          Items: {items.length} • Tap cards to remove them
        </Text>
      </Animated.View>
    </View>
  );
};

export default AdvancedLayoutAnimation;

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text,
    opacity: 0.7,
    marginTop: 5,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  controlButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    backgroundColor: '#FF6B6B',
  },
  addButton: {
    backgroundColor: '#4ECDC4',
  },
  shuffleButton: {
    backgroundColor: '#45B7D1',
  },
  controlButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    opacity: 0.6,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.text,
    opacity: 0.4,
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: theme.colors.text,
    opacity: 0.6,
  },
}));

const styles = StyleSheet.create({
  card: {
    width: '100%',
    minHeight: 120,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  cardContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    lineHeight: 20,
  },
  cardFooter: {
    marginTop: 15,
    alignItems: 'flex-end',
  },
  tapHint: {
    fontSize: 12,
    color: 'white',
    opacity: 0.7,
    fontStyle: 'italic',
  },
});
