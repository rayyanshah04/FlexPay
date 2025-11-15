import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigations/StackNavigator';
import { colors } from '../../theme/style';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Keychain from 'react-native-keychain';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, refreshSession, selectIsAuthenticated } from '../../slices/authSlice';
import BackspaceIcon from '../../assets/icons/backspace.svg';
import { AppDispatch } from '../../store';

type Props = NativeStackScreenProps<RootStackParamList, 'PinLock'>;

const PIN_LENGTH = 4;

export default function PinLockScreen({ navigation }: Props) {
  const [pin, setPin] = useState('');
  const user = useSelector(selectUser);
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace('AppTabs');
    }
  }, [isAuthenticated, navigation]);

  useEffect(() => {
    const checkPinStatus = async () => {
      if (!user?.id) {
        navigation.replace('Login');
        return;
      }
      try {
        const credentials = await Keychain.getGenericPassword({ service: 'userPin' });
        if (!credentials) {
          navigation.replace('PinSetup');
        }
      } catch (error) {
        console.error('Keychain check error:', error);
        Alert.alert('Error', 'Could not check PIN status. Please try again.');
        navigation.replace('Login');
      }
    };
    checkPinStatus();
  }, [user, navigation]);

  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      handleUnlock();
    }
  }, [pin]);

  const handleKeyPress = (key: string) => {
    if (pin.length < PIN_LENGTH) {
      setPin(pin + key);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleUnlock = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'User not logged in.');
      return;
    }

    try {
      const credentials = await Keychain.getGenericPassword({ service: 'userPin' });
      if (credentials && credentials.password === pin) {
        dispatch(refreshSession());
      } else {
        Alert.alert('Invalid PIN', 'The PIN you entered is incorrect.');
        setPin('');
      }
    } catch (error) {
      console.error('Keychain unlock error:', error);
      Alert.alert('Error', 'Could not verify PIN. Please try again.');
      setPin('');
    }
  };

  const handleBiometricAuth = async () => {
    if (!user?.id) return;

    try {
      const credentials = await Keychain.getGenericPassword({
        service: 'userPin',
        authenticationPrompt: { title: 'Authenticate to unlock Flexpay' },
      });

      if (credentials) {
        dispatch(refreshSession());
      }
    } catch (error: any) {
      console.error('Biometric auth error:', error);
    }
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
          <Text style={styles.subtitle}>Enter your PIN to unlock</Text>
          <View style={styles.dotsContainer}>{renderPinDots()}</View>
          <View style={styles.keypadContainer}>{renderKeypad()}</View>
          <TouchableOpacity onPress={handleBiometricAuth} style={styles.biometricButton}>
            <Icon name="finger-print-outline" size={40} color={colors.primary} />
            <Text style={styles.biometricText}>Use Biometrics</Text>
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
  biometricButton: {
    marginTop: 40,
    alignItems: 'center',
  },
  biometricText: {
    color: colors.primary,
    marginTop: 8,
    fontSize: 16,
  },
});
