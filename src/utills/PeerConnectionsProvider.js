import React, { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { useEvent } from ".";
import { SocketIoContext } from "../api/socket-io";
import PeerConnections, { CHAT_DATA_CHANNEL } from "./PeerConnections";

export const PeerConnectionsContext = React.createContext(null);

export const usePeer = id => {
    const [peer, setPeer] = useState({});
    const peers = useContext(PeerConnectionsContext);
    useEffect(() => {if(id)setPeer(peers[id])}, [peers,id])
    return peer;
}

const PeerConnectionsProvider = ({ children, CurrentChat, Users }) => {

    const socketIO = useContext(SocketIoContext)

    const [peerConnections, setPeerConnections] = useState(null)

    useEffect(() => {
        if (socketIO && Users instanceof Array && Users.length > 0 && !peerConnections) {
            setPeerConnections(new PeerConnections({
                users: Users,
                onOfferCreated: (offer, id) => socketIO.emit('offer', { to: id, offer: offer }),
                onAnswerCreated: (answer, id) => socketIO.emit('answer', { to: id, answer: answer }),
                onIceCandidate: (candidate, id) => socketIO.emit('candidate', { to: id, candidate: candidate })
            }))
        }
    }, [socketIO, Users])

    useEffect(() => {
        if (socketIO && peerConnections) {
            socketIO.on('offer', data => peerConnections[data.from].prepareAnswer(data.offer))
            socketIO.on('answer', data => peerConnections[data.from].setRemoteDescription(data.answer))
            socketIO.on('candidate', data => peerConnections[data.from].addIceCandidate(data.candidate))
        }
    }, [socketIO, peerConnections])

    useEffect(() => {
        if (CurrentChat._id && socketIO && peerConnections) {
            let peer = peerConnections[CurrentChat._id];
            if (!['connecting', 'connected'].includes(peer.connectionState))
                peer.createDataChannel(CHAT_DATA_CHANNEL)
        }
    }, [CurrentChat, socketIO, peerConnections])


    return <PeerConnectionsContext.Provider value={peerConnections}>
        {children}
    </PeerConnectionsContext.Provider>
}
export default connect(
    state => {
        return {
            Users: state.Users,
            CurrentChat: state.CurrentChat,
            Profile: state.Profile
        }
    }
)(PeerConnectionsProvider)