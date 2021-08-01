import React from "react";
import { io } from "socket.io-client";
import { callRefresh } from ".";
import { apiBaseUrl } from "../consts";


export const SocketIoContext = React.createContext(null);
const innitSocket = auth => {
    const socket = io(apiBaseUrl, {query: {token:auth}});

    socket.on("connect_error", (err) => {
        switch(err.name){
            case 'UserNotFound':
            case 'TokenMissingError':
            case 'NotBeforeError':
            case 'JsonWebTokenError':dispatchEvent('CALL_LOGOUT');break;
            case 'InternalError': console.log(err);break;
            case 'TokenExpiredError':callRefresh().then(token=>socket.io.opts.query = {token:token});break;
        }
    });

    socket.on('connect',()=>{
        console.log('Connected');
        socket.emit('getAllUsers')
        socket.on('users',data=>console.log(data))
    })

    return socket;
};
export default innitSocket;
