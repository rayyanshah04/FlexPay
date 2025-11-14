import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import BackspaceIcon from '../../assets/icons/backspace.svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigations/HomeStack';
import { Button } from '../../components/ui/Button';
import { colors } from '../../theme/style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// --- FIX: Use the correct type from HomeStack ---
type Props = NativeStackScreenProps<HomeStackParamList, 'PaymentScreen'>;

export default function PaymentScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState('0');

  const handlePress = (num: string) => {
    if (amount.length >= 8) return;
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
    console.log('Requesting Rs. ', amount);
    navigation.goBack();
  };

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + 60,
            paddingHorizontal: 24,
          },
        ]}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Request Money</Text>
          <Text style={styles.subtitle}>
            Enter amount to request
          </Text>
        </View>

        {/* Amount Display Card */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={styles.amountText} numberOfLines={1} adjustsFontSizeToFit>
            Rs. {amount}
          </Text>
        </View>

        {/* Keypad */}
        <View style={styles.keypad}>
          {numbers.map((num, index) => (
            <TouchableOpacity
              key={`${num}-${index}`}
              style={styles.key}
              onPress={() => num && handlePress(num)}
              disabled={!num}
            >
              <Text style={styles.keyText}>{num}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.key} onPress={handleBackspace}>
            <BackspaceIcon width={22} height={22} fill={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Button */}
      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 20 }]}>
        <Button variant="primary" onPress={handleRequest}>
          Request Money
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  amountCard: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.buttonSecondaryBorder,
    marginBottom: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: { elevation: 5 },
    }),
  },
  amountLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  amountText: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  key: {
    width: '33.33%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 26,
    color: colors.text,
    fontWeight: '500',
  },
  buttonContainer: {
    padding: 24,
    backgroundColor: colors.Background,
  },
});