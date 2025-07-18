# Testing in React Native 🧪

## 🎯 Overview

Testing React Native apps ke liye comprehensive approach zaroori hai. Is tutorial mein aap seekhenge ki unit testing, integration testing, aur end-to-end testing kaise implement karte hain.

## 🎯 What You'll Learn

- Jest unit testing fundamentals
- React Native Testing Library
- Detox E2E testing
- Component testing strategies
- API mocking and testing
- Test-driven development (TDD)
- Continuous integration testing
- Performance testing

## 📚 Core Concepts

### 1. **Jest Unit Testing**
```jsx
// utils/calculator.js
export const add = (a, b) => a + b;
export const multiply = (a, b) => a * b;
export const divide = (a, b) => {
  if (b === 0) throw new Error('Division by zero');
  return a / b;
};

// __tests__/calculator.test.js
import { add, multiply, divide } from '../utils/calculator';

describe('Calculator Utils', () => {
  test('should add two numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
    expect(add(0, 0)).toBe(0);
  });

  test('should multiply two numbers correctly', () => {
    expect(multiply(3, 4)).toBe(12);
    expect(multiply(-2, 3)).toBe(-6);
    expect(multiply(0, 5)).toBe(0);
  });

  test('should divide two numbers correctly', () => {
    expect(divide(10, 2)).toBe(5);
    expect(divide(7, 2)).toBe(3.5);
  });

  test('should throw error when dividing by zero', () => {
    expect(() => divide(5, 0)).toThrow('Division by zero');
  });
});
```

### 2. **React Native Testing Library**
```jsx
// components/Counter.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const Counter = ({ initialValue = 0, onCountChange }) => {
  const [count, setCount] = useState(initialValue);

  const increment = () => {
    const newCount = count + 1;
    setCount(newCount);
    onCountChange?.(newCount);
  };

  const decrement = () => {
    const newCount = count - 1;
    setCount(newCount);
    onCountChange?.(newCount);
  };

  return (
    <View testID="counter-container">
      <Text testID="counter-value">{count}</Text>
      <TouchableOpacity testID="increment-button" onPress={increment}>
        <Text>+</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="decrement-button" onPress={decrement}>
        <Text>-</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Counter;

// __tests__/Counter.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Counter from '../components/Counter';

describe('Counter Component', () => {
  test('renders with initial value', () => {
    const { getByTestId } = render(<Counter initialValue={5} />);
    
    expect(getByTestId('counter-value')).toHaveTextContent('5');
  });

  test('increments count when increment button is pressed', () => {
    const { getByTestId } = render(<Counter />);
    const incrementButton = getByTestId('increment-button');
    const counterValue = getByTestId('counter-value');

    fireEvent.press(incrementButton);
    
    expect(counterValue).toHaveTextContent('1');
  });

  test('decrements count when decrement button is pressed', () => {
    const { getByTestId } = render(<Counter initialValue={5} />);
    const decrementButton = getByTestId('decrement-button');
    const counterValue = getByTestId('counter-value');

    fireEvent.press(decrementButton);
    
    expect(counterValue).toHaveTextContent('4');
  });

  test('calls onCountChange when count changes', () => {
    const mockOnCountChange = jest.fn();
    const { getByTestId } = render(
      <Counter onCountChange={mockOnCountChange} />
    );
    
    fireEvent.press(getByTestId('increment-button'));
    
    expect(mockOnCountChange).toHaveBeenCalledWith(1);
  });
});
```

### 3. **API Mocking**
```jsx
// services/userService.js
export const fetchUser = async (userId) => {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
};

export const createUser = async (userData) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create user');
  }
  
  return response.json();
};

// __tests__/userService.test.js
import { fetchUser, createUser } from '../services/userService';

// Mock fetch globally
global.fetch = jest.fn();

describe('User Service', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('fetchUser returns user data on success', async () => {
    const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    const user = await fetchUser(1);
    
    expect(fetch).toHaveBeenCalledWith('/api/users/1');
    expect(user).toEqual(mockUser);
  });

  test('fetchUser throws error on failure', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(fetchUser(999)).rejects.toThrow('Failed to fetch user');
  });

  test('createUser sends correct data', async () => {
    const newUser = { name: 'Jane Doe', email: 'jane@example.com' };
    const createdUser = { id: 2, ...newUser };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => createdUser,
    });

    const result = await createUser(newUser);
    
    expect(fetch).toHaveBeenCalledWith('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    expect(result).toEqual(createdUser);
  });
});
```

