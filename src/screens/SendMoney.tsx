import React, { useEffect, useState } from 'react';
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
import { useSelector } from 'react-redux';
import ScanIcon from '../assets/icons/scan.svg'; // Using ScanIcon as a search icon for now
import UserIcon from '../assets/icons/user-solid-full.svg';
import { RootStackParamList } from '../navigations/StackNavigator';
import { theme } from '../theme/theme';
import { API_BASE } from '../config';
import { selectToken } from '../slices/authSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'SendMoney'>;

interface Beneficiary {
  nickname: string;
  name: string;
  iban_or_number: string;
  color: string;
}

export default function SendMoney({ navigation }: Props) {
  const [accountNo, setAccountNo] = useState('');
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [displayedResults, setDisplayedResults] = useState<Beneficiary[]>([]);
  const token = useSelector(selectToken);

  const colors = ['#4ECCA3', '#FF9F45', '#5DA3FA', '#F76C6C', '#A162F7', '#4DD0E1'];
  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${API_BASE}/api/beneficiaries`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          const beneficiariesWithColor = data.beneficiaries.map((b: Omit<Beneficiary, 'color'>) => ({
            ...b,
            color: getRandomColor(),
          }));
          setBeneficiaries(beneficiariesWithColor);
          setDisplayedResults(beneficiariesWithColor);
        } else {
          console.error('Failed to fetch beneficiaries:', data.error);
        }
      } catch (error) {
        console.error('Error fetching beneficiaries:', error);
      }
    };
    fetchBeneficiaries();
  }, [token]);

  useEffect(() => {
    if (!accountNo) {
      setDisplayedResults(beneficiaries);
      return;
    }

    const localFiltered = beneficiaries.filter(b =>
      (b.nickname || b.name).toLowerCase().includes(accountNo.toLowerCase()) ||
      b.iban_or_number.includes(accountNo)
    );
    setDisplayedResults(localFiltered);

    const isNumberSearch = accountNo.startsWith('03') || accountNo.startsWith('PK04');
    if (isNumberSearch) {
      const existsInBeneficiaries = beneficiaries.some(b => b.iban_or_number === accountNo);
      if (existsInBeneficiaries) {
        return;
      }

      const handler = setTimeout(async () => {
        try {
          const response = await fetch(`${API_BASE}/api/search_user?q=${accountNo}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          if (response.ok && data.user) {
            setDisplayedResults(prev => {
              const suggested = { ...data.user, color: getRandomColor() };
              const isAlreadyDisplayed = prev.some(u => u.iban_or_number === suggested.iban_or_number);
              return isAlreadyDisplayed ? prev : [suggested, ...prev];
            });
          }
        } catch (error) {
          console.error('Error searching for user:', error);
        }
      }, 300);

      return () => clearTimeout(handler);
    }
  }, [accountNo, beneficiaries, token]);

  const handleSelect = (user: Beneficiary) => {
    navigation.navigate('ConfirmPayment', {
      name: user.nickname || user.name,
      iban: user.iban_or_number,
      amount: '10,000 PKR', // This seems to be a placeholder
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
          placeholder="Search by name, phone, or IBAN..."
          value={accountNo}
          onChangeText={setAccountNo}
          autoCapitalize="none"
          placeholderTextColor={'#999'}
          style={styles.input}
        />
      </View>

      <ScrollView style={styles.userList} showsVerticalScrollIndicator={false}>
        {displayedResults.map(user => (
          <TouchableOpacity
            key={user.iban_or_number}
            style={styles.userCard}
            activeOpacity={0.8}
            onPress={() => handleSelect(user)}
          >
            <View style={[styles.avatar, { backgroundColor: user.color }]}>
              <UserIcon width={22} height={22} fill="#fff" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.nickname || user.name}</Text>
              <Text style={styles.userIban}>{user.iban_or_number}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddingBeneficiary')}
      >
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
