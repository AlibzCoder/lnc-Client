import React from "react";
import { io } from "socket.io-client";
import { apiBaseUrl } from "../consts";


export const SocketIoContext = React.createContext(null);
const innitSocket = auth => {
    const socket = io(apiBaseUrl, { query: `auth_token=${auth}` });

    socket.on('error', function (err) {
        console.log(err)
        throw new Error(err);
    });
    socket.on('success', function (data) {
        console.log(data);
    })
    return socket;
};
export default innitSocket;
