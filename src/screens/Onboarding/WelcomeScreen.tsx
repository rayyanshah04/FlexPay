import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigations/StackNavigator';
import { themeStyles, colors } from '../../theme/style';
import { Button } from '../../components/ui/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/bg.png')}
        style={{ position: 'absolute', width: '120%', height: '120%' }}
        resizeMode="cover"
      />
      <View style={styles.contentWrapper}>
        {/* Frosted Glass Logo Container */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo-cropped.png')}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  contentWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.frostedBg,
    borderWidth: 1,
    borderColor: colors.frostedBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 250,
  },
  buttonContainer: {
    marginTop: 60,
    gap: 16,
  },
});
