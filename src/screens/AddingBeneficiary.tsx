import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/StackNavigator';
import { theme } from '../theme/theme';
import UserIcon from '../assets/icons/user-solid-full.svg';
import PhoneIcon from '../assets/icons/send.svg';
import IbanIcon from '../assets/icons/wallet.svg';
import NoteIcon from '../assets/icons/clipboard.svg';
import { useSelector } from 'react-redux';
import { selectToken } from '../slices/authSlice';
import { API_BASE } from '../config';

type Props = NativeStackScreenProps<RootStackParamList, 'AddingBeneficiary'>;

// A styled input component to match the SendMoney screen's aesthetic
const StyledInput = ({ label, value, onChangeText, placeholder, keyboardType, SvgIcon }: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputContainer}>
      <View style={styles.inputIcon}>
        <SvgIcon width={20} height={20} fill="#999" />
      </View>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType || 'default'}
        placeholderTextColor={'#999'}
        style={styles.input}
      />
    </View>
  </View>
);

export default function AddingBeneficiary({ navigation }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [iban, setIban] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector(selectToken);

  const validateInputs = () => {
    const phoneRegex = /^03\d{9}$/; // Regex for 03XXXXXXXXX format

    if (!phone.trim()) {
      Alert.alert('Validation Error', 'Phone Number is required.');
      return false;
    }

    if (!phoneRegex.test(phone.trim())) {
      Alert.alert('Validation Error', 'Phone Number format is invalid. It should be 03XXXXXXXXX (e.g., 03162993834).');
      return false;
    }

    // Name and IBAN are now optional
    return true;
  };

  const handleAddBeneficiary = async () => {
    if (!validateInputs()) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/add_beneficiary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          phone,
          iban,
          note,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // If the server returns an error (e.g., 400, 401, 500)
        // 'result.error' will contain the error message from your Flask backend
        throw new Error(result.error || 'An unknown error occurred.');
      }

      Alert.alert('Success', result.message || 'Beneficiary added successfully!');
      navigation.goBack();
    } catch (err: any) {
      console.error('Add Beneficiary Error:', err);
      // This will display the error message from the `throw new Error(...)` above
      Alert.alert('Failed to Add Beneficiary', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formCard}>
          <Text style={styles.title}>New Beneficiary</Text>
          <Text style={styles.subtitle}>
            Enter the details of the person you want to add to your list.
          </Text>

          <StyledInput
            label="Beneficiary Name"
            placeholder="e.g., John Doe"
            value={name}
            onChangeText={setName}
            SvgIcon={UserIcon}
          />

          <StyledInput
            label="Phone Number"
            placeholder="e.g., 03001234567"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            SvgIcon={PhoneIcon}
          />

          <StyledInput
            label="IBAN / Account Number"
            placeholder="e.g., PK12ABCD1234567890"
            value={iban}
            onChangeText={setIban}
            SvgIcon={IbanIcon}
          />

          <StyledInput
            label="Note (Optional)"
            placeholder="e.g., For monthly rent"
            value={note}
            onChangeText={setNote}
            SvgIcon={NoteIcon}
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleAddBeneficiary}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save Beneficiary'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Same as SendMoney
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    marginTop: 18,
    padding: 24,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6a6a6a',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA', // Light grey background for input
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 55,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },
  buttonContainer: {
    marginBottom: 34,
    padding: 24,
    backgroundColor: '#F8F9FA',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});