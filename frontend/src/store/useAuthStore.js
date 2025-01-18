import { create } from "zustand";

// eslint-disable-next-line no-unused-vars
export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingUp: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,

    
}))