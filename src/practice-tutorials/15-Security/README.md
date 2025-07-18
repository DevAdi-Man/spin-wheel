# Security in React Native 🔒

## 🛡️ Overview

Mobile app security React Native development mein critical aspect hai. Is tutorial mein aap seekhenge ki apps ko secure kaise banate hain, data protection kaise implement karte hain, aur common security vulnerabilities se kaise bachte hain.

## 🎯 What You'll Learn

- Secure data storage techniques
- Biometric authentication implementation
- Certificate pinning and network security
- Code obfuscation and protection
- API security best practices
- Input validation and sanitization
- Secure communication protocols
- Runtime application self-protection (RASP)

## 📚 Core Concepts

### 1. **Secure Storage**
```jsx
import { Keychain } from 'react-native-keychain';
import CryptoJS from 'crypto-js';

class SecureStorage {
  // Store sensitive data in Keychain
  static async storeSecureData(key, data) {
    try {
      const jsonData = JSON.stringify(data);
      await Keychain.setInternetCredentials(key, key, jsonData);
      return true;
    } catch (error) {
      console.error('Secure storage error:', error);
      return false;
    }
  }

  // Retrieve secure data from Keychain
  static async getSecureData(key) {
    try {
      const credentials = await Keychain.getInternetCredentials(key);
      if (credentials) {
        return JSON.parse(credentials.password);
      }
      return null;
    } catch (error) {
      console.error('Secure retrieval error:', error);
      return null;
    }
  }

  // Remove secure data
  static async removeSecureData(key) {
    try {
      await Keychain.resetInternetCredentials(key);
      return true;
    } catch (error) {
      console.error('Secure removal error:', error);
      return false;
    }
  }

  // Encrypt data before storage
  static encryptData(data, secretKey) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  }

  // Decrypt data after retrieval
  static decryptData(encryptedData, secretKey) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  }
}

// Usage
const AuthService = {
  async storeAuthToken(token) {
    const encrypted = SecureStorage.encryptData(token, 'your-secret-key');
    return await SecureStorage.storeSecureData('auth_token', encrypted);
  },

  async getAuthToken() {
    const encryptedToken = await SecureStorage.getSecureData('auth_token');
    if (encryptedToken) {
      return SecureStorage.decryptData(encryptedToken, 'your-secret-key');
    }
    return null;
  },

  async clearAuthToken() {
    return await SecureStorage.removeSecureData('auth_token');
  },
};
```

### 2. **Biometric Authentication**
```jsx
import TouchID from 'react-native-touch-id';
import FingerprintScanner from 'react-native-fingerprint-scanner';

class BiometricAuth {
  // Check if biometric authentication is available
  static async isAvailable() {
    try {
      const biometryType = await TouchID.isSupported();
      return { available: true, type: biometryType };
    } catch (error) {
      return { available: false, error: error.message };
    }
  }

  // Authenticate with biometrics
  static async authenticate(reason = 'Please authenticate') {
    try {
      const config = {
        title: 'Authentication Required',
        subTitle: reason,
        description: 'Place your finger on the sensor or look at the camera',
        fallbackLabel: 'Use Passcode',
        cancelLabel: 'Cancel',
      };

      await TouchID.authenticate(reason, config);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Enhanced biometric authentication with retry logic
  static async authenticateWithRetry(maxAttempts = 3) {
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      try {
        const result = await this.authenticate();
        if (result.success) {
          return result;
        }
        attempts++;
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          return { success: false, error: 'Maximum attempts exceeded' };
        }
      }
    }
  }

  // Check for biometric changes (security measure)
  static async checkBiometricChanges() {
    try {
      // This would check if biometric data has changed
      // Implementation depends on platform-specific APIs
      return { changed: false };
    } catch (error) {
      return { changed: true, error: error.message };
    }
  }
}

// Biometric login component
const BiometricLogin = ({ onSuccess, onError }) => {
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState(null);

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    const { available, type } = await BiometricAuth.isAvailable();
    setBiometricAvailable(available);
    setBiometricType(type);
  };

  const handleBiometricAuth = async () => {
    const result = await BiometricAuth.authenticateWithRetry();
    
    if (result.success) {
      onSuccess();
    } else {
      onError(result.error);
    }
  };

  if (!biometricAvailable) {
    return null;
  }

  return (
    <TouchableOpacity 
      style={styles.biometricButton}
      onPress={handleBiometricAuth}
    >
      <Text>Login with {biometricType}</Text>
    </TouchableOpacity>
  );
};
```

