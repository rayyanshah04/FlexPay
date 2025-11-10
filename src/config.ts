import { Platform } from 'react-native';

// Define different environment configurations
const environments = {
    local: {
        // For Android emulator, 10.0.2.2 points to the host machine's localhost
        API_BASE: Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000',
    },
    production: {
        API_BASE: 'https://flexpay-backend.onrender.com',
    },
};

// ==> SET YOUR CURRENT ENVIRONMENT HERE <==
// Change this value to 'local' or 'production' to switch environments.
const CURRENT_ENV: 'local' | 'production' = 'production';


// Export the configuration for the current environment
export const { API_BASE } = environments[CURRENT_ENV];
