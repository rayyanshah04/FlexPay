import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Animated,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { colors } from '../../theme/style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigations/StackNavigator';
import { Button } from '../../components/ui/Button';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import { Image } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentSuccess'>;

export default function PaymentSuccess({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const viewShotRef = useRef<ViewShot>(null);
  const {
    name = 'Muhammad Hussain',
    amount = '10,000',
    transactionId = 'TXN123456789',
    phone = '',
  } = route.params || {};

  // Get current date and time
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

  // Mask phone number to show only last 2 digits
  const maskPhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber || phoneNumber.length < 2) return phoneNumber;
    const lastTwo = phoneNumber.slice(-2);
    const masked = '*'.repeat(phoneNumber.length - 2);
    return masked + lastTwo;
  };

  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Success icon animation
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Content fade in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleClose = () => {
    navigation.navigate('AppTabs');
  };

  const handleShare = async () => {
    try {
      if (!viewShotRef.current) return;

      // Capture the receipt as an image
      const uri = await viewShotRef.current.capture();
      
      // Share the image
      await Share.open({
        url: Platform.OS === 'android' ? `file://${uri}` : uri,
        type: 'image/png',
        title: 'Payment Receipt',
        subject: 'FlexPay Payment Receipt',
      });
    } catch (error: any) {
      if (error.message && error.message.includes('User did not share')) {
        // User cancelled, do nothing
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
            paddingTop: insets.top + 60,
            paddingBottom: insets.bottom + 40,
            paddingHorizontal: 24,
          },
        ]}
      >
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0, result: 'tmpfile' }}>
          <View style={styles.shareableContent}>
            {/* Success Icon with Animation */}
            <Animated.View
              style={[
                styles.successIconContainer,
                {
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <View style={styles.successIcon}>
                <Text style={styles.successEmoji}>✓</Text>
              </View>
            </Animated.View>

            {/* Content */}
            <Animated.View
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* Success Message */}
              <Text style={styles.title}>Payment Successful!</Text>
              <Text style={styles.subtitle}>
                Your payment has been sent successfully
              </Text>

              {/* Transaction Details Card */}
              <View style={styles.detailsCard}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Recipient</Text>
                  <Text style={styles.detailValue}>{name}</Text>
                </View>
                {phone && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Account Number</Text>
                    <Text style={styles.detailValue}>{maskPhoneNumber(phone)}</Text>
                  </View>
                )}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Amount</Text>
                  <Text style={styles.amountValue}>Rs. {amount}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailValue}>{formattedDate}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Time</Text>
                  <Text style={styles.detailValue}>{formattedTime}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Transaction ID</Text>
                  <Text style={styles.detailValueSmall}>{transactionId}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Completed</Text>
                  </View>
                </View>
              </View>

              {/* FlexPay Branding */}
              <Text style={styles.brandingText}>Powered by FlexPay</Text>
            </Animated.View>
          </View>
        </ViewShot>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <View style={styles.buttonRow}>
            <View style={styles.buttonHalf}>
              <Button variant="secondary" onPress={handleShare}>
                Share
              </Button>
            </View>
            <View style={styles.buttonHalf}>
              <Button variant="secondary" onPress={handleClose}>
                Close
              </Button>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  successEmoji: {
    fontSize: 50,
    color: colors.white,
    fontWeight: '700',
  },
  shareableContent: {
    width: SCREEN_WIDTH * 0.9,
    maxWidth: 400,
    alignItems: 'center',
    backgroundColor: colors.Background,
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  detailsCard: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.buttonSecondaryBorder,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.buttonSecondaryBorder,
  },
  detailLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
  detailValueSmall: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '600',
    fontFamily: 'monospace',
    maxWidth: '60%',
    textAlign: 'right',
  },
  amountValue: {
    fontSize: 16,
    color: colors.success,
    fontWeight: '700',
  },
  statusBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    color: colors.white,
    fontWeight: '600',
  },
  brandingText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonHalf: {
    flex: 1,
  },
});
