import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Button, Text, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import * as yup from 'yup';

const schema = yup.object({
    firstName: yup
        .string()
        .required('First name is required')
        .min(2, 'First name must be at least 2 characters'),
    lastName: yup
        .string()
        .required('Last name is required')
        .min(2, 'Last name must be at least 2 characters.'),
    email: yup
        .string()
        .required('Email is required.')
        .email('Please enter valid email.'),
    age: yup
        .number()
        .required('Age is required.')
        .positive('Age must be positive.')
        .integer('Age must be integer.')
        .min(18, 'Must be at least 18 years old.'),
    password: yup
        .string()
        .required('Password is required.')
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain uppercase, lowercase and number'
        ),
    confirmPassword: yup
        .string()
        .required('Please confirm your password')
        .oneOf([yup.ref('password')], 'Password must matchs.'),
});


const login = () => {
    const { control, handleSubmit, formState: { errors, isSubmitting, isValid }, reset, watch, setValue, getValues } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            age: 0,
            password: '',
            confirmPassword: ''
        }
    });
    const { styles } = useStyles(stylesheet);

    const watchPassword = watch('password');

    const onSubmit = async (data: any) => {
        try {
            console.log('Form Data : ', data);

            await new Promise(resolve => setTimeout(resolve, 2000));

            Alert.alert('Success', 'Form submitted successFully.');
            reset();
        } catch (error) {
            Alert.alert('Error', 'Failed to submit form.');
        }
    };

    const onError = (error: Error) => {
        console.log('Form Errors ', error);
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>React Hook form</Text>

            {/* First Name */}
            <View style={styles.fieldContainer} >
                <Text style={styles.label}>First Name </Text>
                <Controller
                    control={control}
                    name='firstName'
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput style={[styles.input, errors.firstName && styles.inputError]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder='Enter first name'
                        />
                    )}
                />
                {errors.firstName && (
                    <Text style={styles.errorText}> {errors.firstName.message} </Text>
                )}
            </View>

            {/* Last Name */}
            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Last Name </Text>
                <Controller control={control}
                    name="lastName"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput style={[styles.input, errors.lastName && styles.inputError]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder='Enter last Name'
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
                    name='email'
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, errors.email && styles.inputError]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder='Enter Email'
                            keyboardType='email-address'
                            autoCapitalize='none'
                        />
                    )}
                />
                {errors.email && (
                    <Text style={styles.errorText}> {errors.email.message}</Text>
                )}
            </View>

            {/* Age */}
            <View style={styles.fieldContainer}>
                <Text style={styles.label}> Age </Text>
                <Controller
                    control={control}
                    name='age'
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, errors.age && styles.inputError]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder='Enter age'
                            keyboardType='numeric'
                        />
                    )}
                />
                {
                    errors.age && (
                        <Text style={styles.errorText}> {errors.age.message}</Text>
                    )
                }
            </View>
            { /* Password */}
            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Password</Text>
                <Controller
                    control={control}
                    name='password'
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, errors.age && styles.inputError]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder='Enter password'
                            secureTextEntry
                        />
                    )}
                />
                {
                    errors.password && (
                        <Text style={styles.errorText}>{errors.password.message}</Text>
                    )
                }
                {/* Password Strength Indicator */}
                {watchPassword && (
                    <View style={styles.passwordStrength}>
                        <Text style={styles.strengthLabel}>Password Strength:</Text>
                        <View style={styles.strengthBar}>
                            <View
                                style={[
                                    styles.strengthFill,
                                    {
                                        width: `${Math.min(watchPassword.length * 10, 100)}%`,
                                        backgroundColor:
                                            watchPassword.length < 6 ? '#ff4444' :
                                                watchPassword.length < 8 ? '#ffaa00' : '#44ff44'
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
    )
}

export default login

const stylesheet = createStyleSheet(theme => ({
    container: {
        flex: 1,
        padding: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#333'
    },
    fieldContainer: {
        marginBottom: 20
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
        backgroundColor: '#fff'
    },
    inputError: {
        borderColor: '#fff4444'
    },
    errorText: {
        color: '#fff4444',
        fontSize: 14,
        marginTop: 4,
    },
    passwordStrength: {
        marginTop: 8
    },
    strengthLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4
    },
    strengthBar: {
        height: 4,
        backgroundColor: '#eee',
        borderRadius: 2,
        overflow: 'hidden'
    },
    strengthFill: {
        height: '100%',
        borderRadius: 2
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
    },
    debugContainer: {
        marginTOp: 30,
        padding: 15,
        backgroundColor: '#f0f0f0',
        borderRadius: 8
    },
    debugTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8
    },
    debugText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4
    }
}))
