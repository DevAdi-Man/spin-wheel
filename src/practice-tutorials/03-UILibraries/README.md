# UI Libraries & Component Systems 🎨

## Complete UI Library Mastery Guide

UI libraries tumhare app ko professional aur beautiful banate hain. Ye tutorial tumhe sab popular UI libraries sikhayega.

## 📚 What You'll Learn

### **Popular UI Libraries:**
- **NativeBase** - Modular and accessible component library
- **React Native Elements** - Cross-platform UI toolkit
- **UI Kitten** - Eva Design System based
- **Tamagui** - Universal UI system
- **Shoutem UI** - Customizable UI toolkit

## 🎯 Real-World Examples

### **Apps Using These Libraries:**
- **Airbnb** - Custom design system
- **Instagram** - Custom components with libraries
- **Uber** - NativeBase for rapid development
- **Discord** - React Native Elements

## 📖 Theory Deep Dive

### **UI Library Kya Hai?**
```
Raw Components → UI Library → Beautiful App
     ↑              ↑            ↑
  Basic RN      Pre-built     Professional
 Components    Components        Look
```

UI libraries pre-built, tested, aur accessible components provide karte hain jo development speed badhate hain.

### **Choosing Right Library:**
1. **Design Requirements** - App ka design style
2. **Customization** - Kitna customize karna hai
3. **Bundle Size** - App size impact
4. **Community** - Support aur updates
5. **TypeScript** - Type safety

## 🚀 NativeBase

### **Why NativeBase?**
- **Modular** - Sirf zaroori components import karo
- **Accessible** - Built-in accessibility
- **Themeable** - Easy customization
- **TypeScript** - Full TypeScript support

### **Installation:**
```bash
npm install native-base react-native-svg
npm install react-native-safe-area-context

# iOS
cd ios && pod install
```

### **Setup:**
```javascript
// App.js
import React from 'react';
import { NativeBaseProvider, extendTheme } from 'native-base';
import MainApp from './MainApp';

// Custom theme
const theme = extendTheme({
  colors: {
    primary: {
      50: '#E3F2F9',
      100: '#C5E4F3',
      200: '#A2D4EC',
      300: '#7AC1E4',
      400: '#47A9DA',
      500: '#0088CC', // Primary color
      600: '#007AB8',
      700: '#006BA1',
      800: '#005885',
      900: '#003F5E',
    },
  },
  config: {
    initialColorMode: 'light',
  },
});

const App = () => {
  return (
    <NativeBaseProvider theme={theme}>
      <MainApp />
    </NativeBaseProvider>
  );
};

export default App;
```

