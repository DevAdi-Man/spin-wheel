import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  interpolate,
  runOnJS,
  cancelAnimation,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Sample data
const SAMPLE_CARDS = [
  { id: 1, title: 'Beautiful Sunset', image: 'https://picsum.photos/300/400?random=1' },
  { id: 2, title: 'Mountain View', image: 'https://picsum.photos/300/400?random=2' },
  { id: 3, title: 'Ocean Waves', image: 'https://picsum.photos/300/400?random=3' },
  { id: 4, title: 'Forest Path', image: 'https://picsum.photos/300/400?random=4' },
  { id: 5, title: 'City Lights', image: 'https://picsum.photos/300/400?random=5' },
];

const SAMPLE_STORIES = [
  { id: 1, image: 'https://picsum.photos/400/600?random=6', text: 'Amazing day!' },
  { id: 2, image: 'https://picsum.photos/400/600?random=7', text: 'Beautiful view' },
  { id: 3, image: 'https://picsum.photos/400/600?random=8', text: 'Perfect moment' },
];

// Tinder-like Card Swiper Component
const CardSwiper = ({ cards, onSwipe }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const likeOpacity = useSharedValue(0);
  const nopeOpacity = useSharedValue(0);
  
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      rotation.value = (event.translationX / 300) * 15;
      
      const distance = Math.sqrt(event.translationX ** 2 + event.translationY ** 2);
      scale.value = Math.max(0.95, 1 - distance / 1000);
      
      if (event.translationX > 50) {
        likeOpacity.value = Math.min(1, event.translationX / 150);
        nopeOpacity.value = 0;
      } else if (event.translationX < -50) {
        nopeOpacity.value = Math.min(1, Math.abs(event.translationX) / 150);
        likeOpacity.value = 0;
      } else {
        likeOpacity.value = 0;
        nopeOpacity.value = 0;
      }
    })
    .onEnd((event) => {
      const { translationX, velocityX } = event;
      const shouldSwipe = Math.abs(translationX) > 120 || Math.abs(velocityX) > 800;
      
      if (shouldSwipe) {
        const direction = translationX > 0 ? 'right' : 'left';
        const targetX = direction === 'right' ? 400 : -400;
        
        translateX.value = withTiming(targetX, { duration: 300 });
        rotation.value = withTiming(direction === 'right' ? 30 : -30, { duration: 300 });
        scale.value = withTiming(0.8, { duration: 300 });
        
        runOnJS(onSwipe)(direction, cards[currentIndex]);
        
        setTimeout(() => {
          runOnJS(moveToNextCard)();
        }, 300);
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        rotation.value = withSpring(0);
        scale.value = withSpring(1);
        likeOpacity.value = withTiming(0);
        nopeOpacity.value = withTiming(0);
      }
    });
  
  const moveToNextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Reset to first card
    }
    
    translateX.value = 0;
    translateY.value = 0;
    rotation.value = 0;
    scale.value = 1;
    likeOpacity.value = 0;
    nopeOpacity.value = 0;
  };
  
  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));
  
  const likeStyle = useAnimatedStyle(() => ({
    opacity: likeOpacity.value,
  }));
  
  const nopeStyle = useAnimatedStyle(() => ({
    opacity: nopeOpacity.value,
  }));
  
  return (
    <View style={styles.swiperContainer}>
      {/* Background card */}
      {currentIndex < cards.length - 1 && (
        <View style={[styles.card, styles.backgroundCard]}>
          <Image
            source={{ uri: cards[currentIndex + 1]?.image }}
            style={styles.cardImage}
          />
          <Text style={styles.cardTitle}>{cards[currentIndex + 1]?.title}</Text>
        </View>
      )}
      
      {/* Active card */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.card, cardStyle]}>
          <Image
            source={{ uri: cards[currentIndex]?.image }}
            style={styles.cardImage}
          />
          <Text style={styles.cardTitle}>{cards[currentIndex]?.title}</Text>
          
          <Animated.View style={[styles.likeIndicator, likeStyle]}>
            <Text style={styles.likeText}>LIKE ❤️</Text>
          </Animated.View>
          
          <Animated.View style={[styles.nopeIndicator, nopeStyle]}>
            <Text style={styles.nopeText}>NOPE 💔</Text>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

