# Storage & Database Solutions 💾

## Complete Storage Guide

Data storage React Native apps ka foundation hai. Ye tutorial tumhe sab storage solutions sikhayega.

## 📚 What You'll Learn

### **Storage Solutions:**
- **AsyncStorage** - Simple key-value storage
- **SQLite** - Relational database
- **Realm** - Object database
- **MMKV** - High-performance key-value storage
- **Secure Storage** - Encrypted storage

## 🎯 Real-World Examples

### **Apps Using Storage:**
- **WhatsApp** - SQLite for messages, AsyncStorage for settings
- **Instagram** - Realm for complex data relationships
- **Banking Apps** - Secure Storage for sensitive data
- **Offline Apps** - Local database with sync

## 📖 Theory Deep Dive

### **Storage Types:**
```
Simple Data → AsyncStorage/MMKV
Complex Data → SQLite/Realm
Sensitive Data → Secure Storage
Large Files → File System
```

### **When to Use What:**
1. **AsyncStorage** - Settings, preferences, simple data
2. **SQLite** - Complex queries, relationships
3. **Realm** - Object-oriented data, real-time sync
4. **MMKV** - High-performance, frequent reads/writes
5. **Secure Storage** - Passwords, tokens, sensitive info

## 🗄️ AsyncStorage

### **Why AsyncStorage?**
- **Simple** - Easy key-value API
- **Built-in** - No additional dependencies
- **Persistent** - Data survives app restarts
- **Cross-platform** - Works on iOS and Android

### **Installation:**
```bash
npm install @react-native-async-storage/async-storage

# iOS
cd ios && pod install
```

### **Basic Usage:**
```javascript
// utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  // Store string value
  async setItem(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('Error storing data:', error);
      return false;
    }
  }
  
  // Get string value
  async getItem(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  }
  
  // Store object
  async setObject(key, object) {
    try {
      const jsonValue = JSON.stringify(object);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.error('Error storing object:', error);
      return false;
    }
  }
  
  // Get object
  async getObject(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error retrieving object:', error);
      return null;
    }
  }
  
  // Remove item
  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing data:', error);
      return false;
    }
  }
  
  // Remove multiple items
  async removeItems(keys) {
    try {
      await AsyncStorage.multiRemove(keys);
      return true;
    } catch (error) {
      console.error('Error removing multiple items:', error);
      return false;
    }
  }
  
  // Get multiple items
  async getMultiple(keys) {
    try {
      const values = await AsyncStorage.multiGet(keys);
      return values.reduce((result, [key, value]) => {
        result[key] = value;
        return result;
      }, {});
    } catch (error) {
      console.error('Error getting multiple items:', error);
      return {};
    }
  }
  
  // Set multiple items
  async setMultiple(keyValuePairs) {
    try {
      await AsyncStorage.multiSet(keyValuePairs);
      return true;
    } catch (error) {
      console.error('Error setting multiple items:', error);
      return false;
    }
  }
  
  // Get all keys
  async getAllKeys() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys;
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }
  
  // Clear all data
  async clear() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }
  
  // Get storage size info
  async getStorageSize() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const stores = await AsyncStorage.multiGet(keys);
      
      let totalSize = 0;
      const itemSizes = stores.map(([key, value]) => {
        const size = new Blob([value]).size;
        totalSize += size;
        return { key, size };
      });
      
      return {
        totalSize,
        itemCount: keys.length,
        items: itemSizes,
      };
    } catch (error) {
      console.error('Error getting storage size:', error);
      return null;
    }
  }
}

export default new StorageService();
```

### **Custom Hooks for AsyncStorage:**
```javascript
// hooks/useAsyncStorage.js
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAsyncStorage = (key, defaultValue = null) => {
  const [value, setValue] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load value on mount
  useEffect(() => {
    loadValue();
  }, [key]);
  
  const loadValue = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const storedValue = await AsyncStorage.getItem(key);
      if (storedValue !== null) {
        setValue(JSON.parse(storedValue));
      } else {
        setValue(defaultValue);
      }
    } catch (err) {
      setError(err);
      setValue(defaultValue);
    } finally {
      setLoading(false);
    }
  };
  
  const storeValue = async (newValue) => {
    try {
      setError(null);
      setValue(newValue);
      
      if (newValue === null) {
        await AsyncStorage.removeItem(key);
      } else {
        await AsyncStorage.setItem(key, JSON.stringify(newValue));
      }
    } catch (err) {
      setError(err);
    }
  };
  
  const removeValue = async () => {
    try {
      setError(null);
      setValue(defaultValue);
      await AsyncStorage.removeItem(key);
    } catch (err) {
      setError(err);
    }
  };
  
  return {
    value,
    loading,
    error,
    setValue: storeValue,
    removeValue,
    reload: loadValue,
  };
};

// Usage example
const SettingsScreen = () => {
  const {
    value: settings,
    loading,
    error,
    setValue: setSettings,
  } = useAsyncStorage('userSettings', {
    theme: 'light',
    notifications: true,
    language: 'en',
  });
  
  const updateSetting = (key, value) => {
    setSettings({
      ...settings,
      [key]: value,
    });
  };
  
  if (loading) return <Text>Loading settings...</Text>;
  if (error) return <Text>Error loading settings</Text>;
  
  return (
    <View>
      <Text>Theme: {settings.theme}</Text>
      <Button
        title="Toggle Theme"
        onPress={() => updateSetting('theme', settings.theme === 'light' ? 'dark' : 'light')}
      />
    </View>
  );
};
```

