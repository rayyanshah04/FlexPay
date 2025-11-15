import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import ScanIcon from '../../assets/icons/scan.svg';
import UserIcon from '../../assets/icons/user-solid-full.svg';
import { RootStackParamList } from '../../navigations/StackNavigator';
import { colors } from '../../theme/style';
import { API_BASE } from '../../config';
import { selectAuthToken, selectSessionToken } from '../../slices/authSlice';
import { Button } from '../../components/ui/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';


type Props = NativeStackScreenProps<RootStackParamList, 'SendMoney'>;

interface Beneficiary {
  nickname?: string;
  name: string;
  phone_number: string;
  iban_or_number?: string;
  color: string;
}

export default function SendMoney({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [accountNo, setAccountNo] = useState('');
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [displayedResults, setDisplayedResults] = useState<Beneficiary[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const token = useSelector(selectSessionToken);

  const colorPalette = ['#4ECCA3', '#FF9F45', '#5DA3FA', '#F76C6C', '#A162F7', '#4DD0E1'];
  const getRandomColor = () => colorPalette[Math.floor(Math.random() * colorPalette.length)];

  const fetchBeneficiaries = useCallback(async () => {
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
        console.error('Failed to fetch beneficiaries:', data.error || 'Unknown error', data);
      }
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchBeneficiaries();
  }, [fetchBeneficiaries]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchBeneficiaries();
    setRefreshing(false);
  }, [fetchBeneficiaries]);

  useEffect(() => {
    if (!accountNo) {
      setDisplayedResults(beneficiaries);
      return;
    }

    const localFiltered = beneficiaries.filter(b =>
      (b.nickname || b.name).toLowerCase().includes(accountNo.toLowerCase()) ||
      (b.phone_number && b.phone_number.includes(accountNo)) ||
      (b.iban_or_number && b.iban_or_number.includes(accountNo))
    );
    setDisplayedResults(localFiltered);

    const isNumberSearch = accountNo.startsWith('03') || accountNo.startsWith('PK04');
    if (isNumberSearch) {
      const existsInBeneficiaries = beneficiaries.some(b => 
        (b.phone_number && b.phone_number === accountNo) ||
        (b.iban_or_number && b.iban_or_number === accountNo)
      );
      if (existsInBeneficiaries) {
        return;
      }

      const handler = setTimeout(async () => {
        setIsSearching(true);
        try {
          const response = await fetch(`${API_BASE}/api/search_user?q=${accountNo}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          if (response.ok && data.user) {
            setDisplayedResults(prev => {
              const suggested = { 
                ...data.user,
                phone_number: data.user.phone_number,
                iban_or_number: data.user.iban_or_number || data.user.phone_number,
                color: getRandomColor() 
              };
              const isAlreadyDisplayed = prev.some(u => 
                (u.phone_number && suggested.phone_number && u.phone_number === suggested.phone_number) ||
                (u.iban_or_number && suggested.iban_or_number && u.iban_or_number === suggested.iban_or_number)
              );
              return isAlreadyDisplayed ? prev : [suggested, ...prev];
            });
          }
        } catch (error) {
          console.error('Error searching for user:', error);
        } finally {
          setIsSearching(false);
        }
      }, 300);

      return () => clearTimeout(handler);
    }
  }, [accountNo, beneficiaries, token]);

  const handleSelect = (user: Beneficiary) => {
    // Use phone_number from backend, or extract from iban_or_number if needed
    let phoneNumber = user.phone_number || user.iban_or_number || '';
    if (!user.phone_number && phoneNumber && phoneNumber.startsWith('PK04FLXP')) {
      phoneNumber = phoneNumber.slice(-11); // Last 11 digits
    }
    
    navigation.navigate('ConfirmPayment', {
      name: user.nickname || user.name,
      iban: user.iban_or_number || user.phone_number || '',
      amount: '10,000 PKR',
      phone: phoneNumber,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        
      >
        <View style={[styles.scrollContent, { paddingTop: insets.top + 60, paddingBottom: 160 }]}>
          {/* Search Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <ScanIcon width={20} height={20} fill={colors.placeholder} />
            </View>
            <TextInput
              placeholder="name, phone, or IBAN..."
              value={accountNo}
              onChangeText={setAccountNo}
              autoCapitalize="none"
              placeholderTextColor={colors.placeholder}
              style={styles.input}
            />
          </View>

          {/* Loading State */}
          {isSearching && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator style={styles.loadingIndicator} color={colors.primary} />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          )}

          {/* Section Title */}
          <Text style={styles.sectionTitle}>Beneficiaries</Text>

          {/* User Cards */}
          <View style={styles.userList}>
            {displayedResults.map(user => (
              <TouchableOpacity
                key={user.phone_number || user.iban_or_number}
                style={styles.userCard}
                activeOpacity={0.8}
                onPress={() => handleSelect(user)}
              >
                <View style={[styles.avatar, { backgroundColor: user.color }]}>
                  <UserIcon width={22} height={22} fill="#fff" />
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.nickname || user.name}</Text>
                  <Text style={styles.userPhone}>
                    {user.phone_number || (user.iban_or_number && user.iban_or_number.startsWith('PK04FLXP') 
                      ? user.iban_or_number.slice(-11)
                      : user.iban_or_number) || 'N/A'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Add Button at Bottom */}
      <View style={[styles.buttonContainer, { bottom: insets.bottom }]}>
        <Button
          variant="primary"
          onPress={() => navigation.navigate('AddingBeneficiary')}
        >
          Add a Beneficary
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
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
  loadingIndicator: {
    marginRight: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  userList: {
    // gap removed, will use borders for separation
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: `rgba(255, 255, 255, 0.05)`,
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
    color: colors.text,
  },
  userPhone: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    fontFamily: 'monospace',
  },
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    marginBottom : 20,
    padding: 24,
    backgroundColor: colors.Background,
    borderTopWidth: 1,
    borderTopColor: `rgba(255, 255, 255, 0.1)`,
  },
});