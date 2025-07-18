# Advanced Patterns 🎯

## 🧠 Overview

Advanced React patterns React Native development mein code quality, maintainability, aur reusability improve karte hain. Is tutorial mein aap seekhenge ki modern React patterns kaise implement karte hain aur complex applications kaise structure karte hain.

## 🎯 What You'll Learn

- Custom Hooks patterns
- Higher Order Components (HOCs)
- Render Props pattern
- Compound Components
- Provider pattern
- Observer pattern
- Factory pattern
- Dependency Injection
- Error Boundaries
- Code splitting strategies

## 📚 Core Concepts

### 1. **Custom Hooks Patterns**
```jsx
// useApi - Generic API hook
import { useState, useEffect, useCallback } from 'react';

const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

// useLocalStorage - Persistent state hook
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = AsyncStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from AsyncStorage:', error);
      return initialValue;
    }
  });

  const setValue = useCallback(async (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error writing to AsyncStorage:', error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error('Error removing from AsyncStorage:', error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

// useDebounce - Debounced value hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Usage
const SearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  const { data: searchResults, loading, error } = useApi(
    debouncedSearchTerm ? `/api/search?q=${debouncedSearchTerm}` : null
  );

  return (
    <View>
      <TextInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Search..."
      />
      
      {loading && <Text>Searching...</Text>}
      {error && <Text>Error: {error}</Text>}
      
      <FlatList
        data={searchResults}
        renderItem={({ item }) => <SearchResultItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};
```

### 2. **Higher Order Components (HOCs)**
```jsx
// withLoading HOC
const withLoading = (WrappedComponent) => {
  return (props) => {
    if (props.loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
        </View>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

// withErrorBoundary HOC
const withErrorBoundary = (WrappedComponent, fallbackComponent) => {
  class ErrorBoundaryHOC extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      console.error('Error caught by HOC:', error, errorInfo);
      // Log to crash reporting service
    }

    render() {
      if (this.state.hasError) {
        const FallbackComponent = fallbackComponent || DefaultErrorFallback;
        return <FallbackComponent error={this.state.error} />;
      }

      return <WrappedComponent {...this.props} />;
    }
  }

  return ErrorBoundaryHOC;
};

// withAuthentication HOC
const withAuthentication = (WrappedComponent) => {
  return (props) => {
    const { user, loading } = useAuth();

    if (loading) {
      return <LoadingScreen />;
    }

    if (!user) {
      return <LoginScreen />;
    }

    return <WrappedComponent {...props} user={user} />;
  };
};

// Usage
const UserProfile = ({ user }) => (
  <View>
    <Text>Welcome, {user.name}!</Text>
  </View>
);

const EnhancedUserProfile = withAuthentication(
  withErrorBoundary(
    withLoading(UserProfile)
  )
);
```

### 3. **Render Props Pattern**
```jsx
// DataFetcher component with render props
class DataFetcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: true,
      error: null,
    };
  }

  async componentDidMount() {
    try {
      const response = await fetch(this.props.url);
      const data = await response.json();
      this.setState({ data, loading: false });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  }

  render() {
    return this.props.children(this.state);
  }
}

// Mouse tracker with render props
const MouseTracker = ({ children }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    setPosition({
      x: event.nativeEvent.locationX,
      y: event.nativeEvent.locationY,
    });
  };

  return (
    <View onTouchMove={handleMouseMove} style={{ flex: 1 }}>
      {children(position)}
    </View>
  );
};

// Usage
const App = () => (
  <View>
    <DataFetcher url="/api/users">
      {({ data, loading, error }) => {
        if (loading) return <Text>Loading...</Text>;
        if (error) return <Text>Error: {error}</Text>;
        return (
          <FlatList
            data={data}
            renderItem={({ item }) => <UserItem user={item} />}
            keyExtractor={(item) => item.id.toString()}
          />
        );
      }}
    </DataFetcher>

    <MouseTracker>
      {({ x, y }) => (
        <Text>Mouse position: {x}, {y}</Text>
      )}
    </MouseTracker>
  </View>
);
```

