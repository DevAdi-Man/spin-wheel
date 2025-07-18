import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Image,
  Dimensions,
  ScrollView,
  FlatList,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withRepeat,
  interpolate,
  runOnJS,
  cancelAnimation,
  interpolateColor,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Sample data
const SAMPLE_PHOTOS = [
  { id: 1, uri: 'https://picsum.photos/300/400?random=1', title: 'Beautiful Sunset' },
  { id: 2, uri: 'https://picsum.photos/300/400?random=2', title: 'Mountain View' },
  { id: 3, uri: 'https://picsum.photos/300/400?random=3', title: 'Ocean Waves' },
  { id: 4, uri: 'https://picsum.photos/300/400?random=4', title: 'Forest Path' },
];

// 1. Shared Element Transition Example
const SharedElementExample = () => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  
  const openPhoto = (photo) => {
    setSelectedPhoto(photo);
    
    // Animate to fullscreen
    scale.value = withTiming(SCREEN_WIDTH / 150, { duration: 400 });
    translateX.value = withTiming(0, { duration: 400 });
    translateY.value = withTiming(-100, { duration: 400 });
  };
  
  const closePhoto = () => {
    // Animate back to thumbnail
    scale.value = withTiming(1, { duration: 300 });
    translateX.value = withTiming(0, { duration: 300 });
    translateY.value = withTiming(0, { duration: 300 });
    
    setTimeout(() => {
      setSelectedPhoto(null);
    }, 300);
  };
  
  const sharedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));
  
  if (selectedPhoto) {
    return (
      <View style={styles.fullscreenContainer}>
        <Animated.Image
          source={{ uri: selectedPhoto.uri }}
          style={[styles.fullscreenImage, sharedStyle]}
        />
        <Pressable onPress={closePhoto} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </View>
    );
  }
  
  return (
    <View style={styles.gridContainer}>
      <Text style={styles.sectionTitle}>Shared Element Transition</Text>
      <View style={styles.photoGrid}>
        {SAMPLE_PHOTOS.map((photo) => (
          <Pressable key={photo.id} onPress={() => openPhoto(photo)}>
            <Animated.Image
              source={{ uri: photo.uri }}
              style={[styles.thumbnail, sharedStyle]}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
};

// 2. Morphing FAB Example
const MorphingFAB = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const width = useSharedValue(56);
  const height = useSharedValue(56);
  const borderRadius = useSharedValue(28);
  const rotation = useSharedValue(0);
  
  const toggleExpansion = () => {
    if (isExpanded) {
      // Morph back to FAB
      width.value = withSpring(56, { damping: 15 });
      height.value = withSpring(56, { damping: 15 });
      borderRadius.value = withSpring(28, { damping: 15 });
      rotation.value = withSpring(0, { damping: 15 });
      setIsExpanded(false);
    } else {
      // Morph to menu
      width.value = withSpring(200, { damping: 15 });
      height.value = withSpring(280, { damping: 15 });
      borderRadius.value = withSpring(12, { damping: 15 });
      rotation.value = withSpring(45, { damping: 15 });
      setIsExpanded(true);
    }
  };
  
  const morphStyle = useAnimatedStyle(() => ({
    width: width.value,
    height: height.value,
    borderRadius: borderRadius.value,
  }));
  
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
  
  return (
    <View style={styles.fabContainer}>
      <Text style={styles.sectionTitle}>Morphing FAB</Text>
      <Animated.View style={[styles.fab, morphStyle]}>
        {isExpanded ? (
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Quick Actions</Text>
            {['Camera', 'Gallery', 'Files', 'Contacts'].map((item, index) => (
              <Pressable key={item} style={styles.menuItem}>
                <Text style={styles.menuItemText}>{item}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
        
        <Pressable onPress={toggleExpansion} style={styles.fabButton}>
          <Animated.Text style={[styles.fabIcon, iconStyle]}>+</Animated.Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

// 3. Physics Ball Example
const PhysicsBall = () => {
  const ballY = useSharedValue(0);
  const ballX = useSharedValue(SCREEN_WIDTH / 2 - 25);
  const velocityY = useSharedValue(0);
  const velocityX = useSharedValue(0);
  const isAnimating = useSharedValue(false);
  
  const GRAVITY = 0.8;
  const BOUNCE_DAMPING = 0.7;
  const FRICTION = 0.98;
  const GROUND_Y = 300;
  const WALL_LEFT = 0;
  const WALL_RIGHT = SCREEN_WIDTH - 50;
  
  const startPhysics = () => {
    if (isAnimating.value) return;
    
    isAnimating.value = true;
    velocityY.value = -25; // Initial upward velocity
    velocityX.value = (Math.random() - 0.5) * 20; // Random horizontal velocity
    
    const animate = () => {
      // Apply gravity
      velocityY.value += GRAVITY;
      
      // Apply friction
      velocityX.value *= FRICTION;
      
      // Update position
      ballY.value += velocityY.value;
      ballX.value += velocityX.value;
      
      // Ground collision
      if (ballY.value >= GROUND_Y) {
        ballY.value = GROUND_Y;
        velocityY.value *= -BOUNCE_DAMPING;
        
        // Stop if velocity is too low
        if (Math.abs(velocityY.value) < 2) {
          isAnimating.value = false;
          return;
        }
      }
      
      // Wall collisions
      if (ballX.value <= WALL_LEFT || ballX.value >= WALL_RIGHT) {
        velocityX.value *= -BOUNCE_DAMPING;
        ballX.value = Math.max(WALL_LEFT, Math.min(WALL_RIGHT, ballX.value));
      }
      
      // Continue animation
      if (isAnimating.value) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  };
  
  const resetBall = () => {
    cancelAnimation(ballY);
    cancelAnimation(ballX);
    isAnimating.value = false;
    ballY.value = withSpring(0);
    ballX.value = withSpring(SCREEN_WIDTH / 2 - 25);
    velocityY.value = 0;
    velocityX.value = 0;
  };
  
  const ballStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: ballX.value },
      { translateY: ballY.value },
    ],
  }));
  
  return (
    <View style={styles.physicsContainer}>
      <Text style={styles.sectionTitle}>Physics Ball</Text>
      <View style={styles.physicsArea}>
        <Animated.View style={[styles.ball, ballStyle]} />
        <View style={styles.ground} />
      </View>
      
      <View style={styles.physicsControls}>
        <Pressable onPress={startPhysics} style={styles.physicsButton}>
          <Text style={styles.buttonText}>Drop Ball</Text>
        </Pressable>
        <Pressable onPress={resetBall} style={[styles.physicsButton, styles.resetButton]}>
          <Text style={styles.buttonText}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
};

// 4. Advanced Photo Viewer
const AdvancedPhotoViewer = ({ photo, onClose }) => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  
  // Pinch gesture for zoom
  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = Math.max(0.5, Math.min(savedScale.value * event.scale, 4));
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      
      // Auto-fit if zoomed out too much
      if (scale.value < 1) {
        scale.value = withSpring(1);
        savedScale.value = 1;
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      }
    });
  
  // Pan gesture for moving
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (savedScale.value > 1) {
        translateX.value = savedTranslateX.value + event.translationX;
        translateY.value = savedTranslateY.value + event.translationY;
      } else {
        // Allow vertical pan for close gesture
        translateY.value = Math.max(0, event.translationY);
      }
    })
    .onEnd((event) => {
      if (savedScale.value <= 1 && event.translationY > 100) {
        // Close gesture
        runOnJS(onClose)();
        return;
      }
      
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
      
      // Boundary constraints when zoomed
      if (savedScale.value > 1) {
        const maxTranslateX = (SCREEN_WIDTH * (scale.value - 1)) / 2;
        const maxTranslateY = (SCREEN_HEIGHT * (scale.value - 1)) / 2;
        
        if (Math.abs(translateX.value) > maxTranslateX) {
          translateX.value = withSpring(
            translateX.value > 0 ? maxTranslateX : -maxTranslateX
          );
          savedTranslateX.value = translateX.value;
        }
        
        if (Math.abs(translateY.value) > maxTranslateY) {
          translateY.value = withSpring(
            translateY.value > 0 ? maxTranslateY : -maxTranslateY
          );
          savedTranslateY.value = translateY.value;
        }
      } else {
        translateY.value = withSpring(0);
        savedTranslateY.value = 0;
      }
    });
  
  // Double tap to zoom
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value === 1) {
        scale.value = withSpring(2.5);
        savedScale.value = 2.5;
      } else {
        scale.value = withSpring(1);
        savedScale.value = 1;
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      }
    });
  
  const combinedGesture = Gesture.Simultaneous(
    Gesture.Simultaneous(pinchGesture, panGesture),
    doubleTapGesture
  );
  
  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));
  
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [0, 200], [1, 0], 'clamp'),
  }));
  
  return (
    <View style={styles.photoViewerContainer}>
      <Animated.View style={[styles.photoViewerOverlay, overlayStyle]}>
        <Pressable onPress={onClose} style={styles.photoViewerClose}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </Animated.View>
      
      <GestureDetector gesture={combinedGesture}>
        <Animated.Image
          source={{ uri: photo.uri }}
          style={[styles.photoViewerImage, imageStyle]}
          resizeMode="contain"
        />
      </GestureDetector>
    </View>
  );
};

