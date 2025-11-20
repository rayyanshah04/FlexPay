// StackNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn, selectIsAuthenticated } from '../slices/authSlice';
import WelcomeScreen from '../screens/Onboarding/WelcomeScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import PinLockScreen from '../screens/Auth/PinLockScreen';
import PinSetupScreen from '../screens/Auth/PinSetupScreen';
import ConfirmPayment from '../screens/Payments/ConfirmPayment';
import PaymentSuccess from '../screens/Payments/PaymentSuccess';
import AllTransactionsScreen from '../screens/Home/AllTransactionsScreen';
import BottomBar from './BottomBar';
import { themeStyles } from '../theme/style';

const Stack = createNativeStackNavigator();

const screens = [
  { name: 'Welcome', component: WelcomeScreen },
  { name: 'Login', component: LoginScreen },
  { name: 'Signup', component: SignupScreen },
  { name: 'PinLock', component: PinLockScreen },
  { name: 'PinSetup', component: PinSetupScreen },
  { name: 'ConfirmPayment', component: ConfirmPayment },
  { name: 'PaymentSuccess', component: PaymentSuccess },
  { name: 'AllTransactions', component: AllTransactionsScreen },
  { name: 'AppTabs', component: BottomBar },
];

// ...

export default function StackNavigator() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isLoggedIn ? 'PinLock' : 'Welcome'}
      >
        {screens.map(screen => {
          // Only show AppTabs if both tokens are valid (logged in + authenticated)
          if (screen.name === 'AppTabs' && (!isLoggedIn || !isAuthenticated)) {
            return null;
          }
          return (
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
          );
        })}
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
