import { IconButton } from '@material-ui/core';
import { InputBase } from '@material-ui/core';
import SendRounded from '@material-ui/icons/SendRounded';
import { useEffect, useRef, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { connect } from 'react-redux';
import { animated, useSpring } from 'react-spring';
import lonelySVG from '../../assets/images/lonely.svg'
import { imgsUrl } from '../../consts';
import AspectRatio from '../../utills/AspectRatio';
import ImageLoader from '../../utills/ImageLoader';
import { CHAT_DATA_CHANNEL } from '../../utills/PeerConnections';
import { usePeer } from '../../utills/PeerConnectionsProvider';

const NoChat = () => {
    return <div className="main-chat-box-empty">
        <img src={lonelySVG} />
        <p>Nobody's here to talk to me ;)</p>
    </div>
}

const a = [
    // {
    //     self: false,
    //     message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
    //     new: false,
    // },
    // {
    //     self: false,
    //     message: 'Yeah',
    //     new: false,
    // },
    // {
    //     self: true,
    //     message: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    //     new: false,
    // },
    // {
    //     self: true,
    //     message: 'Ok Nigga',
    //     new: false,
    // }
]

const AnimatedMessage = ({ message }) => {
    return <div className={`message-box ${message.self ? '' : 'message-box-peer'}`}>
        <div className="message">
            <p>{message.message}</p>
            <span>08:50</span>
        </div>
    </div>
}

const Chat = ({ CurrentChat }) => {


    const Peer = usePeer(CurrentChat._id);
    const [ChatDataChannel, setChatDataChannel] = useState(null)

    const checkChatDataChannel = () => {
        console.log(Peer.connectionState, !ChatDataChannel)
        if (Peer && Peer.connectionState === 'connected' && !ChatDataChannel) setChatDataChannel(Peer[CHAT_DATA_CHANNEL])
    }
    const onPeerConnectionStateChange = e => {
        checkChatDataChannel()
    }
    const onChatDataChannelMessage = e => {
        if (e.type === "message") {
            addToList({ self: false, message: e.data, new: true });
        }
    }
    useEffect(() => {
        checkChatDataChannel()
        if (Peer) Peer.onconnectionstatechange = onPeerConnectionStateChange
    }, [Peer.connectionState])

    useEffect(() => {
        if (ChatDataChannel) ChatDataChannel.onmessage = onChatDataChannelMessage;
    })

    console.log(Peer)





    const chatLayoutRef = useRef(null)
    const [list, setList] = useState([])

    const addToList = message => {
        setList([...list, ...[message]])
        setTimeout(() => {
            chatLayoutRef.current.parentElement.scrollTop = chatLayoutRef.current.parentElement.scrollHeight
        }, 10)
    }

    const onMessageSubmit = e => {
        e.preventDefault();
        addToList({
            self: true,
            message: e.target.querySelector('input').value,
            new: true,
        });
        ChatDataChannel.send(e.target.querySelector('input').value)
        e.target.querySelector('input').value = ''
    }



    return <div className="main-chat">
        <div className="main-chat-topbar">
            <div className="main-chat-user">
                <div className={`main-chat-user-img ${CurrentChat.isOnline ? 'main-chat-user-img-online' : ''}`}>
                    <AspectRatio>
                        <ImageLoader
                            src={`${imgsUrl}${CurrentChat._id}.jpg?v=${CurrentChat.profileImgVersion}`}
                            loading={() => <i style={{ fontSize: '1.25rem' }} className="fal fa-user flex-center"></i>}
                            error={() => <i style={{ fontSize: '1.25rem' }} className="fal fa-user flex-center"></i>}
                        />
                    </AspectRatio>
                </div>
                <div className="main-chat-user-info jc-sp-e fd-column">
                    <h4>{CurrentChat.name}</h4>
                    <span>hey how you doin, you good?</span>
                </div>
            </div>
        </div>

        <Scrollbars autoHide autoHideTimeout={600} autoHideDuration={200}>
            <div className="chat-layout" ref={chatLayoutRef}>
                {list.map(message => <AnimatedMessage message={message} />)}
            </div>
        </Scrollbars>



        <form className="main-chat-input input" onSubmit={onMessageSubmit}>
            <InputBase
                style={{ flexGrow: 1 }}
                inputProps={{ placeholder: 'Write something' }} />
            <IconButton className="main-chat-input-send" type="submit">
                <SendRounded />
            </IconButton>
        </form>
    </div>
}

const ChatLayout = ({ CurrentChat }) => {
    return <div className="main-chat-box flex-center">
        {CurrentChat._id ? <Chat CurrentChat={CurrentChat} /> : <NoChat />}
    </div>
}


export default connect(
    state => {
        return {
            CurrentChat: state.CurrentChat
        }
    }
)(ChatLayout);