import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, AppDispatch } from './src/store';
import StackNavigator from './src/navigations/StackNavigator';
import { PaperProvider } from 'react-native-paper';
import { theme } from './src/theme/style';
import NotificationService from './src/utils/NotificationService';
import { checkAuth, selectAuthStatus } from './src/slices/authSlice';
import { ActivityIndicator, View, Platform, PermissionsAndroid } from 'react-native';
import { Camera } from 'react-native-vision-camera';

function Root() {
  const dispatch = useDispatch<AppDispatch>();
  const authStatus = useSelector(selectAuthStatus);

  useEffect(() => {
    // Initialize notification service (Firebase)
    NotificationService;

    dispatch(checkAuth());

    // Request permissions on app launch
    const requestPermissions = async () => {
      // Camera Permission
      const cameraPermission = await Camera.requestCameraPermission();
      console.log('Camera Permission:', cameraPermission);

      // Notification Permission (Android 13+)
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        console.log('Notification Permission:', granted);
      }
    };

    requestPermissions();
  }, [dispatch]);

  if (authStatus === 'loading') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <StackNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <Root />
      </PaperProvider>
    </Provider>
  );
}