## 🗃️ SQLite

### **Why SQLite?**
- **Relational** - Complex data relationships
- **SQL Queries** - Powerful query language
- **ACID** - Reliable transactions
- **Performance** - Fast for complex queries

### **Installation:**
```bash
npm install react-native-sqlite-storage

# iOS
cd ios && pod install
```

### **SQLite Setup:**
```javascript
// services/database.js
import SQLite from 'react-native-sqlite-storage';

// Enable debugging
SQLite.DEBUG(true);
SQLite.enablePromise(true);

class DatabaseService {
  constructor() {
    this.db = null;
  }
  
  // Initialize database
  async initDB() {
    try {
      this.db = await SQLite.openDatabase({
        name: 'MyApp.db',
        location: 'default',
        createFromLocation: '~MyApp.db', // Optional: pre-populated database
      });
      
      console.log('Database opened successfully');
      await this.createTables();
      return this.db;
    } catch (error) {
      console.error('Error opening database:', error);
      throw error;
    }
  }
  
  // Create tables
  async createTables() {
    try {
      // Users table
      await this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          avatar TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Posts table
      await this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          image_url TEXT,
          likes_count INTEGER DEFAULT 0,
          comments_count INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);
      
      // Comments table
      await this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS comments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          post_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          content TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (post_id) REFERENCES posts (id),
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);
      
      // Create indexes for better performance
      await this.db.executeSql('CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts (user_id)');
      await this.db.executeSql('CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments (post_id)');
      
      console.log('Tables created successfully');
    } catch (error) {
      console.error('Error creating tables:', error);
      throw error;
    }
  }
  
  // User operations
  async createUser(userData) {
    try {
      const { name, email, avatar } = userData;
      const result = await this.db.executeSql(
        'INSERT INTO users (name, email, avatar) VALUES (?, ?, ?)',
        [name, email, avatar]
      );
      
      return {
        id: result[0].insertId,
        name,
        email,
        avatar,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  
  async getUser(id) {
    try {
      const result = await this.db.executeSql(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      
      if (result[0].rows.length > 0) {
        return result[0].rows.item(0);
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }
  
  async getAllUsers() {
    try {
      const result = await this.db.executeSql('SELECT * FROM users ORDER BY created_at DESC');
      const users = [];
      
      for (let i = 0; i < result[0].rows.length; i++) {
        users.push(result[0].rows.item(i));
      }
      
      return users;
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }
  
  async updateUser(id, userData) {
    try {
      const { name, email, avatar } = userData;
      await this.db.executeSql(
        'UPDATE users SET name = ?, email = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [name, email, avatar, id]
      );
      
      return await this.getUser(id);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
  
  async deleteUser(id) {
    try {
      await this.db.executeSql('DELETE FROM users WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
  
  // Post operations
  async createPost(postData) {
    try {
      const { userId, title, content, imageUrl } = postData;
      const result = await this.db.executeSql(
        'INSERT INTO posts (user_id, title, content, image_url) VALUES (?, ?, ?, ?)',
        [userId, title, content, imageUrl]
      );
      
      return await this.getPost(result[0].insertId);
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }
  
  async getPost(id) {
    try {
      const result = await this.db.executeSql(`
        SELECT p.*, u.name as user_name, u.avatar as user_avatar
        FROM posts p
        JOIN users u ON p.user_id = u.id
        WHERE p.id = ?
      `, [id]);
      
      if (result[0].rows.length > 0) {
        return result[0].rows.item(0);
      }
      return null;
    } catch (error) {
      console.error('Error getting post:', error);
      throw error;
    }
  }
  
  async getAllPosts(limit = 20, offset = 0) {
    try {
      const result = await this.db.executeSql(`
        SELECT p.*, u.name as user_name, u.avatar as user_avatar
        FROM posts p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
      `, [limit, offset]);
      
      const posts = [];
      for (let i = 0; i < result[0].rows.length; i++) {
        posts.push(result[0].rows.item(i));
      }
      
      return posts;
    } catch (error) {
      console.error('Error getting posts:', error);
      throw error;
    }
  }
  
  async searchPosts(query) {
    try {
      const result = await this.db.executeSql(`
        SELECT p.*, u.name as user_name, u.avatar as user_avatar
        FROM posts p
        JOIN users u ON p.user_id = u.id
        WHERE p.title LIKE ? OR p.content LIKE ?
        ORDER BY p.created_at DESC
      `, [`%${query}%`, `%${query}%`]);
      
      const posts = [];
      for (let i = 0; i < result[0].rows.length; i++) {
        posts.push(result[0].rows.item(i));
      }
      
      return posts;
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  }
  
  // Transaction example
  async createPostWithComment(postData, commentData) {
    try {
      await this.db.transaction(async (tx) => {
        // Create post
        const postResult = await tx.executeSql(
          'INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)',
          [postData.userId, postData.title, postData.content]
        );
        
        const postId = postResult.insertId;
        
        // Create comment
        await tx.executeSql(
          'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
          [postId, commentData.userId, commentData.content]
        );
        
        // Update post comment count
        await tx.executeSql(
          'UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?',
          [postId]
        );
      });
      
      console.log('Post and comment created successfully');
      return true;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }
  
  // Close database
  async closeDB() {
    if (this.db) {
      await this.db.close();
      console.log('Database closed');
    }
  }
}

export default new DatabaseService();
```

