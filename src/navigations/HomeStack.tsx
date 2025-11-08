// navigation/HomeStack.js

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import CardScreen from '../screens/CardScreen';
import LoadMoneyScreen from '../screens/LoadMoneyScreen';
import PaymentScreen from '../screens/PaymentScreen';
// --- FIX: Import the missing screens ---
import SendMoney from '../screens/SendMoney';
import QRCodeScreen from '../screens/QRCodeScreen';
// Import other home-related screens

// --- FIX: Update the Param list to match HomeScreen ---
export type HomeStackParamList = {
  HomeMain: undefined;
  CardScreen: undefined;
  LoadMoneyScreen: undefined; // Renamed from LoadMoney
  PaymentScreen: undefined; // Renamed from Payment
  SendMoney: undefined; // Added
  QRCodeScreen: undefined; // Added
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
    </Stack.Navigator>
  );
}