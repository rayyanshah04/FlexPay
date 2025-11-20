import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import { AppState, AppStateStatus } from 'react-native';

const { width } = Dimensions.get('window');
const scanBoxSize = width * 0.65;

const QRScanner = ({ onRead }: { onRead: (value: string | null) => void }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const device = useCameraDevice('back');
  const isFocused = useIsFocused();
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  console.log('=== QRScanner Debug ===');
  console.log('device:', device);
  console.log('hasPermission:', hasPermission);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      console.log('✓ QR Codes scanned:', codes);
      if (codes.length > 0 && codes[0].value) {
        console.log('✓ QR Value:', codes[0].value);
        onRead(codes[0].value);
      }
    },
  });

  useEffect(() => {
    let isMounted = true;

    const requestCameraPermission = async () => {
      try {
        console.log('Requesting camera permission...');
        const permission = await Camera.requestCameraPermission();
        console.log('✓ Camera permission result:', permission);
        if (isMounted) {
          setHasPermission(permission === 'granted');
        }
      } catch (error) {
        console.error('✗ Error requesting camera permission:', error);
        if (isMounted) {
          setHasPermission(false);
        }
      }
    };

    requestCameraPermission();

    // Auto-close scanner after 15 seconds
    const timeout = setTimeout(() => {
      console.log('⏱ Auto-closing scanner after 15 seconds');
      onRead(null);
    }, 15000);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [onRead]);

  console.log('Current state - hasPermission:', hasPermission, 'device:', device ? 'READY' : 'LOADING');

  if (hasPermission === null) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>⏳ Loading camera...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>
          ✗ Camera permission denied
        </Text>
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>
          ✗ No camera device found
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        codeScanner={codeScanner}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused && appState === 'active'}
      />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => onRead(null)} hitSlop={10}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Scan QR to Pay</Text>
        <View style={{ width: 28 }} /> {/* Spacer to balance icon */}
      </View>

      {/* Overlay with Scan Area */}
      <View style={styles.overlay}>
        <View style={styles.scanContainer}>
          <View style={styles.scanBox} />
          <Text style={styles.instructionText}>
            Align QR code within the frame
          </Text>
        </View>
      </View>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => onRead(null)}
        >
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default QRScanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  centered: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    color: 'white',
    fontSize: 16,
    padding: 20,
    textAlign: 'center',
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanContainer: {
    alignItems: 'center',
  },
  scanBox: {
    width: scanBoxSize,
    height: scanBoxSize,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#00FFAA',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  instructionText: {
    marginTop: 20,
    color: 'white',
    fontSize: 16,
    fontWeight: '400',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: '#fff',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  closeText: {
    color: 'white',
    fontSize: 16,
  },
});
