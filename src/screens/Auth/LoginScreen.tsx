import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  RNTextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigations/StackNavigator';
import { themeStyles, colors } from '../../theme/style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/TextInput';
// Import SVG icons
import HideIcon from '../../assets/icons/hide.svg';
import ShowIcon from '../../assets/icons/show.svg';
import { API_BASE } from '../../config';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  // const dispatch = useDispatch(); // Removed useDispatch

  const [isLoading, setIsLoading] = useState(false);

  // State for input focus
  const [phoneNumberFocused, setPhoneNumberFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  // State for password visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const validateInputs = () => {
    const trimmedPhoneNumber = phoneNumber.trim();
    const trimmedPassword = password;

    if (!trimmedPhoneNumber || !trimmedPassword) {
      Alert.alert('Validation Error', 'Please enter phone number and password');
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Save user details to AsyncStorage
      await AsyncStorage.setItem(
        'userDetails',
        JSON.stringify({
          id: data.user.id,
          name: data.user.name, // <-- This is important
          phone_number: data.user.phone_number,
          token: data.token,
        }),
      );

      Alert.alert('Success', data.message);
      navigation.replace('AppTabs');
    } catch (err: any) {
      console.error('Login Error:', err);
      Alert.alert('Login Failed', err.message);
    } finally {
      setIsLoading(false);
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
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo-cropped.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Welcome Back!</Text>

        <TextInput
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          onFocus={() => setPhoneNumberFocused(true)}
          onBlur={() => setPhoneNumberFocused(false)}
          isFocused={phoneNumberFocused}
          keyboardType="phone-pad"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible} // Control visibility
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          isFocused={passwordFocused}
          isPassword={true} // Mark as password field
          onToggleVisibility={() => setIsPasswordVisible(!isPasswordVisible)} // Toggle function
        />

        <Text style={styles.forgotPassword}>Forgot Password?</Text>

        <View style={themeStyles.wFull}>
          <Button variant="primary" onPress={handleLogin} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#fff" /> : 'Login'}
          </Button>
        </View>

        <Text style={styles.switchText}>
          Don't have an account?{' '}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('Signup')}
          >
            Sign Up
          </Text>
        </Text>
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
    justifyContent: 'center',
    padding: 24,
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
    color: colors.text,
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
  forgotPassword: {
    color: colors.primary,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 24,
    marginTop: -12,
    marginRight: 20,
  },
  switchText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 32,
    fontSize: 14,
  },
  link: {
    color: colors.primary,
    fontWeight: '700',
  },
  buttonContainer: {
    marginTop: 60,
    gap: 16,
  },
});
