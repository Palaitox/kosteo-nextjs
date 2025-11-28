import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService } from '../services/api';
import { router } from 'expo-router';

type User = {
    _id: string;
    email: string;
    name?: string;
    // Add other fields as needed
};

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    login: (email: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    login: async () => { },
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@user');
            if (jsonValue != null) {
                setUser(JSON.parse(jsonValue));
            }
        } catch (e) {
            console.error('Failed to load user', e);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string) => {
        try {
            setIsLoading(true);
            // 1. Check if user exists
            const users = await userService.getUserByEmail(email);
            let loggedInUser;

            if (users && users.length > 0) {
                loggedInUser = users[0];
            } else {
                // 2. Create user if not exists
                loggedInUser = await userService.createUser({ email, name: email.split('@')[0] });
            }

            // 3. Save to storage
            await AsyncStorage.setItem('@user', JSON.stringify(loggedInUser));
            setUser(loggedInUser);

            // 4. Navigation is handled by the layout based on user state, 
            // but we can force it here if needed, though reactive is better.
            router.replace('/(tabs)');
        } catch (error) {
            console.error('Login failed', error);
            alert('Login failed: ' + (error as any).message);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('@user');
            setUser(null);
            router.replace('/login');
        } catch (e) {
            console.error('Logout failed', e);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
