export const CHAT_DATA_CHANNEL = 'chatDataChannel';

export default class PeerConnections {
    constructor(users) {
        this.Peers = {}
        users.forEach(user => this.addPeer(user._id));
    }
    addPeer(id) {
        this.Peers[id] = {
            connection: new RTCPeerConnection(),
        }
        this.Peers[id].connection.ondatachannel = e => {
            console.log('onDataChannel',e);
            this.Peers[id][e.channel.label] = e.channel
        };
    }
    removePeer(id) {
        //TODO Test disconnect
        delete this.Peers[id];
    }
    createOffer(id) {
        return new Promise(resolve =>
            this.Peers[id].connection.createOffer().then(offer => {
                this.Peers[id].connection.setLocalDescription(offer);
                resolve(offer)
            }))
    }
    createAnswer(id) {
        return new Promise(resolve =>
            this.Peers[id].connection.createAnswer().then(answer => {
                this.Peers[id].connection.setLocalDescription(answer)
                resolve(answer)
            }))
    }

    createChatDataChannel(id,channelName){
        if(!(channelName in this.Peers[id]))
            this.Peers[id][channelName] = this.Peers[id].connection.createDataChannel(channelName)
    }

    getPeer(id){
        return this.Peers[id]
    }

    usersChangeListener(data){
        console.log(data)
    }
}