### **Basic Components:**
```javascript
// screens/NativeBaseExample.js
import React, { useState } from 'react';
import {
  Box,
  Text,
  Button,
  Input,
  VStack,
  HStack,
  Center,
  Heading,
  Avatar,
  Badge,
  Card,
  Image,
  IconButton,
  useToast,
  Modal,
  FormControl,
  Select,
  CheckIcon,
  Radio,
  Checkbox,
  Switch,
  Slider,
  Progress,
  Spinner,
  Alert,
  Divider,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';

const NativeBaseExample = () => {
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [radioValue, setRadioValue] = useState('1');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);
  const [sliderValue, setSliderValue] = useState(40);
  const toast = useToast();
  
  const showToast = () => {
    toast.show({
      title: "Success!",
      status: "success",
      description: "This is a success toast.",
      placement: "top"
    });
  };
  
  return (
    <Box flex={1} bg="#fff" safeArea>
      <VStack space={4} p={4}>
        {/* Header */}
        <Center>
          <Heading size="lg" color="primary.500">
            NativeBase Components
          </Heading>
        </Center>
        
        {/* Avatar & Badge */}
        <HStack space={4} alignItems="center" justifyContent="center">
          <Avatar
            bg="green.500"
            source={{
              uri: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
            }}
          >
            AK
          </Avatar>
          <VStack>
            <Text fontSize="md" fontWeight="bold">Ankit Kumar</Text>
            <Badge colorScheme="success" variant="solid">
              Online
            </Badge>
          </VStack>
        </HStack>
        
        {/* Card */}
        <Card>
          <VStack space={2} p={4}>
            <HStack justifyContent="space-between" alignItems="center">
              <Heading size="md">Card Title</Heading>
              <IconButton
                icon={<Ionicons name="heart-outline" size={20} />}
                onPress={() => console.log('Liked')}
              />
            </HStack>
            <Text color="gray.500">
              This is a beautiful card component with NativeBase.
            </Text>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3"
              }}
              alt="Nature"
              height={150}
              borderRadius={8}
            />
          </VStack>
        </Card>
        
        {/* Form Controls */}
        <VStack space={3}>
          <FormControl>
            <FormControl.Label>Name</FormControl.Label>
            <Input
              placeholder="Enter your name"
              value={inputValue}
              onChangeText={setInputValue}
            />
            <FormControl.HelperText>
              This will be displayed publicly.
            </FormControl.HelperText>
          </FormControl>
          
          <FormControl>
            <FormControl.Label>Country</FormControl.Label>
            <Select
              selectedValue={selectValue}
              minWidth="200"
              accessibilityLabel="Choose Country"
              placeholder="Choose Country"
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />
              }}
              onValueChange={setSelectValue}
            >
              <Select.Item label="India" value="india" />
              <Select.Item label="USA" value="usa" />
              <Select.Item label="UK" value="uk" />
            </Select>
          </FormControl>
        </VStack>
        
        {/* Radio Group */}
        <FormControl>
          <FormControl.Label>Gender</FormControl.Label>
          <Radio.Group
            name="gender"
            value={radioValue}
            onChange={setRadioValue}
          >
            <HStack space={4}>
              <Radio value="1" my={1}>
                Male
              </Radio>
              <Radio value="2" my={1}>
                Female
              </Radio>
            </HStack>
          </Radio.Group>
        </FormControl>
        
        {/* Checkbox & Switch */}
        <HStack space={4} alignItems="center">
          <Checkbox
            value="agree"
            isChecked={checkboxValue}
            onChange={setCheckboxValue}
          >
            I agree to terms
          </Checkbox>
          <HStack space={2} alignItems="center">
            <Text>Notifications</Text>
            <Switch
              isChecked={switchValue}
              onToggle={setSwitchValue}
              colorScheme="primary"
            />
          </HStack>
        </HStack>
        
        {/* Slider */}
        <VStack space={2}>
          <Text>Volume: {sliderValue}%</Text>
          <Slider
            value={sliderValue}
            onChange={setSliderValue}
            colorScheme="primary"
          >
            <Slider.Track>
              <Slider.FilledTrack />
            </Slider.Track>
            <Slider.Thumb />
          </Slider>
        </VStack>
        
        {/* Progress */}
        <VStack space={2}>
          <Text>Progress</Text>
          <Progress value={65} colorScheme="primary" />
        </VStack>
        
        {/* Buttons */}
        <HStack space={2} justifyContent="center">
          <Button onPress={showToast}>
            Show Toast
          </Button>
          <Button variant="outline" onPress={() => setShowModal(true)}>
            Open Modal
          </Button>
        </HStack>
        
        {/* Alert */}
        <Alert status="info">
          <Alert.Icon />
          <Text>This is an info alert!</Text>
        </Alert>
        
        {/* Loading Spinner */}
        <Center>
          <HStack space={2} alignItems="center">
            <Spinner accessibilityLabel="Loading posts" />
            <Text color="primary.500">Loading...</Text>
          </HStack>
        </Center>
      </VStack>
      
      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Modal Title</Modal.Header>
          <Modal.Body>
            <Text>This is modal content. You can put any component here.</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button onPress={() => setShowModal(false)}>
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

export default NativeBaseExample;
```