### 3. **Certificate Pinning**
```jsx
// Network security with certificate pinning
import { NetworkingModule } from 'react-native';

class SecureNetworking {
  constructor() {
    this.pinnedCertificates = {
      'api.example.com': 'SHA256:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
      'secure.example.com': 'SHA256:BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB=',
    };
  }

  // Secure fetch with certificate pinning
  async secureRequest(url, options = {}) {
    const hostname = new URL(url).hostname;
    const expectedPin = this.pinnedCertificates[hostname];

    if (!expectedPin) {
      throw new Error(`No certificate pin found for ${hostname}`);
    }

    try {
      const response = await fetch(url, {
        ...options,
        // Add certificate pinning headers
        headers: {
          ...options.headers,
          'X-Certificate-Pin': expectedPin,
        },
      });

      // Verify certificate pin (this would be done at native level)
      await this.verifyCertificatePin(hostname, expectedPin);

      return response;
    } catch (error) {
      console.error('Secure request failed:', error);
      throw error;
    }
  }

  // Verify certificate pin (native implementation required)
  async verifyCertificatePin(hostname, expectedPin) {
    // This would call native module to verify certificate
    // Implementation depends on platform-specific code
    return true;
  }

  // API client with security measures
  async apiCall(endpoint, options = {}) {
    const baseURL = 'https://api.example.com';
    const url = `${baseURL}${endpoint}`;

    // Add security headers
    const secureOptions = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-API-Version': '1.0',
        ...options.headers,
      },
    };

    // Add authentication token
    const token = await AuthService.getAuthToken();
    if (token) {
      secureOptions.headers.Authorization = `Bearer ${token}`;
    }

    return this.secureRequest(url, secureOptions);
  }
}

const secureApi = new SecureNetworking();

// Usage
const UserService = {
  async getProfile() {
    try {
      const response = await secureApi.apiCall('/user/profile');
      return await response.json();
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  },

  async updateProfile(data) {
    try {
      const response = await secureApi.apiCall('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  },
};
```

