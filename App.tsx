import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, AppDispatch } from './src/store';
import StackNavigator from './src/navigations/StackNavigator';
import { PaperProvider } from 'react-native-paper';
import { theme } from './src/theme/style';
import NotificationService from './src/utils/NotificationService';
import { checkAuth, selectAuthStatus } from './src/slices/authSlice';
import { ActivityIndicator, View } from 'react-native';

function Root() {
  const dispatch = useDispatch<AppDispatch>();
  const authStatus = useSelector(selectAuthStatus);

  useEffect(() => {
    // Initialize notification service
    NotificationService;
    dispatch(checkAuth());
  }, [dispatch]);

  if (authStatus === 'idle' || authStatus === 'loading') {
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
