import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import HomeStack from './HomeStack';
import MoreScreen from '../screens/Home/MoreScreen';
import { theme } from '../theme/theme';

// --- Import your custom icons ---
import ScanIcon from '../assets/icons/scan.svg';
import HouseIcon from '../assets/icons/house.svg';
import MenuIcon from '../assets/icons/menu.svg';

const Tab = createBottomTabNavigator();

// This is a dummy component. It will never be rendered.
// We just need it to make the tab button work.
const DummyScanScreen = () => null;

export default function BottomBar() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#88AABB',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 10,
          shadowOpacity: 0.1,
        },
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 12,
        },
      }}
    >
      {/* Home Tab */}
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarItemStyle: { paddingLeft: 20 },
          tabBarIcon: ({ color, size }) => (
            <HouseIcon width={size} height={size} fill={color} />
          ),
        }}
      />

      {/* Scan QR Button */}
      <Tab.Screen
        name="Scan QR"
        component={DummyScanScreen}
        options={({ navigation }) => ({
          tabBarLabel: '',
          tabBarButton: props => (
            <TouchableOpacity
              style={styles.scanButtonContainer}
              onPress={() =>
                navigation.navigate('Home', { screen: 'QRCodeScreen' })
              }
            >
              <View style={[styles.scanButton, { backgroundColor: theme.colors.primary }]}>
                <ScanIcon width={38} height={38} fill="#FFFFFF" />
              </View>
            </TouchableOpacity>
          ),
        })}
      />

      {/* More Tab */}
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          tabBarLabel: 'More',
          tabBarItemStyle: { paddingRight: 20 },
          tabBarIcon: ({ color, size }) => (
            <MenuIcon width={size} height={size} fill={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  scanButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButton: {
    width: 60,
    height: 60,
    borderRadius: 40,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    transform: [{ translateY: -15 }],
    justifyContent: 'center',
    alignItems: 'center',
  },
});