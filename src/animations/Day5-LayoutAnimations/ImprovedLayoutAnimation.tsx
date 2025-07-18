import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
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
  FlipInXUp,
  FlipOutXDown,
  RotateInDownLeft,
  RotateOutUpRight,
  PinwheelIn,
  PinwheelOut,
  Layout,
  LinearTransition
} from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface AnimationBoxProps {
  title: string;
  entering: any;
  exiting?: any;
  backgroundColor: string;
  onPress?: () => void;
  visible?: boolean;
}

const AnimationBox: React.FC<AnimationBoxProps> = ({ 
  title, 
  entering, 
  exiting, 
  backgroundColor, 
  onPress,
  visible = true 
}) => {
  if (!visible) return null;

  return (
    <Animated.View 
      entering={entering} 
      exiting={exiting}
      layout={Layout.springify()}
      style={[styles.box, { backgroundColor }]}
    >
      <TouchableOpacity onPress={onPress} style={styles.touchable}>
        <Text style={styles.boxText}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ImprovedLayoutAnimation: React.FC = () => {
  const { styles } = useStyles(stylesheet);
  const [visibleBoxes, setVisibleBoxes] = useState<{ [key: string]: boolean }>({
    fadeBox: true,
    slideBox: true,
    zoomBox: true,
    bounceBox: true,
    complexBox: true,
    flipBox: true,
    rotateBox: true,
    pinwheelBox: true,
  });

  const toggleBox = (boxKey: string) => {
    setVisibleBoxes(prev => ({
      ...prev,
      [boxKey]: !prev[boxKey]
    }));
  };

  const resetAll = () => {
    setVisibleBoxes({
      fadeBox: true,
      slideBox: true,
      zoomBox: true,
      bounceBox: true,
      complexBox: true,
      flipBox: true,
      rotateBox: true,
      pinwheelBox: true,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Layout Animations Demo</Text>
        <TouchableOpacity onPress={resetAll} style={styles.resetButton}>
          <Text style={styles.resetButtonText}>Reset All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Animations */}
        <Text style={styles.sectionTitle}>Basic Animations</Text>
        
        <AnimationBox
          title="Tap to Fade"
          entering={FadeIn.duration(800)}
          exiting={FadeOut.duration(500)}
          backgroundColor="#FF6B6B"
          onPress={() => toggleBox('fadeBox')}
          visible={visibleBoxes.fadeBox}
        />

        <AnimationBox
          title="Slide Up Animation"
          entering={SlideInUp.duration(800).springify()}
          exiting={SlideOutDown.duration(500)}
          backgroundColor="#4ECDC4"
          onPress={() => toggleBox('slideBox')}
          visible={visibleBoxes.slideBox}
        />

        <AnimationBox
          title="Zoom with Delay"
          entering={ZoomIn.delay(300).duration(600)}
          exiting={ZoomOut.duration(400)}
          backgroundColor="#45B7D1"
          onPress={() => toggleBox('zoomBox')}
          visible={visibleBoxes.zoomBox}
        />

        {/* Advanced Animations */}
        <Text style={styles.sectionTitle}>Advanced Animations</Text>

        <AnimationBox
          title="Bounce with Easing"
          entering={BounceIn.easing(Easing.bezier(0.25, 0.1, 0.25, 1)).duration(1000)}
          exiting={BounceOut.duration(600)}
          backgroundColor="#96CEB4"
          onPress={() => toggleBox('bounceBox')}
          visible={visibleBoxes.bounceBox}
        />

        <AnimationBox
          title="Complex Chain"
          entering={SlideInLeft.duration(600).delay(200).springify().damping(15)}
          exiting={SlideOutRight.duration(500)}
          backgroundColor="#FFEAA7"
          onPress={() => toggleBox('complexBox')}
          visible={visibleBoxes.complexBox}
        />

        {/* Creative Animations */}
        <Text style={styles.sectionTitle}>Creative Animations</Text>

        <AnimationBox
          title="Flip Animation"
          entering={FlipInXUp.duration(800)}
          exiting={FlipOutXDown.duration(600)}
          backgroundColor="#DDA0DD"
          onPress={() => toggleBox('flipBox')}
          visible={visibleBoxes.flipBox}
        />

        <AnimationBox
          title="Rotate Entry"
          entering={RotateInDownLeft.duration(1000)}
          exiting={RotateOutUpRight.duration(700)}
          backgroundColor="#F8BBD9"
          onPress={() => toggleBox('rotateBox')}
          visible={visibleBoxes.rotateBox}
        />

        <AnimationBox
          title="Pinwheel Effect"
          entering={PinwheelIn.duration(1200)}
          exiting={PinwheelOut.duration(800)}
          backgroundColor="#B8860B"
          onPress={() => toggleBox('pinwheelBox')}
          visible={visibleBoxes.pinwheelBox}
        />

        {/* Custom Animation Example */}
        <Text style={styles.sectionTitle}>Custom Combinations</Text>
        
        <Animated.View 
          entering={
            FadeIn.duration(500)
              .delay(100)
              .withCallback((finished) => {
                'worklet';
                console.log('Animation finished:', finished);
              })
          }
          exiting={FadeOut.duration(300)}
          layout={LinearTransition.springify().damping(20)}
          style={[styles.box, { backgroundColor: '#FF7F50' }]}
        >
          <Text style={styles.boxText}>Custom Callback</Text>
        </Animated.View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Tap any box to see exit animations!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ImprovedLayoutAnimation;

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  resetButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  box: {
    width: '100%',
    height: 120,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  touchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
  },
  footerText: {
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: 14,
    fontStyle: 'italic',
  },
}));

const styles = StyleSheet.create({
  box: {},
  touchable: {},
  boxText: {},
});
