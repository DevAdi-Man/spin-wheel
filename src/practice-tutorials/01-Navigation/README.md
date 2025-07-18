# Navigation & Routing Mastery 🧭

## React Navigation Complete Guide

Navigation React Native apps ka backbone hai. Ye tutorial tumhe sab types ke navigation patterns sikhayega.

## 📚 What You'll Learn

### **Navigation Types:**
- **Stack Navigation** - Screen pe screen stack karna
- **Tab Navigation** - Bottom tabs jaise Instagram
- **Drawer Navigation** - Side menu jaise Facebook
- **Modal Navigation** - Popup screens
- **Nested Navigation** - Complex navigation structures

## 🎯 Real-World Examples

### **Apps Using These Patterns:**
- **Instagram** - Tab + Stack navigation
- **Facebook** - Drawer + Tab + Stack
- **WhatsApp** - Tab + Stack navigation
- **Uber** - Stack + Modal navigation

## 📖 Theory Deep Dive

### **Stack Navigation Kya Hai?**
```
Screen A → Screen B → Screen C
   ↑         ↑         ↑
 Home    Details    Settings
```

Jaise books ka stack hota hai, waise screens ka stack hota hai. New screen push karte hain, back karne pe pop hota hai.

### **Tab Navigation Kya Hai?**
```
[Home] [Search] [Profile] [Settings]
  ↑       ↑        ↑        ↑
Active  Inactive Inactive Inactive
```

Bottom mein tabs hote hain, tap karne pe screen change hoti hai.

### **Drawer Navigation Kya Hai?**
```
☰ Menu
├── Home
├── Profile  
├── Settings
└── Logout
```

Side se slide karne pe menu aata hai.

## 💻 Installation & Setup

```bash
npm install @react-navigation/native
npm install @react-navigation/stack
npm install @react-navigation/bottom-tabs
npm install @react-navigation/drawer

# Dependencies
npm install react-native-screens react-native-safe-area-context
npm install react-native-gesture-handler react-native-reanimated

# iOS
cd ios && pod install
```

## 🚀 Basic Stack Navigation

### **Simple Stack Example:**
```javascript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Button } from 'react-native';

const Stack = createStackNavigator();

// Home Screen
const HomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details', { 
          itemId: 86, 
          otherParam: 'anything you want here' 
        })}
      />
    </View>
  );
};

// Details Screen
const DetailsScreen = ({ route, navigation }) => {
  const { itemId, otherParam } = route.params;
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Details Screen</Text>
      <Text>Item ID: {itemId}</Text>
      <Text>Other Param: {otherParam}</Text>
      <Button
        title="Go Back"
        onPress={() => navigation.goBack()}
      />
      <Button
        title="Go to Home"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
};

// Main App
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6c5ce7',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'My Home' }}
        />
        <Stack.Screen 
          name="Details" 
          component={DetailsScreen}
          options={({ route }) => ({ 
            title: `Details - ${route.params.itemId}` 
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
```

## 🎨 Tab Navigation

### **Bottom Tabs Example:**
```javascript
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6c5ce7',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
```

## 🎭 Drawer Navigation

### **Side Drawer Example:**
```javascript
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#f8f9fa',
          width: 280,
        },
        drawerActiveTintColor: '#6c5ce7',
        drawerInactiveTintColor: '#666',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
        },
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="person-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="settings-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};
```

## 🔄 Nested Navigation

### **Complex Navigation Structure:**
```javascript
// Tab Navigator inside Stack Navigator
const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

// Final App with Drawer containing Tabs
const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Main" component={MainTabNavigator} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};
```

## 🎯 Advanced Navigation Patterns

### **1. Authentication Flow:**
```javascript
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
};

const RootNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  return (
    <NavigationContainer>
      {isLoggedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
```

### **2. Modal Navigation:**
```javascript
const RootStack = () => {
  return (
    <Stack.Navigator mode="modal">
      <Stack.Screen 
        name="Main" 
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Modal" 
        component={ModalScreen}
        options={{
          title: 'Modal Screen',
          headerLeft: () => (
            <Button title="Close" onPress={() => navigation.goBack()} />
          ),
        }}
      />
    </Stack.Navigator>
  );
};
```

## 🎨 Custom Navigation Components

### **Custom Header:**
```javascript
const CustomHeader = ({ title, navigation }) => {
  return (
    <View style={styles.header}>
      <Pressable onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="white" />
      </Pressable>
      <Text style={styles.headerTitle}>{title}</Text>
      <Pressable onPress={() => navigation.navigate('Search')}>
        <Icon name="search" size={24} color="white" />
      </Pressable>
    </View>
  );
};

// Usage
<Stack.Screen 
  name="Details" 
  component={DetailsScreen}
  options={{
    header: ({ navigation }) => (
      <CustomHeader title="Details" navigation={navigation} />
    ),
  }}
/>
```

