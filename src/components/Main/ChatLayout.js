import { IconButton } from '@material-ui/core';
import { InputBase } from '@material-ui/core';
import SendRounded from '@material-ui/icons/SendRounded';
import Scrollbars from 'react-custom-scrollbars-2';
import { connect } from 'react-redux';
import lonelySVG from '../../assets/images/lonely.svg'
import { imgsUrl } from '../../consts';
import AspectRatio from '../../utills/AspectRatio';
import ImageLoader from '../../utills/ImageLoader';

const NoChat = () => {
    return <div className="main-chat-box-empty">
        <img src={lonelySVG} />
        <p>Nobody's here to talk to me ;)</p>
    </div>
}
const Chat = ({ CurrentChat }) => {
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
            <div className="chat-layout">
                <div className="message-box message-box-peer">
                    <div className="message">
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</p>
                        <span>08:50</span>
                    </div>
                </div>
                <div className="message-box message-box-peer">
                    <div className="message message-pointer">
                        <p>Yeah</p>
                        <span>08:50</span>
                    </div>
                </div>

                <div className="message-box">
                    <div className="message">
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever</p>
                        <span>08:50</span>
                    </div>
                </div>
                <div className="message-box">
                    <div className="message">
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever</p>
                        <span>08:50</span>
                    </div>
                </div>
                <div className="message-box">
                    <div className="message message-pointer">
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever</p>
                        <span>08:50</span>
                    </div>
                </div>
            </div>
        </Scrollbars>

        <form className="main-chat-input input">
            <InputBase
                style={{ flexGrow: 1 }}
                inputProps={{ placeholder: 'Write something' }} />
            <IconButton className="main-chat-input-send">
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