### **Custom Theme:**
```javascript
// theme/customTheme.js
import { extendTheme } from 'native-base';

const customTheme = extendTheme({
  colors: {
    // Custom color palette
    brand: {
      900: '#8287af',
      800: '#7c83db',
      700: '#b3bef6',
    },
    // Override default colors
    primary: {
      50: '#E3F2F9',
      500: '#0088CC',
      900: '#003F5E',
    },
  },
  components: {
    // Customize Button component
    Button: {
      baseStyle: {
        rounded: 'md',
      },
      defaultProps: {
        colorScheme: 'primary',
      },
      variants: {
        solid: {
          bg: 'primary.500',
          _pressed: {
            bg: 'primary.600',
          },
        },
        gradient: {
          bg: {
            linearGradient: {
              colors: ['primary.500', 'secondary.500'],
              start: [0, 0],
              end: [1, 0],
            },
          },
        },
      },
    },
    // Customize Input component
    Input: {
      baseStyle: {
        borderRadius: 'md',
        borderWidth: 1,
        borderColor: 'gray.300',
        _focus: {
          borderColor: 'primary.500',
          bg: 'white',
        },
      },
    },
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

export default customTheme;
```

## ⚡ React Native Elements

### **Why React Native Elements?**
- **Cross-platform** - Consistent look across platforms
- **Highly customizable** - Easy theming
- **Large community** - Good support
- **TypeScript** - Full TypeScript support

### **Installation:**
```bash
npm install react-native-elements react-native-vector-icons
npm install react-native-safe-area-context

# iOS
cd ios && pod install
```

### **Setup:**
```javascript
// App.js
import React from 'react';
import { ThemeProvider } from 'react-native-elements';

const theme = {
  colors: {
    primary: '#0088CC',
    secondary: '#FF6B6B',
    success: '#4ECDC4',
    warning: '#FFE66D',
    error: '#FF6B6B',
  },
  Button: {
    raised: true,
    titleStyle: {
      fontWeight: 'bold',
    },
  },
  Input: {
    containerStyle: {
      marginVertical: 10,
    },
    inputStyle: {
      fontSize: 16,
    },
  },
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <MainApp />
    </ThemeProvider>
  );
};

export default App;
```

