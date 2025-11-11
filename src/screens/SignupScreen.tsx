import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  TextInput as RNTextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/StackNavigator';
import { themeStyles } from '../theme/style';
import { Button } from '../components/ui/Button';
import LinearGradient from 'react-native-linear-gradient';
import HideIcon from '../assets/icons/hide.svg';
import ShowIcon from '../assets/icons/show.svg';

import { API_BASE } from '../config';


type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

// GradientInput component
const GradientInput = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  onFocus,
  onBlur,
  isFocused,
  keyboardType,
  autoCapitalize,
  isPassword,
  onToggleVisibility,
  isValid, // Updated prop
}: any) => (
  <LinearGradient
    colors={
      isValid === false // Check isValid prop
        ? ['#FF0000', '#FF6666'] // Red gradient for invalid
        : isValid === true && !isFocused // Green gradient for valid and not focused
          ? ['#00B37E', '#009966']
          : isFocused
            ? ['#0077B6', '#6A057F'] // Active gradient
            : ['#E0E0E0', '#E0E0E0'] // Inactive grey
    }
    style={styles.inputWrapper}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
  >
    <View style={styles.inputInner}>
      <RNTextInput
        placeholder={placeholder}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        onFocus={onFocus}
        onBlur={onBlur}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        placeholderTextColor={'#999'}
      />
      {isPassword && (
        <TouchableOpacity onPress={onToggleVisibility} style={styles.eyeIcon}>
          {secureTextEntry ? (
            <HideIcon width={22} height={22} fill={'#888'} />
          ) : (
            <ShowIcon width={22} height={22} fill={'#888'} />
          )}
        </TouchableOpacity>
      )}
    </View>
  </LinearGradient>
);

export default function SignupScreen({ navigation }: Props) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [nameFocused, setNameFocused] = useState(false);
  const [phoneNumberFocused, setPhoneNumberFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState<boolean | null>(null); // New state for phone number validation

  const phoneRegex = /^03\d{9}$/;

  useEffect(() => {
    if (phoneNumber) {
      setIsPhoneNumberValid(phoneRegex.test(phoneNumber));
    } else {
      setIsPhoneNumberValid(null);
    }
  }, [phoneNumber]);

  const validateInputs = () => {
    const trimmedName = name.trim();
    const trimmedPhoneNumber = phoneNumber.trim();

    let isValid = true;

    if (!trimmedName || !trimmedPhoneNumber || !password) {
      Alert.alert('Validation Error', 'Please enter all fields');
      isValid = false;
    }

    if (!phoneRegex.test(trimmedPhoneNumber)) {
      isValid = false;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters');
      isValid = false;
    }
    return isValid;
  };

  const handleSignup = async () => {
    if (!validateInputs()) return; // Run your validation first

    try {
      const response = await fetch(`${API_BASE}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone_number: phoneNumber, password }),
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (!response.ok) {
        // backend sends error in data.error
        throw new Error(data.error || 'Something went wrong');
      }

      Alert.alert('Success', `Account created for ${data.name}`);
    } catch (error: any) {
      console.error('Signup Error:', error);
      Alert.alert('Signup Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          <LinearGradient
            colors={['#0077B6', '#6A057F']}
            style={styles.logo}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.logoInner}>
              <Image
                source={require('../assets/logo-cropped.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </LinearGradient>

          <Text style={styles.title}>Create Account</Text>

          <GradientInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            isFocused={nameFocused}
            autoCapitalize="words"
          />

          {isPhoneNumberValid === false && (
            <Text style={styles.errorText}>
              Correct format: 03xxxxxxxxx
            </Text>
          )}
          <GradientInput
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            onFocus={() => setPhoneNumberFocused(true)}
            onBlur={() => setPhoneNumberFocused(false)}
            isFocused={phoneNumberFocused}
            keyboardType="phone-pad"
            autoCapitalize="none"
            isValid={isPhoneNumberValid}
          />

          <GradientInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            isFocused={passwordFocused}
            isPassword={true}
            onToggleVisibility={() => setIsPasswordVisible(!isPasswordVisible)}
          />

          <View style={[themeStyles.wFull, styles.buttonContainer]}>
            <Button variant="primary" onPress={handleSignup} disabled={isLoading} fullWidth>
              {isLoading ? <ActivityIndicator /> : 'Sign Up'}
            </Button>
          </View>

          <Text style={styles.switchText}>
            Already have an account?{' '}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate('Login')}
            >
              Login
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
    padding: 40,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 24,
    marginTop: 20,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoInner: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 37,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: '80%',
    height: '80%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#222222',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputWrapper: {
    height: 55,
    borderRadius: 12,
    padding: 2,
    marginBottom: 20,
  },
  inputInner: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    paddingHorizontal: 12,
  },
  errorText: {
    marginTop: -8,
    color: 'red',
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 10,
  },
  switchText: {
    color: '#666666',
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 20,
    fontSize: 14,
  },
  link: {
    color: '#0077B6',
    fontWeight: '700',
  },
});
