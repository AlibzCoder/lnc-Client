import { IconButton } from '@material-ui/core';
import { ChevronLeft, Settings } from '@material-ui/icons';
import { useContext, useEffect } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { connect } from 'react-redux';
import userImage from '../../assets/images/45936439.jpg'
import { useTransition, animated } from 'react-spring';
import Input from '../../utills/Input';
import RippleLayout from '../../utills/RippleLayout';
import './style.scss'
import { useState } from 'react';



const user_item_height = 76;//3.75em + (1em padding + 1em margin) => 1em = 16px

const Main = props => {

    const transitions = useTransition(props.Users.map((data, i) => ({ ...data, y: i * user_item_height })),
        {
            key: item => item._id,
            from: { height: 0, opacity: 0 },
            leave: { height: 0, opacity: 0 },
            enter: ({ y, height }) => ({ y, height, opacity: 1 }),
            update: ({ y, height }) => ({ y, height }),
        }
    )







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
                <Scrollbars autoHide autoHideTimeout={600} autoHideDuration={200} height={props.Users.length*user_item_height}>

                    {transitions((style, user, t, index) => (
                        <animated.div style={{ zIndex: props.Users.length - index, ...style }}>
                            {console.log(user)}
                            <RippleLayout className="main-chat-list-item">
                                <div className={`main-chat-list-item-img ${user.isOnline?'main-chat-list-item-online':''}`}>
                                    <img src={userImage} />
                                </div>
                                <div className="main-chat-list-item-info jc-sp-e fd-column">
                                    <h4>{user.name}</h4>
                                    <span>hey how you doin, you good?</span>
                                </div>
                                <span className="main-chat-list-item-time">07:11</span>
                            </RippleLayout>
                        </animated.div>
                    ))}




                    {/* <RippleLayout className="main-chat-list-item main-chat-list-item-selected">
                        <div className="main-chat-list-item-img">
                            <img src={userImage} />
                        </div>
                        <div className="main-chat-list-item-info jc-sp-e fd-column">
                            <h4>Ali Banai</h4>
                            <span>hey how you doin, you good?</span>
                        </div>
                        <span className="main-chat-list-item-time">07:11</span>
                    </RippleLayout> */}




                </Scrollbars>
            </div>




        </div>
        <div className="main-chat-box">

        </div>
        <div className="main-current-chat-info">

        </div>
    </div>
}
const mapStateToProps = state => {
    return {
        Profile: state.Profile,
        Users: state.Users
    }
}
const mapDispatchToProps = dispatch => {
    return {

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);