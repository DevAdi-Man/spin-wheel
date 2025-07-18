# Networking & API Integration 🌐

## Complete Networking Guide

API integration React Native apps ka core functionality hai. Ye tutorial tumhe modern networking patterns sikhayega.

## 📚 What You'll Learn

### **Networking Solutions:**
- **Fetch API** - Built-in JavaScript API
- **Axios** - Popular HTTP client
- **GraphQL** - Query language for APIs
- **WebSocket** - Real-time communication
- **Offline Support** - Network-aware apps

## 🎯 Real-World Examples

### **Apps Using These Patterns:**
- **Instagram** - REST APIs for posts, GraphQL for complex queries
- **WhatsApp** - WebSocket for real-time messaging
- **Uber** - Real-time location updates
- **Banking Apps** - Secure API communication

## 📖 Theory Deep Dive

### **API Communication Flow:**
```
App → Request → Server → Response → App
 ↑                                   ↓
Loading State                    Update UI
```

### **Common Networking Challenges:**
1. **Error Handling** - Network failures, timeouts
2. **Loading States** - User feedback during requests
3. **Caching** - Avoiding unnecessary requests
4. **Authentication** - Token management
5. **Offline Support** - Working without internet

## 🚀 Fetch API

### **Basic Fetch Usage:**
```javascript
// utils/api.js
const BASE_URL = 'https://jsonplaceholder.typicode.com';

// GET request
export const fetchPosts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/posts`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

