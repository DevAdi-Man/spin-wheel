# Day 5: Layout Animations & Transitions 🎭

## Layout Animations Overview

Layout animations automatically animate karte hain jab component ka layout change hota hai. Ye especially useful hai jab:
- Components add/remove hote hain
- Size change hota hai
- Position change hota hai
- List items reorder hote hain

## Entering Animations

Jab component mount hota hai ya visible hota hai tab ye animations run hoti hain.

### Built-in Entering Animations:

```javascript
import {
  FadeIn,
  SlideInUp,
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  ZoomIn,
  BounceIn,
  FlipInXUp,
  FlipInYLeft,
  StretchInX,
  StretchInY,
} from 'react-native-reanimated';

// Basic usage
<Animated.View entering={FadeIn}>
  <Text>Fade in animation</Text>
</Animated.View>

// With duration
<Animated.View entering={SlideInUp.duration(800)}>
  <Text>Slide in with custom duration</Text>
</Animated.View>

// With delay
<Animated.View entering={ZoomIn.delay(500)}>
  <Text>Zoom in after delay</Text>
</Animated.View>

// With easing
<Animated.View entering={BounceIn.easing(Easing.bezier(0.25, 0.1, 0.25, 1))}>
  <Text>Bounce in with custom easing</Text>
</Animated.View>
```

### Chaining Modifiers:
```javascript
<Animated.View 
  entering={SlideInLeft.duration(600).delay(200).springify()}
>
  <Text>Complex entering animation</Text>
</Animated.View>
```

## Exiting Animations

Jab component unmount hota hai ya invisible hota hai tab ye animations run hoti hain.

### Built-in Exiting Animations:

```javascript
import {
  FadeOut,
  SlideOutUp,
  SlideOutDown,
  SlideOutLeft,
  SlideOutRight,
  ZoomOut,
  BounceOut,
  FlipOutXUp,
  FlipOutYLeft,
  StretchOutX,
  StretchOutY,
} from 'react-native-reanimated';

// Basic usage
<Animated.View exiting={FadeOut}>
  <Text>Fade out animation</Text>
</Animated.View>

// Combined entering and exiting
<Animated.View 
  entering={SlideInUp.duration(500)}
  exiting={SlideOutDown.duration(300)}
>
  <Text>Slide in up, slide out down</Text>
</Animated.View>
```

## Layout Transitions

Jab component ka layout change hota hai (position, size) tab ye animations run hoti hain.

### Built-in Layout Animations:

```javascript
import {
  Layout,
  LinearTransition,
  FadingTransition,
  SequencedTransition,
  JumpingTransition,
  CurvedTransition,
} from 'react-native-reanimated';

// Basic layout animation
<Animated.View layout={Layout}>
  <Text>Animates layout changes</Text>
</Animated.View>

// With duration
<Animated.View layout={Layout.duration(800)}>
  <Text>Custom duration layout animation</Text>
</Animated.View>

// Different transition types
<Animated.View layout={LinearTransition.duration(500)}>
  <Text>Linear transition</Text>
</Animated.View>

<Animated.View layout={FadingTransition.duration(600)}>
  <Text>Fading transition</Text>
</Animated.View>
```

## Custom Animations

Apne custom entering/exiting animations bana sakte hain.

### Custom Entering Animation:
```javascript
const customEntering = (values) => {
  'worklet';
  const animations = {
    originX: withTiming(values.targetOriginX, { duration: 600 }),
    originY: withTiming(values.targetOriginY, { duration: 600 }),
    opacity: withTiming(1, { duration: 400 }),
    transform: [
      { scale: withTiming(1, { duration: 600 }) },
      { rotate: withTiming('0deg', { duration: 600 }) },
    ],
  };
  
  const initialValues = {
    originX: values.targetOriginX - 100,
    originY: values.targetOriginY - 100,
    opacity: 0,
    transform: [
      { scale: 0.5 },
      { rotate: '180deg' },
    ],
  };
  
  return {
    initialValues,
    animations,
  };
};

// Usage
<Animated.View entering={customEntering}>
  <Text>Custom entering animation</Text>
</Animated.View>
```

### Custom Exiting Animation:
```javascript
const customExiting = (values) => {
  'worklet';
  const animations = {
    originX: withTiming(values.currentOriginX + 100, { duration: 400 }),
    originY: withTiming(values.currentOriginY - 100, { duration: 400 }),
    opacity: withTiming(0, { duration: 300 }),
    transform: [
      { scale: withTiming(0, { duration: 400 }) },
      { rotate: withTiming('180deg', { duration: 400 }) },
    ],
  };
  
  return {
    animations,
  };
};
```

