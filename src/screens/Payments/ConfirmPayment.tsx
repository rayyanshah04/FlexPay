import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Button } from '../../components/ui/Button';
import { RootStackParamList } from '../../navigations/StackNavigator';
import { colors } from '../../theme/style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UserIcon from '../../assets/icons/user-solid-full.svg';
import ArrowUpIcon from '../../assets/icons/arrow-up.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'ConfirmPayment'>;

const ConfirmPayment: React.FC<Props> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const {
    name = 'Muhammad Hussain',
    iban = 'PK12ABC1234567890',
    amount: initialAmount = '10,000',
    phone = '',
  } = route.params || {};

  // Extract phone number from IBAN if not provided directly
  const phoneNumber = phone || iban.replace(/^.*?(\d+)$/, '$1');

  const [amount, setAmount] = useState<string>(initialAmount.replace(' PKR', ''));
  const [note, setNote] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAmountChange = (text: string) => {
    // Remove non-numeric characters except commas and periods
    const cleaned = text.replace(/[^0-9.,]/g, '');
    setAmount(cleaned);
  };

  const handleConfirm = () => {
    if (!amount || amount === '0') {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Generate a transaction ID
      const transactionId = `TXN${Date.now().toString().slice(-10)}`;
      
      // Navigate to success screen
      navigation.navigate('PaymentSuccess', {
        name,
        amount,
        transactionId,
        phone: phoneNumber,
      });
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 100,
            paddingBottom: insets.bottom + 100,
            paddingHorizontal: 24,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.iconContainer}>
            <ArrowUpIcon width={36} height={36} fill={colors.white} style={{ transform: [{ rotate: '45deg' }] }} />
          </View>
          <Text style={styles.title}>Confirm Payment</Text>
          <Text style={styles.subtitle}>
            Review payment details before confirming
          </Text>
        </View>

        {/* Recipient Card */}
        <View style={styles.recipientCard}>
          <Text style={styles.sectionTitle}>Sending to</Text>
          <View style={styles.recipientInfo}>
            <View style={styles.avatar}>
              <UserIcon width={28} height={28} fill={colors.white} />
            </View>
            <View style={styles.recipientDetails}>
              <Text style={styles.recipientName}>{name}</Text>
              <Text style={styles.recipientIban}>{iban}</Text>
            </View>
          </View>
        </View>

        {/* Amount Card */}
        <View style={styles.amountCard}>
          <Text style={styles.sectionTitle}>Amount</Text>
          <View style={styles.amountDisplay}>
            <View style={styles.amountInputWrapper}>
              <Text style={styles.currencySymbol}>Rs.</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={handleAmountChange}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            <Text style={styles.amountLabel}>Pakistani Rupees</Text>
          </View>
        </View>

        {/* Note Section */}
        <View style={styles.noteSection}>
          <Text style={styles.sectionTitle}>Add Note (Optional)</Text>
          <View style={styles.noteInputWrapper}>
            <TextInput
              style={styles.noteInput}
              placeholder="Write a message..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              value={note}
              onChangeText={setNote}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Summary Details */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Transaction Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Transfer Amount</Text>
            <Text style={styles.summaryValue}>Rs. {amount}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Transaction Fee</Text>
            <Text style={styles.summaryValue}>Rs. 0.00</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>Rs. {amount}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomButtonContainer}>
        <Button
          variant="primary"
          onPress={handleConfirm}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Confirm & Send'}
        </Button>
      </View>
    </View>
  );
};

export default ConfirmPayment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  headerSection: {
    marginTop: -60,
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.success,
    borderWidth: 1,
    borderColor: colors.buttonSecondaryBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  recipientCard: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.buttonSecondaryBorder,
    marginBottom: 20,
  },
  recipientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  recipientDetails: {
    flex: 1,
  },
  recipientName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  recipientIban: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
  amountCard: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.buttonSecondaryBorder,
    marginBottom: 20,
  },
  amountDisplay: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  currencySymbol: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginRight: 6,
  },
  amountInput: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    minWidth: 80,
    maxWidth: 150,
    padding: 0,
  },
  amountLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  noteSection: {
    marginBottom: 20,
  },
  noteInputWrapper: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.buttonSecondaryBorder,
    padding: 16,
  },
  noteInput: {
    fontSize: 15,
    color: colors.text,
    minHeight: 100,
  },
  summarySection: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.buttonSecondaryBorder,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.buttonSecondaryBorder,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '600',
  },
  totalRow: {
    borderBottomWidth: 0,
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: colors.buttonSecondaryBorder,
  },
  totalLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: '700',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 40,
    backgroundColor: colors.Background,
  },
});
