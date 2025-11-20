import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
  Alert,
  Platform,
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
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import { API_BASE } from '../../config';

export default function QRCodeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const viewShotRef = useRef<ViewShot>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [userName, setUserName] = useState('User');
  const [userPhone, setUserPhone] = useState('');
  const [qrCodeImage, setQrCodeImage] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const token = await AsyncStorage.getItem('sessionToken');
        if (userData && token) {
          const parsed = JSON.parse(userData);

          const response = await fetch(`${API_BASE}/api/qr-data`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            setUserName(data.name || 'User');
            setUserPhone(data.phone || '');
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(data.qr_data)}&bgcolor=454545&color=FFFFFF&qzone=1`;
            setQrCodeImage(qrUrl);
          }
        }
      } catch (error) {
        console.error('Failed to fetch QR data:', error);
      }
    };
    fetchUserDetails();
  }, []);

  const handleScan = useCallback((data: string | null) => {
    if (data === null) {
      setIsScanning(false);
      return;
    }
    setScannedData(data);
    Alert.alert('Scanned QR Code', data);
    setIsScanning(false);
  }, []);

  const handleShare = async () => {
    try {
      if (!viewShotRef.current) return;

      // Capture the QR card as an image
      const uri = await viewShotRef.current.capture();

      // Share the image
      await Share.open({
        url: Platform.OS === 'android' ? `file://${uri}` : uri,
        type: 'image/jpeg',
        title: 'My FlexPay QR Code',
        subject: 'Pay me on FlexPay',
      });
    } catch (error: any) {
      if (error.message && error.message.includes('User did not share')) {
        // User cancelled, do nothing
        return;
      }
      Alert.alert('Error', 'Failed to share QR code');
      console.error('Share error:', error);
    }
  };

  if (isScanning) {
    return (
      <View style={styles.scannerContainer}>
        <QRScanner onRead={handleScan} />
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

            <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }}>
              <View style={styles.shareableContent}>
                <View style={styles.qrCodeContainer}>
                  {qrCodeImage ? (
                    <Image source={{ uri: qrCodeImage }} style={styles.qrImage} />
                  ) : (
                    <View style={styles.qrPlaceholder} />
                  )}
                </View>

                <View style={styles.cardBottom}>
                  <View style={styles.userInfoContainer}>
                    <UserIcon width={24} height={24} fill={colors.textSecondary} />
                    <View style={styles.userTextContainer}>
                      <Text style={styles.userName}>{userName}</Text>
                      <Text style={styles.userPhone}>{userPhone}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </ViewShot>
          </View>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setIsScanning(true)}
          >
            <ScanIcon width={32} height={32} fill={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
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
    marginBottom: 16 * SCALE,
  },
  cardTitle: {
    fontSize: 20 * SCALE,
    fontWeight: '600',
    color: colors.text,
  },
  shareableContent: {
    backgroundColor: colors.Background,
    padding: 24 * SCALE,
    alignItems: 'center',
    borderRadius: 24,
  },
  qrCodeContainer: {
    padding: 10,
    backgroundColor: colors.secondary,
    borderRadius: 20,
    marginBottom: 20 * SCALE,
  },
  qrImage: {
    width: CARD_WIDTH * 0.65,
    height: CARD_WIDTH * 0.65,
    borderRadius: 12,
  },
  cardBottom: {
    width: '100%',
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  userName: {
    fontSize: 12 * SCALE,
    fontWeight: '600',
    color: colors.text,
  },
  userPhone: {
    fontSize: 13 * SCALE,
    fontWeight: '400',
    color: colors.textSecondary,
    marginTop: -1,
  },
  qrPlaceholder: {
    width: CARD_WIDTH * 0.65,
    height: CARD_WIDTH * 0.65,
    backgroundColor: colors.secondary,
    borderRadius: 12,
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