### **Components Example:**
```javascript
// screens/RNElementsExample.js
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  Header,
  Button,
  Input,
  Card,
  ListItem,
  Avatar,
  Badge,
  CheckBox,
  Slider,
  Rating,
  SearchBar,
  ButtonGroup,
  Overlay,
  Text,
  Divider,
  Image,
  Tile,
  PricingCard,
  SocialIcon,
} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

const RNElementsExample = () => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [checked, setChecked] = useState(false);
  const [sliderValue, setSliderValue] = useState(20);
  const [rating, setRating] = useState(3);
  const [visible, setVisible] = useState(false);
  
  const buttons = ['Button 1', 'Button 2', 'Button 3'];
  
  const list = [
    {
      name: 'Amy Farha',
      avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
      subtitle: 'Vice President'
    },
    {
      name: 'Chris Jackson',
      avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
      subtitle: 'Vice Chairman'
    },
  ];
  
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <Header
        centerComponent={{ text: 'RN Elements', style: { color: '#fff', fontSize: 18 } }}
        rightComponent={{ icon: 'home', color: '#fff' }}
        backgroundColor="#0088CC"
      />
      
      {/* Search Bar */}
      <SearchBar
        placeholder="Type Here..."
        onChangeText={setSearch}
        value={search}
        platform="default"
        containerStyle={{ backgroundColor: 'transparent', borderTopWidth: 0, borderBottomWidth: 0 }}
      />
      
      {/* Button Group */}
      <ButtonGroup
        onPress={setSelectedIndex}
        selectedIndex={selectedIndex}
        buttons={buttons}
        containerStyle={{ height: 50, marginVertical: 10 }}
      />
      
      {/* Cards */}
      <Card>
        <Card.Title>CARD WITH DIVIDER</Card.Title>
        <Card.Divider />
        <Text style={{ marginBottom: 10 }}>
          The idea with React Native Elements is more about component structure than actual design.
        </Text>
        <Button
          icon={<Icon name="code" size={15} color="white" />}
          buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
          title="VIEW NOW"
        />
      </Card>
      
      {/* Pricing Card */}
      <PricingCard
        color="#4f9deb"
        title="Free"
        price="$0"
        info={['1 User', 'Basic Support', 'All Core Features']}
        button={{ title: 'GET STARTED', icon: 'flight-takeoff' }}
      />
      
      {/* List Items */}
      <Card>
        <Card.Title>Team Members</Card.Title>
        <Card.Divider />
        {list.map((l, i) => (
          <ListItem key={i} bottomDivider>
            <Avatar source={{ uri: l.avatar_url }} />
            <ListItem.Content>
              <ListItem.Title>{l.name}</ListItem.Title>
              <ListItem.Subtitle>{l.subtitle}</ListItem.Subtitle>
            </ListItem.Content>
            <Badge value="3" status="success" />
          </ListItem>
        ))}
      </Card>
      
      {/* Input */}
      <Input
        placeholder="Email"
        leftIcon={{ type: 'font-awesome', name: 'envelope' }}
        containerStyle={{ paddingHorizontal: 20 }}
      />
      
      <Input
        placeholder="Password"
        secureTextEntry={true}
        leftIcon={{ type: 'font-awesome', name: 'lock' }}
        containerStyle={{ paddingHorizontal: 20 }}
      />
      
      {/* CheckBox */}
      <CheckBox
        title="Remember Me"
        checked={checked}
        onPress={() => setChecked(!checked)}
        containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
      />
      
      {/* Slider */}
      <View style={{ paddingHorizontal: 20, marginVertical: 20 }}>
        <Text>Slider Value: {sliderValue}</Text>
        <Slider
          value={sliderValue}
          onValueChange={setSliderValue}
          maximumValue={100}
          minimumValue={0}
          thumbStyle={{ backgroundColor: '#0088CC' }}
          trackStyle={{ backgroundColor: '#d3d3d3' }}
          minimumTrackTintColor="#0088CC"
        />
      </View>
      
      {/* Rating */}
      <View style={{ paddingHorizontal: 20, marginVertical: 20 }}>
        <Text>Rating: {rating}</Text>
        <Rating
          showRating
          onFinishRating={setRating}
          style={{ paddingVertical: 10 }}
        />
      </View>
      
      {/* Buttons */}
      <View style={{ paddingHorizontal: 20, marginVertical: 10 }}>
        <Button
          title="Show Overlay"
          onPress={() => setVisible(true)}
          buttonStyle={{ marginBottom: 10 }}
        />
        
        <Button
          title="Outline Button"
          type="outline"
          buttonStyle={{ marginBottom: 10 }}
        />
        
        <Button
          title="Clear Button"
          type="clear"
          buttonStyle={{ marginBottom: 10 }}
        />
      </View>
      
      {/* Social Icons */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 }}>
        <SocialIcon type="twitter" />
        <SocialIcon type="facebook" />
        <SocialIcon type="instagram" />
        <SocialIcon type="linkedin" />
      </View>
      
      {/* Tile */}
      <Tile
        imageSrc={{ uri: 'https://images.unsplash.com/photo-1441742917377-57f78ee0e582?ixlib=rb-4.0.3' }}
        title="Beautiful Landscape"
        featured
        caption="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores dolore exercitationem"
      />
      
      {/* Overlay */}
      <Overlay isVisible={visible} onBackdropPress={() => setVisible(false)}>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 18, marginBottom: 20 }}>Hello from Overlay!</Text>
          <Button title="Close" onPress={() => setVisible(false)} />
        </View>
      </Overlay>
    </ScrollView>
  );
};

export default RNElementsExample;
```

