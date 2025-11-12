import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { theme, meshGradientBackground } from '../../theme/theme';

// for name and also see line 63
import React from 'react';
import { Text } from 'react-native';
import { useUserName } from '../../hooks/useUserName';

// --- SVG IMPORTS ---
import ShowIcon from '../../assets/icons/show.svg';
import HideIcon from '../../assets/icons/hide.svg';
import FreezeIcon from '../../assets/icons/freeze.svg';
import DeleteIcon from '../../assets/icons/delete.svg';

// --- Mock SVG for Mastercard Logo ---
const mastercardXml = `
<svg width="40" height="25" viewBox="0 0 40 25" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12.5" cy="12.5" r="12.5" fill="rgba(255, 255, 255, 0.4)"/>
  <circle cx="27.5" cy="12.5" r="12.5" fill="rgba(255, 255, 255, 0.4)"/>
</svg>
`;

// --- Virtual Card ---
export default function CardScreen() {
  const userName = useUserName();
  const [showDetails, setShowDetails] = React.useState(false);

  const handleToggleView = () => {
    setShowDetails(prev => !prev);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Gradient Card */}
      <View style={[styles.gradientCard, meshGradientBackground.container]}>
        {meshGradientBackground.gradients.map((gradient, index) => (
          <LinearGradient
            key={index}
            colors={gradient.colors}
            locations={[0, 0.75]}
            start={gradient.start}
            end={gradient.end}
            style={meshGradientBackground.gradientLayer}
          />
        ))}

        {/* Content */}
        <View style={styles.balanceContent}>
          <View style={styles.cardTop}>
            <Text style={styles.cardType}>Virtual</Text>
            <SvgXml xml={mastercardXml} />
          </View>
          <View style={styles.cardNumberContainer}>
            <Text style={styles.cardNumber}>
              {showDetails ? '4213' : '****'}
            </Text>
            <Text style={styles.cardNumber}>
              {showDetails ? '3490' : '****'}
            </Text>
            <Text style={styles.cardNumber}>
              {showDetails ? '9821' : '****'}
            </Text>
            <Text style={styles.cardNumber}>
              {showDetails ? '1234' : '****'}
            </Text>
          </View>
          <View style={styles.cardBottom}>
            <Text style={styles.cardHolder}>{userName}</Text>
            <Text style={styles.cardExpiry}>
              {showDetails ? '12/28' : '**/**'}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <ActionButton
          SvgComponent={showDetails ? HideIcon : ShowIcon}
          label={showDetails ? 'Hide' : 'Show'}
          onPress={handleToggleView}
        />
        <ActionButton
          SvgComponent={FreezeIcon}
          label="Freeze"
          onPress={() => { }}
        />
        <ActionButton
          SvgComponent={DeleteIcon}
          label="Delete"
          onPress={() => { }}
        />
      </View>

      {/* Card Details List */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>Card Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status</Text>
          <Text style={[styles.detailValue, { color: '#27AE60' }]}>Active</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Name</Text>
          <Text style={styles.detailValue}>{userName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Expiry</Text>
          <Text style={styles.detailValue}>12/2028</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>CVV</Text>
          <Text style={styles.detailValue}>{showDetails ? '123' : '***'}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

// Helper for buttons
const ActionButton = ({ SvgComponent, label, onPress }: any) => (
  <TouchableOpacity style={styles.actionItem} onPress={onPress}>
    <View style={styles.actionIcon}>
      <SvgComponent width={22} height={22} fill={theme.colors.primary} />
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 24,
  },
  gradientCard: {
    height: 210,
    borderRadius: 16,
    justifyContent: 'space-between',
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  balanceContent: {
    position: 'relative',
    zIndex: 1,
    padding: 20,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardType: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.8,
  },
  cardNumberContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  cardNumber: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 2,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHolder: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  cardExpiry: {
    marginTop: 16,
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 32,
  },
  actionItem: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${theme.colors.accent}40`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    marginTop: 0,
    color: '#333',
    fontWeight: '500',
    fontSize: 14,
  },
  detailsContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    color: '#222',
    fontWeight: '600',
  },
});