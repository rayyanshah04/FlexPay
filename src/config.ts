import { Platform } from 'react-native';

// Define different environment configurations
const environments = {
    local: {
        // For Android emulator, 10.0.2.2 points to the host machine's localhost
        // API_BASE: Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000',
        
        // For physical Android device, use your computer's local IP address
        // Make sure your phone and computer are on the same WiFi network
        API_BASE: Platform.OS === 'android' ? 'http://192.168.0.205:5000' : 'http://localhost:5000',
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
