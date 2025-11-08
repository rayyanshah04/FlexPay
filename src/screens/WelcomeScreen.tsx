import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/StackNavigator';
import { themeStyles } from '../theme/style';
import { Button } from '../components/ui/Button';
import LinearGradient from 'react-native-linear-gradient';
import { theme, meshGradientBackground } from '../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={[styles.container, meshGradientBackground.container]}>
      {/* Mesh Gradient Layers */}
      {meshGradientBackground.gradients.map((gradient, index) => (
        <LinearGradient
          key={index}
          colors={gradient.colors}
          locations={[0, 0.75]}
          start={gradient.start}
          end={gradient.end}
          style={meshGradientBackground.gradientLayer}
        />
      ))}

      {/* Frosted Glass Logo Container */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logo-cropped.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Welcome Text */}
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Sign up or login to get started</Text>

      {/* Buttons */}
      <View style={[themeStyles.wFull, styles.buttonContainer]}>
        <Button
          variant="primary"
          onPress={() => navigation.navigate('Signup')}
        >
          Sign Up
        </Button>

        <Button
          variant="secondary"
          onPress={() => navigation.navigate('Login')}
        >
          Login
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    position: 'relative',
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    zIndex: 10,
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 16,
    zIndex: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    maxWidth: 250,
    zIndex: 10,
  },
  buttonContainer: {
    marginTop: 60,
    gap: 16,
    zIndex: 10,
  },
});