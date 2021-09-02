import { IconButton } from '@material-ui/core';
import { InputBase } from '@material-ui/core';
import SendRounded from '@material-ui/icons/SendRounded';
import { useEffect, useRef, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { connect, useSelector } from 'react-redux';
import { animated, useSpring } from 'react-spring';
import { bindActionCreators } from 'redux';
import lonelySVG from '../../assets/images/lonely.svg'
import { imgsUrl } from '../../consts';
import { addMessage, loadMessages, messagesState, emptyMessages } from '../../redux/actions';
import AspectRatio from '../../utills/AspectRatio';
import { useIDB } from '../../utills/DBHelper/DBProvider';
import ImageLoader from '../../utills/ImageLoader';
import { CHAT_DATA_CHANNEL } from '../../utills/Peers/PeerConnections';
import { usePeer } from '../../utills/Peers/PeerConnectionsProvider';

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

const Message = ({ self, date, type, content }) => {
    return <div className={`message-box ${self ? '' : 'message-box-peer'}`}>
        <div className="message">
            <p>{content}</p>
            <span>08:50</span>
        </div>
    </div>
}

const ChatComponent = props => {

    const { CurrentChat, Messages, Profile, loadMessages, messagesState, addMessage, emptyMessages } = props
    const dbHelper = useIDB()
    const Peer = usePeer(CurrentChat._id);

    const [ChatDataChannel, setChatDataChannel] = useState(null)



    const checkChatDataChannel = () => {
        if (Peer && Peer.connectionState === 'connected' && !ChatDataChannel) setChatDataChannel(Peer[CHAT_DATA_CHANNEL])
    }
    const onPeerConnectionStateChange = e => {
        checkChatDataChannel()
    }
    const onChatDataChannelMessage = e => {
        if (e.type === "message") {
            let { content, id, type } = e.data;
            let message = {
                chatId: CurrentChat._id,
                senderId: CurrentChat._id,
                type: type,
                content: content,
                date: new Date(),
                id: id
            }
            dbHelper.addMessage(message).then(() => {
                addMessage(message)

                setTimeout(() => {
                    scrollToBottom()
                }, 10)
            })
        }
    }
    useEffect(() => {
        checkChatDataChannel()
        if (Peer) Peer.onconnectionstatechange = onPeerConnectionStateChange
    }, [Peer.connectionState])

    useEffect(() => {
        if (ChatDataChannel) ChatDataChannel.onmessage = onChatDataChannelMessage;
    }, [ChatDataChannel, onChatDataChannelMessage])





    const ReadMessages = () => {
        let TAKE = 20;

        if (!dbHelper) return;
        if (Messages.endOfList) return;
        if (Messages.state === 1) return;

        messagesState(1);
        dbHelper.getMessagesByChatId(CurrentChat._id, Messages.skip, TAKE)
            .then((list) => loadMessages(TAKE, list))
    }



    useEffect(() => {
        emptyMessages();
        ReadMessages();
    }, [CurrentChat, dbHelper])




    const chatLayoutRef = useRef(null)
    const scrollToBottom = () => chatLayoutRef.current.parentElement.scrollTop = chatLayoutRef.current.parentElement.scrollHeight


    useEffect(() => setTimeout(() => {
        scrollToBottom()
    }, 10), [Messages.list])


    const onMessageSubmit = e => {
        e.preventDefault();
        let input = e.target.querySelector('input');

        dbHelper.addMessage({
            chatId: CurrentChat._id,
            senderId: Profile.data._id,
            type: 'text',
            content: input.value
        }).then((message) => {
            addMessage(message);

            if (Peer.connectionState === 'connected') {
                ChatDataChannel.send({
                    id: message.id,
                    type: 'text',
                    content: input.value
                })
            }

            input.value = ''

            setTimeout(() => {
                scrollToBottom()
            }, 10)
        })
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
                {Messages.list.map(m => <Message {...m} self={Profile.data._id === m.senderId} />)}
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

const Chat = connect(
    state => {
        return {
            Messages: state.Messages,
            Profile: state.Profile
        }
    },
    dispatch => bindActionCreators({ loadMessages, messagesState, addMessage, emptyMessages }, dispatch)
)(ChatComponent)





const ChatLayout = ({ CurrentChat }) => {
    return <div className="main-chat-box flex-center">
        {CurrentChat._id ? <Chat CurrentChat={CurrentChat} /> : <NoChat />}
    </div>
}


export default connect(
    state => {
        return {
            CurrentChat: state.CurrentChat,
            Messages: state.Messages
        }
    },
    dispatch => bindActionCreators({ loadMessages, messagesState, addMessage }, dispatch)
)(ChatLayout);