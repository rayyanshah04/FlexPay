import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScanIcon from '../assets/icons/scan.svg'; // Using ScanIcon as a search icon for now
import UserIcon from '../assets/icons/user-solid-full.svg';
import { RootStackParamList } from '../navigations/StackNavigator';
import { theme } from '../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SendMoney'>;

interface User {
  id: number;
  name: string;
  color: string;
  iban: string;
}

export default function SendMoney({ navigation }: Props) {
  const [accountNo, setAccountNo] = useState('');

  const users: User[] = [
    {
      id: 1,
      name: 'Muhammad Hussain',
      iban: 'PK12ABC1234567890',
      color: '#4ECCA3',
    },
    { id: 2, name: 'Ayesha Khan', iban: 'PK34XYZ9876543210', color: '#FF9F45' },
    { id: 3, name: 'Ali Raza', iban: 'PK78LMN2468135790', color: '#5DA3FA' },
    { id: 4, name: 'Sara Ahmed', iban: 'PK09QRS1122334455', color: '#F76C6C' },
  ];

  const handleSelect = (user: User) => {
    navigation.navigate('ConfirmPayment', {
      name: user.name,
      iban: user.iban,
      amount: '10,000 PKR',
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >

      <View style={styles.inputContainer}>
        <View style={styles.inputIcon}>
          <ScanIcon width={20} height={20} fill="#999" />
        </View>
        <TextInput
          placeholder="Search by name or IBAN..."
          value={accountNo}
          onChangeText={setAccountNo}
          autoCapitalize="none"
          placeholderTextColor={'#999'}
          style={styles.input}
        />
      </View>

      <Text style={styles.sectionTitle}>Recent Contacts</Text>

      <ScrollView style={styles.userList} showsVerticalScrollIndicator={false}>
        {users.map(user => (
          <TouchableOpacity
            key={user.id}
            style={styles.userCard}
            activeOpacity={0.8}
            onPress={() => handleSelect(user)}
          >
            <View style={[styles.avatar, { backgroundColor: user.color }]}>
              <UserIcon width={22} height={22} fill="#fff" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userIban}>{user.iban}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add a Beneficiary</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 40 : 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  headerBack: {
    fontSize: 24,
    color: theme.colors.primary,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginHorizontal: 24,
    marginTop: 34,
    marginBottom: 24,
    height: 50,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    marginHorizontal: 24,
  },
  userList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  userIban: {
    fontSize: 14,
    color: '#6a6a6a',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    margin: 54,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