### **Custom Tab Bar:**
```javascript
const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || route.name;
        const isFocused = state.index === index;
        
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });
          
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        
        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={[styles.tabItem, isFocused && styles.activeTab]}
          >
            <Text style={[styles.tabLabel, isFocused && styles.activeLabel]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

// Usage
<Tab.Navigator tabBar={props => <CustomTabBar {...props} />}>
```

## 🔗 Deep Linking

### **URL Scheme Setup:**
```javascript
const linking = {
  prefixes: ['myapp://'],
  config: {
    screens: {
      Home: 'home',
      Profile: 'profile/:userId',
      Details: 'details/:itemId',
    },
  },
};

const App = () => {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        {/* Your screens */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

### **Handle Deep Links:**
```javascript
// myapp://profile/123 will navigate to Profile screen with userId: 123
const ProfileScreen = ({ route }) => {
  const { userId } = route.params;
  
  useEffect(() => {
    // Load user data based on userId
    loadUserData(userId);
  }, [userId]);
  
  return (
    <View>
      <Text>User Profile: {userId}</Text>
    </View>
  );
};
```

## 🎯 Navigation Hooks

### **Useful Navigation Hooks:**
```javascript
import { 
  useNavigation, 
  useRoute, 
  useFocusEffect,
  useIsFocused 
} from '@react-navigation/native';

const MyComponent = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();
  
  // Run effect when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Do something when screen is focused
      console.log('Screen is focused');
      
      return () => {
        // Cleanup when screen loses focus
        console.log('Screen lost focus');
      };
    }, [])
  );
  
  // Conditional rendering based on focus
  if (!isFocused) {
    return <LoadingScreen />;
  }
  
  return (
    <View>
      <Text>Current route: {route.name}</Text>
      <Button
        title="Go Back"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};
```

## 🎨 Navigation Animations

### **Custom Transitions:**
```javascript
const forSlideFromRight = ({ current, layouts }) => {
  return {
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0],
          }),
        },
      ],
    },
  };
};

const forFadeFromCenter = ({ current }) => {
  return {
    cardStyle: {
      opacity: current.progress,
    },
  };
};

// Usage
<Stack.Navigator
  screenOptions={{
    cardStyleInterpolator: forSlideFromRight,
  }}
>
  <Stack.Screen 
    name="Details" 
    component={DetailsScreen}
    options={{
      cardStyleInterpolator: forFadeFromCenter,
    }}
  />
</Stack.Navigator>
```

## 🎯 Exercises

### **Exercise 1: Basic Navigation** ⭐
Create a simple app with:
- Home screen with list of items
- Details screen showing item details
- Back navigation

### **Exercise 2: Tab Navigation** ⭐⭐
Build Instagram-like tabs:
- Home feed
- Search screen
- Profile screen
- Custom tab icons

### **Exercise 3: Drawer Navigation** ⭐⭐⭐
Create Facebook-like drawer:
- Main content area
- Side drawer with menu items
- Custom drawer content

### **Exercise 4: Authentication Flow** ⭐⭐⭐⭐
Implement complete auth flow:
- Login/Register screens
- Protected routes
- Conditional navigation

### **Exercise 5: Complex Nested Navigation** ⭐⭐⭐⭐⭐
Build WhatsApp-like navigation:
- Tab navigator (Chats, Status, Calls)
- Stack navigation within each tab
- Modal screens for camera/settings

## 🔗 Resources & Links

### **Official Documentation:**
- React Navigation: https://reactnavigation.org/
- Stack Navigator: https://reactnavigation.org/docs/stack-navigator
- Tab Navigator: https://reactnavigation.org/docs/bottom-tab-navigator
- Drawer Navigator: https://reactnavigation.org/docs/drawer-navigator

### **Video Tutorials:**
- React Navigation 6 Complete Guide
- Advanced Navigation Patterns
- Custom Navigation Components

### **GitHub Examples:**
- React Navigation Examples: https://github.com/react-navigation/react-navigation/tree/main/example
- Real-world Navigation Patterns
- Custom Navigation Components

### **Practice Projects:**
- Instagram Clone Navigation
- WhatsApp Clone Navigation
- E-commerce App Navigation
- Social Media App Navigation

## 🏆 Portfolio Projects

### **Beginner:**
- Simple Todo App with navigation
- Recipe App with categories

### **Intermediate:**
- Social Media App
- E-commerce App

### **Advanced:**
- Multi-tenant App
- Complex Business App

Master navigation aur tumhara React Native journey ka 50% complete! 🚀
