import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Dimensions,
  Alert,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../theme/style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigations/StackNavigator';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import UserIcon from '../../assets/icons/user-solid-full.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentSuccess'>;

export default function PaymentSuccess({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const viewShotRef = useRef<ViewShot>(null);
  const [currentUserName, setCurrentUserName] = useState('You');
  const [currentUserPhone, setCurrentUserPhone] = useState('');
  
  const {
    name = 'Muhammad Hussain',
    amount = '10,000',
    transactionId = 'TXN123456789',
    phone = '',
    senderName = 'You',
    senderPhone = '',
  } = route.params || {};

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const userStr = await AsyncStorage.getItem('userDetails');
        if (userStr) {
          const user = JSON.parse(userStr);
          setCurrentUserName(user.name || 'You');
          setCurrentUserPhone(user.phone_number || '');
        }
      } catch (error) {
        console.error('Error loading user details:', error);
      }
    };
    loadCurrentUser();
  }, []);

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const maskPhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber || phoneNumber.length < 2) return phoneNumber;
    const lastTwo = phoneNumber.slice(-2);
    const masked = '*'.repeat(phoneNumber.length - 2);
    return masked + lastTwo;
  };

  const handleClose = () => {
    navigation.navigate('AppTabs');
  };

  const handleShare = async () => {
    try {
      if (!viewShotRef.current) return;
      const uri = await viewShotRef.current.capture();
      await Share.open({
        url: Platform.OS === 'android' ? `file://${uri}` : uri,
        type: 'image/png',
        title: 'Payment Receipt',
        subject: 'FlexPay Payment Receipt',
      });
    } catch (error: any) {
      if (error.message && error.message.includes('User did not share')) {
        return;
      }
      Alert.alert('Error', 'Failed to share receipt');
      console.error('Share error:', error);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/bg.png')}
      style={styles.backgroundImage}
      imageStyle={{ resizeMode: 'cover' }}
    >
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 24,
          },
        ]}
      >
        <View style={styles.backdropSquare} />
        
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0, result: 'tmpfile' }}>
          <View style={styles.cardWrapper}>
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.amount}>Rs. {amount}</Text>
                <Text style={styles.brandName}>FlexPay</Text>
              </View>

              <View style={styles.cardMiddle}>
                <View style={styles.userSection}>
                  <View style={styles.userRow}>
                    <View style={styles.avatarSmall}>
                      <UserIcon width={16} height={16} fill={colors.white} />
                    </View>
                    <View style={styles.userInfo}>
                      <Text style={styles.userLabel}>To</Text>
                      <Text style={styles.userName}>{name}</Text>
                      {phone && <Text style={styles.userPhone}>{maskPhoneNumber(phone)}</Text>}
                    </View>
                  </View>

                  <View style={styles.userRow}>
                    <View style={styles.avatarSmall}>
                      <UserIcon width={16} height={16} fill={colors.white} />
                    </View>
                    <View style={styles.userInfo}>
                      <Text style={styles.userLabel}>From</Text>
                      <Text style={styles.userName}>{currentUserName}</Text>
                      {currentUserPhone && <Text style={styles.userPhone}>{maskPhoneNumber(currentUserPhone)}</Text>}
                    </View>
                  </View>
                </View>

                <Text style={styles.dateTime}>{formattedTime} • {formattedDate}</Text>
              </View>

              <View style={styles.cardBottom}>
                <View style={styles.transactionSection}>
                  <Text style={styles.transactionLabel}>Transaction ID</Text>
                  <Text style={styles.transactionId}>{transactionId}</Text>
                </View>
              </View>
            </View>
          </View>
        </ViewShot>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
          >
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleClose}
          >
            <Text style={styles.actionButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.75, 280);
const CARD_HEIGHT = CARD_WIDTH * 1.5;
const SCALE = CARD_WIDTH / 300;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  backdropSquare: {
    position: 'absolute',
    width: CARD_WIDTH + 20,
    height: CARD_HEIGHT * 0.63,
    backgroundColor: colors.white,
    opacity: 0.20,
    borderRadius: 26,
    top: '18%',
    zIndex: 0,
  },
  cardWrapper: {
    position: 'relative',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    backgroundColor: colors.Background,
    justifyContent: 'space-between',
    overflow: 'hidden',
    padding: 28 * SCALE,
  },
  cardTop: {
    alignItems: 'center',
    paddingVertical: 12 * SCALE,
    gap: 8 * SCALE,
  },
  amount: {
    fontSize: 36 * SCALE,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Minecraft',
  },
  brandName: {
    fontSize: 14 * SCALE,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: 2 * SCALE,
    textTransform: 'uppercase',
  },
  cardMiddle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userSection: {
    width: '100%',
    gap: 20 * SCALE,
    marginBottom: 20 * SCALE,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10 * SCALE,
  },
  avatarSmall: {
    width: 32 * SCALE,
    height: 32 * SCALE,
    borderRadius: 16 * SCALE,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userLabel: {
    fontSize: 9 * SCALE,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 2 * SCALE,
    textTransform: 'uppercase',
    letterSpacing: 0.5 * SCALE,
  },
  userName: {
    fontSize: 16 * SCALE,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2 * SCALE,
  },
  userPhone: {
    fontSize: 11 * SCALE,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
  dateTime: {
    fontSize: 12 * SCALE,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  cardBottom: {
    justifyContent: 'flex-end',
  },
  transactionSection: {
    width: '100%',
    paddingTop: 16 * SCALE,
    borderTopWidth: 1,
    borderTopColor: colors.buttonSecondaryBorder,
  },
  transactionLabel: {
    fontSize: 9 * SCALE,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 6 * SCALE,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5 * SCALE,
  },
  transactionId: {
    fontSize: 11 * SCALE,
    color: colors.text,
    fontWeight: '500',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    zIndex: 20,
    marginTop: 20,
  },
  actionButton: {
    width: 100,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});
