# Native Integration 🔧

## 🔗 Overview

React Native mein native functionality integrate karna advanced development ka important part hai. Is tutorial mein aap seekhenge ki native modules kaise create karte hain, third-party SDKs kaise integrate karte hain, aur platform-specific code kaise handle karte hain.

## 🎯 What You'll Learn

- Creating custom native modules
- Bridging iOS and Android native code
- Platform-specific implementations
- Third-party SDK integration
- Native UI components
- Performance optimization with native code
- Debugging native modules
- Publishing native modules

## 📚 Core Concepts

### 1. **Creating Native Modules**

#### **iOS Native Module (Swift)**
```swift
// ios/YourApp/CustomModule.swift
import Foundation
import React

@objc(CustomModule)
class CustomModule: NSObject {
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  @objc
  func getName(_ callback: RCTResponseSenderBlock) {
    callback([NSNull(), "Custom iOS Module"])
  }
  
  @objc
  func addNumbers(_ a: NSNumber, b: NSNumber, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    let result = a.doubleValue + b.doubleValue
    resolver(result)
  }
  
  @objc
  func showAlert(_ title: String, message: String) {
    DispatchQueue.main.async {
      let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
      alert.addAction(UIAlertAction(title: "OK", style: .default))
      
      if let rootViewController = UIApplication.shared.windows.first?.rootViewController {
        rootViewController.present(alert, animated: true)
      }
    }
  }
}

// ios/YourApp/CustomModule.m
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CustomModule, NSObject)

RCT_EXTERN_METHOD(getName:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(addNumbers:(nonnull NSNumber *)a 
                  b:(nonnull NSNumber *)b 
                  resolver:(RCTPromiseResolveBlock)resolve 
                  rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(showAlert:(NSString *)title message:(NSString *)message)

@end
```

#### **Android Native Module (Java)**
```java
// android/app/src/main/java/com/yourapp/CustomModule.java
package com.yourapp;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import android.app.AlertDialog;
import android.content.DialogInterface;

public class CustomModule extends ReactContextBaseJavaModule {
    
    private static ReactApplicationContext reactContext;
    
    CustomModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }
    
    @Override
    public String getName() {
        return "CustomModule";
    }
    
    @ReactMethod
    public void getName(Callback callback) {
        callback.invoke(null, "Custom Android Module");
    }
    
    @ReactMethod
    public void addNumbers(double a, double b, Promise promise) {
        try {
            double result = a + b;
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("CALCULATION_ERROR", e);
        }
    }
    
    @ReactMethod
    public void showAlert(String title, String message) {
        getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                AlertDialog.Builder builder = new AlertDialog.Builder(getCurrentActivity());
                builder.setTitle(title)
                       .setMessage(message)
                       .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                           public void onClick(DialogInterface dialog, int id) {
                               dialog.dismiss();
                           }
                       });
                AlertDialog dialog = builder.create();
                dialog.show();
            }
        });
    }
}

// android/app/src/main/java/com/yourapp/CustomPackage.java
package com.yourapp;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CustomPackage implements ReactPackage {
    
    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
    
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new CustomModule(reactContext));
        return modules;
    }
}
```

### 2. **JavaScript Interface**
```jsx
// NativeModules/CustomModule.js
import { NativeModules } from 'react-native';

const { CustomModule } = NativeModules;

export default {
  getName: () => {
    return new Promise((resolve, reject) => {
      CustomModule.getName((error, name) => {
        if (error) {
          reject(error);
        } else {
          resolve(name);
        }
      });
    });
  },

  addNumbers: (a, b) => {
    return CustomModule.addNumbers(a, b);
  },

  showAlert: (title, message) => {
    CustomModule.showAlert(title, message);
  },
};

// Usage in React Native
import CustomModule from './NativeModules/CustomModule';

const App = () => {
  const handleNativeCall = async () => {
    try {
      const name = await CustomModule.getName();
      console.log('Module name:', name);
      
      const result = await CustomModule.addNumbers(5, 3);
      console.log('Addition result:', result);
      
      CustomModule.showAlert('Success', `Result is ${result}`);
    } catch (error) {
      console.error('Native module error:', error);
    }
  };

  return (
    <View>
      <Button title="Call Native Module" onPress={handleNativeCall} />
    </View>
  );
};
```

### 3. **Native UI Components**

