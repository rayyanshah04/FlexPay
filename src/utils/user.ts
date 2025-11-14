import AsyncStorage from '@react-native-async-storage/async-storage';

// Global variable to store name
export let username: string = 'User';

// Call this after login to set name
export const loadUserName = async () => {
    const userStr = await AsyncStorage.getItem('userDetails');
    if (userStr) {
        const user = JSON.parse(userStr);
        username = user.name || 'User';
    }
};

// Optional: clear user on logout
export const clearUser = async () => {
    await AsyncStorage.removeItem('userDetails');
    username = 'User';
};

// Get name from AsyncStorage directly (if you want async)
export const getUserName = async (): Promise<string> => {
    const userStr = await AsyncStorage.getItem('userDetails');
    if (!userStr) return 'User';
    const user = JSON.parse(userStr);
    return user.name || 'User';
};
