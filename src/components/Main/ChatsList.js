import React, { useEffect, useMemo, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useTransition, animated } from 'react-spring';
import Input from '../../utills/Input';
import RippleLayout from '../../utills/RippleLayout';


import { connect, useDispatch } from 'react-redux';
import { imgsUrl } from '../../consts';
import AspectRatio from '../../utills/AspectRatio';
import ImageLoader from '../../utills/ImageLoader';
import { setChat } from '../../redux/actions';

const user_item_height = 76;//3.75em + (1em padding + 1em margin) => 1em = 16px


const ListItem = ({ user, selected }) => {

    const dispatch = useDispatch()

    return <RippleLayout className={`main-chat-list-item ${selected ? 'main-chat-list-item-selected' : ''}`}
        onClick={() => dispatch(setChat(user))}>
        <div className={`main-chat-list-item-img ${user.isOnline ? 'main-chat-list-item-online' : ''}`}>
            <AspectRatio>
                <ImageLoader
                    src={`${imgsUrl}${user._id}.jpg?v=${user.profileImgVersion}`}
                    loading={() => <i style={{ fontSize: '1.25rem' }} className="fal fa-user flex-center"></i>}
                    error={() => <i style={{ fontSize: '1.25rem' }} className="fal fa-user flex-center"></i>}
                />
            </AspectRatio>
        </div>
        <div className="main-chat-list-item-info jc-sp-e fd-column">
            <h5>{user.name}</h5>
            <span>hey how you doin, you good?</span>
        </div>
        <span className="main-chat-list-item-time">07:11</span>
    </RippleLayout>
}


const ChatsList = React.memo(({ setChat, Users, CurrentChat }) => {


    const [list, setList] = useState(Users)
    useEffect(() => setList(Users), [Users])

    const [filter, setFilter] = useState('')

    useEffect(() => setList(filter ? Users.filter((item) => item.name.includes(filter)) : Users), [filter])

    useEffect(() => setFilter(''), [CurrentChat])

    const transitions = useTransition(list.map((data, i) => ({ ...data, y: i * user_item_height })),
        {
            key: item => item._id,
            from: { height: 0, opacity: 0 },
            leave: { height: 0, opacity: 0 },
            enter: ({ y, height }) => ({ y, height, opacity: 1 }),
            update: ({ y, height }) => ({ y, height }),
        }
    )
    return <div className="main-chats-list">
        <div className="main-chat-list-box">
            <div>
                <Input
                    value={filter} onChange={({ target }) => setFilter(target.value)}
                    icon={<i className="fal fa-search"></i>}
                    neumorphic={true} type="text" placeholder="Find Peaple nearby"
                />
            </div>
            <Scrollbars autoHide autoHideTimeout={600} autoHideDuration={200} height={list.length * user_item_height}>
                {transitions((style, user, t, index) => (
                    <animated.div style={{ zIndex: list.length - index, ...style }}>
                        <ListItem user={user} selected={CurrentChat._id === user._id} />
                    </animated.div>
                ))}
            </Scrollbars>
        </div>
    </div>
}, (pp, np) => !(pp.Users !== np.Users || pp.CurrentChat !== np.CurrentChat))

export default connect(
    state => {
        return {
            Users: state.Users,
            CurrentChat: state.CurrentChat
        }
    }
)(ChatsList)