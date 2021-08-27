export const CHAT_DATA_CHANNEL = 'chatDataChannel';


class PeerConnection extends RTCPeerConnection {
    constructor({ id, onOfferCreated,onAnswerCreated, ...options }) {
        super(options ?? {})
        this.id = id;
        this.makingOffer = false;
        this.onOfferCreated = onOfferCreated;
        this.onAnswerCreated = onAnswerCreated;
        super.ondatachannel = this.ondatachannel
        super.onnegotiationneeded = this.onnegotiationneeded
    }
    onnegotiationneeded() {
        try {
            this.makingOffer = true;
            this.setLocalDescription().then(() => this.onOfferCreated(this.localDescription,this.id));
        } catch (err) {
            console.error(err);
        } finally {
            this.makingOffer = false;
        }
    }
    async prepareAnswer(offer){
        await this.setRemoteDescription(offer);
        await this.setLocalDescription();
        this.onAnswerCreated(this.localDescription,this.id)
    }
    ondatachannel(e) {
        this[e.channel.label] = e.channel
    }
    createDataChannel(label){
        if (! (label in this))
            this[label] = super.createDataChannel(label)
    }
}

export default class PeerConnections {
    constructor({ users, onOfferCreated,onAnswerCreated,onIceCandidate, ...options }) {
        this.onOfferCreated = onOfferCreated;
        this.onAnswerCreated = onAnswerCreated;
        this.onIceCandidate = onIceCandidate;
        users.forEach(user => this.addPeer({id:user._id,...options??{}}));
    }
    addPeer({ id, ...options }) {
        this[id] = new PeerConnection({
            id,
            onOfferCreated:this.onOfferCreated,
            onAnswerCreated:this.onAnswerCreated,
            ...options??{}
        })
        this[id].onicecandidate = ({ candidate })=>this.onIceCandidate(candidate,id);
    }
    removePeer(id) {
        //TODO Test disconnect
        delete this[id];
    }
}