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
import { RootStackParamList } from '../../navigations/StackNavigator';
import { themeStyles, colors } from '../../theme/style';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/TextInput';
import HideIcon from '../../assets/icons/hide.svg';
import ShowIcon from '../../assets/icons/show.svg';

import { API_BASE } from '../../config';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

export default function SignupScreen({ navigation }: Props) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [nameFocused, setNameFocused] = useState(false);
  const [phoneNumberFocused, setPhoneNumberFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState<boolean | null>(
    null,
  ); // New state for phone number validation
  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);

  const phoneRegex = /^03\d{9}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (phoneNumber) {
      setIsPhoneNumberValid(phoneRegex.test(phoneNumber));
    } else {
      setIsPhoneNumberValid(null);
    }
  }, [phoneNumber]);

  useEffect(() => {
    if (email) {
      setIsEmailValid(emailRegex.test(email));
    } else {
      setIsEmailValid(null);
    }
  }, [email]);

  const validateInputs = () => {
    const trimmedName = name.trim();
    const trimmedPhoneNumber = phoneNumber.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPhoneNumber || !password) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return false;
    }

    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return false;
    }

    if (!phoneRegex.test(trimmedPhoneNumber)) {
      Alert.alert(
        'Invalid Phone Number',
        'Please enter a valid 11-digit phone number starting with 03.',
      );
      return false;
    }

    if (password.length < 6) {
      Alert.alert(
        'Weak Password',
        'Password must be at least 6 characters long.',
      );
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validateInputs()) return; // Run your validation first

    try {
      const response = await fetch(`${API_BASE}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone_number: phoneNumber,
          password,
        }),
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (!response.ok) {
        // backend sends error in data.error
        throw new Error(data.error || 'Something went wrong');
      }

      Alert.alert('Success', `Account created for ${data.name}`);
      navigation.navigate('Login');
    } catch (error: any) {
      console.error('Signup Error:', error);
      Alert.alert('Signup Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/bg.png')}
        style={{ position: 'absolute', width: '120%', height: '120%' }}
        resizeMode="cover"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/logo-cropped.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Create Account</Text>

          <TextInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            isFocused={nameFocused}
            autoCapitalize="words"
          />

          {isEmailValid === false && (
            <Text style={styles.errorText}>
              Please enter a valid email address.
            </Text>
          )}
          <TextInput
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            isFocused={emailFocused}
            keyboardType="email-address"
            autoCapitalize="none"
            isValid={isEmailValid}
          />

          {isPhoneNumberValid === false && (
            <Text style={styles.errorText}>Correct format: 03xxxxxxxxx</Text>
          )}
          <TextInput
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

          <TextInput
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
            <Button
              variant="primary"
              onPress={handleSignup}
              disabled={isLoading}
            >
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
    position: 'relative',
  },
  keyboardView: {
    flex: 1,
    padding: 24,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.frostedBg,
    borderWidth: 1,
    borderColor: colors.frostedBorder,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputWrapper: {
    height: 55,
    borderRadius: 12,
    padding: 2,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  inputInner: {
    flex: 1,
    backgroundColor: colors.inputBg,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.inputText,
  },
  eyeIcon: {
    paddingHorizontal: 12,
  },
  errorText: {
    marginTop: -8,
    color: colors.error,
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 10,
  },
  switchText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 20,
    fontSize: 14,
  },
  link: {
    color: colors.primary,
    fontWeight: '700',
  },
});