## 🛠️ Essential Libraries

### **Testing Libraries**
```bash
# Core testing
npm install --save-dev jest
npm install --save-dev @testing-library/react-native
npm install --save-dev @testing-library/jest-native

# E2E testing
npm install --save-dev detox
npm install --save-dev @config/detox

# Mocking
npm install --save-dev jest-fetch-mock
npm install --save-dev @react-native-async-storage/async-storage/jest/async-storage-mock
```

### **Additional Tools**
```bash
# Test utilities
npm install --save-dev react-test-renderer
npm install --save-dev enzyme
npm install --save-dev enzyme-adapter-react-16

# Coverage reporting
npm install --save-dev @jest/reporters
npm install --save-dev jest-html-reporters
```

## 💻 Practical Examples

### **Example 1: Component Integration Testing** ⭐⭐⭐
```jsx
// components/UserProfile.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { fetchUser } from '../services/userService';

const UserProfile = ({ userId, onEdit }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await fetchUser(userId);
      setUser(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (user) {
      onEdit(user);
    }
  };

  if (loading) {
    return <Text testID="loading-text">Loading...</Text>;
  }

  if (error) {
    return (
      <View testID="error-container">
        <Text testID="error-text">{error}</Text>
        <TouchableOpacity testID="retry-button" onPress={loadUser}>
          <Text>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!user) {
    return <Text testID="no-user-text">No user found</Text>;
  }

  return (
    <View testID="user-profile-container">
      <Image
        testID="user-avatar"
        source={{ uri: user.avatar }}
        style={{ width: 100, height: 100 }}
      />
      <Text testID="user-name">{user.name}</Text>
      <Text testID="user-email">{user.email}</Text>
      <TouchableOpacity testID="edit-button" onPress={handleEdit}>
        <Text>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserProfile;

// __tests__/UserProfile.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import UserProfile from '../components/UserProfile';
import { fetchUser } from '../services/userService';

// Mock the service
jest.mock('../services/userService');

describe('UserProfile Component', () => {
  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg',
  };

  beforeEach(() => {
    fetchUser.mockClear();
  });

  test('displays loading state initially', () => {
    fetchUser.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    const { getByTestId } = render(<UserProfile userId={1} />);
    
    expect(getByTestId('loading-text')).toHaveTextContent('Loading...');
  });

  test('displays user data after successful fetch', async () => {
    fetchUser.mockResolvedValue(mockUser);
    
    const { getByTestId } = render(<UserProfile userId={1} />);
    
    await waitFor(() => {
      expect(getByTestId('user-name')).toHaveTextContent('John Doe');
      expect(getByTestId('user-email')).toHaveTextContent('john@example.com');
    });
    
    expect(fetchUser).toHaveBeenCalledWith(1);
  });

  test('displays error state when fetch fails', async () => {
    fetchUser.mockRejectedValue(new Error('Network error'));
    
    const { getByTestId } = render(<UserProfile userId={1} />);
    
    await waitFor(() => {
      expect(getByTestId('error-text')).toHaveTextContent('Network error');
    });
  });

  test('retries loading when retry button is pressed', async () => {
    fetchUser
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(mockUser);
    
    const { getByTestId } = render(<UserProfile userId={1} />);
    
    // Wait for error state
    await waitFor(() => {
      expect(getByTestId('error-text')).toHaveTextContent('Network error');
    });
    
    // Press retry button
    fireEvent.press(getByTestId('retry-button'));
    
    // Wait for success state
    await waitFor(() => {
      expect(getByTestId('user-name')).toHaveTextContent('John Doe');
    });
    
    expect(fetchUser).toHaveBeenCalledTimes(2);
  });

  test('calls onEdit with user data when edit button is pressed', async () => {
    fetchUser.mockResolvedValue(mockUser);
    const mockOnEdit = jest.fn();
    
    const { getByTestId } = render(
      <UserProfile userId={1} onEdit={mockOnEdit} />
    );
    
    await waitFor(() => {
      expect(getByTestId('user-name')).toHaveTextContent('John Doe');
    });
    
    fireEvent.press(getByTestId('edit-button'));
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockUser);
  });
});
```

