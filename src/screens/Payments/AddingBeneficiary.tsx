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
import { RootStackParamList } from '../../navigations/StackNavigator';
import { theme } from '../../theme/theme';
import UserIcon from '../../assets/icons/user-solid-full.svg';
import PhoneIcon from '../../assets/icons/send.svg';
import IbanIcon from '../../assets/icons/wallet.svg';
import NoteIcon from '../../assets/icons/clipboard.svg';
import { useSelector } from 'react-redux';
import { selectToken } from '../../slices/authSlice';
import { API_BASE } from '../../config';

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
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector(selectToken);

  const phoneRegex = /^03\d{9}$/;
  const ibanRegex = /^PK04FLXP0000003\d{9}$/;

  // Validation function
  const isPhoneOrIbanValid = (input: string) => {
    if (!input.trim()) return null; // Empty input (not validated yet)
    return phoneRegex.test(input) || ibanRegex.test(input);
  };

  const phoneValidationStatus = isPhoneOrIbanValid(phone);

  const validateInputs = () => {
    const trimmedInput = phone.trim();

    if (!trimmedInput) {
      Alert.alert('Validation Error', 'Phone Number/IBAN is required.');
      return false;
    }

    if (!phoneRegex.test(trimmedInput) && !ibanRegex.test(trimmedInput)) {
      Alert.alert(
        'Validation Error',
        'Invalid format. Use 03XXXXXXXXX for phone or PK04FLXP0000003XXXXXXXXX for IBAN (8 digits only at end).'
      );
      return false;
    }
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
          iban_or_number: phone,
          note,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'An unknown error occurred.');
      }

      Alert.alert('Success', result.message || 'Beneficiary added successfully!');
      navigation.goBack();
    } catch (err: any) {
      console.error('Add Beneficiary Error:', err);
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number / IBAN</Text>
            <Text style={styles.formatText}>
              Phone: 03XXXXXXXXX (11 DIGITS){'\n'}IBAN: PK04FLXP0000003XXXXXXXXX (24 DIGITS)
            </Text>
            <View
              style={[
                styles.inputContainer,
                phoneValidationStatus === false && styles.inputContainerError,
              ]}
            >
              <View style={styles.inputIcon}>
                <PhoneIcon width={20} height={20} fill="#999" />
              </View>
              <TextInput
                placeholder="Phone/IBAN"
                value={phone}
                onChangeText={setPhone}
                keyboardType="default"
                placeholderTextColor={'#999'}
                style={styles.input}
              />
            </View>
            {phoneValidationStatus === false && (
              <Text style={styles.errorText}>Invalid Phone or IBAN format</Text>
            )}
            {phoneValidationStatus === true && (
              <Text style={styles.successText}>✓ Valid format</Text>
            )}
          </View>

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
    backgroundColor: '#F8F9FA',
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
    marginTop: 28,
    padding: 24,
    elevation: 2,
    shadowColor: '#000',
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
  formatText: {
    fontSize: 12,
    color: '#6a6a6a',
    marginBottom: 12,
    textAlign: 'left',
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
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 55,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  inputContainerError: {
    borderColor: '#FF4444',
    borderWidth: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },
  errorText: {
    fontSize: 12,
    color: '#FF4444',
    marginTop: 6,
    fontWeight: '500',
  },
  successText: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 6,
    fontWeight: '500',
  },
  buttonContainer: {
    marginBottom: 64,
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