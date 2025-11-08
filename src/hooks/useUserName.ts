// useUserName.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useUserName = () => {
    const [name, setName] = useState('User');

    useEffect(() => {
        AsyncStorage.getItem('userDetails').then((data) => {
            if (data) setName(JSON.parse(data).name);
        });
    }, []);

    return name;
};
