# Media & Camera Integration 📸

## Complete Media Handling Guide

Media handling React Native apps mein essential feature hai. Ye tutorial tumhe camera, image picker, aur video handling sikhayega.

## 📚 What You'll Learn

### **Media Solutions:**
- **React Native Image Picker** - Photo/video selection
- **React Native Camera** - Camera integration
- **React Native Video** - Video playback
- **Image Manipulation** - Resize, crop, filters
- **File Management** - Upload, download, caching

## 🎯 Real-World Examples

### **Apps Using Media:**
- **Instagram** - Camera, filters, video editing
- **WhatsApp** - Image/video sharing, camera
- **TikTok** - Video recording, effects
- **Snapchat** - Real-time camera filters

## 📖 Theory Deep Dive

### **Media Flow:**
```
Camera/Gallery → Selection → Processing → Upload/Display
      ↑             ↑          ↑           ↑
   Permissions   User Choice  Resize/Crop  Storage
```

### **Common Challenges:**
1. **Permissions** - Camera, gallery access
2. **File Size** - Large images/videos
3. **Performance** - Image loading, memory
4. **Cross-platform** - iOS/Android differences
5. **Quality** - Compression vs quality

## 📷 React Native Image Picker

### **Installation:**
```bash
npm install react-native-image-picker

# iOS
cd ios && pod install
```

### **Permissions Setup:**

#### **iOS (ios/Info.plist):**
```xml
<key>NSCameraUsageDescription</key>
<string>This app needs access to camera to take photos</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs access to photo library to select images</string>
<key>NSMicrophoneUsageDescription</key>
<string>This app needs access to microphone to record videos</string>
```

