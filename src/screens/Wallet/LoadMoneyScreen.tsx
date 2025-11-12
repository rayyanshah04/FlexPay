import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Clipboard,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { colors } from '../../theme/style';

// --- Custom SVG Imports ---
import ClipboardIcon from '../../assets/icons/clipboard.svg';
import ClipboardCheckIcon from '../../assets/icons/clipboard-check.svg';

export default function LoadMoneyScreen() {
  const phoneNumber = '+1 555 123 4567';
  const iban = 'GB29 NWBK 6016 1331 9268 19';
  const monthlyLimit = '$5,000';

  const [copiedItem, setCopiedItem] = useState<'phone' | 'iban' | null>(null);

  const handleCopy = (text: string, item: 'phone' | 'iban') => {
    Clipboard.setString(text);
    setCopiedItem(item);

    setTimeout(() => {
      setCopiedItem(null);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Monthly limit - Rayyan Theme Card */}
        <View style={styles.limitCard}>
          <Text style={styles.heading}>Monthly Transfer Limit</Text>
          <Text style={styles.limitText}>{monthlyLimit}</Text>
        </View>

        {/* Local Transfers */}
        <View style={styles.section}>
          <Text style={styles.subHeading}>Receive local transfers</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>{phoneNumber}</Text>
            <TouchableOpacity
              style={[
                styles.copyButton,
                copiedItem === 'phone' && styles.copyButtonCopied,
              ]}
              onPress={() => handleCopy(phoneNumber, 'phone')}
            >
              {copiedItem === 'phone' ? (
                <ClipboardCheckIcon width={20} height={20} fill={colors.success} />
              ) : (
                <ClipboardIcon width={20} height={20} fill={colors.primary} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* International Transfers */}
        <View style={styles.section}>
          <Text style={styles.subHeading}>Receive international transfers</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>{iban}</Text>
            <TouchableOpacity
              style={[
                styles.copyButton,
                copiedItem === 'iban' && styles.copyButtonCopied,
              ]}
              onPress={() => handleCopy(iban, 'iban')}
            >
              {copiedItem === 'iban' ? (
                <ClipboardCheckIcon width={20} height={20} fill={colors.success} />
              ) : (
                <ClipboardIcon width={20} height={20} fill={colors.primary} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 24,
  },
  limitCard: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${colors.accent}66`,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 8,
  },
  limitText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },
  section: {
    marginBottom: 24,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 12,
  },
  infoBox: {
    backgroundColor: colors.white,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: colors.textDark,
    fontWeight: '500',
    flex: 1,
  },
  copyButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  copyButtonCopied: {
    backgroundColor: `${colors.success}4D`,
  },
});