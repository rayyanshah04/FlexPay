import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigations/StackNavigator';
import { colors } from '../../theme/style';
import * as Keychain from 'react-native-keychain';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, refreshSession, selectAuthToken, clearSession, selectIsAuthenticated } from '../../slices/authSlice';
import BackspaceIcon from '../../assets/icons/backspace.svg';
import { AppDispatch } from '../../store';
import { API_BASE } from '../../config';

type Props = NativeStackScreenProps<RootStackParamList, 'PinLock'>;

const PIN_LENGTH = 4;

export default function PinLockScreen({ navigation }: Props) {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasPIN, setHasPIN] = useState(false);
  const user = useSelector(selectUser);
  const authToken = useSelector(selectAuthToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch<AppDispatch>();
  const inactivityTimeout = useRef<NodeJS.Timeout | null>(null);
  const INACTIVITY_TIME = 300000; // 5 minutes

  const resetInactivityTimer = () => {
    if (inactivityTimeout.current) {
      clearTimeout(inactivityTimeout.current);
    }
    inactivityTimeout.current = setTimeout(() => {
      // dispatch(clearSession()); // Don't logout, just reset PIN
      setPin('');
    }, INACTIVITY_TIME);
  };

  // First check: if no authToken or user.id, go back to Welcome
  useEffect(() => {
    console.log('=== PinLockScreen ===');
    console.log('authToken:', !!authToken);
    console.log('user.id:', user?.id);

    if (!authToken || !user?.id) {
      console.log('❌ No authToken or user.id - redirecting to Welcome');
      navigation.replace('Welcome');
      return;
    }

    // Check if PIN is set for this user
    const checkPinStatus = async () => {
      try {
        console.log('Checking if PIN is set...');
        const response = await fetch(`${API_BASE}/api/login-pin/check`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          console.log('API error checking PIN');
          setHasPIN(false);
          setLoading(false);
          return;
        }

        console.log('PIN check result:', data);
        if (!data.has_pin) {
          console.log('✓ No PIN set - going to PinSetup');
          navigation.replace('PinSetup');
        } else {
          console.log('✓ PIN is set - show lock screen');
          setHasPIN(true);
          setLoading(false);
          resetInactivityTimer();
        }
      } catch (error) {
        console.error('Error checking PIN:', error);
        setLoading(false);
      }
    };

    checkPinStatus();

    return () => {
      if (inactivityTimeout.current) {
        clearTimeout(inactivityTimeout.current);
      }
    };
  }, [authToken, user?.id, navigation]);

  // Navigate to AppTabs when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('✓ Authenticated - navigating to AppTabs');
      navigation.replace('AppTabs');
    }
  }, [isAuthenticated, navigation]);

  // When PIN is 4 digits, verify it
  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      handleUnlock();
    }
  }, [pin]);

  const handleKeyPress = (key: string) => {
    if (pin.length < PIN_LENGTH) {
      setPin(pin + key);
      resetInactivityTimer();
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
    resetInactivityTimer();
  };

  const handleUnlock = async () => {
    try {
      const credentials = await Keychain.getGenericPassword({ service: 'userPin' });

      console.log('=== PIN Verification ===');
      console.log('Stored user_id:', credentials?.username);
      console.log('Current user_id:', user?.id);
      console.log('PIN entered:', pin);

      if (!credentials) {
        console.log('❌ No PIN stored in Keychain, trying backend verification...');

        try {
          const response = await fetch(`${API_BASE}/api/login-pin/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({ pin }),
          });

          const data = await response.json();

          if (response.ok && data.valid) {
            console.log('✓ Backend verification successful! Syncing to Keychain...');
            // Sync to Keychain
            await Keychain.setGenericPassword(String(user?.id), pin, { service: 'userPin' });

            resetInactivityTimer();
            dispatch(refreshSession());
            // navigation.replace('AppTabs'); // Removed explicit navigation
            return;
          } else {
            console.log('❌ Backend verification failed');
            Alert.alert('Invalid PIN', 'Please try again.');
            setPin('');
            resetInactivityTimer();
            return;
          }
        } catch (error) {
          console.error('Backend verification error:', error);
          Alert.alert(
            'PIN Not Found',
            'Your PIN was not found on this device and could not be verified online. Please log in again.',
            [
              { text: 'Log In Again', onPress: () => dispatch(clearSession()) }
            ]
          );
          setPin('');
          resetInactivityTimer();
          return;
        }
      }

      if (credentials.username !== String(user?.id)) {
        console.log('❌ PIN user_id mismatch - stored:', credentials.username, 'current:', String(user?.id));
        Alert.alert(
          'Session Issue',
          'Your session appears to be corrupted. Please logout and login again.',
          [
            { text: 'OK', onPress: () => dispatch(clearSession()) },
          ]
        );
        setPin('');
        return;
      }

      if (credentials.password === pin) {
        console.log('✓ PIN Correct!');
        resetInactivityTimer();
        dispatch(refreshSession());
        // navigation.replace('AppTabs'); // Removed explicit navigation
      } else {
        console.log('❌ PIN Incorrect');
        Alert.alert('Invalid PIN', 'Please try again.');
        setPin('');
        resetInactivityTimer();
      }
    } catch (error) {
      console.error('PIN verification error:', error);
      Alert.alert('Error', 'Could not verify PIN.');
      setPin('');
      resetInactivityTimer();
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Switch Account?',
      'You will be logged out and can login with another account.',
      [
        { text: 'Cancel', onPress: () => { } },
        {
          text: 'Logout',
          onPress: () => {
            dispatch(clearSession());
            setPin('');
          },
        },
      ]
    );
  };

  const renderPinDots = () => {
    const dots = [];
    for (let i = 0; i < PIN_LENGTH; i++) {
      dots.push(
        <View
          key={i}
          style={[styles.dot, { backgroundColor: i < pin.length ? colors.primary : colors.textSecondary }]}
        />
      );
    }
    return dots;
  };

  const renderKeypad = () => {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'backspace'];
    return keys.map((key) => {
      if (key === '') {
        return <View key="empty" style={styles.key} />;
      }
      if (key === 'backspace') {
        return (
          <TouchableOpacity key={key} style={styles.key} onPress={handleBackspace}>
            <BackspaceIcon width={32} height={32} fill={colors.white} />
          </TouchableOpacity>
        );
      }
      return (
        <TouchableOpacity key={key} style={styles.key} onPress={() => handleKeyPress(key)}>
          <Text style={styles.keyText}>{key}</Text>
        </TouchableOpacity>
      );
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!hasPIN) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>PIN not setup</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/bg.png')}
      style={styles.backgroundImage}
      imageStyle={{ resizeMode: 'cover' }}
    >
      <View style={styles.container}>
        <View style={styles.backdropSquare} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Enter PIN</Text>
          <Text style={styles.subtitle}>Enter your PIN to continue</Text>
          <View style={styles.dotsContainer}>{renderPinDots()}</View>
          <View style={styles.keypadContainer}>{renderKeypad()}</View>

          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Switch Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const KEYPAD_SIZE = SCREEN_WIDTH * 0.8;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropSquare: {
    position: 'absolute',
    width: '90%',
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 26,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 68,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 48,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginHorizontal: 12,
  },
  keypadContainer: {
    width: KEYPAD_SIZE,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  key: {
    width: KEYPAD_SIZE / 3,
    height: KEYPAD_SIZE / 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 28,
    color: colors.text,
  },
  logoutButton: {
    marginTop: 40,
    padding: 12,
  },
  logoutText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  loadingText: {
    color: colors.text,
    fontSize: 16,
  },
  errorText: {
    color: colors.text,
    fontSize: 16,
  },
});