## 🎨 UI Kitten

### **Why UI Kitten?**
- **Eva Design System** - Professional design language
- **Dark Theme** - Built-in dark mode support
- **Customizable** - Easy theme customization
- **TypeScript** - Full TypeScript support

### **Installation:**
```bash
npm install @ui-kitten/components @eva-design/eva react-native-svg
npm install react-native-safe-area-context

# iOS
cd ios && pod install
```

### **Setup:**
```javascript
// App.js
import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import MainApp from './MainApp';

const App = () => (
  <>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={eva.light}>
      <MainApp />
    </ApplicationProvider>
  </>
);

export default App;
```

### **Components Example:**
```javascript
// screens/UIKittenExample.js
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import {
  Layout,
  Text,
  Button,
  Input,
  Card,
  List,
  ListItem,
  Avatar,
  Toggle,
  CheckBox,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  IndexPath,
  Datepicker,
  RangeDatepicker,
  Calendar,
  Modal,
  Popover,
  Tooltip,
  Menu,
  MenuItem,
  TopNavigation,
  TopNavigationAction,
  Divider,
  Icon,
  Spinner,
  ProgressBar,
} from '@ui-kitten/components';

const UIKittenExample = () => {
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const [checked, setChecked] = useState(false);
  const [toggleChecked, setToggleChecked] = useState(false);
  const [radioIndex, setRadioIndex] = useState(0);
  const [date, setDate] = useState(new Date());
  const [visible, setVisible] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);
  
  const data = new Array(8).fill({
    title: 'Item',
    description: 'Description for Item',
  });
  
  const displayValue = ['Option 1', 'Option 2', 'Option 3'][selectedIndex.row];
  
  const renderItem = ({ item, index }) => (
    <ListItem
      title={`${item.title} ${index + 1}`}
      description={`${item.description} ${index + 1}`}
      accessoryLeft={() => <Avatar source={{ uri: 'https://i.pravatar.cc/40' }} />}
      accessoryRight={() => <Icon name="arrow-ios-forward" />}
    />
  );
  
  const BackIcon = (props) => (
    <Icon {...props} name="arrow-back" />
  );
  
  const MenuIcon = (props) => (
    <Icon {...props} name="more-vertical" />
  );
  
  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon} />
  );
  
  const renderMenuAction = () => (
    <TopNavigationAction icon={MenuIcon} />
  );
  
  return (
    <Layout style={{ flex: 1 }}>
      {/* Top Navigation */}
      <TopNavigation
        title="UI Kitten Demo"
        alignment="center"
        accessoryLeft={renderBackAction}
        accessoryRight={renderMenuAction}
      />
      <Divider />
      
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* Text */}
        <Text category="h1">UI Kitten Components</Text>
        <Text category="s1" appearance="hint" style={{ marginBottom: 16 }}>
          Eva Design System components
        </Text>
        
        {/* Card */}
        <Card style={{ marginBottom: 16 }}>
          <Text category="h6">Card Title</Text>
          <Text category="p2" appearance="hint">
            This is a beautiful card component with UI Kitten.
          </Text>
        </Card>
        
        {/* Inputs */}
        <Input
          placeholder="Enter your name"
          style={{ marginBottom: 16 }}
        />
        
        <Input
          placeholder="Enter password"
          secureTextEntry={true}
          style={{ marginBottom: 16 }}
        />
        
        {/* Select */}
        <Select
          placeholder="Default"
          value={displayValue}
          selectedIndex={selectedIndex}
          onSelect={index => setSelectedIndex(index)}
          style={{ marginBottom: 16 }}
        >
          <SelectItem title="Option 1" />
          <SelectItem title="Option 2" />
          <SelectItem title="Option 3" />
        </Select>
        
        {/* CheckBox & Toggle */}
        <Layout style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
          <CheckBox
            checked={checked}
            onChange={nextChecked => setChecked(nextChecked)}
          >
            CheckBox
          </CheckBox>
          <Toggle
            checked={toggleChecked}
            onChange={setToggleChecked}
          >
            Toggle
          </Toggle>
        </Layout>
        
        {/* Radio Group */}
        <RadioGroup
          selectedIndex={radioIndex}
          onChange={index => setRadioIndex(index)}
          style={{ marginBottom: 16 }}
        >
          <Radio>Option 1</Radio>
          <Radio>Option 2</Radio>
          <Radio>Option 3</Radio>
        </RadioGroup>
        
        {/* Date Picker */}
        <Datepicker
          label="Date"
          date={date}
          onSelect={nextDate => setDate(nextDate)}
          style={{ marginBottom: 16 }}
        />
        
        {/* Progress Bar */}
        <Text category="label" style={{ marginBottom: 8 }}>Progress</Text>
        <ProgressBar progress={0.7} style={{ marginBottom: 16 }} />
        
        {/* Spinner */}
        <Layout style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Spinner size="small" />
          <Text style={{ marginLeft: 8 }}>Loading...</Text>
        </Layout>
        
        {/* Buttons */}
        <Layout style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
          <Button size="small">Small</Button>
          <Button>Medium</Button>
          <Button size="large">Large</Button>
        </Layout>
        
        <Layout style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
          <Button appearance="outline">Outline</Button>
          <Button appearance="ghost">Ghost</Button>
          <Button status="danger">Danger</Button>
        </Layout>
        
        <Button onPress={() => setVisible(true)} style={{ marginBottom: 16 }}>
          Show Modal
        </Button>
        
        {/* List */}
        <Card>
          <Text category="h6" style={{ marginBottom: 16 }}>List Items</Text>
          <List
            data={data.slice(0, 3)}
            renderItem={renderItem}
          />
        </Card>
      </ScrollView>
      
      {/* Modal */}
      <Modal
        visible={visible}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={() => setVisible(false)}
      >
        <Card disabled={true}>
          <Text category="h6">Modal Title</Text>
          <Text style={{ marginVertical: 16 }}>
            This is modal content. You can put any component here.
          </Text>
          <Button onPress={() => setVisible(false)}>
            Close Modal
          </Button>
        </Card>
      </Modal>
    </Layout>
  );
};

export default UIKittenExample;
```

