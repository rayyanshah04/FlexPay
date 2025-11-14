// StackNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import WelcomeScreen from '../screens/Onboarding/WelcomeScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import BottomBar from './BottomBar'; // Tab navigator
import PaymentScreen from '../screens/Payments/PaymentScreen';
import { themeStyles } from '../theme/style';
import { StyleSheet, Text, View } from 'react-native';
import QRCodeScanner from '../screens/Wallet/QRCodeScreen';
import SendMoney from '../screens/Payments/SendMoney';
import ConfirmPayment from '../screens/Payments/ConfirmPayment';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  AppTabs: undefined;
  Payment: undefined;
  QRCode: undefined;
  SendMoney: undefined;
  ConfirmPayment: {
    name: string;
    iban: string;
    amount: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const screens: {
  [K in keyof RootStackParamList]: {
    name: K;
    component: React.ComponentType<any>;
  };
}[keyof RootStackParamList][] = [
  { name: 'Welcome', component: WelcomeScreen },
  { name: 'Login', component: LoginScreen },
  { name: 'Signup', component: SignupScreen },
  { name: 'AppTabs', component: BottomBar },
  { name: 'Payment', component: PaymentScreen },
  { name: 'QRCode', component: QRCodeScanner },
  { name: 'SendMoney', component: SendMoney },
  { name: 'ConfirmPayment', component: ConfirmPayment },
];

export default function StackNavigator() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'AppTabs' : 'Welcome'}
      >
        {screens.map(screen => (
          <Stack.Screen
            key={screen.name}
            name={screen.name}
            component={screen.component}
            options={{
              headerShown: false,
              // headerShown: screen.name === 'Payment',
              // headerStyle: themeStyles.bgPrimary,
              // headerTitleAlign: 'center',
              // headerShadowVisible: false,
              // headerTintColor: '#fff',
              // headerTitle: paymentHeader,
              ...(screen.name === 'AppTabs' && {
                contentStyle: { backgroundColor: 'transparent' },
              }),
            }}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const paymentHeader = () => {
  return (
    <View style={[themeStyles.alignCenter]}>
      <Text style={styles.balanceLabel}>Current balance</Text>
      <Text style={styles.balanceAmount}>Rs. 414</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  balanceLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  balanceAmount: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
