// Day 8: Master Level Exercise Solutions
// Complete solutions for all complex animation exercises

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Image,
  Dimensions,
  TextInput,
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

// Exercise Solution 1: Instagram Stories Viewer
export const InstagramStoriesViewer = ({ stories, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  
  const progress = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);
  const moreInfoY = useSharedValue(SCREEN_HEIGHT);
  
  const STORY_DURATION = 5000;
  
  useEffect(() => {
    // Entrance animation
    scale.value = withSpring(1, { damping: 15 });
    opacity.value = withTiming(1, { duration: 300 });
    
    // Start story progress
    startStoryProgress();
  }, [currentIndex]);
  
  useEffect(() => {
    if (isPaused) {
      cancelAnimation(progress);
    } else {
      startStoryProgress();
    }
  }, [isPaused]);
  
  const startStoryProgress = () => {
    if (isPaused) return;
    
    const remainingTime = (1 - progress.value) * STORY_DURATION;
    progress.value = withTiming(1, {
      duration: remainingTime,
    }, (finished) => {
      if (finished && !isPaused) {
        runOnJS(nextStory)();
      }
    });
  };
  
  const nextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      progress.value = 0;
    } else {
      onClose();
    }
  };
  
  const prevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      progress.value = 0;
    }
  };
  
  const toggleMoreInfo = () => {
    setShowMoreInfo(!showMoreInfo);
    moreInfoY.value = withSpring(showMoreInfo ? SCREEN_HEIGHT : SCREEN_HEIGHT * 0.3);
  };
  
  // Gesture handling
  const tapGesture = Gesture.Tap()
    .onEnd((event) => {
      const { x } = event;
      if (x < SCREEN_WIDTH / 2) {
        runOnJS(prevStory)();
      } else {
        runOnJS(nextStory)();
      }
    });
  
  const longPressGesture = Gesture.LongPress()
    .minDuration(200)
    .onStart(() => {
      runOnJS(setIsPaused)(true);
    })
    .onEnd(() => {
      runOnJS(setIsPaused)(false);
    });
  
  const panGesture = Gesture.Pan()
    .onEnd((event) => {
      if (event.translationY < -100) {
        runOnJS(toggleMoreInfo)();
      } else if (event.translationY > 100) {
        runOnJS(onClose)();
      }
    });
  
  const combinedGesture = Gesture.Simultaneous(
    Gesture.Race(tapGesture, longPressGesture),
    panGesture
  );
  
  const storyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  
  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));
  
  const moreInfoStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: moreInfoY.value }],
  }));
  
  return (
    <View style={styles.storiesContainer}>
      <Animated.View style={[styles.storyContent, storyStyle]}>
        {/* Progress indicators */}
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
        
        {/* Story content */}
        <GestureDetector gesture={combinedGesture}>
          <View style={styles.storyImageContainer}>
            <Image
              source={{ uri: stories[currentIndex]?.image }}
              style={styles.storyImage}
            />
            <Text style={styles.storyText}>
              {stories[currentIndex]?.text}
            </Text>
            
            {/* Pause indicator */}
            {isPaused && (
              <View style={styles.pauseIndicator}>
                <Text style={styles.pauseText}>⏸️</Text>
              </View>
            )}
          </View>
        </GestureDetector>
        
        {/* Close button */}
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </Animated.View>
      
      {/* More info panel */}
      <Animated.View style={[styles.moreInfoPanel, moreInfoStyle]}>
        <View style={styles.moreInfoContent}>
          <Text style={styles.moreInfoTitle}>Story Details</Text>
          <Text style={styles.moreInfoText}>
            {stories[currentIndex]?.description || 'No additional information available.'}
          </Text>
          <Pressable onPress={toggleMoreInfo} style={styles.moreInfoClose}>
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
};

