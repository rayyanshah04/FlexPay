import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, TextInput, Alert, ActivityIndicator } from 'react-native';
import BackspaceIcon from '../../assets/icons/backspace.svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigations/HomeStack';
import { Button } from '../../components/ui/Button';
import { colors } from '../../theme/style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../../config';


type Props = NativeStackScreenProps<HomeStackParamList, 'PaymentScreen'>;

export default function PaymentScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRedeemCoupon = async () => {
    if (!couponCode.trim()) {
      Alert.alert('Error', 'Please enter a coupon code');
      return;
    }

    setLoading(true);
    try {
      const sessionToken = await AsyncStorage.getItem('sessionToken');

      const response = await fetch(`${API_BASE}/api/coupons/redeem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          coupon_code: couponCode.toUpperCase(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          '🎉 Success!',
          `Coupon redeemed successfully!\nYou received Rs ${data.amount}\nNew Balance: Rs ${data.new_balance}`,
          [
            {
              text: 'OK',
              onPress: () => {
                setCouponCode('');
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', data.error || 'Failed to redeem coupon');
      }
    } catch (error) {
      console.error('Coupon redemption error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 60,
            paddingHorizontal: 24,
            paddingBottom: insets.bottom + 100,
          },
        ]}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Redeem Coupon</Text>
          <Text style={styles.subtitle}>
            Enter your coupon code to receive money
          </Text>
        </View>

        {/* Coupon Card */}
        <View style={styles.couponCard}>
          <Text style={styles.couponLabel}>Coupon Code</Text>
          <TextInput
            style={styles.couponInput}
            value={couponCode}
            onChangeText={setCouponCode}
            placeholder="e.g., MEGA1000"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={20}
            editable={!loading}
          />
          <Text style={styles.helperText}>
            Enter the code exactly as shown
          </Text>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>💡 How it works</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>•</Text>
            <Text style={styles.infoText}>
              Enter your coupon code above
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>•</Text>
            <Text style={styles.infoText}>
              Tap "Redeem Coupon" to claim your reward
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>•</Text>
            <Text style={styles.infoText}>
              Money will be added to your balance instantly
            </Text>
          </View>
        </View>

        {/* Popular Coupons (Optional - for display only) */}
        <View style={styles.popularSection}>
          <Text style={styles.popularTitle}>🎁 Available Coupons</Text>
          <Text style={styles.popularSubtitle}>
            Check with admin for active coupon codes
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 20 }]}>
        <Button
          variant="primary"
          onPress={handleRedeemCoupon}
          disabled={loading || !couponCode.trim()}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={colors.Background} size="small" />
              <Text style={styles.loadingText}>Redeeming...</Text>
            </View>
          ) : (
            'Redeem Coupon'
          )}
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
  content: {
    flexGrow: 1,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  couponCard: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.buttonSecondaryBorder,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },
  couponLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '600',
  },
  couponInput: {
    backgroundColor: colors.Background,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    letterSpacing: 2,
    borderWidth: 2,
    borderColor: colors.primary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  helperText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  infoCard: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.buttonSecondaryBorder,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  infoBullet: {
    fontSize: 16,
    color: colors.primary,
    marginRight: 12,
    fontWeight: '700',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  popularSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  popularTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  popularSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: colors.Background,
    borderTopWidth: 1,
    borderTopColor: colors.buttonSecondaryBorder,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    color: colors.Background,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});