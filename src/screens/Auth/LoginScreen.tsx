
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  TextInput as RNTextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigations/StackNavigator';
import { themeStyles } from '../../theme/style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '../../components/ui/Button';
import LinearGradient from 'react-native-linear-gradient';
// Import SVG icons
import HideIcon from '../../assets/icons/hide.svg';
import ShowIcon from '../../assets/icons/show.svg';
import { API_BASE } from '../../config';


type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

// Modified GradientInput to include the eye icon
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
}: any) => (
  <LinearGradient
    colors={
      isFocused
        ? ['#4CB7B1', '#0871B3'] // Active Gradient
        : ['#E0E0E0', '#E0E0E0'] // Inactive Grey
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
          name: data.user.name,  // <-- This is important
          phone_number: data.user.phone_number,
          token: data.token,
        })
      );

      Alert.alert('Success', data.message);
      navigation.replace("AppTabs");

    } catch (err: any) {
      console.error('Login Error:', err);
      Alert.alert('Login Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <LinearGradient
          colors={['#4CB7B1', '#0871B3']}
          style={styles.logo}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.logoInner}>
            <Image
              source={require('../../assets/logo-cropped.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </LinearGradient>

        <Text style={styles.title}>Welcome Back!</Text>

        <GradientInput
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          onFocus={() => setPhoneNumberFocused(true)}
          onBlur={() => setPhoneNumberFocused(false)}
          isFocused={phoneNumberFocused}
          keyboardType="phone-pad"
          autoCapitalize="none"
        />

        <GradientInput
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
          <Button variant="primary" onPress={handleLogin} fullWidth disabled={isLoading}>
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
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    padding: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 24,
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
  forgotPassword: {
    color: '#0871B3',
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 24,
    marginTop: -12,
  },
  switchText: {
    color: '#666666',
    textAlign: 'center',
    marginTop: 32,
    fontSize: 14,
  },
  link: {
    color: '#0871B3',
    fontWeight: '700',
  },
});