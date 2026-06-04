import {create} from 'zustand';
import toast from 'react-hot-toast';

import { axiosInstance } from '../lib/axios.js';

import {useAuthStore} from './useAuthStore.js';
export const useChatStore=create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUserLoading:false,
    isMessagesLoading:false,
    socket:null,


    getUsers:async()=>{
    set({isUserLoading:true});

    try{
        const res=await axiosInstance.get('/message/users');
        set({users:res.data});
        console.log(res.data);

    }catch(error){
        toast.error(error.response?.data?.message || error.message);
    }finally{
        set({isUserLoading:false});
    }


},
getMessages:async(userId)=>{
    set({isMessagesLoading:true});
    try{
        const res=await axiosInstance.get(`/message/${userId}`);
        set({messages:res.data});
        console.log(res.data);
    }catch(error){
        toast.error(error.response?.data?.message || error.message);
    }finally{
        set({isMessagesLoading:false});
    }
},
sendMessage:async(messageData)=>{
    const {selectedUser,messages}=get();
    if(!selectedUser){
        toast.error('No recipient selected');
        return;
    }
    try{
        const res=await axiosInstance.post(`/message/send/${selectedUser._id}`,messageData);
        set({messages:[...messages,res.data]});
    }catch(error){
        toast.error(error.response?.data?.message || error.message);   
    }

}
,
// subscribe to new messages using socket.io
subscribeToMessages:()=>{
    const {selectedUser}=get();
    if(!selectedUser) return;
    const socket=useChatStore.getState().socket;
    if(!socket) return;

    // avoid duplicate handlers
    socket.off("new-message");
    socket.on("new-message",(newMessage)=>{
        set({messages:[...get().messages,newMessage]});
    });


}
,
unsubscribeFromMessages:()=>{

    const socket=useChatStore.getState().socket;
    if(!socket) return;
    socket.off("new-message");
}
,

setSelectedUser:(selectedUser)=>{
    set({selectedUser});
}

})) 