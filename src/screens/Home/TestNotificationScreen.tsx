import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { colors } from '../../theme/style';
import NotificationService from '../../utils/NotificationService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TestNotificationScreen = () => {
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState('100');
  const [name, setName] = useState('John Doe');

  const testSentNotification = () => {
    NotificationService.transactionNotification('sent', amount, name);
    Alert.alert('Success', 'Check your notification bar! 🔔');
  };

  const testReceivedNotification = () => {
    NotificationService.transactionNotification('received', amount, name);
    Alert.alert('Success', 'Check your notification bar! 🔔');
  };

  const testCustomNotification = () => {
    NotificationService.localNotification(
      'Custom Test',
      'This is a custom test notification!',
      'flexpay-general'
    );
    Alert.alert('Success', 'Check your notification bar! 🔔');
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }
      ]}
    >
      <Text style={styles.title}>🔔 Test Notifications</Text>
      <Text style={styles.subtitle}>
        Test push notifications without needing two phones!
      </Text>

      <View style={styles.section}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="100"
          placeholderTextColor={colors.placeholder}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="John Doe"
          placeholderTextColor={colors.placeholder}
        />
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, styles.buttonSent]}
          onPress={testSentNotification}
        >
          <Text style={styles.buttonText}>💸 Test "Money Sent"</Text>
          <Text style={styles.buttonSubtext}>
            You sent Rs. {amount} to {name}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonReceived]}
          onPress={testReceivedNotification}
        >
          <Text style={styles.buttonText}>💰 Test "Money Received"</Text>
          <Text style={styles.buttonSubtext}>
            You received Rs. {amount} from {name}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonCustom]}
          onPress={testCustomNotification}
        >
          <Text style={styles.buttonText}>🔔 Test Custom</Text>
          <Text style={styles.buttonSubtext}>
            Send a custom notification
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>📱 How to use:</Text>
        <Text style={styles.infoText}>
          1. Tap any button above{'\n'}
          2. Look at the top of your screen{'\n'}
          3. Pull down notification shade to see it{'\n'}
          4. The notification will have sound & vibration
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>⚠️ Not seeing notifications?</Text>
        <Text style={styles.infoText}>
          • Check Settings → Apps → Flexpay → Notifications{'\n'}
          • Make sure notifications are enabled{'\n'}
          • Turn off "Do Not Disturb" mode{'\n'}
          • Try restarting the app
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Background,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonGroup: {
    marginTop: 20,
    gap: 16,
  },
  button: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  buttonSent: {
    backgroundColor: '#FF6B6B',
  },
  buttonReceived: {
    backgroundColor: '#4ECCA3',
  },
  buttonCustom: {
    backgroundColor: '#5DA3FA',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  buttonSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  infoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

export default TestNotificationScreen;
