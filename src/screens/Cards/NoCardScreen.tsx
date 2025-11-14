import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { colors } from '../../theme/style';
import LockIcon from '../../assets/icons/lock.svg';
import { Button } from '../../components/ui/Button';

export default function NoCardScreen() {
  return (
    <ImageBackground
      source={require('../../assets/bg.png')}
      style={styles.backgroundImage}
      imageStyle={{
        resizeMode: 'cover',
      }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Backdrop Square */}
        <View style={styles.backdropSquare} />

        {/* Card with bg color */}
        <View style={styles.cardWrapper}>
          <View style={styles.card}>
            <View style={styles.lockContainer}>
              <LockIcon width={60} height={60} fill="rgba(255, 255, 255, 0.6)" />
            </View>
          </View>
        </View>

        {/* Notice and Button */}
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeText}>You don't own any card.</Text>
          <Text style={styles.noticeSubText}>Get one now!</Text>
          <Button
            variant="primary"
            onPress={() => {}}
            style={{ marginTop: 16 }}
          >
            GET A VIRTUAL CARD
          </Button>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropSquare: {
    position: 'absolute',
    width: 280,
    height: 140,
    backgroundColor: colors.primary,
    opacity: 0.15,
    borderRadius: 16,
    top: '28%',
    left: '50%',
    marginLeft: -140,
    zIndex: 0,
  },
  cardWrapper: {
    position: 'relative',
    zIndex: 10,
    marginBottom: 60,
  },
  card: {
    marginTop : 40,
    width: 260,
    height: 370,
    borderRadius: 24,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
    elevation: 15,
  },
  lockContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `rgba(255, 255, 255, 0.08)`,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: `rgba(255, 255, 255, 0.15)`,
  },
  noticeContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 20,
  },
  noticeText: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  noticeSubText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
});