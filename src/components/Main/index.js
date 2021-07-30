import { IconButton } from '@material-ui/core';
import { ChevronLeft, Settings } from '@material-ui/icons';
import { Scrollbars } from 'react-custom-scrollbars-2';
import userImage from '../../assets/images/45936439.jpg'
import Input from '../../utills/Input';
import RippleLayout from '../../utills/RippleLayout';
import './style.scss'

const Main = props => {
    return <div className="page main-page">
        <div className="main-chats-list">
            <div>
                <div className="d-flex ai-center">
                    <ChevronLeft fontSize="large" />
                    <h3 style={{ paddingTop: 5 }}>Peaple nearby</h3>
                </div>
                <hr />

                <div className="main-user-profile">

                    <div className="profile-image flat-neumorphic-shadow">
                        <img src={userImage} />
                    </div>
                    <h4>Ali Banai</h4>

                    <IconButton className="icon-btn flat-neumorphic-shadow-sm"><i class="fal fa-cog"></i></IconButton>
                </div>
                <hr />

                <Input
                    icon={<i class="fal fa-search"></i>}
                    neumorphic={true} type="text" placeholder="Find"
                />
            </div>
            <div className="main-chat-list-box">
                <Scrollbars autoHide autoHideTimeout={600} autoHideDuration={200}>
                    <h6 className="t-indent-2">Online</h6> <hr />

                    
                    <RippleLayout className="main-chat-list-item">
                        <div className="main-chat-list-item-img">
                            <img src={userImage} />
                        </div>
                        <div className="main-chat-list-item-info jc-sp-e fd-column">
                            <h4>Ali Banai</h4>
                            <span>hey how you doin, you good?</span>
                        </div>
                        <span className="main-chat-list-item-time">07:11</span>
                    </RippleLayout>

                    <RippleLayout className="main-chat-list-item main-chat-list-item-selected">
                        <div className="main-chat-list-item-img">
                            <img src={userImage} />
                        </div>
                        <div className="main-chat-list-item-info jc-sp-e fd-column">
                            <h4>Ali Banai</h4>
                            <span>hey how you doin, you good?</span>
                        </div>
                        <span className="main-chat-list-item-time">07:11</span>
                    </RippleLayout>

                    <RippleLayout className="main-chat-list-item">
                        <div className="main-chat-list-item-img">
                            <img src={userImage} />
                        </div>
                        <div className="main-chat-list-item-info jc-sp-e fd-column">
                            <h4>Ali Banai</h4>
                            <span>hey how you doin, you good?</span>
                        </div>
                        <span className="main-chat-list-item-time">07:11</span>
                    </RippleLayout>

                    <RippleLayout className="main-chat-list-item">
                        <div className="main-chat-list-item-img">
                            <img src={userImage} />
                        </div>
                        <div className="main-chat-list-item-info jc-sp-e fd-column">
                            <h4>Ali Banai</h4>
                            <span>hey how you doin, you good?</span>
                        </div>
                        <span className="main-chat-list-item-time">07:11</span>
                    </RippleLayout>

                    <h6 className="t-indent-2">Offline</h6> <hr />

                    <RippleLayout className="main-chat-list-item">
                        <div className="main-chat-list-item-img">
                            <img src={userImage} />
                        </div>
                        <div className="main-chat-list-item-info jc-sp-e fd-column">
                            <h4>Ali Banai</h4>
                            <span>hey how you doin, you good?</span>
                        </div>
                        <span className="main-chat-list-item-time">07:11</span>
                    </RippleLayout>
                </Scrollbars>
            </div>




        </div>
        <div className="main-chat-box">

        </div>
        <div className="main-current-chat-info">

        </div>
    </div>
}
export default Main;