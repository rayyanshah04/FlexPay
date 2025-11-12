import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { login } from '../../slices/authSlice';
// icons
import UserIcon from '../../assets/icons/user-solid-full.svg';
import SendIcon from '../../assets/icons/send.svg';
import ReceiveIcon from '../../assets/icons/receive.svg';
import WalletIcon from '../../assets/icons/wallet.svg';
import ScanIcon from '../../assets/icons/scan.svg';
import StarIcon from '../../assets/icons/star.svg';
import ShowIcon from '../../assets/icons/show.svg';
import HideIcon from '../../assets/icons/hide.svg';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Platform,
  RefreshControl,
  ImageBackground,
} from 'react-native';
import { colors } from '../../theme/style';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigations/HomeStack';
import { API_BASE } from '../../config';
type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'HomeMain'
>;
const ActionButton = ({ SvgComponent, label, onPress }: any) => (
  <TouchableOpacity style={styles.actionItem} onPress={onPress}>
    <View style={styles.actionIcon}>
      <SvgComponent width={28} height={28} fill={colors.white} />
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);
const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation
    <HomeScreenNavigationProp>
    ();
  const [userName, setUserName] = useState('User');
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const [balance, setBalance] = useState
    <number | null>
    (null);
  const [refreshing, setRefreshing] = useState(false);
  const [hasCard, setHasCard] = useState(false);
  const fetchBalance = async () => {
    try {
      const userDetails = await AsyncStorage.getItem('userDetails');
      if (!userDetails) throw new Error('User details not found');
      const parsed = JSON.parse(userDetails);
      const token = parsed.token;
      if (!token) throw new Error('Auth token not found');
      const response = await fetch(`${API_BASE}/api/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch balance');
      const data = await response.json();
      setBalance(data.balance);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchHasCard = async () => {
    try {
      const userDetails = await AsyncStorage.getItem('userDetails');
      if (!userDetails) throw new Error('User details not found');
      const parsed = JSON.parse(userDetails);
      const token = parsed.token;
      if (!token) throw new Error('Auth token not found');
      const response = await fetch(`${API_BASE}/api/has_card`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch has_card');
      const data = await response.json();
      setHasCard(data.has_card);
    } catch (err) {
      console.error(err);
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    fetchBalance().finally(() => setRefreshing(false));
  };
  useEffect(() => {
    const fetchUserAndBalance = async () => {
      const userData = await AsyncStorage.getItem('userDetails');
      if (userData) {
        const parsed = JSON.parse(userData);
        setUserName(parsed.name || 'User');
        dispatch(login(parsed));
      }
      await fetchBalance();
      await fetchHasCard();
    };
    fetchUserAndBalance();
  }, [dispatch]);
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingTitle}>Hi, {userName}</Text>
          <Text style={styles.greetingSubtitle}>Welcome back</Text>
        </View>
        <View style={styles.profilePic}>
          <UserIcon width={30} height={30} fill={colors.white} />
        </View>
      </View>
      {/* Balance Card */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate(hasCard ? 'CardScreen' : 'NoCardScreen')}
        style={styles.balanceCardWrapper}
      >
        <ImageBackground source={require('../../assets/bg.png')} style={styles.gradientCard} imageStyle={{ resizeMode: 'contain', transform: [{ rotate: '90deg' }, { scaleX: -1 }, { scale: 3 }], right: 120, top: 10, }} resizeMode="contain" >
          <View style={styles.balanceContent}>
            <View style={styles.balanceTitleContainer}>
              <Text style={styles.balanceTitle}>Total Balance</Text>
              <TouchableOpacity onPress={() =>
                setIsBalanceVisible(!isBalanceVisible)}>
                {isBalanceVisible ? (
                  <ShowIcon width={24} height={24} fill={colors.white} />
                ) : (
                  <HideIcon width={24} height={24} fill={colors.white} />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.balanceAmount}>
              {isBalanceVisible
                ? balance !== null
                  ? `Rs. ${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(balance)}`
                  : '...'
                : '******'}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
      {/* Actions */}
      <View style={styles.actionsContainer}>
        <ActionButton SvgComponent={SendIcon} label="Send" onPress={() =>
          navigation.navigate('SendMoney')} />
        <ActionButton SvgComponent={ReceiveIcon} label="Receive" onPress={() =>
          navigation.navigate('PaymentScreen')} />
        <ActionButton SvgComponent={WalletIcon} label="Load" onPress={() =>
          navigation.navigate('LoadMoneyScreen')} />
        <ActionButton SvgComponent={ScanIcon} label="Scan" onPress={() =>
          navigation.navigate('QRCodeScreen')} />
      </View>
      {/* Recent Transactions */}
      <View style={styles.transactionBox}>
        <Text style={styles.transactionTitle}>Recent Transactions</Text>
        <View style={styles.transactionItem}>
          <View style={styles.transactionIcon}>
            <StarIcon width={24} height={24} fill={colors.primary} />
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionName}>Starbucks</Text>
            <Text style={styles.transactionDate}>July 20, 2024</Text>
          </View>
          <Text style={[styles.transactionAmount, { color: colors.textDark }]}>-Rs.5.75</Text>
        </View>
        <View style={styles.transactionItem}>
          <View style={styles.transactionIcon}>
            <UserIcon width={20} height={20} fill={colors.primary} />
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionName}>From John</Text>
            <Text style={styles.transactionDate}>July 19, 2024</Text>
          </View>
          <Text style={[styles.transactionAmount, { color: colors.success }]}>+Rs.500.00</Text>
        </View>
      </View>
    </ScrollView>
  );
};
export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: colors.Background, // dark background
  },
  scrollContent: { padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  greetingTitle: { fontSize: 24, fontWeight: '700', color: colors.text, maxWidth: 250 },
  greetingSubtitle: { fontSize: 16, color: colors.textSecondary, marginTop: 4 },
  profilePic: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.secondary, justifyContent: 'center', alignItems: 'center' },
  balanceCardWrapper: {
    marginBottom: 32,
    borderRadius: 20,
    overflow: 'hidden',
    minHeight: 180,
    ...Platform.select({
      ios: { shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12 },
      android: { elevation: 10 },
    }),
  },
  gradientCard: { flex: 1, padding: 28, justifyContent: 'space-between' },
  balanceTitleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceTitle: { fontSize: 16, fontWeight: '500', color: colors.textSecondary },
  balanceAmount: { fontSize: 36, fontWeight: '700', color: colors.text, marginTop: 8 },
  balanceContent: { position: 'relative', zIndex: 10 },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 32, marginTop: -4 },
  actionItem: { alignItems: 'center' },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    ...Platform.select({
      ios: { shadowColor: colors.secondary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5 },
      android: { elevation: 5 },
    }),
  },
  actionLabel: { fontSize: 14, fontWeight: '500', color: colors.text },
  transactionBox: {
    backgroundColor: colors.frostedBg,
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: { shadowColor: colors.text, shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 4, borderColor: colors.frostedBorder, borderWidth: 1 },
    }),
  },
  transactionTitle: { fontSize: 20, fontWeight: '600', marginBottom: 16, color: colors.text },
  transactionItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.frostedBorder },
  transactionIcon: { width: 45, height: 45, borderRadius: 12, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  transactionDetails: { flex: 1 },
  transactionName: { fontSize: 16, fontWeight: '600', color: colors.text },
  transactionDate: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  transactionAmount: { fontSize: 16, fontWeight: '600', color: colors.text },
});