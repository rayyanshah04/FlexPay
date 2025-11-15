import WelcomeScreen from '../screens/Onboarding/WelcomeScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import PinLockScreen from '../screens/Auth/PinLockScreen';
import BottomBar from './BottomBar';

export const screens = [
  { name: 'Welcome', component: WelcomeScreen },
  { name: 'Login', component: LoginScreen },
  { name: 'Signup', component: SignupScreen },
  { name: 'PinLock', component: PinLockScreen },
  { name: 'AppTabs', component: BottomBar },
];
