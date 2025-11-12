import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme, meshGradientBackground } from '../../theme/theme';
import LockIcon from '../../assets/icons/lock.svg';

export default function NoCardScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Empty Vertical Card */}
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
        <View style={styles.lockContainer}>
          <LockIcon width={60} height={60} fill="rgba(255, 255, 255, 0.5)" />
        </View>
      </View>

      {/* Notice and Button */}
      <View style={styles.noticeContainer}>
        <Text style={styles.noticeText}>You don't own any card.</Text>
        <Text style={styles.noticeSubText}>Get one now!</Text>
        <TouchableOpacity style={styles.getCardButton}>
          <Text style={styles.getCardButtonText}>Get a Virtual Card</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientCard: {
    width: 220,
    height: 350,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 40,
  },
  lockContainer: {
    width: 90,
    height: 90,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noticeContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noticeText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  noticeSubText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  getCardButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  getCardButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
