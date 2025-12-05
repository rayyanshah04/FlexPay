import { Platform } from 'react-native';

// Define different environment configurations
const environments = {
    local: {
        // Use localhost for all devices (requires adb reverse for Android)
        // Run: adb reverse tcp:5000 tcp:5000 && adb reverse tcp:8081 tcp:8081
        API_BASE: 'http://localhost:5000',

        // For WiFi connection (if not using USB):
        // API_BASE: Platform.OS === 'android' ? 'http://192.168.0.205:5000' : 'http://localhost:5000',
    },
    production: {
        API_BASE: 'https://flexpay-backend.onrender.com',
    },
};

// ==> SET YOUR CURRENT ENVIRONMENT HERE <==
// Change this value to 'local' or 'production' to switch environments.
const CURRENT_ENV: 'local' | 'production' = 'local';


// Export the configuration for the current environment
export const { API_BASE } = environments[CURRENT_ENV];
