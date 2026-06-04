import {Server} from "socket.io";
import http from 'http';

import express from 'express';

const app=express();
const server=http.createServer(app);


// * Initialize Socket.IO server and configure CORS settings

const io=new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST","PUT","DELETE","PATCH","OPTIONS"],    
    }
}); 

export const getReceiverSocketId=  (receiverId)=>{
    return userSocketMap[receiverId];
}
// used to store online users and their corresponding socket ids
const userSocketMap={};


io.on("connection",(socket)=>{
    console.info("a user connected with id ",socket.id);

    const userId=socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId]=socket.id;
    }

    io.emit("online-users",Object.keys(userSocketMap));

    socket.on("disconnect",()=>{
        console.info("a user disconnected with id ",socket.id);
        if(userId){
            delete userSocketMap[userId];
        }
        io.emit("online-users",Object.keys(userSocketMap));
    })
 
})
export {io,server,app}