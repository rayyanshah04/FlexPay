import PushNotification, { Importance } from 'react-native-push-notification';
import { Platform } from 'react-native';

class NotificationService {
  constructor() {
    this.configure();
    this.createDefaultChannels();
  }

  configure = () => {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },

      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
      },

      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);
      },

      onRegistrationError: function(err) {
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
