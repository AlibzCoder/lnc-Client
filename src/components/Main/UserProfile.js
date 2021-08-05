import userImage from '../../assets/images/45936439.jpg'
import { IconButton } from '@material-ui/core';
import { connect } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import Input from '../../utills/Input';
import { InputBase } from '@material-ui/core';

const useSize = () => {
    const el = useRef(null)
    const [sizes, setSizes] = useState(null)
    useEffect(() => {
        if (el.current) setSizes(el.current.getBoundingClientRect())
    }, [el.current])
    return [el, sizes]
}

const UserProfile = props => {

    const { Porfile } = props;

    const [profileEdit, setProfileEdit] = useState(false)

    const [profileBoxref, profileBoxSizes] = useSize()
    const [profileEditref, profileEditBoxSizes] = useSize();


    useEffect(() => console.log(profileBoxSizes), [profileBoxSizes])
    useEffect(() => console.log(profileEditBoxSizes), [profileEditBoxSizes])


    return <div ref={profileBoxref} className="main-user-profile-box"
        style={profileBoxSizes && profileEditBoxSizes ? {
            flexBasis: !profileEdit ? profileBoxSizes.height :
                profileBoxSizes.height + profileEditBoxSizes.height
        } : {}}>
        <div className="main-user-profile">
            <div className="profile-image flat-neumorphic-shadow">
                <img src={userImage} />
            </div>


            <h4>Ali Banai</h4>


            <div className="main-user-profile-edit" ref={profileEditref}>
                <Input
                    icon={<i className="fal fa-search"></i>}
                    neumorphic={true} type="text" placeholder="Name"
                />
                <Input
                    type="text"
                    placeholder="Describtion"
                    rows={4} multiline
                    neumorphic={true}
                    icon={<i className="fal fa-search"></i>}
                />
            </div>


            <IconButton onClick={() => setProfileEdit(!profileEdit)}
                className="icon-btn icon-btn-toggle-icon flat-neumorphic-shadow-sm">
                <div className="toggle-icon flex-center">
                    <i className={`fal fa-cog ${!profileEdit ? 'toggle-icon-active' : ''}`}></i>
                    <i class={`fal fa-check ${profileEdit ? 'toggle-icon-active' : ''}`}></i>
                </div>
            </IconButton>
        </div>
    </div >
}

export default connect(state => { return { Porfile: state.Porfile } })(UserProfile)