import PushNotification, { Importance } from 'react-native-push-notification';
import { Platform } from 'react-native';
import { store } from '../store';
import { API_BASE } from '../config';

class NotificationService {
  constructor() {
    this.configure();
    this.createDefaultChannels();
  }

  configure = () => {
    PushNotification.configure({
      onRegister: async function (token) {
        console.log('TOKEN:', token);
        const state = store.getState();
        const userToken = state.auth.user?.token;

        if (userToken) {
          try {
            const response = await fetch(`${API_BASE}/api/user/device-token`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
              },
              body: JSON.stringify({ device_token: token.token }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              console.error('Failed to send device token to backend:', errorData);
            } else {
              console.log('Device token sent to backend successfully.');
            }
          } catch (error) {
            console.error('Error sending device token to backend:', error);
          }
        } else {
          console.log('User not authenticated, device token not sent to backend.');
        }
      },

      onNotification: function (notification) {
        console.log('NOTIFICATION RECEIVED:', notification);
        console.log('Notification data:', notification.data);
        console.log('User interaction:', notification.userInteraction);
        console.log('Foreground:', notification.foreground);

        // Handle remote FCM notifications when app is in foreground
        // When app is in background/closed, Android handles it automatically
        if (notification.foreground && !notification.userInteraction) {
          // App is in foreground, show local notification
          const title = notification.title || '💰 FlexPay';
          const message = notification.message || notification.body || 'New notification';

          PushNotification.localNotification({
            channelId: 'flexpay-transactions',
            title: title,
            message: message,
            playSound: true,
            soundName: 'default',
            importance: 'high',
            priority: 'high',
            vibrate: true,
            vibration: 300,
            data: notification.data,
          });
        }

        // Handle notification tap (user clicked on notification)
        if (notification.userInteraction) {
          console.log('User tapped notification:', notification.data);
          // TODO: Navigate to appropriate screen based on notification.data.type
          // For now, just log it
        }
      },

      onAction: function (notification) {
        console.log('NOTIFICATION ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);
      },

      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });
  };

  createDefaultChannels = () => {
    PushNotification.createChannel(
      {
        channelId: 'flexpay-transactions',
        channelName: 'Transactions',
        channelDescription: 'Notification channel for transactions',
        importance: Importance.HIGH,
        vibrate: true,
      },
      (created) => console.log(`createChannel 'flexpay-transactions' returned '${created}'`)
    );

    PushNotification.createChannel(
      {
        channelId: 'flexpay-general',
        channelName: 'General',
        channelDescription: 'General notifications',
        importance: Importance.DEFAULT,
        vibrate: true,
      },
      (created) => console.log(`createChannel 'flexpay-general' returned '${created}'`)
    );
  };

  localNotification = (title: string, message: string, channelId: string = 'flexpay-general') => {
    PushNotification.localNotification({
      channelId,
      title,
      message,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      priority: 'high',
      vibrate: true,
      vibration: 300,
    });
  };

  transactionNotification = (type: 'sent' | 'received', amount: string, name: string) => {
    const title = type === 'sent' ? '💸 Money Sent' : '💰 Money Received';
    const message = type === 'sent'
      ? `You sent Rs. ${amount} to ${name}`
      : `You received Rs. ${amount} from ${name}`;

    this.localNotification(title, message, 'flexpay-transactions');
  };

  cancelAll = () => {
    PushNotification.cancelAllLocalNotifications();
  };
}

export default new NotificationService();