#### **iOS Custom View**
```swift
// ios/YourApp/CustomView.swift
import UIKit
import React

class CustomView: UIView {
  
  @objc var color: String = "" {
    didSet {
      self.backgroundColor = hexStringToUIColor(color)
    }
  }
  
  @objc var onPress: RCTDirectEventBlock?
  
  override init(frame: CGRect) {
    super.init(frame: frame)
    setupView()
  }
  
  required init?(coder aDecoder: NSCoder) {
    super.init(coder: aDecoder)
    setupView()
  }
  
  func setupView() {
    self.backgroundColor = UIColor.blue
    
    let tapGesture = UITapGestureRecognizer(target: self, action: #selector(handleTap))
    self.addGestureRecognizer(tapGesture)
  }
  
  @objc func handleTap() {
    if let onPress = onPress {
      onPress(["message": "Custom view tapped!"])
    }
  }
  
  func hexStringToUIColor(_ hex: String) -> UIColor {
    var cString: String = hex.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
    
    if cString.hasPrefix("#") {
      cString.remove(at: cString.startIndex)
    }
    
    if cString.count != 6 {
      return UIColor.gray
    }
    
    var rgbValue: UInt64 = 0
    Scanner(string: cString).scanHexInt64(&rgbValue)
    
    return UIColor(
      red: CGFloat((rgbValue & 0xFF0000) >> 16) / 255.0,
      green: CGFloat((rgbValue & 0x00FF00) >> 8) / 255.0,
      blue: CGFloat(rgbValue & 0x0000FF) / 255.0,
      alpha: CGFloat(1.0)
    )
  }
}

// ios/YourApp/CustomViewManager.swift
import React

@objc(CustomViewManager)
class CustomViewManager: RCTViewManager {
  
  override func view() -> UIView! {
    return CustomView()
  }
  
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}

// ios/YourApp/CustomViewManager.m
#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(CustomViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(color, NSString)
RCT_EXPORT_VIEW_PROPERTY(onPress, RCTDirectEventBlock)

@end
```

#### **Android Custom View**
```java
// android/app/src/main/java/com/yourapp/CustomView.java
package com.yourapp;

import android.content.Context;
import android.graphics.Color;
import android.view.View;
import android.widget.TextView;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class CustomView extends TextView {
    
    public CustomView(Context context) {
        super(context);
        setupView();
    }
    
    private void setupView() {
        setText("Custom Native View");
        setBackgroundColor(Color.BLUE);
        setTextColor(Color.WHITE);
        setPadding(20, 20, 20, 20);
        
        setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                onPress();
            }
        });
    }
    
    public void setColor(String color) {
        setBackgroundColor(Color.parseColor(color));
    }
    
    private void onPress() {
        WritableMap event = Arguments.createMap();
        event.putString("message", "Custom view tapped!");
        
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
            getId(),
            "onPress",
            event
        );
    }
}

// android/app/src/main/java/com/yourapp/CustomViewManager.java
package com.yourapp;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.common.MapBuilder;

import java.util.Map;

public class CustomViewManager extends SimpleViewManager<CustomView> {
    
    public static final String REACT_CLASS = "CustomView";
    
    @Override
    public String getName() {
        return REACT_CLASS;
    }
    
    @Override
    public CustomView createViewInstance(ThemedReactContext context) {
        return new CustomView(context);
    }
    
    @ReactProp(name = "color")
    public void setColor(CustomView view, String color) {
        view.setColor(color);
    }
    
    @Override
    public Map getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder.builder()
            .put("onPress", MapBuilder.of("phasedRegistrationNames", 
                MapBuilder.of("bubbled", "onPress")))
            .build();
    }
}
```

## 🛠️ Essential Tools

### **Development Tools**
```bash
# iOS development
xcode-select --install
pod install

# Android development
# Android Studio with SDK
# Gradle

# React Native CLI
npm install -g @react-native-community/cli
```

### **Debugging Tools**
```bash
# iOS debugging
# Xcode debugger
# Instruments for performance

# Android debugging
# Android Studio debugger
# ADB (Android Debug Bridge)
adb logcat
```

## 💻 Practical Examples

