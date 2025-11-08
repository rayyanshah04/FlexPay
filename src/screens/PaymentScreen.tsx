import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons'; // --- REMOVED ---
import BackspaceIcon from '../assets/icons/backspace.svg'; // --- ADDED ---
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigations/HomeStack'; // Use HomeStack
import { Button } from '../components/ui/Button'; // Import our Button

// --- FIX: Use the correct type from HomeStack ---
type Props = NativeStackScreenProps<HomeStackParamList, 'PaymentScreen'>;

export default function PaymentScreen({ navigation }: Props) {
  const [amount, setAmount] = useState('0');

  const handlePress = (num: string) => {
    // Limit to a reasonable amount, e.g., 6 digits
    if (amount.length >= 6) return;

    // Prevent multiple dots
    if (num === '.' && amount.includes('.')) return;

    if (amount === '0' && num !== '.') {
      setAmount(num);
    } else {
      setAmount(amount + num);
    }
  };

  const handleBackspace = () => {
    if (amount.length === 1) {
      setAmount('0');
    } else {
      setAmount(amount.slice(0, -1));
    }
  };

  const handleRequest = () => {
    console.log('Requesting $', amount);
    // You could show a confirmation modal here
    navigation.goBack(); // Go back after requesting
  };

  // Keypad numbers
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0'];

  return (
    // Use SafeAreaView for a clean look
    <SafeAreaView style={styles.container}>
      {/* Amount Display */}
      <View style={styles.amountContainer}>
        <Text style={styles.amountText}>${amount}</Text>
      </View>

      {/* Keypad */}
      <View style={styles.keypad}>
        {numbers.map(num => (
          <TouchableOpacity
            key={num}
            style={styles.key}
            onPress={() => handlePress(num)}
          >
            <Text style={styles.keyText}>{num}</Text>
          </TouchableOpacity>
        ))}
        {/* Backspace Button --- UPDATED --- */}
        <TouchableOpacity style={styles.key} onPress={handleBackspace}>
          <BackspaceIcon width={28} height={28} fill="#0871B3" />
        </TouchableOpacity>
      </View>

      {/* Bottom Button */}
      <View style={styles.buttonContainer}>
        <Button variant="primary" fullWidth onPress={handleRequest}>
          Request Money
        </Button>
      </View>
    </SafeAreaView>
  );
}

// --- New "Rayyan Theme" Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Clean white background
    justifyContent: 'space-between',
  },
  amountContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  amountText: {
    fontSize: 64, // Large, aesthetic amount
    fontWeight: '600',
    color: '#222222',
    textAlign: 'center',
    // Allows text to shrink if it gets too long
    adjustsFontSizeToFit: true,
    minHeight: 80, // Use minHeight instead of lineHeight
    lineHeight: undefined, // Unset lineHeight
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: '10%', // Provides spacing
    marginBottom: 20,
  },
  key: {
    width: '33.33%',
    height: 80, // Taller, easier to tap buttons
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 28,
    color: '#222222',
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    padding: 24, // Consistent padding
    paddingBottom: 40, // Extra space at bottom
  },
});