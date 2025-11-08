import AsyncStorage from '@react-native-async-storage/async-storage';

// Global variable to store username
export let username: string = 'User';

// Call this after login to set username
export const loadUserName = async () => {
    const userStr = await AsyncStorage.getItem('userDetails');
    if (userStr) {
        const user = JSON.parse(userStr);
        username = user.full_name || 'User';
    }
};

// Optional: clear user on logout
export const clearUser = async () => {
    await AsyncStorage.removeItem('userDetails');
    username = 'User';
};

// Get username from AsyncStorage directly (if you want async)
export const getUserName = async (): Promise<string> => {
    const userStr = await AsyncStorage.getItem('userDetails');
    if (!userStr) return 'User';
    const user = JSON.parse(userStr);
    return user.full_name || 'User';
};
