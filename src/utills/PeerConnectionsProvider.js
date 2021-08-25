import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { useEvent } from ".";
import { SocketIoContext } from "../api/socket-io";
import PeerConnections, { CHAT_DATA_CHANNEL } from "./PeerConnections";

export const PeerConnectionsContext = React.createContext(null);

const PeerConnectionsProvider = ({ children, Users, CurrentChat }) => {

    const socketIO = useContext(SocketIoContext)
    const [peerConnections, setPeerConnections] = useState(null)

    useEffect(() => {
        if (Users instanceof Array && Users.length > 0 && !peerConnections) {
            setPeerConnections(new PeerConnections(Users))
        }
    }, [Users])

    useEffect(() => {
        if (socketIO && peerConnections) {

            socketIO.on('offer', data => {
                console.log(data);
                let peer = peerConnections.getPeer(data.from);
                peer.connection.setRemoteDescription(data.offer)
                peerConnections.createChatDataChannel(data.from, CHAT_DATA_CHANNEL)
                peerConnections.createAnswer(data.from).then(answer => socketIO.emit('answer',{
                    to: data.from,
                    answer: answer
                }))
            })

            socketIO.on('answer', data => {
                let peer = peerConnections.getPeer(data.from);
                peer.connection.setRemoteDescription(data.answer)
            })



            // socketIO.on('usersChange',(data)=>console.log('TEST',data))
            // console.log(socketIO)
        }
    }, [socketIO, peerConnections])

    useEffect(() => {
        if (CurrentChat._id) {
            let peer = peerConnections.getPeer(CurrentChat._id);
            if (!['connecting', 'connected'].includes(peer.connection.connectionState)) {
                peerConnections.createOffer(CurrentChat._id).then(offer => socketIO.emit('offer',{
                    to: CurrentChat._id,
                    offer: offer
                }))
            }
        }
    }, [CurrentChat])

    console.log(peerConnections)


    return <PeerConnectionsContext.Provider value={peerConnections}>
        {children}
    </PeerConnectionsContext.Provider>
}
export default connect(
    state => {
        return {
            Users: state.Users,
            CurrentChat: state.CurrentChat
        }
    }
)(PeerConnectionsProvider)