import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../../theme/style';
import { Button } from '../../components/ui/Button';
import { HomeStackParamList } from '../../navigations/HomeStack';
import { API_BASE } from '../../config'; // Import API_BASE
import { useSelector } from 'react-redux'; // Import useSelector
import { selectToken } from '../../slices/authSlice'; // Import selectToken

// Import logos
import MastercardLogo from '../../assets/icons/mastercard.svg';
import VisaLogo from '../../assets/icons/visa.svg';
import AmericanExpressLogo from '../../assets/icons/american-express.svg';


type Props = NativeStackScreenProps<HomeStackParamList, 'GetCardScreen'>;

const cardTypes = [
  {
    name: 'Mastercard',
    logo: <MastercardLogo width={80} height={50} />,
    description: 'Widely accepted globally, with robust security features and rewards programs.',
  },
  {
    name: 'Visa',
    logo: <VisaLogo width={80} height={50} />,
    description: 'A popular choice for online and in-store purchases, offering convenience and reliability.',
  },
  {
    name: 'American Express',
    logo: <AmericanExpressLogo width={80} height={50} />,
    description: 'Known for its premium rewards, travel benefits, and excellent customer service.',
  },
];

export default function GetCardScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const token = useSelector(selectToken); // Add this line

  const handleGetCard = async () => { // Make it async
    if (!selectedCard) {
      return; // Should be disabled by the button, but good to have
    }

    const chosenCardType = selectedCard;

    if (!token) {
      console.error('Authentication token not found.');
      // Optionally, navigate to login or show an error message
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/get_card`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardType: chosenCardType }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Card creation request successful:', data);
        // Go back to the top of the stack (HomeScreen) and then navigate to CardScreen
        // This clears the history so the user can't go back to NoCardScreen
        navigation.popToTop();
        navigation.navigate('CardScreen');
      } else {
        console.error('Card creation request failed:', data);
        // TODO: Handle error, e.g., show an error message
      }
    } catch (error) {
      console.error('Error making card creation request:', error);
      // TODO: Handle network errors
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 180 }} // Space for the button
      >
        <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
          <Text style={styles.title}>Choose Your Card</Text>
          <Text style={styles.subtitle}>
            Select a card type that best fits your needs. You can start using your virtual card immediately.
          </Text>

          <View style={styles.cardList}>
            {cardTypes.map(card => {
              const isSelected = selectedCard === card.name;
              return (
                <TouchableOpacity
                  key={card.name}
                  style={[styles.cardOption, isSelected && styles.selectedCardOption]}
                  onPress={() => setSelectedCard(card.name)}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardLogoContainer}>
                    {card.logo}
                  </View>
                  <Text style={styles.cardName}>{card.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {selectedCard && (
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>About {selectedCard}</Text>
              <Text style={styles.infoText}>
                {cardTypes.find(c => c.name === selectedCard)?.description}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.buttonContainer, { bottom: insets.bottom }]}>
        <Button
          variant="primary"
          onPress={handleGetCard}
          disabled={!selectedCard}
        >
          Get Your Card
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    flex: 1,
    backgroundColor: colors.Background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
  },
  cardList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardOption: {
    width: '48%',
    aspectRatio: 1.5,
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: `rgba(255, 255, 255, 0.1)`,
  },
  selectedCardOption: {
    borderColor: colors.primary,
    backgroundColor: `rgba(1, 9, 33, 0.4)`,
  },
  cardLogoContainer: {
    // The logos have different sizes, this container helps align them
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  infoBox: {
    marginTop: 24,
    padding: 20,
    backgroundColor: 'transparent',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `rgba(255, 255, 255, 0.1)`,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    padding: 24,
    marginBottom: 100,
    backgroundColor: colors.Background,
    borderTopWidth: 1,
    borderTopColor: `rgba(255, 255, 255, 0.1)`,
  },
});
