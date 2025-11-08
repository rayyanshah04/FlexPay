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
import { Button } from '../components/ui/Button';
import { RootStackParamList } from '../navigations/StackNavigator';

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
          style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
        >
          <FontAwesome name="user" size={24} color="#fff" />
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
          placeholderTextColor="#aaa"
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#222',
    marginBottom: 25,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
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
    color: '#222',
  },
  userIban: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  amountBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  amountLabel: {
    fontSize: 15,
    color: '#777',
    marginBottom: 6,
  },
  amountValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
  },
  noteContainer: {
    marginTop: 25,
  },
  noteLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 12,
    fontSize: 15,
    color: '#333',
    height: 120,
  },
  confirmButton: {
    backgroundColor: '#0871B3',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 35,
    alignItems: 'center',
    shadowColor: '#0871B3',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 5,
  },
  confirmText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
