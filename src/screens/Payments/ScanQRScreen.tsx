import React, { useState, useCallback } from 'react';
import { View, Alert, Modal, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigations/StackNavigator';
import { colors } from '../../theme/style';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { selectAuthToken } from '../../slices/authSlice';
import { API_BASE } from '../../config';
import QRScanner from '../../components/qrScanner';

type Props = NativeStackScreenProps<RootStackParamList, 'ScanQR'>;

interface QRData {
  name?: string;
  phone?: string;
  [key: string]: any;
}

const ScanQRScreen = ({ navigation }: Props) => {
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [scannedData, setScannedData] = useState<QRData | null>(null);
  const authToken = useSelector(selectAuthToken);

  const handleQRRead = useCallback(
    async (data: string | null) => {
      if (!data || loading) return;

      setLoading(true);
      console.log('QR Code scanned:', data);

      try {
        // Parse the QR data
        let qrData: QRData;
        try {
          qrData = typeof data === 'string' ? JSON.parse(data) : data;
        } catch (e) {
          console.error('Failed to parse QR code:', e);
          Alert.alert(
            'Invalid QR Code',
            'Invalid QR code format. Please scan a valid FlexPay QR code.'
          );
          setLoading(false);
          return;
        }

        // Step 2: Check if required fields exist
        if (!qrData.name || !qrData.phone) {
          console.error('QR code missing required fields:', qrData);
          Alert.alert(
            'Invalid QR Code',
            'This QR code is missing required information. Please scan a valid FlexPay QR code.'
          );
          setLoading(false);
          return;
        }

        console.log('QR data validated:', qrData);

        // Step 3: Verify user exists in database
        const response = await fetch(`${API_BASE}/api/qr/verify-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            phone: qrData.phone,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          // User not found or other error
          Alert.alert('User Not Found', result.error || 'This user does not exist in FlexPay.');
          setLoading(false);
          return;
        }

        // Step 4: User verified, store data and show options
        console.log('User verified:', result.user);
        setScannedData({
          name: result.user.name,
          phone: result.user.phone,
        });
        setShowOptions(true);
        setLoading(false);
      } catch (error) {
        console.error('QR scanning error:', error);
        Alert.alert('Error', 'Network error. Please check your connection and try again.');
        setLoading(false);
      }
    },
    [loading, authToken]
  );

  const handleSendMoney = () => {
    if (!scannedData?.phone || !scannedData?.name) {
      Alert.alert('Error', 'Invalid QR code data');
      return;
    }

    // Navigate to ConfirmPayment with scanned data
    navigation.replace('ConfirmPayment', {
      name: scannedData.name,
      phone: scannedData.phone,
      amount: '0', // User will enter amount on next screen
    });
  };

  const handleAddBeneficiary = () => {
    if (!scannedData?.phone || !scannedData?.name) {
      Alert.alert('Error', 'Invalid QR code data');
      return;
    }

    // Navigate to AddingBeneficiary with scanned data pre-filled
    navigation.replace('AddingBeneficiary', {
      prefilledName: scannedData.name,
      prefilledPhone: scannedData.phone,
    });
  };

  const handleCancel = () => {
    setShowOptions(false);
    setScannedData(null);
  };

  const handleBack = () => {
    if (showOptions) {
      handleCancel();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <QRScanner onRead={handleQRRead} />

      {/* QR Scanned Options Modal */}
      <Modal
        visible={showOptions}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Close button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCancel}
            >
              <Icon name="close" size={28} color={colors.text} />
            </TouchableOpacity>

            {/* Scanned info */}
            <View style={styles.scannedInfoSection}>
              <Icon name="checkmark-circle" size={60} color={colors.primary} />
              <Text style={styles.successText}>QR Code Scanned!</Text>

              <View style={styles.userInfoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Name:</Text>
                  <Text style={styles.infoValue}>{scannedData?.name || 'N/A'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Phone:</Text>
                  <Text style={styles.infoValue}>{scannedData?.phone || 'N/A'}</Text>
                </View>
              </View>
            </View>

            {/* Action buttons */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.sendButton]}
                onPress={handleSendMoney}
              >
                <Icon name="send" size={20} color={colors.white} />
                <Text style={styles.buttonText}>Send Money</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.addButton]}
                onPress={handleAddBeneficiary}
              >
                <Icon name="person-add" size={20} color={colors.primary} />
                <Text style={[styles.buttonText, { color: colors.primary }]}>
                  Add Beneficiary
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ScanQRScreen;

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  scannedInfoSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  successText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    marginBottom: 20,
  },
  userInfoCard: {
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  buttonsContainer: {
    gap: 12,
    marginTop: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  sendButton: {
    backgroundColor: colors.primary,
  },
  addButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  cancelButton: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.textSecondary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
