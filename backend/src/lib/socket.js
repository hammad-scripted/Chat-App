import {Server} from "socket.io";
import http from 'http';

import express from 'express';

const app=express();
const server=http.createServer(app);


const io=new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST","PUT","DELETE","PATCH","OPTIONS"],    
    }
}); 


io.on("connection",(socket)=>{
    console.log("a user connected with id ",socket.id);

    socket.on("disconnect",()=>{
        console.log("a user disconnected with id ",socket.id);
    })
 
})
export {io,server,app}