import { writable } from 'svelte/store';
import { jwtDecode } from 'jwt-decode'

export const tokenStore = writable(null);

export const setToken = (token) => {
    tokenStore.set(token);
};


export const clearToken = () => {
    tokenStore.set(null);
};

export const getUserIdFromToken = (token) => {
    if (!token) return null;

    try {
        const decoded = jwtDecode(token); // Decode the token
        return decoded?.id || null; // Extract the 'id' field
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
};

