import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Alert,
  Clipboard,
  Dimensions,
} from 'react-native';
import { colors } from '../../theme/style';
import { Button } from '../../components/ui/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigations/HomeStack';
import ShowIcon from '../../assets/icons/show.svg';
import HideIcon from '../../assets/icons/hide.svg';
import MastercardLogo from '../../assets/icons/mastercard.svg';
import VisaLogo from '../../assets/icons/visa.svg';
import AmericanExpressLogo from '../../assets/icons/american-express.svg';
import FreezeIcon from '../../assets/icons/freeze.svg';
import DeleteIcon from '../../assets/icons/delete.svg';
import { useSelector } from 'react-redux';
import api from '../../utils/api';
import { selectSessionToken } from '../../slices/authSlice';

type CardScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'CardScreen'
>;

interface Card {
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvc: string;
  cardType: 'visa' | 'mastercard' | 'amex' | 'unknown';
  isFrozen?: boolean;
}

export default function CardScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<CardScreenNavigationProp>();
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [cardDetails, setCardDetails] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const sessionToken = useSelector(selectSessionToken);

  useEffect(() => {
    const fetchCardDetails = async () => {
      if (!sessionToken) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await api('/api/get_card_details', { method: 'POST' });
        const data = await response.json();
        if (response.ok) {
          setCardDetails(data);
          setIsFrozen(data.isFrozen || false);
        } else {
          console.error('Failed to fetch card details:', data.error);
          if (response.status === 404) {
            navigation.replace('NoCardScreen');
          }
        }
      } catch (error) {
        console.error('Error fetching card details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCardDetails();
  }, [sessionToken, navigation]);

  useFocusEffect(
    React.useCallback(() => {
      const checkCardStatus = async () => {
        if (!sessionToken) return;
        try {
          const response = await api('/api/has_card', { method: 'POST' });
          const data = await response.json();
          if (response.ok && data.has_card === false) {
            navigation.replace('NoCardScreen');
          }
        } catch (error) {
          console.error('Error polling for card status:', error);
        }
      };
      checkCardStatus();
      const intervalId = setInterval(checkCardStatus, 3000);
      return () => clearInterval(intervalId);
    }, [sessionToken, navigation]),
  );

  const getCardLogo = (cardType: Card['cardType']) => {
    switch (cardType) {
      case 'visa':
        return <VisaLogo width={60} height={38} />;
      case 'amex':
        return <AmericanExpressLogo width={60} height={38} />;
      case 'mastercard':
      default:
        return <MastercardLogo width={80} height={50} />;
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    Clipboard.setString(text);
    Alert.alert(
      `${label} Copied`,
      `${text} has been copied to your clipboard.`,
    );
  };

  const formatCardholderName = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0] + '\n' + parts.slice(1).join(' ');
    }
    return name;
  };

  const formatCardNumberDisplay = (fullNumber: string, isVisible: boolean) => {
    const cleanedNumber = fullNumber.replace(/\s/g, '');
    const lastFour = cleanedNumber.slice(12, 16);

    if (!isVisible) {
      return ['•••• •••• ••••', lastFour];
    } else {
      const part1 = cleanedNumber.slice(0, 4);
      const part2 = cleanedNumber.slice(4, 8);
      const part3 = cleanedNumber.slice(8, 12);
      return [`${part1} ${part2} ${part3}`, lastFour];
    }
  };

  const handleFreezeCard = async () => {
    if (!sessionToken) return;
    
    const newFrozenState = !isFrozen;
    
    try {
      const response = await api('/api/freeze_card', {
        method: 'POST',
        body: JSON.stringify({ isFrozen: newFrozenState }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsFrozen(newFrozenState);
        Alert.alert(
          newFrozenState ? 'Card Frozen' : 'Card Unfrozen',
          newFrozenState
            ? 'Your card has been frozen successfully.'
            : 'Your card has been unfrozen successfully.',
        );
      } else {
        Alert.alert('Error', data.error || 'Failed to update card status');
      }
    } catch (error) {
      console.error('Error freezing/unfreezing card:', error);
      Alert.alert('Error', 'Failed to update card status');
    }
  };

  const handleDeleteCard = async () => {
    if (!sessionToken) return;
    
    try {
      const response = await api('/api/delete_card', { method: 'POST' });
      
      const data = await response.json();
      
      if (response.ok) {
        Alert.alert('Card Deleted', 'Your card has been deleted successfully.', [
          {
            text: 'OK',
            onPress: () => navigation.replace('NoCardScreen'),
          },
        ]);
      } else {
        Alert.alert('Error', data.error || 'Failed to delete card');
      }
    } catch (error) {
      console.error('Error deleting card:', error);
      Alert.alert('Error', 'Failed to delete card');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!cardDetails) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No card found.</Text>
        <Button onPress={() => navigation.replace('GetCardScreen')}>
          Get a Card
        </Button>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/bg.png')}
      style={styles.backgroundImage}
      imageStyle={{
        resizeMode: 'cover',
      }}
    >
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 12,
            paddingHorizontal: 24,
          },
        ]}
      >
        <View style={styles.cardWrapper}>
          <View style={[styles.backdropSquare, { top: CARD_HEIGHT * 0.12 }]} />
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.cardLogoContainer}>
                {getCardLogo(cardDetails.cardType)}
              </View>
              <TouchableOpacity
                onPress={() => setIsCardVisible(!isCardVisible)}
                style={styles.showButton}
              >
                {isCardVisible ? (
                  <ShowIcon width={24} height={24} fill={colors.white} />
                ) : (
                  <HideIcon width={24} height={24} fill={colors.white} />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => copyToClipboard(cardDetails.cardNumber, 'Card Number')}
            >
              <View style={styles.cardMiddle}>
                <View style={styles.cardNumberContainer}>
                  {formatCardNumberDisplay(cardDetails.cardNumber, isCardVisible).map((row, index) => (
                    <Text key={index} style={styles.cardNumberRow}>
                      {row}
                    </Text>
                  ))}
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.cardBottom}>
              <View style={styles.cardBottomLeft}>
                <TouchableOpacity
                  style={styles.cardholderSection}
                  activeOpacity={0.7}
                  onPress={() => copyToClipboard(cardDetails.cardHolderName, 'Cardholder Name')}
                >
                  <Text style={styles.cardholderName}>
                    {formatCardholderName(cardDetails.cardHolderName)}
                  </Text>
                </TouchableOpacity>
                <View style={styles.detailsRow}>
                  <TouchableOpacity
                    style={styles.expirySection}
                    activeOpacity={0.7}
                    onPress={() => copyToClipboard(cardDetails.expiryDate, 'Expiry Date')}
                  >
                    <Text style={styles.detailLabel}>VALID THRU</Text>
                    <Text style={styles.detailValue}>{cardDetails.expiryDate}</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.cardTypeLabel}>DEBIT CARD</Text>
              </View>
              <View style={styles.cardBottomRight}>
                <TouchableOpacity
                  style={styles.cvcSection}
                  activeOpacity={0.7}
                  onPress={() => copyToClipboard(cardDetails.cvc, 'CVC')}
                >
                  <Text style={styles.detailLabel}>CVC</Text>
                  <Text style={styles.detailValue}>
                    {isCardVisible ? cardDetails.cvc : '•••'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleFreezeCard}
          >
            <FreezeIcon width={32} height={32} fill={isFrozen ? colors.primary : colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              Alert.alert(
                "Delete Card",
                "Are you sure you want to delete this card?",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Delete", style: "destructive", onPress: handleDeleteCard }
                ]
              );
            }}
          >
            <DeleteIcon width={32} height={32} fill={colors.white} />
          </TouchableOpacity>
        </View>

      </View>
    </ImageBackground>
  );
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.75, 280);
const CARD_HEIGHT = CARD_WIDTH * 1.5;
const SCALE = CARD_WIDTH / 300;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.Background,
  },
  errorText: {
    color: colors.text,
    fontSize: 16,
  },
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 200,
  },
  backdropSquare: {
    position: 'absolute',
    width: CARD_WIDTH * 1.1,
    height: CARD_HEIGHT * 0.7,
    backgroundColor: colors.white,
    opacity: 0.20,
    borderRadius: 26,
    zIndex: 0,
  },
  cardWrapper: {
    position: 'relative',
    zIndex: 10,
    flex: 1,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLogoContainer: {
    // Now on top left
  },
  showButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `rgba(255, 255, 255, 0.15)`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardMiddle: {
    alignItems: 'flex-start',
    marginVertical: 24,
  },
  cardNumberContainer: {
    alignItems: 'flex-start',
  },
  cardNumberRow: {
    fontSize: 20 * SCALE,
    fontWeight: '500',
    color: colors.text,
    letterSpacing: 3 * SCALE,
    marginBottom: 6 * SCALE,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardBottomLeft: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  cardBottomRight: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  cardholderSection: {
  },
  cardholderName: {
    fontSize: 35 * SCALE,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 40 * SCALE,
    letterSpacing: 0.5 * SCALE,
    fontFamily: 'Minecraft',
    textTransform: 'uppercase',
  },
  detailsRow: {
    flexDirection: 'row',
    marginTop: 12 * SCALE,
  },
  cvcSection: {
    alignItems: 'flex-end',
  },
  expirySection: {
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 9 * SCALE,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 3 * SCALE,
    letterSpacing: 0.3 * SCALE,
  },
  detailValue: {
    fontSize: 14 * SCALE,
    fontWeight: '600',
    color: colors.text,
  },
  cardTypeLabel: {
    fontSize: 12 * SCALE,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 12 * SCALE,
  },
  actionContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    paddingBottom: 20,
  },
  iconButton: {
    marginTop: -40,
    marginBottom: 60,
    width: 72 * SCALE,
    height: 72 * SCALE,
    borderRadius: 36 * SCALE,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20 * SCALE,
  },
});
