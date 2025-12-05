import { Platform } from 'react-native';

// Define different environment configurations
const environments = {
    local: {
        // API_BASE: 'http://localhost:5000',

        // For WiFi connection (if not using USB):
        API_BASE: Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000',
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