// Exercise Solution 2: Advanced Tinder Cards
export const AdvancedTinderCards = ({ cards, onSwipe, onEmpty }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const likeOpacity = useSharedValue(0);
  const nopeOpacity = useSharedValue(0);
  const superLikeOpacity = useSharedValue(0);
  
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      
      // Advanced rotation calculation
      const rotationFactor = (event.translationX / SCREEN_WIDTH) * 30;
      const verticalFactor = Math.abs(event.translationY) / SCREEN_HEIGHT;
      rotation.value = rotationFactor * (1 - verticalFactor);
      
      // Dynamic scale based on distance
      const distance = Math.sqrt(
        event.translationX ** 2 + event.translationY ** 2
      );
      scale.value = Math.max(0.85, 1 - distance / 1500);
      
      // Advanced indicator logic
      const horizontalThreshold = 80;
      const verticalThreshold = -120;
      
      if (event.translationY < verticalThreshold) {
        // Super like (swipe up)
        superLikeOpacity.value = Math.min(
          1,
          Math.abs(event.translationY - verticalThreshold) / 100
        );
        likeOpacity.value = 0;
        nopeOpacity.value = 0;
      } else if (event.translationX > horizontalThreshold) {
        // Like (swipe right)
        likeOpacity.value = Math.min(
          1,
          (event.translationX - horizontalThreshold) / 100
        );
        nopeOpacity.value = 0;
        superLikeOpacity.value = 0;
      } else if (event.translationX < -horizontalThreshold) {
        // Nope (swipe left)
        nopeOpacity.value = Math.min(
          1,
          Math.abs(event.translationX + horizontalThreshold) / 100
        );
        likeOpacity.value = 0;
        superLikeOpacity.value = 0;
      } else {
        // Reset all indicators
        likeOpacity.value = 0;
        nopeOpacity.value = 0;
        superLikeOpacity.value = 0;
      }
    })
    .onEnd((event) => {
      const { translationX, translationY, velocityX, velocityY } = event;
      
      // Decision logic with velocity consideration
      const swipeThreshold = 120;
      const velocityThreshold = 800;
      const superLikeThreshold = -150;
      
      let swipeDirection = null;
      
      if (translationY < superLikeThreshold || velocityY < -velocityThreshold) {
        swipeDirection = 'super_like';
      } else if (
        translationX > swipeThreshold || 
        velocityX > velocityThreshold
      ) {
        swipeDirection = 'like';
      } else if (
        translationX < -swipeThreshold || 
        velocityX < -velocityThreshold
      ) {
        swipeDirection = 'nope';
      }
      
      if (swipeDirection) {
        // Animate card out with physics
        const targetX = swipeDirection === 'like' ? SCREEN_WIDTH : 
                       swipeDirection === 'nope' ? -SCREEN_WIDTH : 0;
        const targetY = swipeDirection === 'super_like' ? -SCREEN_HEIGHT : 
                       translateY.value + velocityY * 0.1;
        const targetRotation = swipeDirection === 'like' ? 45 : 
                              swipeDirection === 'nope' ? -45 : 0;
        
        translateX.value = withTiming(targetX, { duration: 300 });
        translateY.value = withTiming(targetY, { duration: 300 });
        rotation.value = withTiming(targetRotation, { duration: 300 });
        scale.value = withTiming(0.8, { duration: 300 });
        
        // Callback
        runOnJS(onSwipe)(swipeDirection, cards[currentIndex]);
        
        setTimeout(() => {
          runOnJS(moveToNextCard)();
        }, 300);
      } else {
        // Return to center with spring physics
        translateX.value = withSpring(0, { damping: 15, stiffness: 150 });
        translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
        rotation.value = withSpring(0, { damping: 15 });
        scale.value = withSpring(1, { damping: 15 });
        
        // Reset indicators
        likeOpacity.value = withTiming(0);
        nopeOpacity.value = withTiming(0);
        superLikeOpacity.value = withTiming(0);
      }
    });
  
  const moveToNextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(nextIndex);
      setNextIndex(nextIndex + 1);
    } else {
      onEmpty();
    }
    
    // Reset all animations
    translateX.value = 0;
    translateY.value = 0;
    rotation.value = 0;
    scale.value = 1;
    likeOpacity.value = 0;
    nopeOpacity.value = 0;
    superLikeOpacity.value = 0;
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
    transform: [{ scale: 0.8 + likeOpacity.value * 0.2 }],
  }));
  
  const nopeStyle = useAnimatedStyle(() => ({
    opacity: nopeOpacity.value,
    transform: [{ scale: 0.8 + nopeOpacity.value * 0.2 }],
  }));
  
  const superLikeStyle = useAnimatedStyle(() => ({
    opacity: superLikeOpacity.value,
    transform: [{ scale: 0.8 + superLikeOpacity.value * 0.2 }],
  }));
  
  if (currentIndex >= cards.length) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No more cards!</Text>
        <Text style={styles.emptySubtext}>Check back later for more profiles</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.cardContainer}>
      {/* Background cards for stack effect */}
      {[1, 2].map((offset) => {
        const cardIndex = currentIndex + offset;
        if (cardIndex >= cards.length) return null;
        
        return (
          <View
            key={cardIndex}
            style={[
              styles.card,
              styles.backgroundCard,
              {
                zIndex: -offset,
                transform: [
                  { scale: 1 - offset * 0.05 },
                  { translateY: offset * 8 },
                ],
                opacity: 1 - offset * 0.2,
              },
            ]}
          >
            <Image
              source={{ uri: cards[cardIndex].image }}
              style={styles.cardImage}
            />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{cards[cardIndex].name}</Text>
              <Text style={styles.cardAge}>{cards[cardIndex].age}</Text>
            </View>
          </View>
        );
      })}
      
      {/* Active card */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.card, cardStyle]}>
          <Image
            source={{ uri: cards[currentIndex]?.image }}
            style={styles.cardImage}
          />
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{cards[currentIndex]?.name}</Text>
            <Text style={styles.cardAge}>{cards[currentIndex]?.age}</Text>
          </View>
          
          {/* Action indicators */}
          <Animated.View style={[styles.likeIndicator, likeStyle]}>
            <Text style={styles.likeText}>LIKE ❤️</Text>
          </Animated.View>
          
          <Animated.View style={[styles.nopeIndicator, nopeStyle]}>
            <Text style={styles.nopeText}>NOPE 💔</Text>
          </Animated.View>
          
          <Animated.View style={[styles.superLikeIndicator, superLikeStyle]}>
            <Text style={styles.superLikeText}>SUPER LIKE ⭐</Text>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

