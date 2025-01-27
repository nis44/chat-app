import { create } from "zustand";
import axios from "axios";
import { axiosInstance } from "../lib/axios";
import {io} from "socket.io-client"

const BASE_URL = "http://localhost:8000"

export const useAuthStore = create((set, get) => ({
  user: null, // The current user will be stored here
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  users: [],
  messages: [],
  socket: null,

  // Sign-up functionality
  signup: async (userData) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/users/register", userData);
      set({ user: response.data.user, isSigningUp: false });
      get().connectSocket();
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
      get().connectSocket();
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
      get().disconnectSocket();
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
      console.log("Updated user state:", response.data.data.user);
      get().connectSocket();
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
  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/users/get-users");
      console.log(response.data.data)
      set({ users: response.data.data, isLoading: false });
      // console.log(users)
    } catch (error) {
      console.error("Error fetching users:", error);
      set({ isLoading: false });
    }
  },

  // Fetch messages for a specific user
  fetchMessages: async (userId) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(`/users/get-messages/${userId}`);
      set({ messages: response.data.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching messages:", error);
      set({ isLoading: false });
    }
  },

  // Send a message to a specific user
  sendMessage: async (userId, messageData) => {
    try {
      const response = await axiosInstance.post(`/users/send-messages/${userId}`, messageData);
      set((state) => ({
        messages: [...state.messages, response.data.data], // Append the new message
      }));
    } catch (error) {
      console.error("Error sending message:", error);
    }
  },

  connectSocket: () => {
    const {getCurrentUser} = get()
    if(!getCurrentUser || get().socket?.connected) return;


    const socket = io(BASE_URL)
    socket.connect()
    set ({socket: socket})
  },
  disconnectSocket: () => {
    if(get().socket?.connected) get().socket.disconnect();
    set ({socket: null})
  },
}));
