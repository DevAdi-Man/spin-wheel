# Forms & Validation Mastery 📝

## Complete Forms & Validation Guide

Forms React Native apps ka essential part hain. Ye tutorial tumhe modern form handling aur validation sikhayega.

## 📚 What You'll Learn

### **Form Libraries:**
- **React Hook Form** - Performance-focused, minimal re-renders
- **Formik** - Popular, feature-rich form library
- **Yup** - Schema-based validation
- **Zod** - TypeScript-first validation
- **Custom Validation** - Manual validation patterns

## 🎯 Real-World Examples

### **Apps Using Form Patterns:**
- **Instagram** - Registration, profile editing
- **Uber** - Address forms, payment forms
- **Banking Apps** - Complex validation, security
- **E-commerce** - Checkout forms, user details

## 📖 Theory Deep Dive

### **Form Handling Challenges:**
```
User Input → Validation → State Management → Submission
     ↑           ↑            ↑              ↑
  Real-time   Error Show   Performance   API Calls
```

### **Common Form Problems:**
1. **Performance** - Too many re-renders
2. **Validation** - Complex validation logic
3. **UX** - When to show errors
4. **State** - Managing form state
5. **Accessibility** - Screen reader support

## 🚀 React Hook Form

### **Why React Hook Form?**
- **Performance** - Minimal re-renders
- **Less Code** - Simple API
- **TypeScript** - Great TypeScript support
- **Validation** - Built-in validation support

### **Installation:**
```bash
npm install react-hook-form
npm install @hookform/resolvers yup # For Yup validation
```

### **Basic Form:**
```javascript
// screens/ReactHookFormExample.js
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation schema
const schema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email'),
  age: yup
    .number()
    .required('Age is required')
    .positive('Age must be positive')
    .integer('Age must be an integer')
    .min(18, 'Must be at least 18 years old'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase and number'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

const ReactHookFormExample = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    watch,
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange', // Validate on change
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      age: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Watch specific fields
  const watchedPassword = watch('password');

  const onSubmit = async (data) => {
    try {
      console.log('Form Data:', data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert('Success', 'Form submitted successfully!');
      reset(); // Reset form after successful submission
    } catch (error) {
      Alert.alert('Error', 'Failed to submit form');
    }
  };

  const onError = (errors) => {
    console.log('Form Errors:', errors);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Hook Form</Text>

      {/* First Name */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>First Name</Text>
        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.firstName && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter first name"
            />
          )}
        />
        {errors.firstName && (
          <Text style={styles.errorText}>{errors.firstName.message}</Text>
        )}
      </View>

      {/* Last Name */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Last Name</Text>
        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.lastName && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter last name"
            />
          )}
        />
        {errors.lastName && (
          <Text style={styles.errorText}>{errors.lastName.message}</Text>
        )}
      </View>

      {/* Email */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}
      </View>

      {/* Age */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Age</Text>
        <Controller
          control={control}
          name="age"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.age && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter age"
              keyboardType="numeric"
            />
          )}
        />
        {errors.age && (
          <Text style={styles.errorText}>{errors.age.message}</Text>
        )}
      </View>

      {/* Password */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Password</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter password"
              secureTextEntry
            />
          )}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password.message}</Text>
        )}

        {/* Password Strength Indicator */}
        {watchedPassword && (
          <View style={styles.passwordStrength}>
            <Text style={styles.strengthLabel}>Password Strength:</Text>
            <View style={styles.strengthBar}>
              <View
                style={[
                  styles.strengthFill,
                  {
                    width: `${Math.min(watchedPassword.length * 10, 100)}%`,
                    backgroundColor:
                      watchedPassword.length < 6 ? '#ff4444' :
                      watchedPassword.length < 8 ? '#ffaa00' : '#44ff44'
                  }
                ]}
              />
            </View>
          </View>
        )}
      </View>

      {/* Confirm Password */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Confirm Password</Text>
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.confirmPassword && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Confirm password"
              secureTextEntry
            />
          )}
        />
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
        )}
      </View>

      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <Button
          title={isSubmitting ? "Submitting..." : "Submit"}
          onPress={handleSubmit(onSubmit, onError)}
          disabled={isSubmitting || !isValid}
        />

        <Button
          title="Reset"
          onPress={() => reset()}
          color="#666"
        />
      </View>

      {/* Form State Debug */}
      <View style={styles.debugContainer}>
        <Text style={styles.debugTitle}>Form State:</Text>
        <Text style={styles.debugText}>Valid: {isValid ? 'Yes' : 'No'}</Text>
        <Text style={styles.debugText}>Submitting: {isSubmitting ? 'Yes' : 'No'}</Text>
        <Text style={styles.debugText}>Errors: {Object.keys(errors).length}</Text>
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
    color: '#333',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 4,
  },
  passwordStrength: {
    marginTop: 8,
  },
  strengthLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  strengthBar: {
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  debugContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default ReactHookFormExample;
```

