import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import QRScanner from '../../components/qrScanner';
import { colors, themeStyles, theme } from '../../theme/style';

// --- Import your custom camera icon ---
import CameraIcon from '../../assets/icons/camera.svg';

// --- Generate QR Code Image (simple placeholder) ---
const qrCodeImage = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=flexpay-user-12345';

// --- "My Code" Tab ---
const MyCodeRoute = ({ jumpTo }: { jumpTo: (key: string) => void }) => (
  <View style={styles.scene}>
    <View style={styles.qrContainer}>
      <Text style={styles.qrTitle}>My Code</Text>
      <Text style={styles.qrSubtitle}>Show this code to receive money</Text>
      <View style={styles.qrImageContainer}>
        <Image source={{ uri: qrCodeImage }} style={styles.qrImage} />
      </View>
      <Text style={styles.qrName}>Number: +1 234 567 8900</Text>

      <TouchableOpacity
        style={styles.rayyanButton}
        onPress={() => jumpTo('second')}
      >
        <CameraIcon width={20} height={20} fill="#FFFFFF" />
        <Text style={styles.rayyanButtonText}>Scan QR</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// --- "Scan" Tab ---
const ScanRoute = () => {
  const [qrCode, setQrCode] = useState<string | null>('');

  return (
    <View style={styles.scene}>
      <QRScanner onScan={setQrCode} />
      <View style={styles.scanOverlay}>
        <Ionicons name="scan-outline" size={24} color={colors.primary} />
        <Text style={styles.scanOverlayText}>Scanning...</Text>
      </View>
    </View>
  );
};

// --- Main Component ---
export default function QRCodeScreen() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'My Code' },
    { key: 'second', title: 'Scan' },
  ]);

  const renderScene = ({
    route,
    jumpTo,
  }: {
    route: { key: string };
    jumpTo: (key: string) => void;
  }) => {
    switch (route.key) {
      case 'first':
        return <MyCodeRoute jumpTo={jumpTo} />;
      case 'second':
        return <ScanRoute />;
      default:
        return null;
    }
  };

  // --- Custom Tab Bar ---
  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: colors.primary }}
      style={{ backgroundColor: 'white', elevation: 0, shadowOpacity: 0 }}
      labelStyle={{ color: '#222222', fontWeight: '600', textTransform: 'none' }}
      activeColor={colors.primary}
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
    />
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  scene: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  qrTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#222',
  },
  qrSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  qrImageContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  qrImage: {
    width: 250,
    height: 250,
    borderRadius: 12,
  },
  qrName: {
    fontSize: 18,
    color: colors.primary,
    marginTop: 20,
  },
  rayyanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 20,
    minWidth: '60%',
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  rayyanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  scanOverlay: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  scanOverlayText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 10,
  },
});