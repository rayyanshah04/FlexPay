import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../theme/style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/ui/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../../config';
import ShowIcon from '../../assets/icons/show.svg';
import HideIcon from '../../assets/icons/hide.svg';

export default function ChangePasswordScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const userDetails = await AsyncStorage.getItem('userDetails');
      if (!userDetails) throw new Error('User details not found');
      const parsed = JSON.parse(userDetails);
      const token = parsed.token;

      const response = await fetch(`${API_BASE}/api/password/change`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      Alert.alert('Success', 'Password changed successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
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
            <Text style={styles.iconEmoji}>🔒</Text>
          </View>
          <Text style={styles.title}>Change Password</Text>
          <Text style={styles.subtitle}>
            Enter your current and new password
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.section}>
          {/* Old Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Enter current password"
                value={oldPassword}
                onChangeText={setOldPassword}
                placeholderTextColor={colors.textSecondary}
                style={styles.input}
                secureTextEntry={!showOldPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? (
                  <ShowIcon width={20} height={20} fill={colors.textSecondary} />
                ) : (
                  <HideIcon width={20} height={20} fill={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* New Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={setNewPassword}
                placeholderTextColor={colors.textSecondary}
                style={styles.input}
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <ShowIcon width={20} height={20} fill={colors.textSecondary} />
                ) : (
                  <HideIcon width={20} height={20} fill={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.helperText}>
              Password must be at least 6 characters
            </Text>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm New Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholderTextColor={colors.textSecondary}
                style={styles.input}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <ShowIcon width={20} height={20} fill={colors.textSecondary} />
                ) : (
                  <HideIcon width={20} height={20} fill={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomButtonContainer}>
        <Button
          variant="primary"
          onPress={handleChangePassword}
          disabled={isLoading}
        >
          {isLoading ? 'Changing...' : 'Change Password'}
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
  scrollContent: {
    paddingBottom: 120,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.buttonSecondaryBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconEmoji: {
    fontSize: 36,
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
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
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  eyeIcon: {
    padding: 4,
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 6,
    opacity: 0.7,
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
