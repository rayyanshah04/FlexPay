import { MD3LightTheme as DefaultTheme, configureFonts } from 'react-native-paper';

// Font config remains the same as it's not a visual style change
const fontConfig = {
  displayLarge: { fontFamily: 'Inter-Bold', fontSize: 32 },
  displayMedium: { fontFamily: 'Inter-SemiBold', fontSize: 24 },
  titleLarge: { fontFamily: 'Inter-SemiBold', fontSize: 20 },
  bodyMedium: { fontFamily: 'Inter-Regular', fontSize: 16 },
  labelLarge: { fontFamily: 'Inter-Medium', fontSize: 14 },
};

// --- Rayyan Theme Definition ---
export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // --- Core Rayyan Theme Colors ---
    primary: '#0871B3', // The main brand blue
    secondary: '#6A057F', // A vibrant purple
    tertiary: '#90E0EF', // A lighter blue
    accent: '#d4f3fdff', // A complementary blue-green

    // --- App Colors ---
    background: 'transparent', // Screens will use a gradient, not a solid color
    surface: 'rgba(255, 255, 255, 0.15)', // "Frosted glass" for cards/surfaces

    // --- Text Colors ---
    text: '#FFFFFF', // Default text is now white
    onPrimary: '#FFFFFF', // Text on a solid pink button
    onSecondary: '#FFFFFF', // Text on a secondary button

    // --- Other ---
    outline: 'rgba(255, 255, 255, 0.3)', // Border for "frosted glass" elements
  },
  fonts: configureFonts({ config: fontConfig }),
};

// --- Mesh Gradient Background (for cards) ---
export const meshGradientBackground = {
  container: {
    position: 'relative' as const,
    overflow: 'hidden' as const,
    backgroundColor: '#81d3f1ff',
  },
  gradientLayer: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Individual gradient configurations
  gradients: [
    {
      name: 'topLeft',
      colors: ['#4CB7B1', 'transparent'],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    {
      name: 'topRight',
      colors: ['#0871B3', 'transparent'],
      start: { x: 1, y: 0 },
      end: { x: 0, y: 1 },
    },
    {
      name: 'bottomLeft',
      colors: ['#0871B3', 'transparent'],
      start: { x: 0, y: 1 },
      end: { x: 1, y: 0 },
    },
    {
      name: 'bottomRight',
      colors: ['#4CB7B1', 'transparent'],
      start: { x: 1, y: 1 },
      end: { x: 0, y: 0 },
    },
  ],
};