### 4. **Input Validation & Sanitization**
```jsx
import validator from 'validator';
import DOMPurify from 'isomorphic-dompurify';

class InputValidator {
  // Email validation
  static validateEmail(email) {
    if (!email || typeof email !== 'string') {
      return { valid: false, error: 'Email is required' };
    }

    if (!validator.isEmail(email)) {
      return { valid: false, error: 'Invalid email format' };
    }

    return { valid: true };
  }

  // Password validation
  static validatePassword(password) {
    if (!password || typeof password !== 'string') {
      return { valid: false, error: 'Password is required' };
    }

    if (password.length < 8) {
      return { valid: false, error: 'Password must be at least 8 characters' };
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
      return { 
        valid: false, 
        error: 'Password must contain uppercase, lowercase, number, and special character' 
      };
    }

    return { valid: true };
  }

  // Phone number validation
  static validatePhone(phone) {
    if (!phone || typeof phone !== 'string') {
      return { valid: false, error: 'Phone number is required' };
    }

    if (!validator.isMobilePhone(phone)) {
      return { valid: false, error: 'Invalid phone number format' };
    }

    return { valid: true };
  }

  // Sanitize HTML input
  static sanitizeHtml(input) {
    if (typeof input !== 'string') {
      return '';
    }
    return DOMPurify.sanitize(input);
  }

  // Sanitize SQL input (basic)
  static sanitizeSql(input) {
    if (typeof input !== 'string') {
      return '';
    }
    
    // Remove common SQL injection patterns
    return input
      .replace(/['";\\]/g, '')
      .replace(/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi, '');
  }

  // Validate and sanitize form data
  static validateForm(formData, rules) {
    const errors = {};
    const sanitizedData = {};

    for (const [field, value] of Object.entries(formData)) {
      const rule = rules[field];
      if (!rule) continue;

      // Sanitize input
      let sanitizedValue = value;
      if (rule.sanitize) {
        switch (rule.sanitize) {
          case 'html':
            sanitizedValue = this.sanitizeHtml(value);
            break;
          case 'sql':
            sanitizedValue = this.sanitizeSql(value);
            break;
          default:
            sanitizedValue = validator.escape(value);
        }
      }

      // Validate input
      if (rule.required && (!sanitizedValue || sanitizedValue.trim() === '')) {
        errors[field] = `${field} is required`;
        continue;
      }

      if (rule.type) {
        let validation;
        switch (rule.type) {
          case 'email':
            validation = this.validateEmail(sanitizedValue);
            break;
          case 'password':
            validation = this.validatePassword(sanitizedValue);
            break;
          case 'phone':
            validation = this.validatePhone(sanitizedValue);
            break;
        }

        if (validation && !validation.valid) {
          errors[field] = validation.error;
          continue;
        }
      }

      sanitizedData[field] = sanitizedValue;
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
      data: sanitizedData,
    };
  }
}

// Secure form component
const SecureForm = ({ onSubmit, validationRules }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = () => {
    const validation = InputValidator.validateForm(formData, validationRules);
    
    if (validation.valid) {
      onSubmit(validation.data);
    } else {
      setErrors(validation.errors);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={formData.email || ''}
        onChangeText={(value) => handleInputChange('email', value)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && <Text style={styles.error}>{errors.email}</Text>}

      <TextInput
        placeholder="Password"
        value={formData.password || ''}
        onChangeText={(value) => handleInputChange('password', value)}
        secureTextEntry
      />
      {errors.password && <Text style={styles.error}>{errors.password}</Text>}

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

// Usage
const LoginForm = () => {
  const validationRules = {
    email: { required: true, type: 'email', sanitize: 'html' },
    password: { required: true, type: 'password' },
  };

  const handleLogin = (sanitizedData) => {
    console.log('Secure login data:', sanitizedData);
    // Proceed with login
  };

  return (
    <SecureForm 
      onSubmit={handleLogin}
      validationRules={validationRules}
    />
  );
};
```

## 🛠️ Essential Security Libraries

### **Core Security Libraries**
```bash
# Secure storage
npm install react-native-keychain
npm install react-native-sensitive-info

# Biometric authentication
npm install react-native-touch-id
npm install react-native-fingerprint-scanner

# Encryption
npm install crypto-js
npm install react-native-crypto

# Input validation
npm install validator
npm install isomorphic-dompurify
```

### **Advanced Security Tools**
```bash
# Code obfuscation
npm install --save-dev javascript-obfuscator
npm install --save-dev metro-react-native-babel-transformer

# Runtime protection
npm install react-native-root-detection
npm install react-native-jailbreak-detection

# Network security
npm install react-native-ssl-pinning
npm install react-native-cert-pinner
```

## 💻 Practical Examples

