import { Platform } from 'react-native';

// Define different environment configurations
const environments = {
    local: {
        // For Android emulator (USB debugging)
        API_BASE: Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000',
    },
    ngrok: {
        // Update this URL when you run ngrok!
        // Run: ngrok http 5000
        // Then copy the https URL here (e.g., https://abcd-1234.ngrok-free.app)
        API_BASE: 'https://xt59hqjr-5000.asse.devtunnels.ms',
    },
    production: {
        API_BASE: 'https://flexpay-backend.onrender.com',
    },
};

// ==> SET YOUR CURRENT ENVIRONMENT HERE <==
// Change this value to 'local', 'ngrok', or 'production' to switch environments.
// Use 'ngrok' when building APK for external testing!
const CURRENT_ENV: 'local' | 'ngrok' | 'production' = 'ngrok';


// Export the configuration for the current environment
export const { API_BASE } = environments[CURRENT_ENV];
