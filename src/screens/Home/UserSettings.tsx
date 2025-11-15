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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigations/HomeStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserIcon from '../../assets/icons/user-solid-full.svg';
import ArrowUpIcon from '../../assets/icons/arrow-up.svg';
import { Button } from '../../components/ui/Button';
import { API_BASE } from '../../config';
import { useFocusEffect } from '@react-navigation/native';

type UserSettingsNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'UserSettings'>;

export default function UserSettings() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<UserSettingsNavigationProp>();
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [originalData, setOriginalData] = useState({ name: '', phone: '', email: '' });

  const fetchUserProfile = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('sessionToken');
      if (!userString || !token) return;
      
      const user = JSON.parse(userString);

      const response = await fetch(`${API_BASE}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUserName(data.name || '');
        setUserPhone(data.phone || '');
        setUserEmail(data.email || '');
        setOriginalData({ name: data.name, phone: data.phone, email: data.email });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserProfile();
    }, [])
  );

  const handleSaveProfile = async () => {
    if (!userName.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    if (!userPhone.trim()) {
      Alert.alert('Error', 'Phone number is required');
      return;
    }

    setIsLoading(true);

    try {
      const userDetails = await AsyncStorage.getItem('userDetails');
      if (!userDetails) throw new Error('User details not found');
      
      const parsed = JSON.parse(userDetails);
      const token = parsed.token;

      const response = await fetch(`${API_BASE}/api/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: userName,
          phone: userPhone,
          email: userEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      // Update local storage
      parsed.name = userName;
      parsed.phone = userPhone;
      parsed.email = userEmail;
      await AsyncStorage.setItem('userDetails', JSON.stringify(parsed));

      setOriginalData({ name: userName, phone: userPhone, email: userEmail });
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const userDetails = await AsyncStorage.getItem('userDetails');
              if (!userDetails) throw new Error('User details not found');
              
              const parsed = JSON.parse(userDetails);
              const token = parsed.token;

              const response = await fetch(`${API_BASE}/api/account/delete`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
              });

              const data = await response.json();

              if (!response.ok) {
                throw new Error(data.error || 'Failed to delete account');
              }

              await AsyncStorage.clear();
              Alert.alert('Account Deleted', 'Your account has been deleted successfully');
              // Navigation to login will happen automatically when AsyncStorage is cleared
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
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
          paddingBottom: insets.bottom + 40,
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

        <Button
          variant="primary"
          onPress={handleSaveProfile}
          style={{ marginTop: 8 }}
        >
          Save Changes
        </Button>
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
    // flexGrow removed to prevent excessive scrolling
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
    borderWidth: 2,
    borderColor: colors.buttonSecondaryBorder,
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
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.buttonSecondaryBorder,
    padding: 16,
    fontSize: 16,
    color: colors.text,
  },

  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 0,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.buttonSecondaryBorder,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.buttonSecondaryBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconEmoji: {
    fontSize: 24,
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
  dangerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.error,
    marginBottom: 16,
  },
  deleteButton: {
    backgroundColor: colors.error,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  logoutButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.error,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 20,
  },
});