### Custom Layout Animation:
```javascript
const customLayout = (values) => {
  'worklet';
  return {
    animations: {
      originX: withTiming(values.targetOriginX, { duration: 500 }),
      originY: withTiming(values.targetOriginY, { duration: 500 }),
      width: withTiming(values.targetWidth, { duration: 500 }),
      height: withTiming(values.targetHeight, { duration: 500 }),
    },
  };
};
```

## Practical Examples

### 1. Animated List
```javascript
const AnimatedList = () => {
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);
  
  const addItem = () => {
    setItems(prev => [...prev, `Item ${prev.length + 1}`]);
  };
  
  const removeItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };
  
  return (
    <View>
      {items.map((item, index) => (
        <Animated.View
          key={item}
          entering={SlideInRight.delay(index * 100)}
          exiting={SlideOutLeft}
          layout={LinearTransition}
          style={styles.listItem}
        >
          <Text>{item}</Text>
          <Pressable onPress={() => removeItem(index)}>
            <Text>❌</Text>
          </Pressable>
        </Animated.View>
      ))}
      
      <Pressable onPress={addItem} style={styles.addButton}>
        <Text>Add Item</Text>
      </Pressable>
    </View>
  );
};
```

### 2. Modal with Animations
```javascript
const AnimatedModal = ({ visible, onClose, children }) => {
  if (!visible) return null;
  
  return (
    <Animated.View 
      entering={FadeIn}
      exiting={FadeOut}
      style={styles.modalOverlay}
    >
      <Animated.View
        entering={ZoomIn.springify()}
        exiting={ZoomOut}
        style={styles.modalContent}
      >
        {children}
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Text>Close</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
};
```

### 3. Expandable Card
```javascript
const ExpandableCard = () => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <Animated.View layout={Layout.springify()} style={styles.card}>
      <Pressable onPress={() => setExpanded(!expanded)}>
        <Text style={styles.cardTitle}>Tap to expand</Text>
      </Pressable>
      
      {expanded && (
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(200)}
          layout={Layout}
        >
          <Text style={styles.cardContent}>
            This is the expanded content that appears with animation.
          </Text>
        </Animated.View>
      )}
    </Animated.View>
  );
};
```

### 4. Staggered Grid
```javascript
const StaggeredGrid = ({ data }) => {
  return (
    <View style={styles.grid}>
      {data.map((item, index) => (
        <Animated.View
          key={item.id}
          entering={FadeIn.delay(index * 50).springify()}
          layout={LinearTransition}
          style={styles.gridItem}
        >
          <Text>{item.title}</Text>
        </Animated.View>
      ))}
    </View>
  );
};
```

## Advanced Techniques

### 1. Conditional Animations
```javascript
const ConditionalAnimation = ({ condition }) => {
  const enteringAnimation = condition ? SlideInUp : SlideInDown;
  const exitingAnimation = condition ? SlideOutUp : SlideOutDown;
  
  return (
    <Animated.View
      entering={enteringAnimation.duration(500)}
      exiting={exitingAnimation.duration(300)}
    >
      <Text>Conditional animation based on state</Text>
    </Animated.View>
  );
};
```

### 2. Shared Element Transition (Basic)
```javascript
const SharedElementTransition = () => {
  const [showDetail, setShowDetail] = useState(false);
  
  if (showDetail) {
    return (
      <Animated.View
        entering={ZoomIn.duration(400)}
        exiting={ZoomOut.duration(300)}
        style={styles.detailView}
      >
        <Text>Detail View</Text>
        <Pressable onPress={() => setShowDetail(false)}>
          <Text>Back</Text>
        </Pressable>
      </Animated.View>
    );
  }
  
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={styles.listView}
    >
      <Pressable onPress={() => setShowDetail(true)}>
        <Text>Show Detail</Text>
      </Pressable>
    </Animated.View>
  );
};
```

### 3. Layout Animation with State
```javascript
const LayoutWithState = () => {
  const [layout, setLayout] = useState('row');
  
  return (
    <View>
      <Animated.View
        layout={LinearTransition.duration(600)}
        style={[
          styles.container,
          { flexDirection: layout === 'row' ? 'row' : 'column' }
        ]}
      >
        {[1, 2, 3, 4].map(num => (
          <Animated.View
            key={num}
            layout={Layout.springify()}
            style={styles.layoutBox}
          >
            <Text>{num}</Text>
          </Animated.View>
        ))}
      </Animated.View>
      
      <Pressable onPress={() => setLayout(layout === 'row' ? 'column' : 'row')}>
        <Text>Toggle Layout</Text>
      </Pressable>
    </View>
  );
};
```

## Performance Considerations