// 5. Staggered List Animation
const StaggeredList = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const loadItems = () => {
    setIsLoading(true);
    setItems([]);
    
    // Simulate loading with staggered appearance
    const newItems = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      title: `Item ${i + 1}`,
      subtitle: `Description for item ${i + 1}`,
    }));
    
    newItems.forEach((item, index) => {
      setTimeout(() => {
        setItems(prev => [...prev, item]);
        if (index === newItems.length - 1) {
          setIsLoading(false);
        }
      }, index * 100);
    });
  };
  
  const renderItem = ({ item, index }) => (
    <StaggeredListItem item={item} index={index} />
  );
  
  return (
    <View style={styles.listContainer}>
      <Text style={styles.sectionTitle}>Staggered List</Text>
      <Pressable onPress={loadItems} style={styles.loadButton}>
        <Text style={styles.buttonText}>
          {isLoading ? 'Loading...' : 'Load Items'}
        </Text>
      </Pressable>
      
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        style={styles.list}
      />
    </View>
  );
};

const StaggeredListItem = ({ item, index }) => {
  const translateX = useSharedValue(-100);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  
  useEffect(() => {
    // Staggered entrance animation
    const delay = index * 50;
    
    setTimeout(() => {
      translateX.value = withSpring(0, { damping: 15 });
      opacity.value = withTiming(1, { duration: 400 });
      scale.value = withSpring(1, { damping: 12 });
    }, delay);
  }, []);
  
  const itemStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));
  
  return (
    <Animated.View style={[styles.listItem, itemStyle]}>
      <View style={styles.listItemContent}>
        <Text style={styles.listItemTitle}>{item.title}</Text>
        <Text style={styles.listItemSubtitle}>{item.subtitle}</Text>
      </View>
    </Animated.View>
  );
};