// Stories Viewer Component
const StoriesViewer = ({ stories, visible, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const progress = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  
  React.useEffect(() => {
    if (visible) {
      scale.value = withSpring(1);
      opacity.value = withTiming(1);
      startStoryProgress();
    } else {
      scale.value = withTiming(0.8);
      opacity.value = withTiming(0);
    }
  }, [visible, currentIndex]);
  
  const startStoryProgress = () => {
    progress.value = 0;
    progress.value = withTiming(1, { duration: 3000 }, (finished) => {
      if (finished) {
        runOnJS(nextStory)();
      }
    });
  };
  
  const nextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };
  
  const tapGesture = Gesture.Tap()
    .onEnd((event) => {
      const { x } = event;
      if (x < SCREEN_WIDTH / 2) {
        if (currentIndex > 0) {
          runOnJS(setCurrentIndex)(currentIndex - 1);
        }
      } else {
        runOnJS(nextStory)();
      }
    });
  
  const storyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  
  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));
  
  if (!visible) return null;
  
  return (
    <View style={styles.storiesContainer}>
      <Animated.View style={[styles.storyContent, storyStyle]}>
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          {stories.map((_, index) => (
            <View key={index} style={styles.progressBar}>
              {index === currentIndex && (
                <Animated.View style={[styles.progressFill, progressStyle]} />
              )}
              {index < currentIndex && (
                <View style={[styles.progressFill, { width: '100%' }]} />
              )}
            </View>
          ))}
        </View>
        
        <GestureDetector gesture={tapGesture}>
          <View style={styles.storyImageContainer}>
            <Image
              source={{ uri: stories[currentIndex]?.image }}
              style={styles.storyImage}
            />
            <Text style={styles.storyText}>{stories[currentIndex]?.text}</Text>
          </View>
        </GestureDetector>
        
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

// Bottom Sheet Component
const BottomSheet = ({ visible, onClose, children }) => {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);
  
  React.useEffect(() => {
    if (visible) {
      translateY.value = withSpring(SCREEN_HEIGHT * 0.3);
      backdropOpacity.value = withTiming(0.5);
    } else {
      translateY.value = withTiming(SCREEN_HEIGHT);
      backdropOpacity.value = withTiming(0);
    }
  }, [visible]);
  
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newY = SCREEN_HEIGHT * 0.3 + event.translationY;
      if (newY >= SCREEN_HEIGHT * 0.3) {
        translateY.value = newY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 100 || event.velocityY > 500) {
        translateY.value = withTiming(SCREEN_HEIGHT);
        backdropOpacity.value = withTiming(0);
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(SCREEN_HEIGHT * 0.3);
      }
    });
  
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
    pointerEvents: backdropOpacity.value > 0 ? 'auto' : 'none',
  }));
  
  if (!visible) return null;
  
  return (
    <View style={styles.bottomSheetContainer}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>
      
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.bottomSheet, sheetStyle]}>
          <View style={styles.handle} />
          <ScrollView style={styles.sheetContent}>
            {children}
          </ScrollView>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

// Main App Component
const CompleteApp = () => {
  const [showStories, setShowStories] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [swipeHistory, setSwipeHistory] = useState([]);
  
  const handleSwipe = (direction, card) => {
    setSwipeHistory(prev => [...prev, { direction, card: card.title }]);
  };
  
  const clearHistory = () => {
    setSwipeHistory([]);
  };
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reanimated Showcase</Text>
        <Text style={styles.headerSubtitle}>Complete Real-world Examples</Text>
      </View>
      
      {/* Main Content */}
      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        {/* Card Swiper Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tinder-like Card Swiper</Text>
          <Text style={styles.sectionDescription}>
            Swipe left or right to interact with cards
          </Text>
          <CardSwiper cards={SAMPLE_CARDS} onSwipe={handleSwipe} />
        </View>
        
        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.actionButton, styles.storiesButton]}
            onPress={() => setShowStories(true)}
          >
            <Text style={styles.buttonText}>📱 View Stories</Text>
          </Pressable>
          
          <Pressable
            style={[styles.actionButton, styles.sheetButton]}
            onPress={() => setShowBottomSheet(true)}
          >
            <Text style={styles.buttonText}>📋 Show Details</Text>
          </Pressable>
        </View>
        
        {/* Swipe History */}
        {swipeHistory.length > 0 && (
          <View style={styles.historySection}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Swipe History</Text>
              <Pressable onPress={clearHistory} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </Pressable>
            </View>
            {swipeHistory.slice(-5).map((item, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyText}>
                  {item.direction === 'right' ? '❤️' : '💔'} {item.card}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      
      {/* Stories Viewer */}
      <StoriesViewer
        stories={SAMPLE_STORIES}
        visible={showStories}
        onClose={() => setShowStories(false)}
      />
      
      {/* Bottom Sheet */}
      <BottomSheet
        visible={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
      >
        <View style={styles.sheetContentContainer}>
          <Text style={styles.sheetTitle}>App Features</Text>
          <Text style={styles.sheetText}>
            This app demonstrates advanced React Native Reanimated features:
          </Text>
          
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>• Gesture-based card swiping</Text>
            <Text style={styles.featureItem}>• Instagram-like stories viewer</Text>
            <Text style={styles.featureItem}>• Interactive bottom sheet</Text>
            <Text style={styles.featureItem}>• Smooth animations & transitions</Text>
            <Text style={styles.featureItem}>• Multi-touch gesture handling</Text>
            <Text style={styles.featureItem}>• Performance optimizations</Text>
          </View>
          
          <Text style={styles.sheetFooter}>
            Built with React Native Reanimated 3 🚀
          </Text>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#2d2d2d',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
  },
  mainContent: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  swiperContainer: {
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: SCREEN_WIDTH - 60,
    height: 350,
    backgroundColor: 'white',
    borderRadius: 20,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  backgroundCard: {
    transform: [{ scale: 0.95 }],
    opacity: 0.8,
  },
  cardImage: {
    width: '100%',
    height: 250,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'center',
  },
  likeIndicator: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(76, 217, 100, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    transform: [{ rotate: '-15deg' }],
  },
  nopeIndicator: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    transform: [{ rotate: '15deg' }],
  },
  likeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  nopeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    minWidth: 140,
  },
  storiesButton: {
    backgroundColor: '#6c5ce7',
  },
  sheetButton: {
    backgroundColor: '#00b894',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  historySection: {
    margin: 20,
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    padding: 20,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  clearButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  historyItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  historyText: {
    color: '#888',
    fontSize: 16,
  },
  // Stories styles
  storiesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    zIndex: 1000,
  },
  storyContent: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingTop: 50,
    gap: 5,
  },
  progressBar: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  storyImageContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  storyImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'cover',
  },
  storyText: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  // Bottom sheet styles
  bottomSheetContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: SCREEN_HEIGHT * 0.7,
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sheetContentContainer: {
    paddingBottom: 40,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  sheetText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  featureList: {
    marginBottom: 30,
  },
  featureItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  sheetFooter: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#6c5ce7',
  },
});

export default CompleteApp;