// POST request
export const createPost = async (postData) => {
  try {
    const response = await fetch(`${BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// PUT request
export const updatePost = async (id, postData) => {
  try {
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

// DELETE request
export const deletePost = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};
```

### **Advanced Fetch with Custom Hook:**
```javascript
// hooks/useFetch.js
import { useState, useEffect } from 'react';

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
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
    };
    
    fetchData();
  }, [url]);
  
  const refetch = () => {
    fetchData();
  };
  
  return { data, loading, error, refetch };
};

// Usage in component
const PostsScreen = () => {
  const { data: posts, loading, error, refetch } = useFetch('/api/posts');
  
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;
  
  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <PostItem post={item} />}
      onRefresh={refetch}
      refreshing={loading}
    />
  );
};
```

## ⚡ Axios

### **Why Axios?**
- **Interceptors** - Request/response modification
- **Automatic JSON** - Automatic JSON parsing
- **Request/Response Transformation** - Data transformation
- **Timeout Support** - Request timeout handling
- **Error Handling** - Better error handling

### **Installation:**
```bash
npm install axios
```

### **Axios Setup:**
```javascript
// services/apiClient.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance
const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // Add auth token to requests
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request
    console.log('Request:', config.method?.toUpperCase(), config.url);
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log response
    console.log('Response:', response.status, response.config.url);
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const response = await axios.post('/auth/refresh', {
          refreshToken,
        });
        
        const { accessToken } = response.data;
        await AsyncStorage.setItem('authToken', accessToken);
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        await AsyncStorage.multiRemove(['authToken', 'refreshToken']);
        // Navigate to login screen
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Response error:', errorMessage);
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

### **API Service Layer:**
```javascript
// services/postService.js
import apiClient from './apiClient';

class PostService {
  // Get all posts
  async getPosts(page = 1, limit = 10) {
    try {
      const response = await apiClient.get('/posts', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Get single post
  async getPost(id) {
    try {
      const response = await apiClient.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Create post
  async createPost(postData) {
    try {
      const response = await apiClient.post('/posts', postData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Update post
  async updatePost(id, postData) {
    try {
      const response = await apiClient.put(`/posts/${id}`, postData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Delete post
  async deletePost(id) {
    try {
      await apiClient.delete(`/posts/${id}`);
      return true;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Upload image
  async uploadImage(imageUri) {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
      
      const response = await apiClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Error handler
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || 'Server error',
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      // Request was made but no response
      return {
        message: 'Network error - please check your connection',
        status: 0,
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'Unknown error',
        status: -1,
      };
    }
  }
}

export default new PostService();
```

### **Using API Service:**
```javascript
// screens/PostsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Alert, RefreshControl } from 'react-native';
import PostService from '../services/postService';

const PostsScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Load posts
  const loadPosts = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
        setError(null);
      } else {
        setLoading(true);
      }
      
      const response = await PostService.getPosts(pageNum, 10);
      
      if (refresh || pageNum === 1) {
        setPosts(response.data);
      } else {
        setPosts(prev => [...prev, ...response.data]);
      }
      
      setHasMore(response.data.length === 10);
      setPage(pageNum);
    } catch (err) {
      setError(err.message);
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Load more posts (pagination)
  const loadMore = () => {
    if (!loading && hasMore) {
      loadPosts(page + 1);
    }
  };
  
  // Refresh posts
  const onRefresh = () => {
    loadPosts(1, true);
  };
  
  // Delete post
  const deletePost = async (id) => {
    try {
      await PostService.deletePost(id);
      setPosts(prev => prev.filter(post => post.id !== id));
      Alert.alert('Success', 'Post deleted successfully');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };
  
  useEffect(() => {
    loadPosts();
  }, []);
  
  const renderPost = ({ item }) => (
    <View style={styles.postItem}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postBody}>{item.body}</Text>
      <Button
        title="Delete"
        onPress={() => deletePost(item.id)}
        color="#ff4444"
      />
    </View>
  );
  
  if (loading && posts.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Loading posts...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() => 
          loading && posts.length > 0 ? (
            <Text style={styles.loadingMore}>Loading more...</Text>
          ) : null
        }
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
  postBody: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  loadingMore: {
    textAlign: 'center',
    padding: 16,
    color: '#666',
  },
});

export default PostsScreen;
```

## 🔄 GraphQL with Apollo Client

### **Why GraphQL?**
- **Flexible Queries** - Request exactly what you need
- **Single Endpoint** - One URL for all operations
- **Type Safety** - Strong typing system
- **Real-time** - Subscriptions for live data

### **Installation:**
```bash
npm install @apollo/client graphql
```

### **Apollo Client Setup:**
```javascript
// services/apolloClient.js
import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import AsyncStorage from '@react-native-async-storage/async-storage';

// HTTP Link
const httpLink = createHttpLink({
  uri: 'https://api.example.com/graphql',
});

// Auth Link
const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('authToken');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Error Link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }
  
  if (networkError) {
    console.error(`Network error: ${networkError}`);
    
    // Handle 401 errors
    if (networkError.statusCode === 401) {
      // Clear token and redirect to login
      AsyncStorage.removeItem('authToken');
    }
  }
});

// Apollo Client
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            keyArgs: false,
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

export default client;
```

### **GraphQL Queries & Mutations:**
```javascript
// graphql/queries.js
import { gql } from '@apollo/client';

// Queries
export const GET_POSTS = gql`
  query GetPosts($first: Int, $after: String) {
    posts(first: $first, after: $after) {
      edges {
        node {
          id
          title
          content
          author {
            id
            name
            avatar
          }
          createdAt
          likesCount
          commentsCount
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      title
      content
      author {
        id
        name
        avatar
      }
      createdAt
      likesCount
      commentsCount
      comments {
        id
        content
        author {
          id
          name
          avatar
        }
        createdAt
      }
    }
  }
`;

// Mutations
export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      content
      author {
        id
        name
        avatar
      }
      createdAt
    }
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likesCount
      isLiked
    }
  }
`;

// Subscriptions
export const POST_LIKED = gql`
  subscription PostLiked($postId: ID!) {
    postLiked(postId: $postId) {
      id
      likesCount
      isLiked
    }
  }
`;
```

### **Using GraphQL in Components:**
```javascript
// screens/GraphQLPostsScreen.js
import React from 'react';
import { View, Text, FlatList, Button, Alert } from 'react-native';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { GET_POSTS, CREATE_POST, LIKE_POST, POST_LIKED } from '../graphql/queries';

const GraphQLPostsScreen = () => {
  const { data, loading, error, fetchMore, refetch } = useQuery(GET_POSTS, {
    variables: { first: 10 },
    notifyOnNetworkStatusChange: true,
  });
  
  const [createPost] = useMutation(CREATE_POST, {
    update(cache, { data: { createPost } }) {
      // Update cache after creating post
      const existingPosts = cache.readQuery({ query: GET_POSTS });
      cache.writeQuery({
        query: GET_POSTS,
        data: {
          posts: {
            ...existingPosts.posts,
            edges: [
              { node: createPost, cursor: createPost.id },
              ...existingPosts.posts.edges,
            ],
          },
        },
      });
    },
  });
  
  const [likePost] = useMutation(LIKE_POST);
  
  // Subscribe to post likes
  useSubscription(POST_LIKED, {
    variables: { postId: 'current-post-id' },
    onSubscriptionData: ({ subscriptionData }) => {
      console.log('Post liked:', subscriptionData.data);
    },
  });
  
  const handleCreatePost = async () => {
    try {
      await createPost({
        variables: {
          input: {
            title: 'New Post',
            content: 'This is a new post created with GraphQL',
          },
        },
      });
      Alert.alert('Success', 'Post created successfully');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };
  
  const handleLikePost = async (postId) => {
    try {
      await likePost({
        variables: { postId },
        optimisticResponse: {
          likePost: {
            id: postId,
            likesCount: 1, // Optimistic update
            isLiked: true,
            __typename: 'Post',
          },
        },
      });
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };
  
  const loadMore = () => {
    if (data?.posts?.pageInfo?.hasNextPage) {
      fetchMore({
        variables: {
          after: data.posts.pageInfo.endCursor,
        },
      });
    }
  };
  
  if (loading && !data) {
    return (
      <View style={styles.center}>
        <Text>Loading posts...</Text>
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
  
  const posts = data?.posts?.edges?.map(edge => edge.node) || [];
  
  return (
    <View style={styles.container}>
      <Button title="Create Post" onPress={handleCreatePost} />
      
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postItem}>
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text style={styles.postContent}>{item.content}</Text>
            <Text style={styles.postAuthor}>By: {item.author.name}</Text>
            <Button
              title={`Like (${item.likesCount})`}
              onPress={() => handleLikePost(item.id)}
            />
          </View>
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        refreshing={loading}
        onRefresh={() => refetch()}
      />
    </View>
  );
};

export default GraphQLPostsScreen;
```

## 🎯 Exercises

### **Exercise 1: REST API Client** ⭐⭐
Create a complete REST API client:
- CRUD operations
- Error handling
- Loading states
- Pagination

### **Exercise 2: Real-time Chat** ⭐⭐⭐
Build a chat app with WebSocket:
- Send/receive messages
- Online status
- Typing indicators
- Message history

### **Exercise 3: Offline-First App** ⭐⭐⭐⭐
Create an app that works offline:
- Local data storage
- Sync when online
- Conflict resolution
- Queue failed requests

### **Exercise 4: GraphQL Social App** ⭐⭐⭐⭐⭐
Build a social media app:
- GraphQL queries/mutations
- Real-time subscriptions
- Optimistic updates
- Complex data relationships

## 🔗 Resources & Links

### **Fetch API:**
- MDN Docs: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- React Native Networking: https://reactnative.dev/docs/network

### **Axios:**
- Official Docs: https://axios-http.com/
- Interceptors Guide: https://axios-http.com/docs/interceptors

### **GraphQL:**
- Apollo Client: https://www.apollographql.com/docs/react/
- GraphQL Docs: https://graphql.org/learn/

### **WebSocket:**
- WebSocket API: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
- Socket.IO: https://socket.io/docs/v4/

Networking master karne ke baad tumhara app kisi bhi API ke saath seamlessly communicate kar sakta hai! 🌐✨
