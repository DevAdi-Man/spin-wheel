# Push Notifications 🔔

## 📱 Overview

Push notifications modern mobile apps ka crucial feature hain. Is tutorial mein aap seekhenge ki React Native mein push notifications kaise implement karte hain, Firebase Cloud Messaging (FCM) kaise use karte hain, aur local notifications kaise create karte hain.

## 🎯 What You'll Learn

- Firebase Cloud Messaging (FCM) integration
- Local notifications implementation
- Background task handling
- Deep linking with notifications
- Notification scheduling and management
- Custom notification sounds and styles
- Push notification analytics

## 📚 Core Concepts

### 1. **Firebase Cloud Messaging Setup**
```jsx
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';

const NotificationService = {
  // Request permission for notifications
  async requestPermission() {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      return enabled;
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  },

  // Get FCM token
  async getToken() {
    try {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      return token;
    } catch (error) {
      console.log('Error getting FCM token:', error);
    }
  },

  // Listen for token refresh
  onTokenRefresh(callback) {
    return messaging().onTokenRefresh(callback);
  },
};
```

### 2. **Handling Notifications**
```jsx
import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';

const useNotifications = () => {
  useEffect(() => {
    // Handle notification when app is in foreground
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification:', remoteMessage);
      // Show local notification or update UI
      showLocalNotification(remoteMessage);
    });

    // Handle notification when app is in background
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Background notification opened:', remoteMessage);
      // Navigate to specific screen
      handleNotificationNavigation(remoteMessage);
    });

    // Handle notification when app is closed
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('App opened from notification:', remoteMessage);
          handleNotificationNavigation(remoteMessage);
        }
      });

    return unsubscribeForeground;
  }, []);
};
```

### 3. **Local Notifications**
```jsx
import PushNotification from 'react-native-push-notification';

const LocalNotificationService = {
  configure() {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('Local notification token:', token);
      },
      onNotification: function (notification) {
        console.log('Local notification:', notification);
        if (notification.userInteraction) {
          // User tapped on notification
          handleLocalNotificationTap(notification);
        }
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  },

  showNotification(title, message, data = {}) {
    PushNotification.localNotification({
      title,
      message,
      playSound: true,
      soundName: 'default',
      userInfo: data,
      actions: ['Reply', 'Ignore'],
    });
  },

  scheduleNotification(title, message, date, data = {}) {
    PushNotification.localNotificationSchedule({
      title,
      message,
      date,
      userInfo: data,
      repeatType: 'day', // 'week', 'month', 'year'
    });
  },

  cancelAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
  },
};
```

## 🛠️ Essential Libraries

### **Core Libraries**
```bash
# Firebase for push notifications
npm install @react-native-firebase/app
npm install @react-native-firebase/messaging

# Local notifications
npm install react-native-push-notification
npm install @react-native-async-storage/async-storage

# Permissions
npm install react-native-permissions
```

### **Advanced Libraries**
```bash
# Notification scheduling
npm install @react-native-community/push-notification-ios

# Badge management
npm install react-native-badge

# Deep linking
npm install @react-native-community/linking
```

## 💻 Practical Examples

### **Example 1: Basic FCM Setup** ⭐
```jsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

const NotificationScreen = () => {
  const [fcmToken, setFcmToken] = useState('');

  useEffect(() => {
    requestPermissionAndGetToken();
    setupNotificationListeners();
  }, []);

  const requestPermissionAndGetToken = async () => {
    try {
      // Request permission
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        // Get FCM token
        const token = await messaging().getToken();
        setFcmToken(token);
        console.log('FCM Token:', token);
      }
    } catch (error) {
      console.log('Permission request error:', error);
    }
  };

  const setupNotificationListeners = () => {
    // Foreground notifications
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        remoteMessage.notification?.title || 'Notification',
        remoteMessage.notification?.body || 'You have a new message'
      );
    });

    // Background/Quit state notifications
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open:', remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification caused app to open from quit state:', remoteMessage);
        }
      });

    return unsubscribe;
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Push Notifications Demo
      </Text>
      
      <Text style={{ marginBottom: 10 }}>FCM Token:</Text>
      <Text style={{ fontSize: 12, marginBottom: 20 }}>
        {fcmToken || 'Getting token...'}
      </Text>
      
      <Button
        title="Test Local Notification"
        onPress={() => {
          // This would trigger a local notification
          Alert.alert('Info', 'Check console for FCM token');
        }}
      />
    </View>
  );
};

export default NotificationScreen;
```

