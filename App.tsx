import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import StackNavigator from './src/navigations/StackNavigator';
import { PaperProvider } from 'react-native-paper';
import { theme } from './src/theme/style';
import NotificationService from './src/utils/NotificationService';

export default function App() {
  useEffect(() => {
    // Initialize notification service
    NotificationService;
  }, []);

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <StackNavigator />
      </PaperProvider>
    </Provider>
  );
}