### **Example 1: Secure Authentication Flow** ⭐⭐⭐
```jsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Keychain } from 'react-native-keychain';
import CryptoJS from 'crypto-js';

class SecureAuthManager {
  constructor() {
    this.tokenKey = 'auth_token';
    this.refreshTokenKey = 'refresh_token';
    this.secretKey = 'your-app-secret-key'; // Should be generated dynamically
  }

  // Secure login
  async login(credentials) {
    try {
      // Validate credentials
      const validation = InputValidator.validateForm(credentials, {
        email: { required: true, type: 'email' },
        password: { required: true, type: 'password' },
      });

      if (!validation.valid) {
        throw new Error('Invalid credentials format');
      }

      // Hash password before sending
      const hashedPassword = CryptoJS.SHA256(credentials.password).toString();

      // Make secure API call
      const response = await secureApi.apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: validation.data.email,
          password: hashedPassword,
        }),
      });

      const authData = await response.json();

      if (authData.success) {
        await this.storeTokens(authData.token, authData.refreshToken);
        return { success: true, user: authData.user };
      } else {
        throw new Error(authData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }

  // Store tokens securely
  async storeTokens(token, refreshToken) {
    try {
      // Encrypt tokens
      const encryptedToken = CryptoJS.AES.encrypt(token, this.secretKey).toString();
      const encryptedRefreshToken = CryptoJS.AES.encrypt(refreshToken, this.secretKey).toString();

      // Store in Keychain
      await Keychain.setInternetCredentials(this.tokenKey, this.tokenKey, encryptedToken);
      await Keychain.setInternetCredentials(this.refreshTokenKey, this.refreshTokenKey, encryptedRefreshToken);

      return true;
    } catch (error) {
      console.error('Token storage error:', error);
      return false;
    }
  }

  // Retrieve tokens securely
  async getTokens() {
    try {
      const tokenCredentials = await Keychain.getInternetCredentials(this.tokenKey);
      const refreshTokenCredentials = await Keychain.getInternetCredentials(this.refreshTokenKey);

      if (tokenCredentials && refreshTokenCredentials) {
        // Decrypt tokens
        const token = CryptoJS.AES.decrypt(tokenCredentials.password, this.secretKey).toString(CryptoJS.enc.Utf8);
        const refreshToken = CryptoJS.AES.decrypt(refreshTokenCredentials.password, this.secretKey).toString(CryptoJS.enc.Utf8);

        return { token, refreshToken };
      }

      return null;
    } catch (error) {
      console.error('Token retrieval error:', error);
      return null;
    }
  }

  // Refresh token
  async refreshToken() {
    try {
      const tokens = await this.getTokens();
      if (!tokens) {
        throw new Error('No refresh token available');
      }

      const response = await secureApi.apiCall('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      });

      const authData = await response.json();

      if (authData.success) {
        await this.storeTokens(authData.token, authData.refreshToken);
        return { success: true, token: authData.token };
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      await this.logout(); // Clear invalid tokens
      return { success: false, error: error.message };
    }
  }

  // Secure logout
  async logout() {
    try {
      // Clear tokens from secure storage
      await Keychain.resetInternetCredentials(this.tokenKey);
      await Keychain.resetInternetCredentials(this.refreshTokenKey);

      // Clear any cached data
      await AsyncStorage.clear();

      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }

  // Check if user is authenticated
  async isAuthenticated() {
    const tokens = await this.getTokens();
    return tokens !== null;
  }
}

const authManager = new SecureAuthManager();

// Secure authentication hook
const useSecureAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isAuth = await authManager.isAuthenticated();
      if (isAuth) {
        // Get user data from secure API
        const userData = await getUserProfile();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const result = await authManager.login(credentials);
      if (result.success) {
        setUser(result.user);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authManager.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, login, logout };
};
```

