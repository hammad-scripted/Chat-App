import {create} from 'zustand';
import toast from 'react-hot-toast';

import { axiosInstance } from '../lib/axios.js';

import {useAuthStore} from './useAuthStore.js';
export const useChatStore=create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUserLoading:false,
    isMessageLoading:false,


    getUsers:async()=>{
    set({isUserLoading:true});

    try{
        const res=await axiosInstance.get('/message/users');
        set({users:res.data});
        console.log(res.data);

    }catch(error){
        toast.error(error.response.data.message);
    }finally{
        set({isUserLoading:false});
    }


},
getMessages:async(userId)=>{
    set({isMessageLoading:true});
    try{
        const res=await axiosInstance.get(`/message/${userId}`);
        set({messages:res.data});
        console.log(res.data);
    }catch(error){
        toast.error(error.response.data.message);
    }finally{
        set({isMessageLoading:false});
    }
},
sendMessage:async(messageData)=>{
    const {selectedUser,messages}=get();
    try{
        const res=await axiosInstance.post(`/message/${selectedUser._id}`,messageData);
        set({messages:[...messages,res.data]});
    }catch(error){
        toast.error(error.response.data.message);   
    }

}
,
// subscribe to new messages using socket.io
subscribeToMessages:()=>{
    const {selectedUser,messages}=get();
    if(!selectedUser) return;
    const socket=useChatStore.getState().socket;
    

    socket.on("new-message",(newMessage)=>{
        set({messages:[...get().messages,newMessage]});
    });


}
,
unsubscribeFromMessages:()=>{

    const socket=useChatStore.getState().socket;
    socket.off("new-message");
}
,


setSelectedUser:(selectedUser)=>{
    set({selectedUser});
}

})) 