### **Example 1: Biometric Authentication Module** ⭐⭐⭐
```jsx
// NativeModules/BiometricAuth.js
import { NativeModules, Platform } from 'react-native';

const { BiometricAuth } = NativeModules;

export default {
  isAvailable: async () => {
    try {
      return await BiometricAuth.isAvailable();
    } catch (error) {
      return false;
    }
  },

  authenticate: async (reason = 'Please authenticate') => {
    try {
      const result = await BiometricAuth.authenticate(reason);
      return { success: true, ...result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getSupportedBiometrics: async () => {
    try {
      return await BiometricAuth.getSupportedBiometrics();
    } catch (error) {
      return [];
    }
  },
};

// Usage
import BiometricAuth from './NativeModules/BiometricAuth';

const LoginScreen = () => {
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const available = await BiometricAuth.isAvailable();
    setBiometricAvailable(available);
  };

  const handleBiometricLogin = async () => {
    const result = await BiometricAuth.authenticate('Login with biometrics');
    
    if (result.success) {
      // Handle successful authentication
      console.log('Biometric authentication successful');
      navigateToHome();
    } else {
      // Handle authentication failure
      Alert.alert('Authentication Failed', result.error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Login Screen</Text>
      
      {biometricAvailable && (
        <TouchableOpacity 
          style={styles.biometricButton}
          onPress={handleBiometricLogin}
        >
          <Text>Login with Biometrics</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity style={styles.loginButton}>
        <Text>Login with Password</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### **Example 2: Camera Module Integration** ⭐⭐⭐⭐
```jsx
// NativeModules/CameraModule.js
import { NativeModules, NativeEventEmitter } from 'react-native';

const { CameraModule } = NativeModules;
const cameraEventEmitter = new NativeEventEmitter(CameraModule);

export default {
  // Initialize camera
  initialize: async (config = {}) => {
    try {
      return await CameraModule.initialize(config);
    } catch (error) {
      throw new Error(`Camera initialization failed: ${error.message}`);
    }
  },

  // Take photo
  takePhoto: async (options = {}) => {
    try {
      const result = await CameraModule.takePhoto(options);
      return result;
    } catch (error) {
      throw new Error(`Photo capture failed: ${error.message}`);
    }
  },

  // Start video recording
  startRecording: async (options = {}) => {
    try {
      return await CameraModule.startRecording(options);
    } catch (error) {
      throw new Error(`Video recording failed: ${error.message}`);
    }
  },

  // Stop video recording
  stopRecording: async () => {
    try {
      return await CameraModule.stopRecording();
    } catch (error) {
      throw new Error(`Stop recording failed: ${error.message}`);
    }
  },

  // Event listeners
  onPhotoTaken: (callback) => {
    return cameraEventEmitter.addListener('onPhotoTaken', callback);
  },

  onRecordingStarted: (callback) => {
    return cameraEventEmitter.addListener('onRecordingStarted', callback);
  },

  onRecordingStopped: (callback) => {
    return cameraEventEmitter.addListener('onRecordingStopped', callback);
  },

  // Cleanup
  cleanup: () => {
    cameraEventEmitter.removeAllListeners('onPhotoTaken');
    cameraEventEmitter.removeAllListeners('onRecordingStarted');
    cameraEventEmitter.removeAllListeners('onRecordingStopped');
  },
};

// Usage in component
import CameraModule from './NativeModules/CameraModule';

const CameraScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    initializeCamera();
    setupEventListeners();

    return () => {
      CameraModule.cleanup();
    };
  }, []);

  const initializeCamera = async () => {
    try {
      await CameraModule.initialize({
        quality: 'high',
        flashMode: 'auto',
        cameraType: 'back',
      });
    } catch (error) {
      Alert.alert('Camera Error', error.message);
    }
  };

  const setupEventListeners = () => {
    CameraModule.onPhotoTaken((photo) => {
      setPhotos(prev => [...prev, photo]);
    });

    CameraModule.onRecordingStarted(() => {
      setIsRecording(true);
    });

    CameraModule.onRecordingStopped((video) => {
      setIsRecording(false);
      console.log('Video saved:', video.path);
    });
  };

  const takePhoto = async () => {
    try {
      const photo = await CameraModule.takePhoto({
        quality: 0.8,
        base64: false,
      });
      console.log('Photo taken:', photo.path);
    } catch (error) {
      Alert.alert('Photo Error', error.message);
    }
  };

  const toggleRecording = async () => {
    try {
      if (isRecording) {
        await CameraModule.stopRecording();
      } else {
        await CameraModule.startRecording({
          quality: 'high',
          maxDuration: 60, // seconds
        });
      }
    } catch (error) {
      Alert.alert('Recording Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        {/* Camera preview would be here */}
      </View>
      
      <View style={styles.controls}>
        <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
          <Text>Take Photo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.recordButton, isRecording && styles.recording]}
          onPress={toggleRecording}
        >
          <Text>{isRecording ? 'Stop Recording' : 'Start Recording'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
```

### **Example 3: Third-Party SDK Integration** ⭐⭐⭐⭐⭐
```jsx
// Example: Integrating Firebase Analytics natively
// ios/YourApp/AnalyticsModule.swift
import Firebase
import React

@objc(AnalyticsModule)
class AnalyticsModule: NSObject {
  
  override init() {
    super.init()
    if FirebaseApp.app() == nil {
      FirebaseApp.configure()
    }
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  @objc
  func logEvent(_ eventName: String, parameters: [String: Any]) {
    Analytics.logEvent(eventName, parameters: parameters)
  }
  
  @objc
  func setUserProperty(_ value: String, forName name: String) {
    Analytics.setUserProperty(value, forName: name)
  }
  
  @objc
  func setUserId(_ userId: String) {
    Analytics.setUserID(userId)
  }
  
  @objc
  func setCurrentScreen(_ screenName: String, screenClass: String?) {
    Analytics.logEvent(AnalyticsEventScreenView, parameters: [
      AnalyticsParameterScreenName: screenName,
      AnalyticsParameterScreenClass: screenClass ?? screenName
    ])
  }
}

// JavaScript interface
import { NativeModules } from 'react-native';

const { AnalyticsModule } = NativeModules;

export default {
  logEvent: (eventName, parameters = {}) => {
    AnalyticsModule.logEvent(eventName, parameters);
  },

  setUserProperty: (name, value) => {
    AnalyticsModule.setUserProperty(value, name);
  },

  setUserId: (userId) => {
    AnalyticsModule.setUserId(userId);
  },

  setCurrentScreen: (screenName, screenClass) => {
    AnalyticsModule.setCurrentScreen(screenName, screenClass);
  },

  // Predefined events
  logLogin: (method) => {
    AnalyticsModule.logEvent('login', { method });
  },

  logPurchase: (value, currency, items) => {
    AnalyticsModule.logEvent('purchase', {
      value,
      currency,
      items: JSON.stringify(items),
    });
  },

  logShare: (contentType, itemId) => {
    AnalyticsModule.logEvent('share', {
      content_type: contentType,
      item_id: itemId,
    });
  },
};

// Usage with React Navigation
import Analytics from './NativeModules/Analytics';

const AppNavigator = () => {
  return (
    <NavigationContainer
      onStateChange={(state) => {
        const currentRoute = getCurrentRoute(state);
        if (currentRoute) {
          Analytics.setCurrentScreen(currentRoute.name, currentRoute.name);
        }
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Usage in components
const ProductScreen = ({ product }) => {
  useEffect(() => {
    Analytics.logEvent('view_item', {
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
      value: product.price,
    });
  }, [product]);

  const handlePurchase = () => {
    Analytics.logPurchase(product.price, 'USD', [product]);
    // Handle purchase logic
  };

  return (
    <View>
      {/* Product UI */}
      <Button title="Buy Now" onPress={handlePurchase} />
    </View>
  );
};
```

## 🎯 Practice Exercises

### **Beginner Level** ⭐
1. **Simple Native Module** - Create a module that returns device info
2. **Platform Detection** - Create utilities for platform-specific code

### **Intermediate Level** ⭐⭐⭐
3. **Custom UI Component** - Create a native button with custom styling
4. **File System Access** - Create module for file operations

### **Advanced Level** ⭐⭐⭐⭐
5. **Bluetooth Integration** - Create module for Bluetooth communication
6. **Push Notification Handler** - Custom notification processing

### **Expert Level** ⭐⭐⭐⭐⭐
7. **Payment Gateway Integration** - Integrate native payment SDKs
8. **AR/VR Module** - Create augmented reality features

## 🔧 Best Practices

### **Performance Optimization**
```jsx
// Use callbacks for synchronous operations
@ReactMethod
public void syncOperation(Callback callback) {
    String result = performSyncOperation();
    callback.invoke(result);
}

// Use promises for asynchronous operations
@ReactMethod
public void asyncOperation(Promise promise) {
    new AsyncTask<Void, Void, String>() {
        @Override
        protected String doInBackground(Void... voids) {
            return performAsyncOperation();
        }
        
        @Override
        protected void onPostExecute(String result) {
            promise.resolve(result);
        }
    }.execute();
}
```

### **Error Handling**
```jsx
// Proper error handling in native modules
@ReactMethod
public void riskyOperation(Promise promise) {
    try {
        String result = performRiskyOperation();
        promise.resolve(result);
    } catch (Exception e) {
        promise.reject("OPERATION_FAILED", e.getMessage(), e);
    }
}
```

## 🔗 Resources

- [React Native Native Modules](https://reactnative.dev/docs/native-modules-intro)
- [iOS Native Modules](https://reactnative.dev/docs/native-modules-ios)
- [Android Native Modules](https://reactnative.dev/docs/native-modules-android)
- [Native UI Components](https://reactnative.dev/docs/native-components-ios)

Native integration se aap React Native ki limitations ko overcome kar sakte hain aur powerful native features access kar sakte hain! 🔧✨
