# State Management Mastery 🧠

## Complete State Management Guide

State management React Native apps ka brain hai. Ye tutorial tumhe sab modern state management solutions sikhayega.

## 📚 What You'll Learn

### **State Management Solutions:**
- **Redux Toolkit** - Industry standard, complex apps
- **Zustand** - Simple, lightweight alternative
- **Context API** - Built-in React solution
- **React Query** - Server state management
- **Jotai** - Atomic state management

## 🎯 Real-World Examples

### **Apps Using These Patterns:**
- **Facebook** - Redux for complex state
- **Instagram** - Context + Redux combination
- **WhatsApp** - Zustand for simplicity
- **Twitter** - React Query for API data

## 📖 Theory Deep Dive

### **State Management Kya Hai?**
```
Component A ←→ Global State ←→ Component B
     ↑              ↑              ↑
  Local State   Shared State   Local State
```

State management ka matlab hai app ka data efficiently manage karna taaki har component ko zaroori data mil sake.

### **Types of State:**
1. **Local State** - Sirf ek component mein use hota hai
2. **Global State** - Multiple components share karte hain
3. **Server State** - API se aata hai
4. **URL State** - Navigation parameters

## 🚀 Redux Toolkit (RTK)

### **Why Redux Toolkit?**
- **Predictable** - State changes predictable hote hain
- **Debuggable** - DevTools se easily debug kar sakte hain
- **Scalable** - Large apps ke liye perfect
- **Time Travel** - State history track kar sakte hain

### **Installation:**
```bash
npm install @reduxjs/toolkit react-redux
```

### **Basic Setup:**
```javascript
// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import counterSlice from './counterSlice';
import userSlice from './userSlice';

export const store = configureStore({
  reducer: {
    counter: counterSlice,
    user: userSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### **Creating Slices:**
```javascript
// store/counterSlice.js
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  value: number;
  loading: boolean;
}

