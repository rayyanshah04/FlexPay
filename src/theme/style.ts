import { Background } from '@react-navigation/elements';
import { StyleSheet } from 'react-native';
import {
    MD3LightTheme as DefaultTheme,
    configureFonts,
} from 'react-native-paper';
import { black } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

// --- Centralized Colors ---
export const colors = {
    white: '#FFFFFF',
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.85)',
    textDark: '#222222',
    inputText: '#ffffffff',
    placeholder: '#999',
    icon: '#888',
    error: 'red',
    frostedBg: 'rgba(255, 255, 255, 0.7)',
    frostedBorder: 'rgba(255, 255, 255, 0.3)',
    primary: '#9747ff',
    secondary: '#454545',
    tertiary: '#90E0EF',
    buttonSecondaryBg: 'rgba(255, 255, 255, 0.05)',
    buttonSecondaryBorder: 'rgba(255, 255, 255, 0.3)',
    accent: '#d4f3fdff',
    success: '#34C759',
    Background: '#121212',
    black: '#000000',
};

// --- Rayyan Theme Styles ---
export const themeStyles = StyleSheet.create({
    // --- Button Styles ---
    button: {
        paddingVertical: 10,
        borderRadius: 120,
        fontSize: 18,
        fontWeight: '600',
    },

    // --- Input Styles ---
    inputWrapper: {
        height: 55,
        borderRadius: 999,
        padding: 2,
        marginBottom: 20,
        marginHorizontal: 20,
    },
    inputInner: {
        flex: 1,
        backgroundColor: 'transparent',
        borderRadius: 999,
        borderWidth: 1,
        borderColor: colors.buttonSecondaryBorder,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    input: {
        flex: 1,
        paddingHorizontal: 16,
        fontSize: 16,
        color: colors.inputText,
    },
    eyeIcon: {
        paddingHorizontal: 12,
    },

    // --- Utility Classes (Kept from original) ---
    wFull: {
        width: '100%',
    },
    textCenter: {
        textAlign: 'center',
    },
    textEnd: {
        textAlign: 'right',
    },
    flexRow: {
        flexDirection: 'row',
    },
    alignCenter: {
        alignItems: 'center',
    },
    justifyCenter: {
        justifyContent: 'center',
    },
});


// --- Content from theme.ts ---

// Font config
const fontConfig = {
    displayLarge: { fontFamily: 'Inter-Bold', fontSize: 32 },
    displayMedium: { fontFamily: 'Inter-SemiBold', fontSize: 24 },
    titleLarge: { fontFamily: 'Inter-SemiBold', fontSize: 20 },
    bodyMedium: { fontFamily: 'Inter-Regular', fontSize: 16 },
    labelLarge: { fontFamily: 'Inter-Medium', fontSize: 14 },
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
    gradients: [
        { name: 'topLeft', colors: ['#4CB7B1', 'transparent'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
        { name: 'topRight', colors: ['#0871B3', 'transparent'], start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
        { name: 'bottomLeft', colors: ['#0871B3', 'transparent'], start: { x: 0, y: 1 }, end: { x: 1, y: 0 } },
        { name: 'bottomRight', colors: ['#4CB7B1', 'transparent'], start: { x: 1, y: 1 }, end: { x: 0, y: 0 } },
    ],
};