import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import StackNavigator from './src/navigations/StackNavigator';
import { PaperProvider } from 'react-native-paper';
import { theme } from './src/theme/style';

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <StackNavigator />
      </PaperProvider>
    </Provider>
  );
}