### 1. Use Appropriate Animations
```javascript
// ✅ Light animations for frequent changes
<Animated.View entering={FadeIn.duration(200)}>

// ❌ Heavy animations for frequent changes
<Animated.View entering={BounceIn.duration(1000)}>
```

### 2. Optimize List Animations
```javascript
// ✅ Stagger delays for better performance
entering={SlideInRight.delay(index * 50)}

// ❌ Same delay for all items
entering={SlideInRight.delay(500)}
```

### 3. Conditional Animation Loading
```javascript
const shouldAnimate = Platform.OS === 'ios' || !isLowEndDevice;

<Animated.View 
  entering={shouldAnimate ? SlideInUp : undefined}
  exiting={shouldAnimate ? SlideOutDown : undefined}
>
```

## Common Patterns

### 1. Toast Notifications
```javascript
const Toast = ({ message, visible }) => {
  if (!visible) return null;
  
  return (
    <Animated.View
      entering={SlideInUp.springify()}
      exiting={SlideOutUp}
      style={styles.toast}
    >
      <Text>{message}</Text>
    </Animated.View>
  );
};
```

### 2. Loading States
```javascript
const LoadingState = ({ loading }) => {
  if (!loading) return null;
  
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={styles.loadingOverlay}
    >
      <Text>Loading...</Text>
    </Animated.View>
  );
};
```

## Practice Exercises

1. **Animated Todo List**: Add/remove items with different animations
2. **Image Gallery**: Grid layout with staggered animations
3. **Accordion Menu**: Expandable sections with smooth transitions
4. **Tab Navigation**: Animated tab switching

## Homework 📝

### Practice Tasks:
- Layout animations implement karo
- Custom entering/exiting animations banao
- List animations optimize karo
- Modal transitions improve karo

### 🎯 Animation Examples to Copy & Practice:

#### 1. **Expo Snack Examples**
- **Layout Animations**: https://snack.expo.dev/@reanimated/layout-animations
- **Entering/Exiting**: https://snack.expo.dev/@reanimated/entering-exiting
- **Animated Lists**: https://snack.expo.dev/@reanimated/animated-flatlist
- **Modal Transitions**: https://snack.expo.dev/@reanimated/modal-animations

#### 2. **Advanced Layout Examples**
- **Shared Elements**: https://docs.swmansion.com/react-native-reanimated/examples/shared-element-transitions
- **Tab Transitions**: https://snack.expo.dev/@reanimated/tab-transitions
- **Accordion Menu**: https://snack.expo.dev/@reanimated/accordion

#### 3. **Real-world Layout Patterns**
- **Instagram Feed**: https://github.com/lukewalczak/react-native-instagram-stories
- **Expandable Cards**: https://snack.expo.dev/@reanimated/expandable-cards
- **Animated Headers**: https://github.com/react-navigation/react-navigation/tree/main/example

### 🔥 Challenge Animations to Try:
1. **Todo List**: Add/remove items with smooth animations
2. **Image Gallery**: Grid layout with entering animations
3. **Chat Messages**: Messages appear with slide-in effect
4. **Settings Menu**: Expandable sections with layout transitions

### 📱 Ready-to-Copy Layout Examples:

#### Basic Entering Animation:
```javascript
// Copy to Expo Snack
<Animated.View 
  entering={SlideInUp.duration(500).springify()}
  exiting={SlideOutDown.duration(300)}
>
  <Text>Animated Content</Text>
</Animated.View>
```

#### Custom Layout Animation:
```javascript
const customLayout = (values) => {
  'worklet';
  return {
    animations: {
      originX: withSpring(values.targetOriginX),
      originY: withSpring(values.targetOriginY),
    },
  };
};
```

#### Staggered List Items:
```javascript
{items.map((item, index) => (
  <Animated.View
    key={item.id}
    entering={FadeIn.delay(index * 100)}
    layout={LinearTransition}
  >
    <Text>{item.title}</Text>
  </Animated.View>
))}
```

### 🎨 Layout Animation Inspiration:
- **Material Design**: https://material.io/design/motion/
- **iOS Human Interface**: https://developer.apple.com/design/human-interface-guidelines/motion
- **Dribbble Animations**: Search "mobile layout transitions"

### 📺 Layout Animation Tutorials:
- **React Navigation Animations**: Official docs examples
- **Layout Animation Patterns**: YouTube tutorials
- **Shared Element Transitions**: Advanced tutorials

### 🛠️ Layout Animation Tools:
- **Figma Smart Animate**: Prototype layout transitions
- **Principle**: Animation prototyping
- **ProtoPie**: Interactive prototypes

## Next Day Preview
Kal hum seekhenge:
- Complex gesture combinations
- Multi-touch interactions
- Advanced UI patterns
- Performance optimization techniques
