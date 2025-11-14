import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import HomeStack from './HomeStack';
import MoreScreen from '../screens/Home/MoreScreen';
import { colors } from '../theme/style';

// --- Import your custom icons ---
import ScanIcon from '../assets/icons/scan.svg';
import HouseIcon from '../assets/icons/house.svg';
import MenuIcon from '../assets/icons/menu.svg';

const Tab = createBottomTabNavigator();

// This is a dummy component. It will never be rendered.
const DummyScanScreen = () => null;

export default function BottomBar() {
  const [activeTab, setActiveTab] = useState('Home');

  const handleTabPress = (tabName: string, navigation: any) => {
    setActiveTab(tabName);
    if (tabName === 'Home') {
      navigation.navigate('Home');
    } else if (tabName === 'Scan QR') {
      navigation.navigate('Home', { screen: 'QRCodeScreen' });
    } else if (tabName === 'More') {
      navigation.navigate('More');
    }
  };

  const CustomTabBar = ({ navigation }: any) => {
    return (
      <View style={styles.tabBarContainer}>
        <View style={styles.pillContainer}>
          {/* Home Button */}
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => handleTabPress('Home', navigation)}
          >
            <View
              style={[
                styles.iconCircle,
                activeTab === 'Home' && styles.activeCircle,
              ]}
            >
              <HouseIcon
                width={24}
                height={24}
                fill={activeTab === 'Home' ? colors.primary : `rgba(255, 255, 255, 0.6)`}
              />
            </View>
          </TouchableOpacity>

          {/* Scan QR Button */}
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => handleTabPress('Scan QR', navigation)}
          >
            <View
              style={[
                styles.iconCircle,
                activeTab === 'Scan QR' && styles.activeCircle,
              ]}
            >
              <ScanIcon
                width={24}
                height={24}
                fill={activeTab === 'Scan QR' ? colors.primary : `rgba(255, 255, 255, 0.6)`}
              />
            </View>
          </TouchableOpacity>

          {/* More Button */}
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => handleTabPress('More', navigation)}
          >
            <View
              style={[
                styles.iconCircle,
                activeTab === 'More' && styles.activeCircle,
              ]}
            >
              <MenuIcon
                width={24}
                height={24}
                fill={activeTab === 'More' ? colors.primary : `rgba(255, 255, 255, 0.6)`}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('../assets/bg.png')}
      style={styles.backgroundContainer}
      imageStyle={{
        resizeMode: 'cover',
      }}
    >
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(props) => <CustomTabBar {...props} />}
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
          component={DummyScanScreen}
          options={{
            tabBarLabel: '',
          }}
        />

        <Tab.Screen
          name="More"
          component={MoreScreen}
          options={{
            tabBarLabel: 'More',
          }}
        />
      </Tab.Navigator>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
  },
  tabBarContainer: {
    backgroundColor: 'transparent',
    paddingBottom: 24,
    paddingTop: 16,
    paddingHorizontal: 24,
  },
  pillContainer: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  activeCircle: {
    backgroundColor: `rgba(255, 255, 255)`,
  },
});