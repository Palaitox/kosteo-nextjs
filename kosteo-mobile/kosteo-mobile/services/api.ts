import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getDevApiUrl = () => {
    const expoHost = Constants.expoConfig?.hostUri || Constants.expoGoConfig?.debuggerHost;
    if (expoHost) {
        const host = expoHost.split(':')[0];
        return `http://${host}:3000/api/v1`;
    }

    return Platform.select({
        android: 'http://10.0.2.2:3000/api/v1',
        ios: 'http://localhost:3000/api/v1',
        default: 'http://localhost:3000/api/v1',
    })!;
};

const DEV_API_URL = getDevApiUrl();

export const api = axios.create({
    baseURL: DEV_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const userService = {
    getUserByEmail: async (email: string) => {
        const response = await api.get(`/users`, { params: { q: email, limit: 1 } });
        return response.data;
    },
    createUser: async (userData: { email: string; name?: string }) => {
        const response = await api.post(`/users`, userData);
        return response.data;
    },
};

export const productService = {
    getProducts: async () => {
        const response = await api.get('/products');
        return response.data;
    },
};
