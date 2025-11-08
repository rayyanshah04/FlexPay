import LinearGradient from 'react-native-linear-gradient';

// for username //
import React, { useState, useEffect } from 'react';
import { loadUserName } from '../utils/user.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { login } from '../slices/authSlice';


//icons import
import UserIcon from '../assets/icons/user-solid-full.svg';
import SendIcon from '../assets/icons/send.svg';
import ReceiveIcon from '../assets/icons/receive.svg';
import WalletIcon from '../assets/icons/wallet.svg';
import ScanIcon from '../assets/icons/scan.svg';
import StarIcon from '../assets/icons/star.svg';
import ShowIcon from '../assets/icons/show.svg';
import HideIcon from '../assets/icons/hide.svg';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { theme, meshGradientBackground } from '../theme/theme';

import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigations/HomeStack';

const api = {
  call: (detail: string) => {
    if (detail === 'name') {
      return 'John Doe';
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greetingTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222222',
    maxWidth: 250,
  },
  greetingSubtitle: {
    fontSize: 16,
    color: '#6a6a6a',
    marginTop: 4,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  balanceCard: {
    padding: 28,
    borderRadius: 20,
    marginBottom: 32,
    minHeight: 180,
    justifyContent: 'space-between',
  },
  gradientCard: {
    padding: 28,
    borderRadius: 20,
    marginBottom: 32,
    minHeight: 180,
    justifyContent: 'space-between',
  },
  balanceTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
  balanceContent: {
    position: 'relative',
    zIndex: 10,
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
    marginTop: 16,
  },
  actionItem: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222222',
  },
  transactionBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 4,
        borderColor: '#f0f0f0',
        borderWidth: 1,
      },
    }),
  },
  transactionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  transactionIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: `${theme.colors.accent}`, // Using accent color with opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  transactionDate: {
    fontSize: 14,
    color: '#6a6a6a',
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
});

type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'HomeMain'
>;

const ActionButton = ({ SvgComponent, label, onPress }: any) => (
  <TouchableOpacity style={styles.actionItem} onPress={onPress}>
    <View style={styles.actionIcon}>
      <SvgComponent width={28} height={28} fill="white" />
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [userName, setUserName] = useState('User'); // <-- add this

  const [isBalanceVisible, setIsBalanceVisible] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem('userDetails');
      if (userData) {
        const parsed = JSON.parse(userData);

        // Save to local state
        setUserName(parsed.name || 'User');

        // Save to Redux so other screens can access
        dispatch(login(parsed));
      }

    };
    fetchUser();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingTitle}>Hi, {userName}</Text>
          <Text style={styles.greetingSubtitle}>Welcome back</Text>
        </View>
        <View style={styles.profilePic}>
          <UserIcon width={30} height={30} fill="white" />
        </View>
      </View>

      {/* Balance Card */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('CardScreen')}
      >
        <View style={[styles.gradientCard, styles.shadow, meshGradientBackground.container]}>
          {meshGradientBackground.gradients.map((gradient, index) => (
            <LinearGradient
              key={index}
              colors={gradient.colors}
              start={gradient.start}
              end={gradient.end}
              style={meshGradientBackground.gradientLayer}
            />
          ))}
          <View style={styles.balanceContent}>
            <View style={styles.balanceTitleContainer}>
              <Text style={styles.balanceTitle}>Total Balance</Text>
              <TouchableOpacity onPress={() => setIsBalanceVisible(!isBalanceVisible)}>
                {isBalanceVisible ? <ShowIcon width={24} height={24} fill="white" /> : <HideIcon width={24} height={24} fill="white" />}
              </TouchableOpacity>
            </View>
            <Text style={styles.balanceAmount}>
              {isBalanceVisible ? 'Rs. 1,234.56' : '******'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <ActionButton
          SvgComponent={SendIcon}
          label="Send"
          onPress={() => navigation.navigate('SendMoney')}
        />
        <ActionButton
          SvgComponent={ReceiveIcon}
          label="Receive"
          onPress={() => navigation.navigate('PaymentScreen')}
        />
        <ActionButton
          SvgComponent={WalletIcon}
          label="Load"
          onPress={() => navigation.navigate('LoadMoneyScreen')}
        />
        <ActionButton
          SvgComponent={ScanIcon}
          label="Scan"
          onPress={() => navigation.navigate('QRCodeScreen')}
        />
      </View>

      {/* Recent Transactions */}
      <View style={styles.transactionBox}>
        <Text style={styles.transactionTitle}>Recent Transactions</Text>
        <View style={styles.transactionItem}>
          <View style={styles.transactionIcon}>
            <StarIcon width={24} height={24} fill={theme.colors.primary} />
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionName}>Starbucks</Text>
            <Text style={styles.transactionDate}>July 20, 2024</Text>
          </View>
          <Text style={styles.transactionAmount}>-Rs.5.75</Text>
        </View>
        <View style={styles.transactionItem}>
          <View style={styles.transactionIcon}>
            <UserIcon width={20} height={20} fill={theme.colors.primary} />
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionName}>From John</Text>
            <Text style={styles.transactionDate}>July 19, 2024</Text>
          </View>
          <Text style={[styles.transactionAmount, { color: 'green' }]}>+Rs.500.00</Text>
        </View>
      </View>
    </ScrollView>
  );

};
export default HomeScreen;