const initialState: CounterState = {
  value: 0,
  loading: false,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      // RTK uses Immer internally, so we can "mutate" the state
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    reset: (state) => {
      state.value = 0;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount, reset, setLoading } = counterSlice.actions;
export default counterSlice.reducer;
```

### **Async Actions with createAsyncThunk:**
```javascript
// store/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching user data
export const fetchUserById = createAsyncThunk(
  'user/fetchById',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

interface UserState {
  data: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.data = null;
      state.error = null;
    },
    updateUser: (state, action) => {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
```

### **Using Redux in Components:**
```javascript
// App.js - Provider setup
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import CounterScreen from './screens/CounterScreen';

const App = () => {
  return (
    <Provider store={store}>
      <CounterScreen />
    </Provider>
  );
};

export default App;
```

```javascript
// screens/CounterScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount, reset } from '../store/counterSlice';
import { fetchUserById } from '../store/userSlice';

const CounterScreen = () => {
  const dispatch = useDispatch();
  const { value, loading } = useSelector((state) => state.counter);
  const { data: user, loading: userLoading, error } = useSelector((state) => state.user);
  
  const handleIncrement = () => {
    dispatch(increment());
  };
  
  const handleDecrement = () => {
    dispatch(decrement());
  };
  
  const handleIncrementByFive = () => {
    dispatch(incrementByAmount(5));
  };
  
  const handleReset = () => {
    dispatch(reset());
  };
  
  const handleFetchUser = () => {
    dispatch(fetchUserById('123'));
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redux Toolkit Counter</Text>
      <Text style={styles.counter}>{value}</Text>
      
      <View style={styles.buttonContainer}>
        <Button title="+" onPress={handleIncrement} />
        <Button title="-" onPress={handleDecrement} />
        <Button title="+5" onPress={handleIncrementByFive} />
        <Button title="Reset" onPress={handleReset} />
      </View>
      
      <View style={styles.userSection}>
        <Button title="Fetch User" onPress={handleFetchUser} />
        {userLoading && <Text>Loading user...</Text>}
        {user && <Text>User: {user.name}</Text>}
        {error && <Text style={styles.error}>Error: {error}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  counter: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
  },
  userSection: {
    alignItems: 'center',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default CounterScreen;
```

## 🪶 Zustand (Lightweight Alternative)

### **Why Zustand?**
- **Simple** - Minimal boilerplate
- **TypeScript** - Great TypeScript support
- **Small** - Tiny bundle size
- **Flexible** - No providers needed

### **Installation:**
```bash
npm install zustand
```

### **Basic Store:**
```javascript
// store/useCounterStore.js
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  incrementByAmount: (amount: number) => void;
  reset: () => void;
}

export const useCounterStore = create<CounterState>()(
  devtools(
    persist(
      (set, get) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
        decrement: () => set((state) => ({ count: state.count - 1 })),
        incrementByAmount: (amount) => 
          set((state) => ({ count: state.count + amount })),
        reset: () => set({ count: 0 }),
      }),
      {
        name: 'counter-storage', // localStorage key
      }
    )
  )
);
```

### **Async Store with API:**
```javascript
// store/useUserStore.js
import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
  updateUser: (user: User) => void;
  clearError: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const users = await response.json();
      set({ users, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  fetchUserById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      const user = await response.json();
      set({ currentUser: user, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  updateUser: (updatedUser) => {
    set((state) => ({
      users: state.users.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ),
      currentUser: state.currentUser?.id === updatedUser.id 
        ? updatedUser 
        : state.currentUser,
    }));
  },
  
  clearError: () => set({ error: null }),
}));
```

### **Using Zustand in Components:**
```javascript
// screens/ZustandCounterScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useCounterStore } from '../store/useCounterStore';
import { useUserStore } from '../store/useUserStore';

const ZustandCounterScreen = () => {
  // Counter store
  const { count, increment, decrement, incrementByAmount, reset } = useCounterStore();
  
  // User store
  const { 
    currentUser, 
    loading, 
    error, 
    fetchUserById, 
    clearError 
  } = useUserStore();
  
  const handleFetchUser = () => {
    fetchUserById('123');
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zustand Counter</Text>
      <Text style={styles.counter}>{count}</Text>
      
      <View style={styles.buttonContainer}>
        <Button title="+" onPress={increment} />
        <Button title="-" onPress={decrement} />
        <Button title="+5" onPress={() => incrementByAmount(5)} />
        <Button title="Reset" onPress={reset} />
      </View>
      
      <View style={styles.userSection}>
        <Button title="Fetch User" onPress={handleFetchUser} />
        {loading && <Text>Loading...</Text>}
        {currentUser && <Text>User: {currentUser.name}</Text>}
        {error && (
          <View>
            <Text style={styles.error}>Error: {error}</Text>
            <Button title="Clear Error" onPress={clearError} />
          </View>
        )}
      </View>
    </View>
  );
};

export default ZustandCounterScreen;
```

## ⚛️ Context API

### **When to Use Context:**
- **Small to medium apps**
- **Theme management**
- **User authentication**
- **Simple global state**

### **Creating Context:**
```javascript
// context/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  clearError: () => void;
}

// Initial state
const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
};

// Actions
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  // Check for existing token on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);
  
  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        // Validate token and get user data
        const userData = await validateToken(token);
        dispatch({ type: 'SET_USER', payload: userData });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to check auth status' });
    }
  };
  
  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      
      const { user, token } = await response.json();
      await AsyncStorage.setItem('authToken', token);
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };
  
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      dispatch({ type: 'SET_USER', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to logout' });
    }
  };
  
  const register = async (userData: RegisterData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      
      const { user, token } = await response.json();
      await AsyncStorage.setItem('authToken', token);
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };
  
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };
  
  const value: AuthContextType = {
    ...state,
    login,
    logout,
    register,
    clearError,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### **Using Context:**
```javascript
// App.js
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import MainNavigator from './navigation/MainNavigator';

const App = () => {
  return (
    <AuthProvider>
      <MainNavigator />
    </AuthProvider>
  );
};

export default App;
```

```javascript
// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, clearError } = useAuth();
  
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    
    await login(email, password);
  };
  
  React.useEffect(() => {
    if (error) {
      Alert.alert('Login Error', error);
      clearError();
    }
  }, [error]);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <Button
        title={loading ? "Logging in..." : "Login"}
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
};

export default LoginScreen;
```

## 🔄 React Query (TanStack Query)

### **Why React Query?**
- **Server State** - API data management
- **Caching** - Automatic caching
- **Background Updates** - Fresh data automatically
- **Optimistic Updates** - Better UX

### **Installation:**
```bash
npm install @tanstack/react-query
```

### **Setup:**
```javascript
// App.js
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MainApp />
    </QueryClientProvider>
  );
};

export default App;
```

### **Using React Query:**
```javascript
// hooks/useUsers.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch users
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return response.json();
    },
  });
};

// Fetch single user
export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      return response.json();
    },
    enabled: !!userId, // Only run if userId exists
  });
};

// Create user mutation
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData) => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Update user mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, userData }) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Update specific user in cache
      queryClient.setQueryData(['user', variables.userId], data);
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
```

### **Using in Components:**
```javascript
// screens/UsersScreen.js
import React from 'react';
import { View, Text, FlatList, Button, Alert } from 'react-native';
import { useUsers, useCreateUser } from '../hooks/useUsers';

const UsersScreen = () => {
  const { data: users, isLoading, error, refetch } = useUsers();
  const createUserMutation = useCreateUser();
  
  const handleCreateUser = () => {
    createUserMutation.mutate(
      {
        name: 'New User',
        email: 'newuser@example.com',
      },
      {
        onSuccess: () => {
          Alert.alert('Success', 'User created successfully');
        },
        onError: (error) => {
          Alert.alert('Error', error.message);
        },
      }
    );
  };
  
  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading users...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error: {error.message}</Text>
        <Button title="Retry" onPress={() => refetch()} />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Button
        title={createUserMutation.isLoading ? "Creating..." : "Create User"}
        onPress={handleCreateUser}
        disabled={createUserMutation.isLoading}
      />
      
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default UsersScreen;
```

## 🎯 Exercises

### **Exercise 1: Redux Counter** ⭐
Create a counter app with Redux Toolkit:
- Increment/decrement buttons
- Reset functionality
- Persist state

### **Exercise 2: Zustand Todo App** ⭐⭐
Build a todo app with Zustand:
- Add/remove todos
- Mark as complete
- Filter todos

### **Exercise 3: Context Authentication** ⭐⭐⭐
Implement auth flow with Context:
- Login/logout
- Protected routes
- User profile

### **Exercise 4: React Query Posts** ⭐⭐⭐⭐
Create a posts app with React Query:
- Fetch posts list
- Create new posts
- Update/delete posts
- Optimistic updates

### **Exercise 5: Complex State Management** ⭐⭐⭐⭐⭐
Build a social media app combining:
- Redux for app state
- React Query for server data
- Context for theme/settings

## 🔗 Resources & Links

### **Redux Toolkit:**
- Official Docs: https://redux-toolkit.js.org/
- Redux DevTools: https://github.com/reduxjs/redux-devtools

### **Zustand:**
- GitHub: https://github.com/pmndrs/zustand
- Documentation: https://zustand-demo.pmnd.rs/

### **React Query:**
- Official Docs: https://tanstack.com/query/latest
- Examples: https://github.com/TanStack/query/tree/main/examples

### **Context API:**
- React Docs: https://react.dev/reference/react/useContext
- Patterns: https://kentcdodds.com/blog/how-to-use-react-context-effectively

State management master karne ke baad tumhara app ka brain powerful ho jayega! 🧠✨
