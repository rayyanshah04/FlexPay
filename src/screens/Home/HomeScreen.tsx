import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { login } from '../../slices/authSlice';
// icons
import UserIcon from '../../assets/icons/user-solid-full.svg';
import StarIcon from '../../assets/icons/star.svg';
import ShowIcon from '../../assets/icons/show.svg';
import HideIcon from '../../assets/icons/hide.svg';
import ArrowUpIcon from '../../assets/icons/arrow-up.svg';
import ArrowDownIcon from '../../assets/icons/arrow-down.svg';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { Button } from '../../components/ui/Button';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigations/HomeStack';
import { API_BASE } from '../../config';
type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'HomeMain'
>;

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const [userName, setUserName] = useState('User');
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
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
        method: 'POST', // Changed to POST
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
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem('userDetails');
      if (userData) {
        const parsed = JSON.parse(userData);
        setUserName(parsed.name || 'User');
        dispatch(login(parsed));
      }
    };
    fetchUser();
  }, [dispatch]);

  useFocusEffect(
    React.useCallback(() => {
      fetchBalance();
      fetchHasCard();
    }, [])
  );

  const transactions = [
    {
      id: 1,
      name: 'Dribble',
      time: 'Today, 15:10',
      amount: '-$149.00',
      type: 'transfer',
      icon: '🎯',
    },
    {
      id: 2,
      name: 'Trent Bolt',
      time: 'Yesterday, 09:45',
      amount: '+$74.00',
      type: 'received',
      icon: '⚡',
    },
    {
      id: 3,
      name: 'Apple Services',
      time: 'Yesterday, 05:10',
      amount: '-$12.00',
      type: 'transfer',
      icon: '🍎',
    },
    {
      id: 4,
      name: 'Ryne LTD',
      time: '2 Aug, 09:11',
      amount: '-$18.00',
      type: 'transfer',
      icon: '🚀',
    },
  ];

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
        navigation.navigate(hasCard ? 'CardScreen' : 'NoCardScreen')
      }
      style={styles.balanceCardWrapper}
    >
      <ImageBackground
        source={require('../../assets/bg.png')}
        style={styles.gradientCard}
        imageStyle={{
          resizeMode: 'contain',
          transform: [{ rotate: '90deg' }, { scaleX: -1 }, { scale: 3 }],
          right: 120,
          top: 10,
        }}
        resizeMode="contain"
      >
        <View style={styles.balanceContent}>
          <View style={styles.balanceTitleContainer}>
            <Text style={styles.balanceTitle}>Total Balance</Text>
            <TouchableOpacity
              onPress={() => setIsBalanceVisible(!isBalanceVisible)}
            >
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
                ? `Rs. ${new Intl.NumberFormat('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(balance)}`
                : '...'
              : '******'}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>

    {/* Actions */}
    <View style={styles.actionsContainer}>
      <Button
        variant="primary"
        icon={() => <ArrowUpIcon width={20} height={20} fill={colors.white} />}
        onPress={() => navigation.navigate('SendMoney')}
        style={{ width: 160, marginHorizontal: 2 }}
      >
        SEND
      </Button>

      <Button
        variant="white"
        icon={() => <ArrowDownIcon width={20} height={20} fill={colors.black} />}
        onPress={() => navigation.navigate('PaymentScreen')}
        style={{ width: 160, marginHorizontal: 2 }}
      >
        RECEIVE
      </Button>
    </View>

    {/* Recent Transactions */}
    <View style={styles.transactionSection}>
      <View style={styles.transactionHeader}>
        <Text style={styles.transactionTitle}>Transaction</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.transactionList}>
        {transactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View style={styles.transactionIconContainer}>
              <View style={styles.transactionIcon}>
                <Text style={styles.iconEmoji}>{transaction.icon}</Text>
              </View>
            </View>

            <View style={styles.transactionContent}>
              <Text style={styles.transactionName}>{transaction.name}</Text>
              <Text style={styles.transactionTime}>{transaction.time}</Text>
            </View>

            <View style={styles.transactionRight}>
              <Text
                style={[
                  styles.transactionAmount,
                  {
                    color:
                      transaction.type === 'received'
                        ? colors.success
                        : colors.text,
                  },
                ]}
              >
                {transaction.amount}
              </Text>
              <Text style={styles.transactionType}>
                {transaction.type === 'received' ? 'Received' : 'Transfer'}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  </ScrollView>
);

};
export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    flex: 1,
    backgroundColor: colors.Background,
  },
  scrollContent: { 
    padding: 24,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    maxWidth: 250,
  },
  greetingSubtitle: { fontSize: 16, color: colors.textSecondary, marginTop: 4 },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCardWrapper: {
    marginBottom: 32,
    borderRadius: 20,
    overflow: 'hidden',
    minHeight: 180,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: { elevation: 10 },
    }),
  },
  gradientCard: { flex: 1, padding: 28, justifyContent: 'space-between' },
  balanceTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  balanceContent: { position: 'relative', zIndex: 10 },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    marginTop: -12,
  },
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
      ios: {
        shadowColor: colors.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: { elevation: 5 },
    }),
  },
  actionLabel: { fontSize: 14, fontWeight: '500', color: colors.text },
  transactionSection: {
    marginTop: 8,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  transactionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  seeAll: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  transactionList: {
    backgroundColor: 'transparent',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  transactionIconContainer: {
    marginRight: 12,
  },
  transactionIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: 24,
  },
  transactionContent: {
    flex: 1,
    justifyContent: 'center',
  },
  transactionName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  transactionTime: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '400',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  transactionType: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '400',
  },
});