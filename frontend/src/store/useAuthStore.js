import { create } from "zustand";
import axios from 'axios';
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    signup: async (userData) => {
        set({ isSigningUp: true });
        try {
            const response = await axiosInstance.post('/users/register', userData);
            console.log(response)
            set({ authUser: response.data.user, isSigningUp: false });
        } catch (error) {
            console.error("Signup error:", error);
            set({ isSigningUp: false });
        }
    },

    login: async (credentials) => {
        set({ isLoggingIn: true });
        try {
            const response = await axiosInstance.post('/users/login', credentials);
            set({ authUser: response.data.user, isLoggingIn: false });
        } catch (error) {
            console.error("Signin error:", error);
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/users/logout');
            set({ authUser: null });
        } catch (error) {
            console.error("Logout error:", error);
        }
    },

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const response = await axios.get('/api/checkAuth');
            set({ authUser: response.data.user, isCheckingAuth: false });
        } catch (error) {
            console.error("Check auth error:", error);
            set({ isCheckingAuth: false });
        }
    }
}));