### 4. **Compound Components Pattern**
```jsx
// Modal compound component
const Modal = ({ children, visible, onClose }) => {
  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        {children}
      </View>
    </View>
  );
};

const ModalHeader = ({ children, onClose }) => (
  <View style={styles.modalHeader}>
    {children}
    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
      <Text>×</Text>
    </TouchableOpacity>
  </View>
);

const ModalBody = ({ children }) => (
  <View style={styles.modalBody}>
    {children}
  </View>
);

const ModalFooter = ({ children }) => (
  <View style={styles.modalFooter}>
    {children}
  </View>
);

// Attach sub-components
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

// Accordion compound component
const Accordion = ({ children, allowMultiple = false }) => {
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (index) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <View style={styles.accordion}>
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          isOpen: openItems.has(index),
          onToggle: () => toggleItem(index),
        })
      )}
    </View>
  );
};

const AccordionItem = ({ title, children, isOpen, onToggle }) => (
  <View style={styles.accordionItem}>
    <TouchableOpacity onPress={onToggle} style={styles.accordionHeader}>
      <Text style={styles.accordionTitle}>{title}</Text>
      <Text>{isOpen ? '−' : '+'}</Text>
    </TouchableOpacity>
    {isOpen && (
      <View style={styles.accordionContent}>
        {children}
      </View>
    )}
  </View>
);

Accordion.Item = AccordionItem;

// Usage
const App = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <Modal.Header onClose={() => setModalVisible(false)}>
          <Text>Modal Title</Text>
        </Modal.Header>
        <Modal.Body>
          <Text>Modal content goes here</Text>
        </Modal.Body>
        <Modal.Footer>
          <Button title="Save" onPress={() => {}} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </Modal.Footer>
      </Modal>

      <Accordion allowMultiple={true}>
        <Accordion.Item title="Section 1">
          <Text>Content for section 1</Text>
        </Accordion.Item>
        <Accordion.Item title="Section 2">
          <Text>Content for section 2</Text>
        </Accordion.Item>
      </Accordion>
    </View>
  );
};
```

## 🛠️ Advanced Patterns

### **Observer Pattern**
```jsx
// Event emitter for global state management
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);

    // Return unsubscribe function
    return () => {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    };
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }

  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
}

// Global event bus
const eventBus = new EventEmitter();

// useEventBus hook
const useEventBus = (event, callback, deps = []) => {
  useEffect(() => {
    const unsubscribe = eventBus.on(event, callback);
    return unsubscribe;
  }, deps);

  const emit = useCallback((data) => {
    eventBus.emit(event, data);
  }, [event]);

  return emit;
};

// Usage
const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEventBus('notification:add', (notification) => {
    setNotifications(prev => [...prev, { ...notification, id: Date.now() }]);
  });

  useEventBus('notification:remove', (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  });

  return (
    <View>
      {children}
      <NotificationList notifications={notifications} />
    </View>
  );
};

const SomeComponent = () => {
  const emitNotification = useEventBus('notification:add');

  const showNotification = () => {
    emitNotification({
      type: 'success',
      message: 'Operation completed successfully!',
    });
  };

  return (
    <Button title="Show Notification" onPress={showNotification} />
  );
};
```

### **Factory Pattern**
```jsx
// Component factory for different card types
const CardFactory = {
  createCard: (type, props) => {
    switch (type) {
      case 'user':
        return <UserCard {...props} />;
      case 'product':
        return <ProductCard {...props} />;
      case 'article':
        return <ArticleCard {...props} />;
      default:
        return <DefaultCard {...props} />;
    }
  },
};

// Form field factory
const FormFieldFactory = {
  createField: (fieldConfig) => {
    const { type, name, label, validation, ...props } = fieldConfig;

    const baseProps = {
      name,
      label,
      validation,
      ...props,
    };

    switch (type) {
      case 'text':
        return <TextInput {...baseProps} />;
      case 'email':
        return <EmailInput {...baseProps} />;
      case 'password':
        return <PasswordInput {...baseProps} />;
      case 'select':
        return <SelectInput {...baseProps} />;
      case 'checkbox':
        return <CheckboxInput {...baseProps} />;
      case 'radio':
        return <RadioInput {...baseProps} />;
      default:
        return <TextInput {...baseProps} />;
    }
  },
};

// Dynamic form using factory
const DynamicForm = ({ formConfig }) => {
  return (
    <View>
      {formConfig.fields.map((fieldConfig, index) => (
        <View key={index} style={styles.fieldContainer}>
          {FormFieldFactory.createField(fieldConfig)}
        </View>
      ))}
    </View>
  );
};

// Usage
const loginFormConfig = {
  fields: [
    {
      type: 'email',
      name: 'email',
      label: 'Email Address',
      validation: { required: true, email: true },
    },
    {
      type: 'password',
      name: 'password',
      label: 'Password',
      validation: { required: true, minLength: 8 },
    },
  ],
};

const LoginScreen = () => (
  <DynamicForm formConfig={loginFormConfig} />
);
```

