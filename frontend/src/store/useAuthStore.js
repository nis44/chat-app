import { create } from "zustand";
import axios from "axios";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => ({
  user: null, // The current user will be stored here
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  // Sign-up functionality
  signup: async (userData) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/users/register", userData);
      set({ user: response.data.user, isSigningUp: false });
    } catch (error) {
      console.error("Signup error:", error);
      set({ isSigningUp: false });
    }
  },

  // Login functionality
  login: async (credentials) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post("/users/login", credentials);
      set({ user: response.data.data.user, isLoggingIn: false });
    } catch (error) {
      console.error("Signin error:", error);
      set({ isLoggingIn: false });
    }
  },

  // Logout functionality
  logout: async () => {
    try {
      await axiosInstance.post("/users/logout");
      set({ user: null });
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  // Check authentication status
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axios.get("/api/checkAuth");
      set({ user: response.data.user, isCheckingAuth: false });
    } catch (error) {
      console.error("Check auth error:", error);
      set({ isCheckingAuth: false });
    }
  },

  // Fetch current user data
  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get("/users/current-user");
      set({ user: response.data.data.user });
    //   console.log("Updated user state:", response.data.data.user);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  },

  // Update user account details
  updateAccountDetails: async (details) => {
    set({ isUpdatingProfile: true });
    try {
      console.log(details)
      const response = await axiosInstance.patch("/users/update-account", details);
      set({ user: response.data.data.user, isUpdatingProfile: false });
    } catch (error) {
      console.error("Error updating account details:", error);
      set({ isUpdatingProfile: false });
    }
  },

  // Update user avatar
  updateAvatar: async (avatarFile) => {
    set({ isUpdatingProfile: true });
    try {
       
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      //  console.log(avatarFile);
      const response = await axiosInstance.patch("/users/avatar", avatarFile);

      // console.log("Updated user state:", response.data.data.user);
      

      set({ user: response.data.data.user, isUpdatingProfile: false });
    } catch (error) {
      console.error("Error updating avatar:", error);
      set({ isUpdatingProfile: false });
    }
  },
}));
