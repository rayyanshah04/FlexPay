import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigations/StackNavigator';
import { colors } from '../../theme/style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UserIcon from '../../assets/icons/user-solid-full.svg';
import PhoneIcon from '../../assets/icons/send.svg';
import NoteIcon from '../../assets/icons/clipboard.svg';
import { useSelector } from 'react-redux';
import { selectSessionToken } from '../../slices/authSlice';
import { API_BASE } from '../../config';
import { Button } from '../../components/ui/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'AddingBeneficiary'>;

export default function AddingBeneficiary({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();

  // Get prefilled data from route params (from QR scan)
  const prefilledName = route?.params?.prefilledName || '';
  const prefilledPhone = route?.params?.prefilledPhone || '';

  const [name, setName] = useState(prefilledName);
  const [phone, setPhone] = useState(prefilledPhone);
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector(selectSessionToken);

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
        throw new Error(result.error || result.message || 'An unknown error occurred.');
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
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 80,
            paddingBottom: insets.bottom + 180,
            paddingHorizontal: 24,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconEmoji}>👤</Text>
          </View>
          <Text style={styles.title}>Add New Beneficiary</Text>
          <Text style={styles.subtitle}>
            Save contact details for quick and easy payments
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Beneficiary Information</Text>

          {/* Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconContainer}>
                <UserIcon width={18} height={18} fill={colors.textSecondary} />
              </View>
              <TextInput
                placeholder="Enter beneficiary name"
                value={name}
                onChangeText={setName}
                placeholderTextColor={colors.textSecondary}
                style={styles.input}
              />
            </View>
          </View>

          {/* Phone/IBAN Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number / IBAN</Text>
            <Text style={styles.helperText}>
              Phone: 03XXXXXXXXX (11 digits){'\n'}
              IBAN: PK04FLXP0000003XXXXXXXXX (24 digits)
            </Text>
            <View
              style={[
                styles.inputWrapper,
                phoneValidationStatus === false && styles.inputWrapperError,
              ]}
            >
              <View style={styles.inputIconContainer}>
                <PhoneIcon width={18} height={18} fill={colors.textSecondary} />
              </View>
              <TextInput
                placeholder="Enter phone or IBAN"
                value={phone}
                onChangeText={setPhone}
                keyboardType="default"
                placeholderTextColor={colors.textSecondary}
                style={styles.input}
              />
            </View>
            {phoneValidationStatus === false && (
              <Text style={styles.errorText}>⚠ Invalid format</Text>
            )}
            {phoneValidationStatus === true && (
              <Text style={styles.successText}>✓ Valid format</Text>
            )}
          </View>

          {/* Note Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Note (Optional)</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconContainer}>
                <NoteIcon width={18} height={18} fill={colors.textSecondary} />
              </View>
              <TextInput
                placeholder="Add a note (e.g., Monthly rent)"
                value={note}
                onChangeText={setNote}
                placeholderTextColor={colors.textSecondary}
                style={styles.input}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomButtonContainer}>
        <Button
          variant="primary"
          onPress={handleAddBeneficiary}
          disabled={isLoading}
          style={styles.saveButton}
        >
          {isLoading ? 'Adding...' : 'Add Beneficiary'}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

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
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.buttonSecondaryBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconEmoji: {
    fontSize: 40,
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
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
    opacity: 0.7,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.buttonSecondaryBorder,
    paddingHorizontal: 16,
    height: 55,
  },
  inputWrapperError: {
    borderColor: colors.error,
    borderWidth: 1.5,
  },
  inputIconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 6,
    fontWeight: '500',
  },
  successText: {
    fontSize: 12,
    color: colors.success,
    marginTop: 6,
    fontWeight: '500',
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
  saveButton: {
    marginTop: 0,
  },
});