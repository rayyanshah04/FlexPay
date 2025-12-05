import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  RefreshControl,
  Platform,
  StyleSheet,
} from 'react-native';
import api from '../../utils/api';
import { selectUser } from '../../slices/authSlice';
import NotificationService from '../../utils/NotificationService';
import { colors } from '../../theme/style';
import { Button } from '../../components/ui/Button';
import UserIcon from '../../assets/icons/user-solid-full.svg';
import ShowIcon from '../../assets/icons/show.svg';
import HideIcon from '../../assets/icons/hide.svg';
import ArrowUpIcon from '../../assets/icons/arrow-up.svg';
import ArrowDownIcon from '../../assets/icons/arrow-down.svg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigations/HomeStack';

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'HomeMain'>;


const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const user = useSelector(selectUser);
  const [userName, setUserName] = useState('User');
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [hasCard, setHasCard] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const previousBalance = useRef<number | null>(null);

  const fetchBalance = async () => {
    try {
      const response = await api('/api/balance');
      if (!response.ok) throw new Error('Failed to fetch balance');
      const data = await response.json();

      if (previousBalance.current !== null && data.balance > previousBalance.current) {
        const difference = data.balance - previousBalance.current;
        NotificationService.transactionNotification('received', difference.toFixed(2), 'Someone');
      }

      previousBalance.current = data.balance;
      setBalance(data.balance);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHasCard = async () => {
    try {
      const response = await api('/api/has_card', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to fetch has_card');
      const data = await response.json();
      setHasCard(data.has_card);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await api('/api/transactions');
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      setTransactions(data.transactions);
    } catch (err) {
      console.error(err);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    Promise.all([fetchBalance(), fetchHasCard(), fetchTransactions()]).finally(() => setRefreshing(false));
  };

  useEffect(() => {
    if (user) {
      setUserName(user.name || 'User');
    }
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      fetchBalance();
      fetchHasCard();
      fetchTransactions();
    }, [])
  );

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
        <TouchableOpacity
          style={styles.profilePic}
          onPress={() => navigation.navigate('UserSettings')}
        >
          <UserIcon width={30} height={30} fill={colors.white} />
        </TouchableOpacity>
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
          <TouchableOpacity onPress={() => navigation.navigate('AllTransactions', { transactions, userId: user?.id })}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionList}>
          {transactions.slice(0, 4).map((transaction) => {
            // Determine transaction display based on transaction_type
            const isReceived = transaction.transaction_type === 'received' || transaction.transaction_type === 'redeemed';
            const isSent = transaction.transaction_type === 'sent';
            const isRedeemed = transaction.transaction_type === 'redeemed';

            // For legacy 'transfer' type, fall back to receiver_id check
            const isLegacyReceived = transaction.transaction_type === 'transfer' && transaction.receiver_id === user?.id;
            const finalIsReceived = isReceived || isLegacyReceived;

            const name = isRedeemed
              ? transaction.sender_name // Shows "Coupon: CODE"
              : finalIsReceived
                ? transaction.sender_name
                : transaction.receiver_name;

            const amount = finalIsReceived
              ? `+Rs. ${transaction.amount.toFixed(2)}`
              : `-Rs. ${transaction.amount.toFixed(2)}`;

            const time = new Date(transaction.timestamp).toLocaleString();

            // Display type label
            let typeLabel = 'Transfer';
            if (isRedeemed) typeLabel = 'Redeemed';
            else if (isSent) typeLabel = 'Sent';
            else if (isReceived) typeLabel = 'Received';
            else if (isLegacyReceived) typeLabel = 'Received';
            else typeLabel = 'Sent';

            return (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionIconContainer}>
                  <View style={styles.transactionIcon}>
                    <Text style={styles.iconText}>{name.charAt(0)}</Text>
                  </View>
                </View>

                <View style={styles.transactionContent}>
                  <Text style={styles.transactionName}>{name}</Text>
                  <Text style={styles.transactionTime}>{time}</Text>
                </View>

                <View style={styles.transactionRight}>
                  <Text
                    style={[
                      styles.transactionAmount,
                      {
                        color: finalIsReceived ? colors.success : colors.text,
                      },
                    ]}
                  >
                    {amount}
                  </Text>
                  <Text style={styles.transactionType}>
                    {typeLabel}
                  </Text>
                </View>
              </View>
            );
          })}
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
  iconText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
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