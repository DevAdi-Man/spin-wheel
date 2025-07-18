// React Native Reanimated Tutorial - Main Index File
// 8 Days Complete Course

// Day 1 - Foundation & Setup
export { default as BasicAnimation } from './Day1-Foundation/BasicAnimation';

// Day 2 - Animated Styles & Interpolation
export { default as InterpolationExamples } from './Day2-AnimatedStyles/InterpolationExamples';

// Day 3 - Gestures & Touch Interactions
export { default as DragAndDrop } from './Day3-Gestures/DragAndDrop';

// Day 4 - Advanced Animation Functions
export { default as AnimationShowcase } from './Day4-AdvancedAnimations/AnimationShowcase';

// Day 7 - Real World Projects
export { default as CompleteApp } from './Day7-RealWorldProjects/CompleteApp';

// Day 8 - Master Level Complex Animations
export { default as ComplexAnimationExamples } from './Day8-MasterLevel/ComplexAnimationExamples';
export {
  InstagramStoriesViewer,
  AdvancedTinderCards,
  MorphingSearchBar
} from './Day8-MasterLevel/ExerciseSolutions';

// Tutorial Navigation Component
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';

const tutorials = [
  {
    day: 1,
    title: 'Foundation & Setup',
    description: 'Basic concepts, useSharedValue, useAnimatedStyle',
    component: 'BasicAnimation',
    difficulty: '⭐',
  },
  {
    day: 2,
    title: 'Animated Styles & Interpolation',
    description: 'Advanced styling, interpolation, color animations',
    component: 'InterpolationExamples',
    difficulty: '⭐⭐',
  },
  {
    day: 3,
    title: 'Gestures & Touch Interactions',
    description: 'Pan gestures, tap handling, drag & drop',
    component: 'DragAndDrop',
    difficulty: '⭐⭐⭐',
  },
  {
    day: 4,
    title: 'Advanced Animation Functions',
    description: 'withTiming, withSpring, withSequence, withRepeat',
    component: 'AnimationShowcase',
    difficulty: '⭐⭐⭐',
  },
  {
    day: 5,
    title: 'Layout Animations',
    description: 'Entering/exiting animations, layout transitions',
    component: null,
    difficulty: '⭐⭐⭐⭐',
  },
  {
    day: 6,
    title: 'Complex Interactions',
    description: 'Multi-gesture handling, advanced patterns',
    component: null,
    difficulty: '⭐⭐⭐⭐',
  },
  {
    day: 7,
    title: 'Real World Projects',
    description: 'Complete apps, best practices, production tips',
    component: 'CompleteApp',
    difficulty: '⭐⭐⭐⭐⭐',
  },
  {
    day: 8,
    title: 'Master Level Complex Animations',
    description: 'Shared elements, morphing, physics, advanced patterns',
    component: 'ComplexAnimationExamples',
    difficulty: '⭐⭐⭐⭐⭐',
    isNew: true,
  },
];

export const TutorialNavigator = ({ onSelectTutorial }) => {
  const [selectedDay, setSelectedDay] = useState(null);

  const handleTutorialSelect = (tutorial) => {
    setSelectedDay(tutorial.day);
    if (tutorial.component && onSelectTutorial) {
      onSelectTutorial(tutorial.component);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>React Native Reanimated</Text>
        <Text style={styles.subtitle}>8 Days Master Course 🚀</Text>
        <Text style={styles.description}>
          Complete tutorial series to master React Native animations
        </Text>
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>✨ NEW: Day 8 Master Level Added!</Text>
        </View>
      </View>

      <View style={styles.tutorialList}>
        {tutorials.map((tutorial) => (
          <Pressable
            key={tutorial.day}
            style={[
              styles.tutorialCard,
              selectedDay === tutorial.day && styles.selectedCard,
              !tutorial.component && styles.disabledCard,
              tutorial.isNew && styles.newCard,
            ]}
            onPress={() => handleTutorialSelect(tutorial)}
            disabled={!tutorial.component}
          >
            <View style={styles.cardHeader}>
              <View style={styles.dayInfo}>
                <Text style={styles.dayNumber}>Day {tutorial.day}</Text>
                {tutorial.isNew && <Text style={styles.newTag}>NEW</Text>}
              </View>
              <View style={styles.cardMeta}>
                <Text style={styles.difficulty}>{tutorial.difficulty}</Text>
                {tutorial.component && <Text style={styles.availableText}>📱 Demo</Text>}
                {!tutorial.component && <Text style={styles.readmeText}>📖 README</Text>}
              </View>
            </View>

            <Text style={styles.tutorialTitle}>{tutorial.title}</Text>
            <Text style={styles.tutorialDescription}>{tutorial.description}</Text>

            {selectedDay === tutorial.day && (
              <View style={styles.selectedIndicator}>
                <Text style={styles.selectedText}>Currently Selected</Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Master Level Features 🎯</Text>
        <Text style={styles.footerText}>
          Day 8 includes advanced concepts like shared element transitions,
          morphing animations, physics simulations, and production-ready patterns.
        </Text>

        <View style={styles.progressStats}>
          <Text style={styles.statText}>
            📚 Total Days: {tutorials.length}
          </Text>
          <Text style={styles.statText}>
            💻 Interactive Demos: {tutorials.filter(t => t.component).length}
          </Text>
          <Text style={styles.statText}>
            📖 Documentation: {tutorials.length} READMEs
          </Text>
          <Text style={styles.statText}>
            🎯 Master Level: Day 8 Complex Animations
          </Text>
        </View>

        <View style={styles.difficultyGuide}>
          <Text style={styles.difficultyTitle}>Difficulty Guide:</Text>
          <Text style={styles.difficultyItem}>⭐ Beginner - Basic concepts</Text>
          <Text style={styles.difficultyItem}>⭐⭐ Intermediate - Advanced features</Text>
          <Text style={styles.difficultyItem}>⭐⭐⭐ Advanced - Complex interactions</Text>
          <Text style={styles.difficultyItem}>⭐⭐⭐⭐ Expert - Production patterns</Text>
          <Text style={styles.difficultyItem}>⭐⭐⭐⭐⭐ Master - Complex systems</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#6c5ce7',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 5,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 22,
  },
  newBadge: {
    marginTop: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  newBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tutorialList: {
    padding: 20,
  },
  tutorialCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#6c5ce7',
    backgroundColor: '#f8f7ff',
  },
  disabledCard: {
    opacity: 0.7,
    backgroundColor: '#f5f5f5',
  },
  newCard: {
    borderColor: '#00b894',
    backgroundColor: '#f0fff4',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6c5ce7',
  },
  newTag: {
    backgroundColor: '#00b894',
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  difficulty: {
    fontSize: 14,
    color: '#fdcb6e',
  },
  availableText: {
    fontSize: 12,
    color: '#00b894',
    fontWeight: '600',
  },
  readmeText: {
    fontSize: 12,
    color: '#fdcb6e',
    fontWeight: '600',
  },
  tutorialTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 8,
  },
  tutorialDescription: {
    fontSize: 16,
    color: '#636e72',
    lineHeight: 22,
  },
  selectedIndicator: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#6c5ce7',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    backgroundColor: '#2d3436',
    margin: 20,
    borderRadius: 15,
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  footerText: {
    fontSize: 16,
    color: '#ddd',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  progressStats: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statText: {
    fontSize: 16,
    color: '#74b9ff',
    marginBottom: 5,
    fontWeight: '500',
  },
  difficultyGuide: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 10,
  },
  difficultyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  difficultyItem: {
    fontSize: 14,
    color: '#ddd',
    marginBottom: 5,
  },
});

export default TutorialNavigator;