#### **Android (android/app/src/main/AndroidManifest.xml):**
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
```

### **Basic Image Picker:**
```javascript
// components/ImagePickerComponent.js
import React, { useState } from 'react';
import { View, Text, Image, Button, Alert, StyleSheet } from 'react-native';
import { launchImageLibrary, launchCamera, MediaType } from 'react-native-image-picker';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const ImagePickerComponent = ({ onImageSelected }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Request permissions
  const requestCameraPermission = async () => {
    try {
      const result = await request(
        Platform.OS === 'ios' 
          ? PERMISSIONS.IOS.CAMERA 
          : PERMISSIONS.ANDROID.CAMERA
      );
      
      return result === RESULTS.GRANTED;
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  };
  
  const requestGalleryPermission = async () => {
    try {
      const result = await request(
        Platform.OS === 'ios' 
          ? PERMISSIONS.IOS.PHOTO_LIBRARY 
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
      );
      
      return result === RESULTS.GRANTED;
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  };
  
  // Image picker options
  const imagePickerOptions = {
    mediaType: 'photo',
    includeBase64: false,
    maxHeight: 2000,
    maxWidth: 2000,
    quality: 0.8,
  };
  
  const videoPickerOptions = {
    mediaType: 'video',
    videoQuality: 'medium',
    durationLimit: 30, // 30 seconds
  };
  
  // Launch camera
  const openCamera = async (mediaType = 'photo') => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera permission is required');
      return;
    }
    
    setLoading(true);
    
    const options = mediaType === 'photo' ? imagePickerOptions : videoPickerOptions;
    
    launchCamera(options, (response) => {
      setLoading(false);
      
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
      } else if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        setSelectedImage(asset);
        onImageSelected && onImageSelected(asset);
      }
    });
  };
  
  // Launch gallery
  const openGallery = async (mediaType = 'photo') => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Gallery permission is required');
      return;
    }
    
    setLoading(true);
    
    const options = {
      ...imagePickerOptions,
      mediaType,
      selectionLimit: 1, // Single selection
    };
    
    launchImageLibrary(options, (response) => {
      setLoading(false);
      
      if (response.didCancel) {
        console.log('User cancelled gallery');
      } else if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
      } else if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        setSelectedImage(asset);
        onImageSelected && onImageSelected(asset);
      }
    });
  };
  
  // Multiple image selection
  const openMultipleGallery = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Gallery permission is required');
      return;
    }
    
    setLoading(true);
    
    const options = {
      ...imagePickerOptions,
      selectionLimit: 5, // Multiple selection
    };
    
    launchImageLibrary(options, (response) => {
      setLoading(false);
      
      if (response.didCancel) {
        console.log('User cancelled gallery');
      } else if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
      } else if (response.assets) {
        console.log('Selected images:', response.assets.length);
        onImageSelected && onImageSelected(response.assets);
      }
    });
  };
  
  // Show action sheet
  const showImagePicker = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => openCamera('photo') },
        { text: 'Gallery', onPress: () => openGallery('photo') },
        { text: 'Multiple Images', onPress: openMultipleGallery },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };
  
  const showVideoPicker = () => {
    Alert.alert(
      'Select Video',
      'Choose an option',
      [
        { text: 'Record Video', onPress: () => openCamera('video') },
        { text: 'Gallery', onPress: () => openGallery('video') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Image Picker</Text>
      
      {selectedImage && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage.uri }} style={styles.image} />
          <Text style={styles.imageInfo}>
            Size: {Math.round(selectedImage.fileSize / 1024)} KB
          </Text>
          <Text style={styles.imageInfo}>
            Dimensions: {selectedImage.width} x {selectedImage.height}
          </Text>
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        <Button
          title={loading ? "Loading..." : "Select Image"}
          onPress={showImagePicker}
          disabled={loading}
        />
        
        <Button
          title={loading ? "Loading..." : "Select Video"}
          onPress={showVideoPicker}
          disabled={loading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  imageInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  buttonContainer: {
    gap: 10,
  },
});

export default ImagePickerComponent;
```

### **Advanced Image Processing:**
```javascript
// utils/imageProcessor.js
import { Image } from 'react-native';

class ImageProcessor {
  // Get image dimensions
  static getImageDimensions(uri) {
    return new Promise((resolve, reject) => {
      Image.getSize(
        uri,
        (width, height) => resolve({ width, height }),
        (error) => reject(error)
      );
    });
  }
  
  // Resize image (requires react-native-image-resizer)
  static async resizeImage(uri, maxWidth = 800, maxHeight = 600, quality = 80) {
    try {
      const ImageResizer = require('react-native-image-resizer');
      
      const resizedImage = await ImageResizer.createResizedImage(
        uri,
        maxWidth,
        maxHeight,
        'JPEG',
        quality,
        0, // rotation
        undefined, // outputPath
        false, // keepMeta
        {
          mode: 'contain',
          onlyScaleDown: true,
        }
      );
      
      return resizedImage;
    } catch (error) {
      console.error('Error resizing image:', error);
      throw error;
    }
  }
  
  // Compress image
  static async compressImage(uri, quality = 0.7) {
    try {
      const ImageResizer = require('react-native-image-resizer');
      
      const compressedImage = await ImageResizer.createResizedImage(
        uri,
        undefined, // keep original width
        undefined, // keep original height
        'JPEG',
        quality * 100,
        0
      );
      
      return compressedImage;
    } catch (error) {
      console.error('Error compressing image:', error);
      throw error;
    }
  }
  
  // Convert to base64
  static async convertToBase64(uri) {
    try {
      const RNFS = require('react-native-fs');
      const base64 = await RNFS.readFile(uri, 'base64');
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error('Error converting to base64:', error);
      throw error;
    }
  }
  
  // Save image to gallery
  static async saveToGallery(uri, filename) {
    try {
      const CameraRoll = require('@react-native-camera-roll/camera-roll');
      const result = await CameraRoll.save(uri, { type: 'photo', album: 'MyApp' });
      return result;
    } catch (error) {
      console.error('Error saving to gallery:', error);
      throw error;
    }
  }
}

export default ImageProcessor;
```

## 🎥 React Native Camera

### **Installation:**
```bash
npm install react-native-vision-camera

# iOS
cd ios && pod install
```

### **Camera Component:**
```javascript
// components/CameraComponent.js
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const CameraComponent = ({ onPhotoTaken, onVideoRecorded }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [cameraType, setCameraType] = useState('back');
  const [isRecording, setIsRecording] = useState(false);
  const [flash, setFlash] = useState('off');
  
  const camera = useRef(null);
  const devices = useCameraDevices();
  const device = devices[cameraType];
  
  // Request permissions
  useEffect(() => {
    requestPermissions();
  }, []);
  
  const requestPermissions = async () => {
    try {
      const cameraPermission = await request(
        Platform.OS === 'ios' 
          ? PERMISSIONS.IOS.CAMERA 
          : PERMISSIONS.ANDROID.CAMERA
      );
      
      const microphonePermission = await request(
        Platform.OS === 'ios' 
          ? PERMISSIONS.IOS.MICROPHONE 
          : PERMISSIONS.ANDROID.RECORD_AUDIO
      );
      
      setHasPermission(
        cameraPermission === RESULTS.GRANTED && 
        microphonePermission === RESULTS.GRANTED
      );
    } catch (error) {
      console.error('Permission error:', error);
    }
  };
  
  // Take photo
  const takePhoto = async () => {
    try {
      if (!camera.current) return;
      
      const photo = await camera.current.takePhoto({
        flash: flash,
        qualityPrioritization: 'quality',
        enableAutoRedEyeReduction: true,
      });
      
      console.log('Photo taken:', photo);
      onPhotoTaken && onPhotoTaken(photo);
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };
  
  // Start video recording
  const startRecording = async () => {
    try {
      if (!camera.current) return;
      
      setIsRecording(true);
      
      camera.current.startRecording({
        flash: flash,
        onRecordingFinished: (video) => {
          console.log('Video recorded:', video);
          setIsRecording(false);
          onVideoRecorded && onVideoRecorded(video);
        },
        onRecordingError: (error) => {
          console.error('Recording error:', error);
          setIsRecording(false);
          Alert.alert('Error', 'Failed to record video');
        },
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
    }
  };
  
  // Stop video recording
  const stopRecording = async () => {
    try {
      if (!camera.current) return;
      await camera.current.stopRecording();
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };
  
  // Toggle camera
  const toggleCamera = () => {
    setCameraType(cameraType === 'back' ? 'front' : 'back');
  };
  
  // Toggle flash
  const toggleFlash = () => {
    setFlash(flash === 'off' ? 'on' : 'off');
  };
  
  // Frame processor for real-time processing
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    // Process frame here (face detection, QR codes, etc.)
    console.log('Frame:', frame.width, 'x', frame.height);
  }, []);
  
  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>Camera permission required</Text>
        <TouchableOpacity onPress={requestPermissions} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  if (!device) {
    return (
      <View style={styles.container}>
        <Text>Camera not available</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={isActive}
        photo={true}
        video={true}
        audio={true}
        frameProcessor={frameProcessor}
      />
      
      {/* Camera controls */}
      <View style={styles.controls}>
        {/* Top controls */}
        <View style={styles.topControls}>
          <TouchableOpacity onPress={toggleFlash} style={styles.controlButton}>
            <Text style={styles.controlText}>
              {flash === 'off' ? '⚡️' : '🔆'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={toggleCamera} style={styles.controlButton}>
            <Text style={styles.controlText}>🔄</Text>
          </TouchableOpacity>
        </View>
        
        {/* Bottom controls */}
        <View style={styles.bottomControls}>
          <TouchableOpacity onPress={takePhoto} style={styles.captureButton}>
            <Text style={styles.captureText}>📷</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={isRecording ? stopRecording : startRecording}
            style={[styles.recordButton, isRecording && styles.recordingButton]}
          >
            <Text style={styles.recordText}>
              {isRecording ? '⏹️' : '🎥'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 50,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlText: {
    fontSize: 24,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ccc',
  },
  captureText: {
    fontSize: 30,
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingButton: {
    backgroundColor: 'darkred',
  },
  recordText: {
    fontSize: 30,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    margin: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CameraComponent;
```

## 🎯 Exercises

### **Exercise 1: Photo Gallery App** ⭐⭐
Create a photo gallery with:
- Image selection from gallery
- Grid view display
- Image preview
- Delete functionality

### **Exercise 2: Camera App** ⭐⭐⭐
Build a camera app with:
- Photo/video capture
- Flash control
- Camera switching
- Gallery integration

### **Exercise 3: Image Editor** ⭐⭐⭐⭐
Create an image editing app:
- Crop, resize, rotate
- Filters and effects
- Text overlay
- Save/share functionality

### **Exercise 4: Social Media Camera** ⭐⭐⭐⭐⭐
Build Instagram-like camera:
- Stories camera
- Real-time filters
- Video recording
- Upload with compression

## 🔗 Resources & Links

### **Image Picker:**
- React Native Image Picker: https://github.com/react-native-image-picker/react-native-image-picker
- Permissions: https://github.com/zoontek/react-native-permissions

### **Camera:**
- Vision Camera: https://react-native-vision-camera.com/
- Camera Roll: https://github.com/react-native-cameraroll/react-native-cameraroll

### **Image Processing:**
- Image Resizer: https://github.com/bamlab/react-native-image-resizer
- Image Crop Picker: https://github.com/ivpusic/react-native-image-crop-picker

Media handling master karne ke baad tumhara app professional camera aur gallery features kar sakta hai! 📸✨
