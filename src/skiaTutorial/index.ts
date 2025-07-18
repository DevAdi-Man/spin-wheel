// React Native Skia Tutorial 2025 - Main Export File

// Basic Components
export * from './02-CanvasBasics/CanvasIntro';
export * from './03-ShapesAndPaths/BasicShapes';
export * from './04-ColorsAndGradients/ColorSystems';

// Animation Examples
export * from './05-Animations/AnimationBasics';

// Interactive Components
export * from './07-TouchInteractions/GestureHandling';

// Real World Examples
export * from './09-RealWorldExamples/PracticalProjects';

// Practice Exercises
export * from './10-Exercises/PracticeProblems';

// Tutorial Information
export const TUTORIAL_INFO = {
  title: 'React Native Skia Tutorial 2025',
  version: '1.0.0',
  description: 'Complete guide to React Native Skia with practical examples',
  chapters: [
    '01-BasicSetup',
    '02-CanvasBasics', 
    '03-ShapesAndPaths',
    '04-ColorsAndGradients',
    '05-Animations',
    '06-FiltersAndEffects',
    '07-TouchInteractions',
    '08-AdvancedTechniques',
    '09-RealWorldExamples',
    '10-Exercises'
  ],
  features: [
    'Hardware accelerated graphics',
    'Smooth animations',
    'Touch interactions',
    'Custom shaders',
    'Image processing',
    'Real-world examples',
    'Practice exercises'
  ]
};

// Quick Start Guide
export const QUICK_START = `
# React Native Skia Tutorial 2025

## Installation
npm install @shopify/react-native-skia@latest

## Basic Usage
import {Canvas, Circle} from '@shopify/react-native-skia';

<Canvas style={{width: 300, height: 300}}>
  <Circle cx={150} cy={150} r={50} color="red" />
</Canvas>

## Tutorial Structure
1. Basic Setup & Installation
2. Canvas Basics
3. Shapes and Paths
4. Colors and Gradients
5. Animations
6. Filters and Effects
7. Touch Interactions
8. Advanced Techniques
9. Real World Examples
10. Exercises and Practice

Happy Learning! 🎨
`;
