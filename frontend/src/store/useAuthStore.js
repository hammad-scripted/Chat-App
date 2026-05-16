import { create } from 'zustand';

import { axiosInstance } from './../lib/axios.js';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/check', {
        withCredentials: true,
      });
      set({ authUser: res.data });
    } catch (error) {
      console.log('Error checking auth:', error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (userData) => {
    try {
      set({ isSigningUp: true });
      const res = await axiosInstance.post('/auth/signup', userData);
      toast.success('Account created successfully');
      set({ authUser: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
      console.log('Error signing up:', error);
    } finally {
      set({ isSigningUp: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      set({ authUser: null });
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error(error.response.data.message);
      console.log('Error logging out:', error);
    }
  },
  login: async (userData) => {
    try {
      set({ isLoggingIn: true });
      const res = await axiosInstance.post('/auth/login', userData);
      toast.success('Logged in successfully');
      set({ authUser: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
      console.log('Error logging in:', error);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  updateProfilePic: async ({ profilePic }) => {
    try {
      set({ isUpdatingProfile: true });
      const res = await axiosInstance.put('/auth/update-profilePic', {
        profilePic,
      });
      toast.success('Profile updated successfully');
      set({ authUser: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      console.log('Error updating profile pic:', error);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