// Main Component
const ComplexAnimationExamples = () => {
  const [selectedExample, setSelectedExample] = useState('shared');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  
  const examples = [
    { id: 'shared', title: 'Shared Element', component: SharedElementExample },
    { id: 'morphing', title: 'Morphing FAB', component: MorphingFAB },
    { id: 'physics', title: 'Physics Ball', component: PhysicsBall },
    { id: 'list', title: 'Staggered List', component: StaggeredList },
  ];
  
  const renderExample = () => {
    const example = examples.find(ex => ex.id === selectedExample);
    const Component = example.component;
    return <Component />;
  };
  
  if (selectedPhoto) {
    return (
      <AdvancedPhotoViewer
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Master Level Complex Animations</Text>
      
      {/* Example Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.selector}
        contentContainerStyle={styles.selectorContent}
      >
        {examples.map((example) => (
          <Pressable
            key={example.id}
            onPress={() => setSelectedExample(example.id)}
            style={[
              styles.selectorButton,
              selectedExample === example.id && styles.selectedButton,
            ]}
          >
            <Text
              style={[
                styles.selectorText,
                selectedExample === example.id && styles.selectedText,
              ]}
            >
              {example.title}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      
      {/* Example Content */}
      <ScrollView style={styles.exampleContent} showsVerticalScrollIndicator={false}>
        {renderExample()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  selector: {
    maxHeight: 60,
    marginBottom: 20,
  },
  selectorContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  selectorButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  selectedButton: {
    backgroundColor: '#6c5ce7',
  },
  selectorText: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedText: {
    color: 'white',
  },
  exampleContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  // Shared Element Styles
  gridContainer: {
    padding: 20,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  thumbnail: {
    width: (SCREEN_WIDTH - 60) / 2,
    height: 120,
    borderRadius: 10,
  },
  fullscreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    zIndex: 1000,
  },
  fullscreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
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
  
  // Morphing FAB Styles
  fabContainer: {
    padding: 20,
    alignItems: 'center',
  },
  fab: {
    backgroundColor: '#6c5ce7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  menuContent: {
    padding: 20,
    alignItems: 'flex-start',
    width: '100%',
  },
  menuTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  menuItem: {
    paddingVertical: 10,
    width: '100%',
  },
  menuItemText: {
    color: 'white',
    fontSize: 16,
  },
  
  // Physics Ball Styles
  physicsContainer: {
    padding: 20,
  },
  physicsArea: {
    height: 350,
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    position: 'relative',
    marginBottom: 20,
  },
  ball: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ff6b6b',
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: '#4a4a4a',
  },
  physicsControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  physicsButton: {
    backgroundColor: '#00b894',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  resetButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  // Photo Viewer Styles
  photoViewerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    zIndex: 1000,
  },
  photoViewerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  photoViewerClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoViewerImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  
  // List Styles
  listContainer: {
    padding: 20,
  },
  loadButton: {
    backgroundColor: '#74b9ff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: 'center',
    marginBottom: 20,
  },
  list: {
    maxHeight: 400,
  },
  listItem: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listItemContent: {
    padding: 15,
  },
  listItemTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  listItemSubtitle: {
    color: '#ccc',
    fontSize: 14,
  },
});

export default ComplexAnimationExamples;
