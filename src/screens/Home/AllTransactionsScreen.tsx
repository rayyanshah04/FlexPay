import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigations/StackNavigator';
import { colors } from '../../theme/style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScanIcon from '../../assets/icons/scan.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'AllTransactions'>;

export default function AllTransactionsScreen({ route }: Props) {
  const { transactions, userId } = route.params;
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = useMemo(() => {
    if (!searchQuery) {
      return transactions;
    }
    return transactions.filter(transaction => {
      const isReceived = transaction.transaction_type === 'received' || transaction.transaction_type === 'redeemed';
      const isLegacyReceived = transaction.transaction_type === 'transfer' && transaction.receiver_id === userId;
      const finalIsReceived = isReceived || isLegacyReceived;

      const name = transaction.transaction_type === 'redeemed'
        ? transaction.sender_name
        : finalIsReceived
          ? transaction.sender_name
          : transaction.receiver_name;
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery, transactions, userId]);

  const renderTransaction = ({ item }: { item: any }) => {
    const isReceived = item.transaction_type === 'received' || item.transaction_type === 'redeemed';
    const isLegacyReceived = item.transaction_type === 'transfer' && item.receiver_id === userId;
    const finalIsReceived = isReceived || isLegacyReceived;

    const name = item.transaction_type === 'redeemed'
      ? item.sender_name // Shows "Coupon: CODE"
      : finalIsReceived
        ? item.sender_name
        : item.receiver_name;

    const amount = finalIsReceived
      ? `+Rs. ${item.amount.toFixed(2)}`
      : `-Rs. ${item.amount.toFixed(2)}`;
    const time = new Date(item.timestamp).toLocaleString();

    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionIcon}>
          <Text style={styles.transactionIconText}>{name.charAt(0)}</Text>
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionName}>{name}</Text>
          <Text style={styles.transactionTime}>{time}</Text>
        </View>
        <Text style={[styles.transactionAmount, { color: finalIsReceived ? colors.success : colors.text }]}>
          {amount}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 100 }]}>
      <Text style={styles.title}>All Transactions</Text>
      <View style={styles.inputContainer}>
        <View style={styles.inputIcon}>
          <ScanIcon width={20} height={20} fill={colors.placeholder} />
        </View>
        <TextInput
          placeholder="Search by name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          placeholderTextColor={colors.placeholder}
          style={styles.input}
        />
      </View>
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    paddingHorizontal: 24,
    marginTop: -28,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 24,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: `rgba(255, 255, 255, 0.1)`,
    height: 55,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  listContent: {
    paddingHorizontal: 24,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.buttonSecondaryBorder,
  },
  transactionIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionIconText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  transactionTime: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
});
