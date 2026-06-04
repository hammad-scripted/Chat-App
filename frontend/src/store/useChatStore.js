import {create} from 'zustand';
import toast from 'react-hot-toast';

import { axiosInstance } from '../lib/axios.js';


export const useChatStore=create((set)=>({
    messages:[],
    users:[],
    selectedUsers:null,
    isUserLoading:false,
    isMessageLoading:false,


    getUsers:async()=>{
    set({isUserLoading:true});

    try{
        const res=await axiosInstance.get('/messages/users');
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
        const res=await axiosInstance.get(`/messages/${userId}`);
        set({messages:res.data});
        console.log(res.data);
    }catch(error){
        toast.error(error.response.data.message);
    }finally{
        set({isMessageLoading:false});
    }
}

}))