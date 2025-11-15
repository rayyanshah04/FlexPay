import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Alert,
} from 'react-native';
import { colors } from '../../theme/style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigations/StackNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../slices/authSlice';
import UserIcon from '../../assets/icons/user-solid-full.svg';
import ArrowUpIcon from '../../assets/icons/arrow-up.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../../config';

type MoreScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AppTabs'
>;

const MoreScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<MoreScreenNavigationProp>();
  const dispatch = useDispatch();
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('user@example.com');

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
        setUserName(data.name || 'User');
        setUserEmail(data.email || 'user@example.com');
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

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          dispatch(logoutUser());
          navigation.reset({
            index: 0,
            routes: [{ name: 'Welcome' }],
          });
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
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 120,
          paddingHorizontal: 24,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>More</Text>
      </View>

      {/* Profile Card */}
      <TouchableOpacity
        style={styles.profileCard}
        onPress={() => {
          // @ts-ignore - Navigate to UserSettings in HomeStack
          navigation.navigate('Home', { screen: 'UserSettings' });
        }}
      >
        <View style={styles.avatar}>
          <UserIcon width={40} height={40} fill={colors.white} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{userName}</Text>
          <Text style={styles.profileEmail}>{userEmail}</Text>
        </View>
        <ArrowUpIcon
          width={16}
          height={16}
          fill={colors.textSecondary}
          style={{ transform: [{ rotate: '90deg' }] }}
        />
      </TouchableOpacity>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            // @ts-ignore
            navigation.navigate('Home', { screen: 'CardScreen' });
          }}
        >
          <View style={styles.menuIcon}>
            <Text style={styles.iconEmoji}>💳</Text>
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>My Cards</Text>
            <Text style={styles.menuSubtitle}>View & manage your cards</Text>
          </View>
          <ArrowUpIcon
            width={16}
            height={16}
            fill={colors.textSecondary}
            style={{ transform: [{ rotate: '90deg' }] }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            // @ts-ignore
            navigation.navigate('Home', { screen: 'SendMoney' });
          }}
        >
          <View style={styles.menuIcon}>
            <Text style={styles.iconEmoji}>💸</Text>
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Send Money</Text>
            <Text style={styles.menuSubtitle}>Transfer to anyone</Text>
          </View>
          <ArrowUpIcon
            width={16}
            height={16}
            fill={colors.textSecondary}
            style={{ transform: [{ rotate: '90deg' }] }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            // @ts-ignore
            navigation.navigate('Home', { screen: 'QRCodeScreen' });
          }}
        >
          <View style={styles.menuIcon}>
            <Text style={styles.iconEmoji}>📷</Text>
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Scan QR Code</Text>
            <Text style={styles.menuSubtitle}>Quick payment</Text>
          </View>
          <ArrowUpIcon
            width={16}
            height={16}
            fill={colors.textSecondary}
            style={{ transform: [{ rotate: '90deg' }] }}
          />
        </TouchableOpacity>
      </View>

      {/* Developer Tools */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔧 Developer Tools</Text>

        <TouchableOpacity
          style={[styles.menuItem, styles.testMenuItem]}
          onPress={() => {
            // @ts-ignore
            navigation.navigate('Home', { screen: 'TestNotification' });
          }}
        >
          <View style={styles.menuIcon}>
            <Text style={styles.iconEmoji}>🔔</Text>
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Test Notifications</Text>
            <Text style={styles.menuSubtitle}>Test push notifications</Text>
          </View>
          <ArrowUpIcon
            width={16}
            height={16}
            fill={colors.textSecondary}
            style={{ transform: [{ rotate: '90deg' }] }}
          />
        </TouchableOpacity>
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <Text style={styles.iconEmoji}>❓</Text>
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Help Center</Text>
            <Text style={styles.menuSubtitle}>Get help & support</Text>
          </View>
          <ArrowUpIcon
            width={16}
            height={16}
            fill={colors.textSecondary}
            style={{ transform: [{ rotate: '90deg' }] }}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <Text style={styles.iconEmoji}>ℹ️</Text>
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>About FlexPay</Text>
            <Text style={styles.menuSubtitle}>Version 1.0.0</Text>
          </View>
          <ArrowUpIcon
            width={16}
            height={16}
            fill={colors.textSecondary}
            style={{ transform: [{ rotate: '90deg' }] }}
          />
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 12,
    marginBottom: 32,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: colors.buttonSecondaryBorder,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  profileEmail: {
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.buttonSecondaryBorder,
  },
  testMenuItem: {
    backgroundColor: 'rgba(93, 163, 250, 0.1)',
    paddingHorizontal: 12,
    borderRadius: 12,
    borderBottomWidth: 0,
  },
  menuIcon: {
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
    fontSize: 20,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  logoutButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.error,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
});

export default MoreScreen;