## 🎯 Exercises

### **Exercise 1: NativeBase Profile Screen** ⭐⭐
Create a profile screen using NativeBase:
- User avatar and info
- Form inputs for editing
- Save/cancel buttons
- Toast notifications

### **Exercise 2: RN Elements Social Feed** ⭐⭐⭐
Build a social media feed:
- Header with search
- Card-based posts
- Like/comment buttons
- User avatars and badges

### **Exercise 3: UI Kitten Dashboard** ⭐⭐⭐⭐
Create an admin dashboard:
- Navigation with tabs
- Charts and statistics
- Data tables
- Modal forms

### **Exercise 4: Multi-Library App** ⭐⭐⭐⭐⭐
Build an app using multiple libraries:
- NativeBase for forms
- RN Elements for navigation
- UI Kitten for data display
- Consistent theming

## 🔗 Resources & Links

### **NativeBase:**
- Official Docs: https://nativebase.io/
- Components: https://docs.nativebase.io/
- Themes: https://docs.nativebase.io/theme

### **React Native Elements:**
- Official Docs: https://reactnativeelements.com/
- Components: https://reactnativeelements.com/docs/
- Theming: https://reactnativeelements.com/docs/customization

### **UI Kitten:**
- Official Docs: https://akveo.github.io/react-native-ui-kitten/
- Eva Design: https://eva.design/
- Themes: https://akveo.github.io/react-native-ui-kitten/docs/design-system/eva-theme

### **Design Systems:**
- Material Design: https://material.io/design
- Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/
- Eva Design System: https://eva.design/

UI libraries master karne ke baad tumhara app professional aur beautiful dikhega! 🎨✨