### **Dependency Injection Pattern**
```jsx
// Service container
class ServiceContainer {
  constructor() {
    this.services = new Map();
    this.singletons = new Map();
  }

  register(name, factory, singleton = false) {
    this.services.set(name, { factory, singleton });
  }

  resolve(name) {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }

    if (service.singleton) {
      if (!this.singletons.has(name)) {
        this.singletons.set(name, service.factory(this));
      }
      return this.singletons.get(name);
    }

    return service.factory(this);
  }
}

// Create container and register services
const container = new ServiceContainer();

container.register('apiClient', () => new ApiClient(), true);
container.register('userService', (container) => 
  new UserService(container.resolve('apiClient')), true);
container.register('authService', (container) => 
  new AuthService(container.resolve('apiClient')), true);

// Service provider context
const ServiceContext = React.createContext(container);

export const ServiceProvider = ({ children }) => (
  <ServiceContext.Provider value={container}>
    {children}
  </ServiceContext.Provider>
);

// Hook to use services
export const useService = (serviceName) => {
  const container = useContext(ServiceContext);
  return useMemo(() => container.resolve(serviceName), [container, serviceName]);
};

// Usage in components
const UserProfile = () => {
  const userService = useService('userService');
  const [user, setUser] = useState(null);

  useEffect(() => {
    userService.getCurrentUser().then(setUser);
  }, [userService]);

  return (
    <View>
      {user && <Text>Welcome, {user.name}!</Text>}
    </View>
  );
};
```

## 🎯 Practice Exercises

### **Beginner Level** ⭐
1. **Custom Hook Creation** - Create useToggle and useCounter hooks
2. **Simple HOC** - Create withLoading HOC for components

### **Intermediate Level** ⭐⭐⭐
3. **Render Props** - Create DataProvider with render props
4. **Compound Components** - Build Tab component system

### **Advanced Level** ⭐⭐⭐⭐
5. **Observer Pattern** - Implement global notification system
6. **Factory Pattern** - Create dynamic form builder

### **Expert Level** ⭐⭐⭐⭐⭐
7. **Dependency Injection** - Build service container system
8. **Complex State Management** - Create custom state management solution

## 🔧 Best Practices

### **Custom Hooks Guidelines**
```jsx
// ✅ Good: Single responsibility
const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => setCount(c => c + 1), []);
  const decrement = useCallback(() => setCount(c => c - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  
  return { count, increment, decrement, reset };
};

// ❌ Bad: Multiple responsibilities
const useEverything = () => {
  // Too many unrelated things
};
```

### **HOC Best Practices**
```jsx
// ✅ Good: Forward refs and display names
const withEnhancement = (WrappedComponent) => {
  const EnhancedComponent = React.forwardRef((props, ref) => {
    return <WrappedComponent {...props} ref={ref} />;
  });
  
  EnhancedComponent.displayName = `withEnhancement(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return EnhancedComponent;
};
```

## 🔗 Resources

- [React Patterns](https://reactpatterns.com/)
- [Advanced React Patterns](https://kentcdodds.com/blog/advanced-react-patterns)
- [React Hooks Patterns](https://blog.logrocket.com/react-hooks-cheat-sheet-unlock-solutions-to-common-problems-af4caf699e70/)

Advanced patterns se aap scalable aur maintainable React Native applications bana sakte hain! 🎯✨
