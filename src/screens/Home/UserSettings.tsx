import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { colors } from '../../theme/style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserIcon from '../../assets/icons/user-solid-full.svg';
import ArrowUpIcon from '../../assets/icons/arrow-up.svg';

export default function UserSettings() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userData = await AsyncStorage.getItem('userDetails');
      if (userData) {
        const parsed = JSON.parse(userData);
        setUserName(parsed.name || '');
        setUserPhone(parsed.phone || '');
        setUserEmail(parsed.email || '');
      }
    };
    fetchUserDetails();
  }, []);

  const handleSaveProfile = () => {
    Alert.alert('Success', 'Profile will be updated');
    // TODO: Implement backend API call
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Password change will be implemented');
    // TODO: Implement backend API call
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          // TODO: Navigate to login screen
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingTop: insets.top + 80,
          paddingBottom: insets.bottom + 120,
          paddingHorizontal: 24,
        },
      ]}
    >
      {/* Profile Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <UserIcon width={60} height={60} fill={colors.white} />
        </View>
        <Text style={styles.profileName}>{userName}</Text>
        <Text style={styles.profileSubtitle}>Manage your account</Text>
      </View>

      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Information</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={setUserName}
            placeholder="Enter your name"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={userPhone}
            onChangeText={setUserPhone}
            placeholder="Enter your phone"
            placeholderTextColor={colors.textSecondary}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={userEmail}
            onChangeText={setUserEmail}
            placeholder="Enter your email"
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>

      {/* Security Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={handleChangePassword}
        >
          <View style={styles.settingIcon}>
            <Text style={styles.iconEmoji}>🔒</Text>
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Change Password</Text>
            <Text style={styles.settingSubtitle}>Update your password</Text>
          </View>
          <ArrowUpIcon
            width={16}
            height={16}
            fill={colors.textSecondary}
            style={{ transform: [{ rotate: '90deg' }] }}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Text style={styles.iconEmoji}>🔐</Text>
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Two-Factor Authentication</Text>
            <Text style={styles.settingSubtitle}>Add extra security</Text>
          </View>
          <ArrowUpIcon
            width={16}
            height={16}
            fill={colors.textSecondary}
            style={{ transform: [{ rotate: '90deg' }] }}
          />
        </TouchableOpacity>
      </View>

      {/* Other Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Other</Text>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Text style={styles.iconEmoji}>🔔</Text>
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Notifications</Text>
            <Text style={styles.settingSubtitle}>Manage notifications</Text>
          </View>
          <ArrowUpIcon
            width={16}
            height={16}
            fill={colors.textSecondary}
            style={{ transform: [{ rotate: '90deg' }] }}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Text style={styles.iconEmoji}>💳</Text>
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Payment Methods</Text>
            <Text style={styles.settingSubtitle}>Manage cards & accounts</Text>
          </View>
          <ArrowUpIcon
            width={16}
            height={16}
            fill={colors.textSecondary}
            style={{ transform: [{ rotate: '90deg' }] }}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Text style={styles.iconEmoji}>ℹ️</Text>
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Help & Support</Text>
            <Text style={styles.settingSubtitle}>Get help</Text>
          </View>
          <ArrowUpIcon
            width={16}
            height={16}
            fill={colors.textSecondary}
            style={{ transform: [{ rotate: '90deg' }] }}
          />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconEmoji: {
    fontSize: 20,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 20,
  },
});
