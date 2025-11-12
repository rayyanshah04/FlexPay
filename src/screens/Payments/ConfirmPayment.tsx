import FontAwesome from '@react-native-vector-icons/fontawesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { Button } from '../../components/ui/Button';
import { RootStackParamList } from '../../navigations/StackNavigator';
import { colors } from '../../theme/style';

type Props = NativeStackScreenProps<RootStackParamList, 'ConfirmPayment'>;

const ConfirmPayment: React.FC<Props> = ({ route, navigation }) => {
  const {
    name = 'Muhammad Hussain',
    iban = 'PK12ABC1234567890',
    amount = '10,000 PKR',
  } = route.params || {};

  const theme = useTheme();
  const [note, setNote] = useState<string>('');

  const handleConfirm = () => {
    Alert.alert('✅ Payment Confirmed', `You have sent ${amount} to ${name}.`, [
      { text: 'OK', onPress: () => navigation.navigate('AppTabs') },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>Confirm Payment</Text>

      {/* Recipient Summary Card */}
      <View style={styles.summaryCard}>
        <View
          style={[styles.avatar, { backgroundColor: colors.primary }]}
        >
          <FontAwesome name="user" size={24} color={colors.white} />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userIban}>{iban}</Text>
        </View>
      </View>

      {/* Amount Section */}
      <View style={styles.amountBox}>
        <Text style={styles.amountLabel}>Amount</Text>
        <Text style={styles.amountValue}>{amount}</Text>
      </View>

      {/* Note Section */}
      <View style={styles.noteContainer}>
        <Text style={styles.noteLabel}>Add a Note (optional)</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Write a short message..."
          placeholderTextColor={colors.placeholder}
          multiline
          numberOfLines={4}
          value={note}
          onChangeText={setNote}
          textAlignVertical="top"
        />
      </View>

      <Button onPress={handleConfirm}>
        <Text style={styles.confirmText}>Confirm Payment</Text>
      </Button>
    </KeyboardAvoidingView>
  );
};

export default ConfirmPayment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 25,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    shadowColor: colors.textDark,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textDark,
  },
  userIban: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  amountBox: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
    shadowColor: colors.textDark,
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  amountLabel: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  amountValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textDark,
  },
  noteContainer: {
    marginTop: 25,
  },
  noteLabel: {
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.frostedBorder,
    padding: 12,
    fontSize: 15,
    color: colors.textDark,
    height: 120,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 35,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 5,
  },
  confirmText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
});
