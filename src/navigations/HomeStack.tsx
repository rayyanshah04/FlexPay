// navigation/HomeStack.js

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import CardScreen from '../screens/Cards/CardScreen';
import NoCardScreen from '../screens/Cards/NoCardScreen';
import LoadMoneyScreen from '../screens/Wallet/LoadMoneyScreen';
import PaymentScreen from '../screens/Payments/PaymentScreen';
// --- FIX: Import the missing screens ---
import SendMoney from '../screens/Payments/SendMoney';
import QRCodeScreen from '../screens/Wallet/QRCodeScreen';
import AddingBeneficiary from '../screens/Payments/AddingBeneficiary';
// Import other home-related screens

// --- FIX: Update the Param list to match HomeScreen ---
export type HomeStackParamList = {
  HomeMain: undefined;
  CardScreen: undefined;
  NoCardScreen: undefined;
  LoadMoneyScreen: undefined; // Renamed from LoadMoney
  PaymentScreen: undefined; // Renamed from Payment
  SendMoney: undefined; // Added
  QRCodeScreen: undefined; // Added
  AddingBeneficiary: undefined; // Added
};
const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CardScreen"
        component={CardScreen}
        options={{
          title: 'My Cards',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="NoCardScreen"
        component={NoCardScreen}
        options={{
          title: 'My Cards',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      />

      <Stack.Screen
        // --- FIX: Rename to match Param list ---
        name="LoadMoneyScreen"
        component={LoadMoneyScreen}
        options={{
          headerShadowVisible: false,
          title: 'Load Money',
        }}
      />

      {/* --- FIX: Add the missing screens --- */}
      <Stack.Screen
        name="PaymentScreen"
        component={PaymentScreen}
        options={{
          headerShadowVisible: false,
          title: 'Receive Money',
        }}
      />
      <Stack.Screen
        name="SendMoney"
        component={SendMoney}
        options={{
          headerShadowVisible: false,
          title: 'Send Money',
        }}
      />
      <Stack.Screen
        name="QRCodeScreen"
        component={QRCodeScreen}
        options={{
          headerShadowVisible: false,
          title: 'QR Code',
        }}
      />
      <Stack.Screen
        name="AddingBeneficiary"
        component={AddingBeneficiary}
        options={{
          headerShadowVisible: false,
          title: 'Add Beneficiary',
        }}
      />
    </Stack.Navigator>
  );
}