### **Example 2: Runtime Security Checks** ⭐⭐⭐⭐
```jsx
import JailMonkey from 'jail-monkey';
import DeviceInfo from 'react-native-device-info';

class SecurityChecker {
  // Check device security status
  static async performSecurityChecks() {
    const checks = {
      isJailbroken: false,
      isDebuggingEnabled: false,
      isEmulator: false,
      hasHooks: false,
      isTampered: false,
    };

    try {
      // Check for jailbreak/root
      checks.isJailbroken = JailMonkey.isJailBroken();

      // Check for debugging
      checks.isDebuggingEnabled = await DeviceInfo.isEmulator() || __DEV__;

      // Check for emulator
      checks.isEmulator = await DeviceInfo.isEmulator();

      // Check for hooks (basic detection)
      checks.hasHooks = this.detectHooks();

      // Check for tampering
      checks.isTampered = this.detectTampering();

    } catch (error) {
      console.error('Security check error:', error);
    }

    return checks;
  }

  // Detect runtime hooks
  static detectHooks() {
    try {
      // Check for common hooking frameworks
      const suspiciousGlobals = [
        'frida',
        'xposed',
        'substrate',
        'cycript',
      ];

      for (const global of suspiciousGlobals) {
        if (typeof window !== 'undefined' && window[global]) {
          return true;
        }
      }

      // Check for modified native functions
      if (typeof fetch !== 'function' || fetch.toString().includes('[native code]') === false) {
        return true;
      }

      return false;
    } catch (error) {
      return true; // Assume compromised if check fails
    }
  }

  // Detect app tampering
  static detectTampering() {
    try {
      // Check bundle integrity (simplified)
      const expectedChecksum = 'your-app-checksum';
      const currentChecksum = this.calculateBundleChecksum();
      
      return expectedChecksum !== currentChecksum;
    } catch (error) {
      return true; // Assume tampered if check fails
    }
  }

  // Calculate bundle checksum (simplified)
  static calculateBundleChecksum() {
    // This would calculate actual bundle checksum
    // Implementation depends on platform-specific code
    return 'calculated-checksum';
  }

  // Handle security violations
  static handleSecurityViolation(violations) {
    const criticalViolations = violations.filter(v => 
      v === 'isJailbroken' || v === 'isTampered' || v === 'hasHooks'
    );

    if (criticalViolations.length > 0) {
      // Critical security violation - exit app
      this.exitApp('Security violation detected');
    } else {
      // Non-critical violations - log and continue with restrictions
      console.warn('Security warnings detected:', violations);
      this.enableRestrictedMode();
    }
  }

  // Exit app securely
  static exitApp(reason) {
    console.error('App exit:', reason);
    
    // Clear sensitive data
    authManager.logout();
    
    // Show security message
    Alert.alert(
      'Security Alert',
      'This app cannot run on compromised devices.',
      [{ text: 'OK', onPress: () => BackHandler.exitApp() }],
      { cancelable: false }
    );
  }

  // Enable restricted mode
  static enableRestrictedMode() {
    // Disable sensitive features
    // Increase security logging
    // Limit functionality
  }
}

// Security provider component
const SecurityProvider = ({ children }) => {
  const [securityStatus, setSecurityStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    performInitialSecurityCheck();
    
    // Periodic security checks
    const interval = setInterval(performSecurityCheck, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const performInitialSecurityCheck = async () => {
    try {
      const checks = await SecurityChecker.performSecurityChecks();
      setSecurityStatus(checks);
      
      const violations = Object.keys(checks).filter(key => checks[key]);
      if (violations.length > 0) {
        SecurityChecker.handleSecurityViolation(violations);
      }
    } catch (error) {
      console.error('Initial security check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const performSecurityCheck = async () => {
    try {
      const checks = await SecurityChecker.performSecurityChecks();
      const violations = Object.keys(checks).filter(key => checks[key]);
      
      if (violations.length > 0) {
        SecurityChecker.handleSecurityViolation(violations);
      }
    } catch (error) {
      console.error('Runtime security check failed:', error);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SecurityContext.Provider value={securityStatus}>
      {children}
    </SecurityContext.Provider>
  );
};
```

## 🎯 Practice Exercises

### **Beginner Level** ⭐
1. **Basic Secure Storage** - Implement secure token storage
2. **Input Validation** - Create form validation with sanitization

### **Intermediate Level** ⭐⭐⭐
3. **Biometric Authentication** - Add fingerprint/face ID login
4. **API Security** - Implement secure API communication

### **Advanced Level** ⭐⭐⭐⭐
5. **Certificate Pinning** - Add SSL certificate pinning
6. **Runtime Protection** - Implement jailbreak/root detection

### **Expert Level** ⭐⭐⭐⭐⭐
7. **Code Obfuscation** - Implement code protection strategies
8. **Comprehensive Security** - Build complete security framework

## 🔧 Security Checklist

### **Data Protection**
- ✅ Use Keychain/Keystore for sensitive data
- ✅ Encrypt data before storage
- ✅ Implement secure communication (HTTPS)
- ✅ Validate and sanitize all inputs
- ✅ Use certificate pinning

### **Authentication**
- ✅ Implement strong password policies
- ✅ Add biometric authentication
- ✅ Use secure token storage
- ✅ Implement token refresh mechanism
- ✅ Add session timeout

### **Runtime Protection**
- ✅ Detect jailbreak/root
- ✅ Check for debugging/emulation
- ✅ Implement anti-tampering measures
- ✅ Monitor for runtime manipulation
- ✅ Add code obfuscation

## 🔗 Resources

- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security-testing-guide/)
- [React Native Security](https://reactnative.dev/docs/security)
- [iOS Security Guide](https://developer.apple.com/documentation/security)
- [Android Security](https://developer.android.com/topic/security)

Security ek ongoing process hai - regular updates aur monitoring zaroori hai! 🔒✨