### **Example 2: Local Notifications with Scheduling** ⭐⭐⭐
```jsx
import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import PushNotification from 'react-native-push-notification';

const LocalNotificationScreen = () => {
  useEffect(() => {
    // Configure local notifications
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });

    // Create notification channel for Android
    PushNotification.createChannel(
      {
        channelId: 'default-channel',
        channelName: 'Default Channel',
        channelDescription: 'A default channel for notifications',
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`Channel created: ${created}`)
    );
  }, []);

  const showImmediateNotification = () => {
    PushNotification.localNotification({
      channelId: 'default-channel',
      title: 'Immediate Notification',
      message: 'This notification appeared immediately!',
      playSound: true,
      soundName: 'default',
      actions: ['Reply', 'Ignore'],
    });
  };

  const scheduleNotification = () => {
    const date = new Date();
    date.setSeconds(date.getSeconds() + 10); // 10 seconds from now

    PushNotification.localNotificationSchedule({
      channelId: 'default-channel',
      title: 'Scheduled Notification',
      message: 'This notification was scheduled 10 seconds ago!',
      date,
      playSound: true,
      soundName: 'default',
    });
  };

  const scheduleRepeatingNotification = () => {
    PushNotification.localNotificationSchedule({
      channelId: 'default-channel',
      title: 'Daily Reminder',
      message: 'Don\'t forget to check the app!',
      date: new Date(Date.now() + 60 * 1000), // 1 minute from now
      repeatType: 'day',
      playSound: true,
      soundName: 'default',
    });
  };

  const cancelAllNotifications = () => {
    PushNotification.cancelAllLocalNotifications();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Local Notifications Demo</Text>
      
      <Button
        title="Show Immediate Notification"
        onPress={showImmediateNotification}
        style={styles.button}
      />
      
      <Button
        title="Schedule Notification (10s)"
        onPress={scheduleNotification}
        style={styles.button}
      />
      
      <Button
        title="Schedule Daily Notification"
        onPress={scheduleRepeatingNotification}
        style={styles.button}
      />
      
      <Button
        title="Cancel All Notifications"
        onPress={cancelAllNotifications}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    marginVertical: 10,
  },
});

export default LocalNotificationScreen;
```

### **Example 3: Advanced Notification Handling** ⭐⭐⭐⭐
```jsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationHistoryScreen = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotificationHistory();
    setupAdvancedListeners();
  }, []);

  const loadNotificationHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('notification_history');
      if (stored) {
        setNotifications(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading notifications:', error);
    }
  };

  const saveNotification = async (notification) => {
    try {
      const newNotification = {
        id: Date.now().toString(),
        title: notification.notification?.title || 'No Title',
        body: notification.notification?.body || 'No Body',
        data: notification.data || {},
        timestamp: new Date().toISOString(),
        read: false,
      };

      const updatedNotifications = [newNotification, ...notifications];
      setNotifications(updatedNotifications);
      
      await AsyncStorage.setItem(
        'notification_history',
        JSON.stringify(updatedNotifications)
      );
    } catch (error) {
      console.log('Error saving notification:', error);
    }
  };

  const setupAdvancedListeners = () => {
    // Handle foreground notifications
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification received:', remoteMessage);
      await saveNotification(remoteMessage);
      
      // Show custom in-app notification
      showInAppNotification(remoteMessage);
    });

    // Handle background notification taps
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Background notification opened:', remoteMessage);
      handleNotificationAction(remoteMessage);
    });

    // Handle notification when app is closed
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('App opened from closed state:', remoteMessage);
          handleNotificationAction(remoteMessage);
        }
      });

    return unsubscribeForeground;
  };

  const showInAppNotification = (notification) => {
    // Custom in-app notification UI
    // You can use libraries like react-native-flash-message
    console.log('Showing in-app notification:', notification);
  };

  const handleNotificationAction = (notification) => {
    // Handle deep linking or navigation based on notification data
    const { screen, params } = notification.data || {};
    
    if (screen) {
      // Navigate to specific screen
      console.log(`Navigate to ${screen} with params:`, params);
    }
  };

  const renderNotificationItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationBody}>{item.body}</Text>
      <Text style={styles.notificationTime}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notification History</Text>
      
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  notificationItem: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationBody: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
});

export default NotificationHistoryScreen;
```

## 🎯 Practice Exercises

### **Beginner Level** ⭐
1. **Basic FCM Setup** - Integrate Firebase and get FCM token
2. **Simple Local Notifications** - Create immediate local notifications

### **Intermediate Level** ⭐⭐⭐
3. **Scheduled Notifications** - Implement notification scheduling
4. **Notification History** - Store and display notification history

### **Advanced Level** ⭐⭐⭐⭐
5. **Deep Linking** - Navigate to specific screens from notifications
6. **Custom Notification UI** - Create custom in-app notification components

### **Expert Level** ⭐⭐⭐⭐⭐
7. **Chat App Notifications** - Real-time messaging with push notifications
8. **E-commerce Notifications** - Order updates, promotions, and reminders

## 🔧 Configuration

### **Firebase Setup**
```json
// google-services.json (Android)
// GoogleService-Info.plist (iOS)
```

### **Android Configuration**
```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
```

### **iOS Configuration**
```xml
<!-- ios/YourApp/Info.plist -->
<key>UIBackgroundModes</key>
<array>
  <string>remote-notification</string>
</array>
```

## 🔗 Resources

- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [React Native Firebase](https://rnfirebase.io/)
- [Push Notification Best Practices](https://developer.android.com/guide/topics/ui/notifiers/notifications)

Push notifications ke saath aap users ko engaged rakh sakte hain aur better user experience provide kar sakte hain! 🔔✨