### **Using SQLite in Components:**
```javascript
// screens/SQLitePostsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, TextInput, Alert } from 'react-native';
import DatabaseService from '../services/database';

const SQLitePostsScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  useEffect(() => {
    initializeDatabase();
  }, []);
  
  const initializeDatabase = async () => {
    try {
      await DatabaseService.initDB();
      await loadPosts();
    } catch (error) {
      Alert.alert('Database Error', error.message);
    }
  };
  
  const loadPosts = async () => {
    try {
      setLoading(true);
      const allPosts = await DatabaseService.getAllPosts();
      setPosts(allPosts);
    } catch (error) {
      Alert.alert('Error', 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };
  
  const createPost = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    
    try {
      // First create a user if not exists (simplified)
      const user = await DatabaseService.createUser({
        name: 'Test User',
        email: `user${Date.now()}@example.com`,
        avatar: 'https://i.pravatar.cc/100',
      });
      
      await DatabaseService.createPost({
        userId: user.id,
        title,
        content,
        imageUrl: null,
      });
      
      setTitle('');
      setContent('');
      await loadPosts();
      Alert.alert('Success', 'Post created successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to create post');
    }
  };
  
  const renderPost = ({ item }) => (
    <View style={styles.postItem}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postContent}>{item.content}</Text>
      <Text style={styles.postAuthor}>By: {item.user_name}</Text>
      <Text style={styles.postDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
    </View>
  );
  
  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading posts...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Post title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Post content"
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={3}
        />
        <Button title="Create Post" onPress={createPost} />
      </View>
      
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        refreshing={loading}
        onRefresh={loadPosts}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  postItem: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  postAuthor: {
    fontSize: 12,
    color: '#999',
  },
  postDate: {
    fontSize: 12,
    color: '#999',
  },
});

export default SQLitePostsScreen;
```

## 🎯 Exercises

### **Exercise 1: Settings Manager** ⭐⭐
Create a settings management system:
- User preferences storage
- Theme settings
- Notification preferences
- Data export/import

### **Exercise 2: Todo App with SQLite** ⭐⭐⭐
Build a todo app with database:
- CRUD operations
- Categories and tags
- Search functionality
- Data relationships

### **Exercise 3: Offline-First Social App** ⭐⭐⭐⭐
Create a social media app:
- Local data storage
- Sync with server
- Conflict resolution
- Queue management

### **Exercise 4: E-commerce Cart System** ⭐⭐⭐⭐⭐
Build a shopping cart with:
- Product catalog
- Cart persistence
- Order history
- Complex queries

## 🔗 Resources & Links

### **AsyncStorage:**
- Official Docs: https://react-native-async-storage.github.io/async-storage/
- Best Practices: https://react-native-async-storage.github.io/async-storage/docs/advanced/best-practices

### **SQLite:**
- React Native SQLite: https://github.com/andpor/react-native-sqlite-storage
- SQLite Tutorial: https://www.sqlitetutorial.net/

### **Realm:**
- Realm React Native: https://realm.io/docs/javascript/latest/
- Realm Studio: https://realm.io/products/realm-studio

### **MMKV:**
- React Native MMKV: https://github.com/mrousavy/react-native-mmkv
- Performance Comparison: https://github.com/mrousavy/react-native-mmkv#benchmark

Storage solutions master karne ke baad tumhara app efficiently data manage kar sakta hai! 💾✨
