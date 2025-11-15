import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import HomeStack from './HomeStack';
import MoreScreen from '../screens/Home/MoreScreen';
import { colors } from '../theme/style';

// --- Import your custom icons ---
import ScanIcon from '../assets/icons/scan.svg';
import HouseIcon from '../assets/icons/house.svg';
import MenuIcon from '../assets/icons/menu.svg';

import ScanQRScreen from '../screens/Payments/ScanQRScreen';

const Tab = createBottomTabNavigator();

// This is a dummy component. It will never be rendered.
const DummyScanScreen = () => null;

export default function BottomBar() {
  const CustomTabBar = ({ state, navigation }: any) => {
    const currentTabRoute = state.routes[state.index];
    const focusedRouteName = getFocusedRouteNameFromRoute(currentTabRoute);

    let activeTabForStyling = currentTabRoute.name;

    if (currentTabRoute.name === 'Home') {
      if (focusedRouteName === 'QRCodeScreen') {
        activeTabForStyling = 'Scan QR';
      } else if (focusedRouteName === 'HomeMain' || focusedRouteName === undefined) {
        activeTabForStyling = 'Home';
      }
    }

    // Show bottom bar only on these screens
    const screensToShowTabBar = [
      'HomeMain',
    ];

    if (currentTabRoute.name === 'Home' && focusedRouteName && !screensToShowTabBar.includes(focusedRouteName)) {
      return null;
    }

    return (
      <View style={styles.tabBarContainer}>
        <View style={styles.pillContainer}>
          {/* Home Button */}
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => navigation.navigate('Home')}
          >
            <View
              style={
                activeTabForStyling === 'Home'
                  ? styles.activeIconCircle
                  : styles.iconCircle
              }
            >
              <HouseIcon
                width={22}
                height={22}
                fill={
                  activeTabForStyling === 'Home'
                    ? colors.primary
                    : `rgba(255, 255, 255, 0.6)`
                }
              />
            </View>
          </TouchableOpacity>

          {/* Scan QR Button */}
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => navigation.navigate('Home', { screen: 'QRCodeScreen' })}
          >
            <View
              style={
                activeTabForStyling === 'Scan QR'
                  ? styles.activeIconCircle
                  : styles.iconCircle
              }
            >
              <ScanIcon
                width={22}
                height={22}
                fill={
                  activeTabForStyling === 'Scan QR'
                    ? colors.primary
                    : `rgba(255, 255, 255, 0.6)`
                }
              />
            </View>
          </TouchableOpacity>

          {/* More Button */}
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => navigation.navigate('More')}
          >
            <View
              style={
                activeTabForStyling === 'More'
                  ? styles.activeIconCircle
                  : styles.iconCircle
              }
            >
              <MenuIcon
                width={22}
                height={22}
                fill={
                  activeTabForStyling === 'More'
                    ? colors.primary
                    : `rgba(255, 255, 255, 0.6)`
                }
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent', // make navigator itself transparent
          borderTopWidth: 0,
          elevation: 0,
        },
        sceneContainerStyle: {
          backgroundColor: 'transparent', // makes screen background show
        },
      }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
        }}
      />

      <Tab.Screen
        name="Scan QR"
        component={ScanQRScreen}
        options={{
          tabBarLabel: '',
        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('Home', { screen: 'QRCodeScreen' });
          },
        })}
      />

      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          tabBarLabel: 'More',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute', // overlay on top of screen
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
    paddingTop: 14,
    paddingHorizontal: 24,
    backgroundColor: 'transparent', // <- must be transparent
  },
  pillContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)', // <-- optional translucent if you want blur effect
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 18,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
  },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  activeIconCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `rgba(255, 255, 255)`,
    overflow: 'hidden',
  },
});