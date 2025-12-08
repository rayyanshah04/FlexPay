import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootStackParamList } from '../../navigations/StackNavigator';
import { colors } from '../../theme/style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UserIcon from '../../assets/icons/user-solid-full.svg';
import api from '../../utils/api';

type Props = NativeStackScreenProps<RootStackParamList, 'ConfirmPayment'>;

const ConfirmPayment: React.FC<Props> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const {
    name = 'Muhammad Hussain',
    iban = 'PK12ABC1234567890',
    amount: initialAmount = '0',
    phone = '',
  } = route.params || {};

  const phoneNumber = phone || iban.replace(/^.*?(\d+)$/, '$1');

  const [amount, setAmount] = useState<string>(initialAmount.replace(' PKR', '').replace(/,/g, ''));
  const [note, setNote] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const formatNumberWithCommas = (value: string): string => {
    // Remove any non-digit characters except decimal point
    const cleaned = value.replace(/[^\d.]/g, '');

    // Split by decimal point
    const parts = cleaned.split('.');

    // Format the integer part with commas
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Return formatted number (with decimal if it exists)
    return parts.join('.');
  };

  const handleAmountChange = (text: string) => {
    // Remove commas first
    const cleaned = text.replace(/,/g, '').replace(/[^0-9.]/g, '');
    setAmount(cleaned);
  };

  const handleConfirm = async () => {
    if (!amount || amount === '0') {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    console.log('DEBUG: Sending transaction with phone:', phoneNumber);

    setIsLoading(true);

    try {
      const response = await api('/api/transactions/send', {
        method: 'POST',
        body: JSON.stringify({
          receiver_phone: phoneNumber,
          amount: parseFloat(amount.replace(/,/g, '')),
          note: note,
        }),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Non-JSON response received:', response.status);
        Alert.alert('Error', 'Server error. Please try again later.');
        return;
      }

      const data = await response.json();

      if (response.ok) {
        // Show success notification
        // NotificationService.transactionNotification('sent', formatNumberWithCommas(amount), name);

        const transactionId = data.transaction_id || `TXN${Date.now().toString().slice(-10)}`;

        navigation.navigate('PaymentSuccess', {
          name,
          amount: formatNumberWithCommas(amount),
          transactionId,
          phone: phoneNumber,
        });
      } else {
        Alert.alert('Transaction Failed', data.error || 'Unable to complete transaction. Please try again.');
      }
    } catch (error) {
      console.error('Transaction error:', error);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/bg.png')}
      style={styles.backgroundImage}
      imageStyle={{ resizeMode: 'cover' }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + 24,
              paddingBottom: insets.bottom + 24,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.backdropSquare} />

          <View style={styles.cardWrapper}>
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.avatar}>
                  <UserIcon width={28} height={28} fill={colors.white} />
                </View>
              </View>

              <View style={styles.cardMiddle}>
                <View style={styles.recipientSection}>
                  <Text style={styles.recipientName}>{name}</Text>
                  <Text style={styles.recipientPhone}>{phoneNumber}</Text>
                </View>

                <View style={styles.amountSection}>
                  <Text style={styles.amountLabel}>Amount</Text>
                  <View style={styles.amountInputWrapper}>
                    <Text style={styles.currencySymbol}>Rs.</Text>
                    <TextInput
                      style={styles.amountInput}
                      value={formatNumberWithCommas(amount)}
                      onChangeText={handleAmountChange}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.cardBottom}>
                <View style={styles.noteSection}>
                  <Text style={styles.noteLabel}>Note (Optional)</Text>
                  <TextInput
                    style={styles.noteInput}
                    placeholder="Add a message..."
                    placeholderTextColor={colors.textSecondary}
                    value={note}
                    onChangeText={setNote}
                    maxLength={90}
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
              disabled={isLoading}
            >
              <Text style={styles.confirmButtonText}>
                {isLoading ? 'Processing...' : 'Confirm Payment'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default ConfirmPayment;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.75, 280);
const CARD_HEIGHT = CARD_WIDTH * 1.3;
const SCALE = CARD_WIDTH / 300;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  backdropSquare: {
    position: 'absolute',
    width: CARD_WIDTH + 20,
    height: CARD_HEIGHT * 0.63,
    backgroundColor: colors.white,
    opacity: 0.20,
    borderRadius: 26,
    top: '18%',
    zIndex: 0,
  },
  cardWrapper: {
    position: 'relative',
    zIndex: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    backgroundColor: colors.Background,
    justifyContent: 'space-between',
    overflow: 'hidden',
    padding: 28 * SCALE,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardMiddle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  recipientSection: {
    marginBottom: 24 * SCALE,
  },
  recipientName: {
    fontSize: 22 * SCALE,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2 * SCALE,
  },
  recipientPhone: {
    fontSize: 11 * SCALE,
    color: colors.textSecondary,
    fontFamily: 'monospace',
    letterSpacing: 0.3 * SCALE,
  },
  amountSection: {
    width: '100%',
    marginBottom: 16 * SCALE,
  },
  amountLabel: {
    fontSize: 10 * SCALE,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8 * SCALE,
    letterSpacing: 0.3 * SCALE,
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.buttonSecondaryBorder,
    borderRadius: 8,
    paddingHorizontal: 12 * SCALE,
    paddingVertical: 8 * SCALE,
  },
  currencySymbol: {
    fontSize: 24 * SCALE,
    fontWeight: '700',
    color: colors.text,
    marginRight: 4 * SCALE,
  },
  amountInput: {
    fontSize: 24 * SCALE,
    fontWeight: '700',
    color: colors.text,
    minWidth: 60 * SCALE,
    padding: 0,
    flex: 1,
  },
  cardBottom: {
    justifyContent: 'flex-end',
  },
  noteSection: {
    width: '100%',
  },
  noteLabel: {
    fontSize: 10 * SCALE,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 6 * SCALE,
    letterSpacing: 0.3 * SCALE,
  },
  noteInput: {
    fontSize: 13 * SCALE,
    color: colors.text,
    padding: 8 * SCALE,
    minHeight: 60 * SCALE,
    borderWidth: 1,
    borderColor: colors.buttonSecondaryBorder,
    borderRadius: 8,
    textAlignVertical: 'top',
  },
  actionContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    paddingBottom: 20,
  },
  confirmButton: {
    marginTop: -40,
    marginBottom: 60,
    width: 200,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});