### **Example 2: Detox E2E Testing** ⭐⭐⭐⭐
```javascript
// e2e/firstTest.e2e.js
describe('App E2E Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display welcome screen', async () => {
    await expect(element(by.id('welcome-screen'))).toBeVisible();
    await expect(element(by.text('Welcome to React Native!'))).toBeVisible();
  });

  it('should navigate to user profile', async () => {
    // Tap on profile button
    await element(by.id('profile-button')).tap();
    
    // Wait for profile screen to load
    await waitFor(element(by.id('user-profile-screen')))
      .toBeVisible()
      .withTimeout(5000);
    
    // Verify profile elements
    await expect(element(by.id('user-name'))).toBeVisible();
    await expect(element(by.id('user-email'))).toBeVisible();
  });

  it('should handle form submission', async () => {
    // Navigate to form
    await element(by.id('form-button')).tap();
    
    // Fill form fields
    await element(by.id('name-input')).typeText('John Doe');
    await element(by.id('email-input')).typeText('john@example.com');
    
    // Submit form
    await element(by.id('submit-button')).tap();
    
    // Verify success message
    await waitFor(element(by.text('Form submitted successfully!')))
      .toBeVisible()
      .withTimeout(3000);
  });

  it('should handle network errors gracefully', async () => {
    // Mock network failure
    await device.setURLBlacklist(['**/api/**']);
    
    // Try to load data
    await element(by.id('load-data-button')).tap();
    
    // Verify error message
    await waitFor(element(by.text('Network error occurred')))
      .toBeVisible()
      .withTimeout(5000);
    
    // Clear blacklist
    await device.setURLBlacklist([]);
  });
});

// detox.config.js
module.exports = {
  testRunner: 'jest',
  runnerConfig: 'e2e/config.json',
  configurations: {
    'ios.sim.debug': {
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/YourApp.app',
      build: 'xcodebuild -workspace ios/YourApp.xcworkspace -scheme YourApp -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
      type: 'ios.simulator',
      device: {
        type: 'iPhone 12',
      },
    },
    'android.emu.debug': {
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug',
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_3_API_29',
      },
    },
  },
};
```

### **Example 3: Custom Testing Utilities** ⭐⭐⭐⭐⭐
```jsx
// __tests__/utils/testUtils.js
import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Custom render function with providers
export const renderWithProviders = (
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        // Add your reducers here
      },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <NavigationContainer>
        {children}
      </NavigationContainer>
    </Provider>
  );

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

// Mock navigation
export const createMockNavigation = (params = {}) => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  dispatch: jest.fn(),
  setParams: jest.fn(),
  addListener: jest.fn(() => jest.fn()),
  isFocused: jest.fn(() => true),
  canGoBack: jest.fn(() => false),
  getParent: jest.fn(),
  getState: jest.fn(() => ({
    routes: [{ name: 'Test', params }],
    index: 0,
  })),
});

// Mock AsyncStorage
export const mockAsyncStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
};

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  avatar: 'https://example.com/avatar.jpg',
  ...overrides,
});

export const createMockPost = (overrides = {}) => ({
  id: 1,
  title: 'Test Post',
  content: 'This is a test post content',
  author: createMockUser(),
  createdAt: new Date().toISOString(),
  ...overrides,
});

// Wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

// Custom matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});
```

## 🎯 Practice Exercises

### **Beginner Level** ⭐
1. **Basic Unit Tests** - Write tests for utility functions
2. **Component Rendering** - Test component rendering with different props

### **Intermediate Level** ⭐⭐⭐
3. **User Interactions** - Test button presses and form submissions
4. **API Mocking** - Mock API calls and test different response scenarios

### **Advanced Level** ⭐⭐⭐⭐
5. **Integration Testing** - Test component interactions with services
6. **Navigation Testing** - Test screen navigation and routing

### **Expert Level** ⭐⭐⭐⭐⭐
7. **E2E Testing** - Implement comprehensive end-to-end test suites
8. **Performance Testing** - Test app performance and memory usage

## 🔧 Configuration

### **Jest Configuration**
```json
// jest.config.js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/jest.setup.js',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-vector-icons)/)',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.js',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

// jest.setup.js
import 'react-native-gesture-handler/jestSetup';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});
```

## 📊 Testing Strategies

### **Testing Pyramid**
1. **Unit Tests (70%)** - Test individual functions and components
2. **Integration Tests (20%)** - Test component interactions
3. **E2E Tests (10%)** - Test complete user workflows

### **Test Coverage Goals**
- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

## 🔗 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Detox E2E Testing](https://github.com/wix/Detox)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

Testing se aap confident aur bug-free apps bana sakte hain! 🧪✨
