import { StyleSheet } from "react-native";

// --- Rayyan Theme Styles ---
export const themeStyles = StyleSheet.create({
    // --- Button Styles ---
    button: {
        paddingVertical: 10, // Made buttons slightly taller
        borderRadius: 12, // Rounded corners
        fontSize: 18,
        fontWeight: '600',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
    },
    btnPrimary: {
        backgroundColor: '#F94188', // Solid pink
    },
    // Renamed to 'btnSecondary' for clarity
    btnSecondary: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)', // Frosted glass
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
    },

    // --- Input Styles (Frosted Glass) ---
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        color: '#FFFFFF', // White text
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        fontSize: 16,
        fontWeight: '500',
    },

    // --- Utility Colors ---
    primary: {
        color: "#F94188"
    },
    bgPrimary: {
        backgroundColor: '#F94188'
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
    // ... add any other styles you need
});

export const meshGradientBackground = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#193546', // Base color for blending
    overflow: 'hidden',
  },
  gradientLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});