### **Advanced React Hook Form:**
```javascript
// hooks/useAdvancedForm.js
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Custom hook for advanced form handling
export const useAdvancedForm = (schema, options = {}) => {
  const form = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    ...options,
  });

  // Custom methods
  const setFieldError = (fieldName, message) => {
    form.setError(fieldName, {
      type: 'manual',
      message,
    });
  };

  const clearFieldError = (fieldName) => {
    form.clearErrors(fieldName);
  };

  const validateField = async (fieldName) => {
    return await form.trigger(fieldName);
  };

  const getFieldState = (fieldName) => {
    const fieldState = form.getFieldState(fieldName);
    const value = form.getValues(fieldName);

    return {
      ...fieldState,
      value,
      hasError: !!fieldState.error,
      isEmpty: !value || value.length === 0,
    };
  };

  // Auto-save functionality
  const enableAutoSave = (callback, delay = 1000) => {
    const subscription = form.watch((data, { name, type }) => {
      if (type === 'change') {
        const timeoutId = setTimeout(() => {
          callback(data);
        }, delay);

        return () => clearTimeout(timeoutId);
      }
    });

    return subscription;
  };

  return {
    ...form,
    setFieldError,
    clearFieldError,
    validateField,
    getFieldState,
    enableAutoSave,
  };
};

// Usage example
const AdvancedFormExample = () => {
  const schema = yup.object({
    username: yup.string().required('Username is required'),
    email: yup.string().email().required('Email is required'),
  });

  const form = useAdvancedForm(schema);

  // Auto-save example
  React.useEffect(() => {
    const unsubscribe = form.enableAutoSave((data) => {
      console.log('Auto-saving:', data);
      // Save to localStorage or API
    });

    return unsubscribe;
  }, []);

  const checkUsernameAvailability = async (username) => {
    try {
      const response = await fetch(`/api/check-username/${username}`);
      const { available } = await response.json();

      if (!available) {
        form.setFieldError('username', 'Username is already taken');
      } else {
        form.clearFieldError('username');
      }
    } catch (error) {
      console.error('Error checking username:', error);
    }
  };

  return (
    <View>
      {/* Form implementation */}
    </View>
  );
};
```

## 📋 Formik

### **Why Formik?**
- **Mature** - Battle-tested library
- **Feature-rich** - Lots of built-in features
- **Community** - Large community support
- **Integration** - Good third-party integration

### **Installation:**
```bash
npm install formik yup
```

### **Basic Formik Form:**
```javascript
// screens/FormikExample.js
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

// Validation schema
const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  message: Yup.string()
    .min(10, 'Message must be at least 10 characters')
    .required('Message is required'),
});

const FormikExample = () => {
  const initialValues = {
    name: '',
    email: '',
    phone: '',
    message: '',
  };

  const handleSubmit = async (values, { setSubmitting, resetForm, setFieldError }) => {
    try {
      console.log('Submitting:', values);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate server validation error
      if (values.email === 'test@error.com') {
        setFieldError('email', 'This email is already registered');
        return;
      }

      Alert.alert('Success', 'Form submitted successfully!');
      resetForm();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Formik Form</Text>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
          isValid,
          dirty,
        }) => (
          <View>
            {/* Name Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={[
                  styles.input,
                  touched.name && errors.name && styles.inputError
                ]}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                placeholder="Enter your name"
              />
              {touched.name && errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            {/* Email Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[
                  styles.input,
                  touched.email && errors.email && styles.inputError
                ]}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Phone Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={[
                  styles.input,
                  touched.phone && errors.phone && styles.inputError
                ]}
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
                value={values.phone}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
              {touched.phone && errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}
            </View>

            {/* Message Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Message</Text>
              <TextInput
                style={[
                  styles.textArea,
                  touched.message && errors.message && styles.inputError
                ]}
                onChangeText={handleChange('message')}
                onBlur={handleBlur('message')}
                value={values.message}
                placeholder="Enter your message"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              {touched.message && errors.message && (
                <Text style={styles.errorText}>{errors.message}</Text>
              )}
            </View>

            {/* Submit Button */}
            <Button
              title={isSubmitting ? "Submitting..." : "Submit"}
              onPress={handleSubmit}
              disabled={isSubmitting || !isValid || !dirty}
            />

            {/* Form State Debug */}
            <View style={styles.debugContainer}>
              <Text style={styles.debugTitle}>Form State:</Text>
              <Text style={styles.debugText}>Valid: {isValid ? 'Yes' : 'No'}</Text>
              <Text style={styles.debugText}>Dirty: {dirty ? 'Yes' : 'No'}</Text>
              <Text style={styles.debugText}>Submitting: {isSubmitting ? 'Yes' : 'No'}</Text>
            </View>
          </View>
        )}
      </Formik>
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
    color: '#333',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    height: 100,
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 4,
  },
  debugContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default FormikExample;
```

## 🎯 Exercises

### **Exercise 1: Registration Form** ⭐⭐
Create a user registration form with:
- Personal details (name, email, phone)
- Password with strength indicator
- Terms & conditions checkbox
- Real-time validation

### **Exercise 2: Multi-step Form** ⭐⭐⭐
Build a multi-step wizard:
- Personal info → Address → Payment
- Progress indicator
- Back/Next navigation
- Form state persistence

### **Exercise 3: Dynamic Form Builder** ⭐⭐⭐⭐
Create a dynamic form system:
- JSON-driven form configuration
- Different field types
- Conditional field visibility
- Custom validation rules

### **Exercise 4: Advanced Survey Form** ⭐⭐⭐⭐⭐
Build a complex survey app:
- Multiple question types
- Skip logic and branching
- Progress tracking
- Offline form submission

## 🔗 Resources & Links

### **React Hook Form:**
- Official Docs: https://react-hook-form.com/
- Examples: https://github.com/react-hook-form/react-hook-form/tree/master/examples

### **Formik:**
- Official Docs: https://formik.org/
- Examples: https://github.com/formium/formik/tree/master/examples

### **Validation Libraries:**
- Yup: https://github.com/jquense/yup
- Zod: https://github.com/colinhacks/zod
- Joi: https://github.com/sideway/joi

Forms master karne ke baad tumhare app mein perfect user input handling hogi! 📝✨