// Exercise Solution 3: Morphing Search Bar
export const MorphingSearchBar = ({ onSearch }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  
  const width = useSharedValue(40);
  const borderRadius = useSharedValue(20);
  const iconOpacity = useSharedValue(1);
  const inputOpacity = useSharedValue(0);
  const cancelOpacity = useSharedValue(0);
  
  const mockSuggestions = [
    'React Native',
    'Reanimated',
    'Gesture Handler',
    'Animation',
    'Mobile Development',
  ];
  
  const expandSearchBar = () => {
    setIsExpanded(true);
    
    // Morph animations
    width.value = withSpring(SCREEN_WIDTH - 40, { damping: 15 });
    borderRadius.value = withSpring(8, { damping: 15 });
    iconOpacity.value = withTiming(0, { duration: 200 });
    inputOpacity.value = withTiming(1, { duration: 300 });
    cancelOpacity.value = withTiming(1, { duration: 300 });
  };
  
  const collapseSearchBar = () => {
    setIsExpanded(false);
    setSearchText('');
    setSuggestions([]);
    
    // Reverse morph animations
    width.value = withSpring(40, { damping: 15 });
    borderRadius.value = withSpring(20, { damping: 15 });
    iconOpacity.value = withTiming(1, { duration: 300 });
    inputOpacity.value = withTiming(0, { duration: 200 });
    cancelOpacity.value = withTiming(0, { duration: 200 });
  };
  
  const handleTextChange = (text) => {
    setSearchText(text);
    
    // Filter suggestions
    if (text.length > 0) {
      const filtered = mockSuggestions.filter(item =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };
  
  const searchBarStyle = useAnimatedStyle(() => ({
    width: width.value,
    borderRadius: borderRadius.value,
  }));
  
  const iconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
  }));
  
  const inputStyle = useAnimatedStyle(() => ({
    opacity: inputOpacity.value,
  }));
  
  const cancelStyle = useAnimatedStyle(() => ({
    opacity: cancelOpacity.value,
  }));
  
  return (
    <View style={styles.searchContainer}>
      <Animated.View style={[styles.searchBar, searchBarStyle]}>
        {/* Search icon */}
        <Animated.View style={[styles.searchIcon, iconStyle]}>
          <Pressable onPress={expandSearchBar}>
            <Text style={styles.iconText}>🔍</Text>
          </Pressable>
        </Animated.View>
        
        {/* Search input */}
        <Animated.View style={[styles.searchInput, inputStyle]}>
          <TextInput
            value={searchText}
            onChangeText={handleTextChange}
            placeholder="Search..."
            placeholderTextColor="#999"
            style={styles.textInput}
            autoFocus={isExpanded}
          />
        </Animated.View>
        
        {/* Cancel button */}
        <Animated.View style={[styles.cancelButton, cancelStyle]}>
          <Pressable onPress={collapseSearchBar}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
      
      {/* Suggestions */}
      {suggestions.length > 0 && (
        <View style={styles.suggestions}>
          {suggestions.map((suggestion, index) => (
            <SuggestionItem
              key={suggestion}
              text={suggestion}
              index={index}
              onPress={() => {
                setSearchText(suggestion);
                onSearch(suggestion);
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const SuggestionItem = ({ text, index, onPress }) => {
  const translateX = useSharedValue(-100);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    const delay = index * 50;
    setTimeout(() => {
      translateX.value = withSpring(0, { damping: 15 });
      opacity.value = withTiming(1, { duration: 300 });
    }, delay);
  }, []);
  
  const itemStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));
  
  return (
    <Animated.View style={[styles.suggestionItem, itemStyle]}>
      <Pressable onPress={onPress} style={styles.suggestionButton}>
        <Text style={styles.suggestionText}>{text}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // Instagram Stories Styles
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
  pauseIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseText: {
    fontSize: 20,
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
  moreInfoPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: SCREEN_HEIGHT * 0.7,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  moreInfoContent: {
    padding: 20,
  },
  moreInfoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  moreInfoText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 20,
  },
  moreInfoClose: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  // Tinder Cards Styles
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: SCREEN_WIDTH - 40,
    height: SCREEN_HEIGHT * 0.7,
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
    opacity: 0.8,
  },
  cardImage: {
    width: '100%',
    height: '75%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardInfo: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardAge: {
    fontSize: 20,
    color: '#666',
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
  superLikeIndicator: {
    position: 'absolute',
    top: 20,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: 'rgba(0, 123, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
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
  superLikeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
  },
  
  // Search Bar Styles
  searchContainer: {
    padding: 20,
  },
  searchBar: {
    height: 40,
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  searchIcon: {
    position: 'absolute',
    left: 10,
  },
  iconText: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 40,
    marginRight: 60,
  },
  textInput: {
    fontSize: 16,
    color: '#333',
  },
  cancelButton: {
    position: 'absolute',
    right: 10,
  },
  cancelText: {
    color: '#007bff',
    fontSize: 16,
  },
  suggestions: {
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionButton: {
    padding: 15,
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
  },
});
