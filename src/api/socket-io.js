import React from "react";
import { io } from "socket.io-client";
import { callRefresh } from ".";
import { apiBaseUrl } from "../consts";
import { ALL_USERS } from "../redux/types";


export const SocketIoContext = React.createContext(null);
const innitSocket = (auth,dispatch) => {
    const socket = io(apiBaseUrl, {query: {token:auth}  }); // ,autoConnect: false

    socket.on("connect_error", (err) => {
        switch(err.name){
            case 'UserNotFound':
            case 'TokenMissingError':
            case 'NotBeforeError':
            case 'JsonWebTokenError':document.dispatchEvent(new CustomEvent('CALL_LOGOUT'));break;
            case 'InternalError': console.log(err);break;
            case 'TokenExpiredError':callRefresh().then(token=>{
                socket.io.opts.query = {token:token};
                //socket.connect();
            });break;
        }
    });

    socket.on('connect',()=>{
        console.log('Connected');
        socket.emit('getAllUsers')
    })
    socket.on('users',data=>dispatch({type:ALL_USERS,users:data}))
    socket.on('usersChange',data=>dispatch(data))

    return socket;
};



export default innitSocket;
