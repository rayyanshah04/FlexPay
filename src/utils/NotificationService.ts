import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { store } from '../store';
import { API_BASE } from '../config';

const DEBUG_PREFIX = '🔥 FLEXPAY_FCM_DEBUG 🔥';

class NotificationService {
  private fcmToken: string | null = null;

  constructor() {
    console.log(`${DEBUG_PREFIX} [INIT] NotificationService constructor called`);
    this.setupFCMTokenListener();
    this.listenForAuthChanges();
    this.createNotificationChannel();
  }

  createNotificationChannel = async () => {
    // Create a notification channel for Android
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
      sound: 'default',
    });
  };


  setupFCMTokenListener = () => {
    console.log(`${DEBUG_PREFIX} [SETUP] setupFCMTokenListener called, Platform: ${Platform.OS}`);

    try {
      console.log(`${DEBUG_PREFIX} [SETUP] Setting up Firebase Cloud Messaging listener`);

      // Get token on app start
      messaging().getToken().then((token) => {
        if (token) {
          console.log(`${DEBUG_PREFIX} [STEP 1/4] ✅ FCM Token Retrieved from Firebase`);
          console.log(`${DEBUG_PREFIX} [STEP 1/4] Token value: ${token}`);
          console.log(`${DEBUG_PREFIX} [STEP 1/4] Token length: ${token?.length}`);
          this.fcmToken = token;
          // Try to send the token immediately if the user is already logged in
          this.sendTokenToBackend();
        } else {
          console.log(`${DEBUG_PREFIX} [STEP 1/4] ⚠️ No FCM token available yet`);
        }
      }).catch((error) => {
        console.error(`${DEBUG_PREFIX} [SETUP] ❌ Error getting initial token:`, error);
      });

      // Listen for new tokens
      messaging().onTokenRefresh((token) => {
        console.log(`${DEBUG_PREFIX} [STEP 1/4] ✅ FCM Token Refreshed from Firebase`);
        console.log(`${DEBUG_PREFIX} [STEP 1/4] New token value: ${token}`);
        console.log(`${DEBUG_PREFIX} [STEP 1/4] Token length: ${token?.length}`);
        this.fcmToken = token;
        this.sendTokenToBackend();
      });

      // Listen for messages in foreground - only display if not already shown
      messaging().onMessage(async (remoteMessage) => {
        console.log(`${DEBUG_PREFIX} [EVENT] FCM Message Received in Foreground:`, remoteMessage);

        // Only display notification if it has data (transaction notification from backend)
        // Firebase auto-displays notifications with 'notification' field when app is in background
        if (remoteMessage.notification && remoteMessage.data?.type === 'transaction') {
          await notifee.displayNotification({
            title: remoteMessage.notification.title,
            body: remoteMessage.notification.body,
            android: {
              channelId: 'default',
              smallIcon: 'ic_menu_camera', // Your white logo without background circle
              color: '#9747ff', // FlexPay purple color
              pressAction: {
                id: 'default',
              },
            },
          });
          console.log(`${DEBUG_PREFIX} [NOTIFEE] Displaying notification with smallIcon: ic_menu_camera`);
        }
      });

      console.log(`${DEBUG_PREFIX} [SETUP] ✅ Firebase Messaging listeners registered successfully`);
    } catch (error) {
      console.error(`${DEBUG_PREFIX} [SETUP] ❌ Error setting up FCM listener:`, error);
    }
  };

  listenForAuthChanges = () => {
    let previousIsLoggedIn = store.getState().auth.isLoggedIn;
    store.subscribe(() => {
      const currentIsLoggedIn = store.getState().auth.isLoggedIn;
      if (currentIsLoggedIn && !previousIsLoggedIn) {
        this.sendTokenToBackend();
      }
      previousIsLoggedIn = currentIsLoggedIn;
    });
  };

  sendTokenToBackend = async () => {
    if (!this.fcmToken) {
      console.log(`${DEBUG_PREFIX} [SEND_TOKEN] No FCM token available to send.`);
      return;
    }

    console.log(`${DEBUG_PREFIX} [STEP 2/4] sendTokenToBackend called`);
    console.log(`${DEBUG_PREFIX} [STEP 2/4] Device token: ${this.fcmToken}`);

    const state = store.getState();
    const userToken = state.auth.authToken;
    const userId = state.auth.user?.id;
    const userName = state.auth.user?.name;

    console.log(`${DEBUG_PREFIX} [STEP 2/4] Current auth state:`, {
      hasUserToken: !!userToken,
      userId,
      userName,
      userTokenLength: userToken?.length,
    });

    if (userToken) {
      console.log(`${DEBUG_PREFIX} [STEP 2/4] ✅ User is authenticated, proceeding with token send`);

      try {
        const url = `${API_BASE}/api/user/device-token`;
        const payload = { device_token: this.fcmToken };

        console.log(`${DEBUG_PREFIX} [STEP 3/4] 📡 Sending token to backend`);
        console.log(`${DEBUG_PREFIX} [STEP 3/4] URL: ${url}`);
        console.log(`${DEBUG_PREFIX} [STEP 3/4] Payload:`, payload);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
          },
          body: JSON.stringify(payload),
        });

        console.log(`${DEBUG_PREFIX} [STEP 3/4] Response status: a${response.status}`);

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`${DEBUG_PREFIX} [STEP 3/4] ❌ Failed to send device token. Status: ${response.status}`, errorData);
        } else {
          const successData = await response.json();
          console.log(`${DEBUG_PREFIX} [STEP 4/4] ✅ Device token sent to backend successfully!`);
          console.log(`${DEBUG_PREFIX} [STEP 4/4] Response:`, successData);
        }
      } catch (error) {
        console.error(`${DEBUG_PREFIX} [STEP 3/4] ❌ Error sending device token to backend:`, error);
      }
    } else {
      console.log(`${DEBUG_PREFIX} [STEP 2/4] ❌ User not authenticated, device token NOT sent to backend`);
      console.log(`${DEBUG_PREFIX} [STEP 2/4] Auth state is empty or no user token present`);
    }
  };
}

export default new NotificationService();
