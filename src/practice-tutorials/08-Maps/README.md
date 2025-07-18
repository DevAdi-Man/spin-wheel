# Maps & Location Integration 🗺️

## 📍 Overview

Maps aur location services modern mobile apps ka essential part hain. Is tutorial mein aap seekhenge ki React Native mein maps integrate kaise karte hain, location tracking kaise karte hain, aur geolocation features kaise implement karte hain.

## 🎯 What You'll Learn

- React Native Maps integration
- Real-time location tracking
- Google Places API integration
- Custom map markers and overlays
- Geofencing and location-based notifications
- Offline maps and caching
- Performance optimization for maps

## 📚 Core Concepts

### 1. **React Native Maps**
```jsx
import MapView, { Marker, Polyline, Circle } from 'react-native-maps';

const MapScreen = () => {
  const [region, setRegion] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  return (
    <MapView
      style={styles.map}
      region={region}
      onRegionChange={setRegion}
      showsUserLocation={true}
      showsMyLocationButton={true}
    >
      <Marker
        coordinate={{ latitude: 28.6139, longitude: 77.2090 }}
        title="New Delhi"
        description="Capital of India"
      />
    </MapView>
  );
};
```

### 2. **Location Services**
```jsx
import Geolocation from '@react-native-community/geolocation';

const LocationTracker = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Get current position
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

    // Watch position changes
    const watchId = Geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, distanceFilter: 10 }
    );

    return () => Geolocation.clearWatch(watchId);
  }, []);

  return (
    <View>
      {location && (
        <Text>
          Lat: {location.latitude}, Lng: {location.longitude}
        </Text>
      )}
    </View>
  );
};
```

## 🛠️ Essential Libraries

### **Core Libraries**
```bash
# Maps
npm install react-native-maps
npm install @react-native-community/geolocation

# Places & Geocoding
npm install react-native-google-places-autocomplete
npm install react-native-geocoding

# Permissions
npm install react-native-permissions
```

## 💻 Practical Examples

### **Example 1: Basic Map with Current Location** ⭐
```jsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const BasicMapScreen = () => {
  const [region, setRegion] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      },
      (error) => {
        Alert.alert('Error', 'Unable to get location');
        console.log(error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onRegionChange={setRegion}
      >
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="You are here"
            pinColor="red"
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
```

## 🎯 Practice Exercises

### **Beginner Level** ⭐
1. **Basic Map Display** - Create a simple map view with custom markers
2. **Current Location** - Get user's current location and center map

### **Intermediate Level** ⭐⭐⭐
3. **Places Search** - Implement Google Places autocomplete
4. **Custom Markers** - Create custom marker components with clustering

### **Advanced Level** ⭐⭐⭐⭐
5. **Route Planning** - Calculate routes between points with directions
6. **Real-time Tracking** - Track user movement and draw path on map

### **Expert Level** ⭐⭐⭐⭐⭐
7. **Uber-like App** - Driver-rider matching with real-time tracking
8. **Delivery Tracking** - Multi-stop route optimization

## 🔗 Resources

- [React Native Maps Documentation](https://github.com/react-native-maps/react-native-maps)
- [Google Maps Platform](https://developers.google.com/maps)
- [Location Services Best Practices](https://developer.android.com/guide/topics/location)

Maps aur location services ke saath aap amazing location-aware apps bana sakte hain! 🗺️✨
