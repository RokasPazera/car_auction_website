import { writable } from 'svelte/store';

export const userStore = writable({
    id: null,
    username: '',
    email: '',
    isAdmin: false,
});

export const setUser = (userData) => {
    userStore.set({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        isAdmin: userData.isAdmin,
    });
};

export const clearUser = () => {
    userStore.set({
        id: null,
        username: '',
        email: '',
        isAdmin: false,
    });
};