import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
} from 'react-native';
import { colors } from '../../theme/style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ScanIcon from '../../assets/icons/scan.svg';
import UploadIcon from '../../assets/icons/upload.svg';
import BackIcon from '../../assets/icons/backspace.svg';
import QRScanner from '../../components/qrScanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserIcon from '../../assets/icons/user-solid-full.svg';

const qrCodeImage =
  'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=flexpay-user-12345&bgcolor=121212&color=FFFFFF&qzone=1';

export default function QRCodeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userData = await AsyncStorage.getItem('userDetails');
      if (userData) {
        const parsed = JSON.parse(userData);
        setUserName(parsed.name || 'User');
      }
    };
    fetchUserDetails();
  }, []);

  const handleScan = (data: string | null) => {
    setScannedData(data);
    if (data) {
      alert(`Scanned QR Code: ${data}`);
      setIsScanning(false);
    }
  };

  if (isScanning) {
    return (
      <View style={styles.scannerContainer}>
        <QRScanner onScan={handleScan} />
        <TouchableOpacity
          style={[styles.backButton, { top: insets.top + 16 }]}
          onPress={() => setIsScanning(false)}
        >
          <BackIcon width={24} height={24} fill={colors.white} />
        </TouchableOpacity>
        <View style={styles.scannerOverlay}>
          <Text style={styles.scannerText}>
            {scannedData ? `Scanned: ${scannedData}` : 'Point camera at a QR code'}
          </Text>
        </View>
      </View>
    );
  }

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
            paddingBottom: insets.bottom + 12,
            paddingHorizontal: 24,
          },
        ]}
      >
        <View style={styles.backdropSquare} />

        <View style={styles.cardWrapper}>
          <View style={styles.qrCard}>
            <View style={styles.cardTop}>
              <Text style={styles.cardTitle}>Receive Money</Text>
            </View>

            <View style={styles.qrCodeContainer}>
              <Image source={{ uri: qrCodeImage }} style={styles.qrImage} />
            </View>

            <View style={styles.cardBottom}>
              <UserIcon width={24} height={24} fill={colors.textSecondary} />
              <Text style={styles.userName}>{userName}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setIsScanning(true)}
          >
            <ScanIcon width={32} height={32} fill={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <UploadIcon width={32} height={32} fill={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.8, 320);
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
    paddingBottom: 40, // Adjusted paddingBottom
  },
  backdropSquare: {
    position: 'absolute',
    width: CARD_WIDTH + 20,
    height: CARD_HEIGHT * 0.63, // Adjusted height
    backgroundColor: colors.white,
    opacity: 0.2,
    borderRadius: 26,
    top: '15.7%', // Adjusted top
    zIndex: 0,
  },
  cardWrapper: {
    position: 'relative',
    zIndex: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    backgroundColor: colors.Background,
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    padding: 24 * SCALE,
  },
  cardTop: {
    width: '100%',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20 * SCALE,
    fontWeight: '600',
    color: colors.text,
  },
  qrCodeContainer: {
    padding: 10,
    backgroundColor: colors.secondary,
    borderRadius: 20,
  },
  qrImage: {
    width: CARD_WIDTH * 0.65,
    height: CARD_WIDTH * 0.65,
    borderRadius: 12,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  userName: {
    fontSize: 16 * SCALE,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 10,
  },
  actionContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    marginTop: -60,
    marginBottom: 60, // Added marginBottom
  },
  iconButton: {
    width: 72 * SCALE,
    height: 72 * SCALE,
    borderRadius: 36 * SCALE,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20 * SCALE,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: colors.black,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 30,
  },
  scannerOverlay: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  scannerText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: '600',
  },
});