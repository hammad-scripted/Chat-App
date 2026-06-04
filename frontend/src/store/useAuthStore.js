import { create } from 'zustand';
import {io} from 'socket.io-client';
import { axiosInstance } from './../lib/axios.js';
import toast from 'react-hot-toast';
import { useChatStore } from './useChatStore.js';
const BASE_URL= 'http://localhost:5001';

export const useAuthStore = create((set,get) => ({
  onlineUsers: [],
  socket: null,
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
      get().connectSocket();
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
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      console.log('Error signing up:', error);
    } finally {
      set({ isSigningUp: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      set({ authUser: null });
      get().disconnectSocket();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      console.log('Error logging out:', error);
    }
  },
  login: async (userData) => {
    try {
      set({ isLoggingIn: true });
      const res = await axiosInstance.post('/auth/login', userData);
      toast.success('Logged in successfully');
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
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
  connectSocket:()=>{
    const {authUser}=get();
    if(!authUser || get().socket?.connected){
      // user not authenticated or already connected
      console.log('User not authenticated or socket already connected, cannot connect to socket');
      return;
    }
    const socket=io(BASE_URL,{
      query:{
        userId:authUser._id
      }
    });
    socket.connect();
    set({socket});
    // also mirror socket into chat store so other stores can use it
    try{ useChatStore.setState({ socket }); }catch(e){/* ignore if chat store not ready */}

    socket.on("online-users",(userIds)=>{
      set({onlineUsers:userIds});
    }); 


  }
  ,
  disconnectSocket:()=>{
   if(get().socket?.connected){
    get().socket.disconnect();
    set({socket:null});
    try{ useChatStore.setState({ socket: null }); }catch(e){}
   }
  }
}));
