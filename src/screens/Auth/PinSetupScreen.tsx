import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigations/StackNavigator';
import { colors } from '../../theme/style';
import * as Keychain from 'react-native-keychain';
import { useSelector } from 'react-redux';
import { selectUser } from '../../slices/authSlice';
import BackspaceIcon from '../../assets/icons/backspace.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'PinSetup'>;

const PIN_LENGTH = 4;

export default function PinSetupScreen({ navigation }: Props) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (pin.length === PIN_LENGTH && !isConfirming) {
      setIsConfirming(true);
    } else if (pin.length === PIN_LENGTH && isConfirming) {
      setConfirmPin(pin);
      handleSetPin(pin);
    }
  }, [pin, isConfirming]);

  const handleKeyPress = (key: string) => {
    if (pin.length < PIN_LENGTH) {
      setPin(pin + key);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleSetPin = async (finalPin: string) => {
    if (!user?.id) {
      Alert.alert('Error', 'User not logged in.');
      return;
    }

    if (confirmPin !== finalPin) {
      Alert.alert('PINs do not match', 'Please try again.');
      setPin('');
      setConfirmPin('');
      setIsConfirming(false);
      return;
    }

    try {
      await Keychain.setGenericPassword(String(user.id), finalPin, { service: 'userPin' });
      Alert.alert('PIN Set', 'Your PIN has been set successfully.');
      navigation.replace('PinLock');
    } catch (error) {
      console.error('Keychain error:', error);
      Alert.alert('Error', 'Could not set PIN. Please try again.');
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
          <Text style={styles.title}>{isConfirming ? 'Confirm PIN' : 'Create a PIN'}</Text>
          <Text style={styles.subtitle}>
            {isConfirming ? 'Enter your new PIN again.' : 'Create a 4-digit PIN to secure your account.'}
          </Text>
          <View style={styles.dotsContainer}>{renderPinDots()}</View>
          <View style={styles.keypadContainer}>{renderKeypad()}</View>
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
    height: '60%',
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
    marginBottom: 48,
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
});
