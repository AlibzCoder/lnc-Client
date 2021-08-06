import userImage from '../../assets/images/45936439.jpg'
import { IconButton, Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import Input from '../../utills/Input';
import AspectRatio from '../../utills/AspectRatio';
import ImageLoader from '../../utills/ImageLoader';
import { imgsUrl } from '../../consts';
import { Skeleton } from '@material-ui/lab';
import { CircularProgress } from '@material-ui/core';
import { EditProfile, Profile, UploadProfileImg } from '../../redux/actions';
import Crop from '../../utills/Crop/Crop';

const useSize = () => {
    const el = useRef(null)
    const [sizes, setSizes] = useState(null)
    useEffect(() => {
        if (el.current) setSizes(el.current.getBoundingClientRect())
    }, [el.current])
    return [el, sizes]
}

const UserProfile = ({ Profile, getProfile }) => {

    const { data, state } = Profile;

    const [profileEdit, setProfileEdit] = useState(false)
    const [profileEditLoading, setProfileEditLoading] = useState(false)

    const [profileBoxref, profileBoxSizes] = useSize()
    const [profileEditref, profileEditBoxSizes] = useSize();
    const [nameRef, nameSizes] = useSize();


    const [name, setName] = useState(data.name ?? '')
    const [description, setDescription] = useState(data.description ?? '')


    useEffect(() => {
        setName(data.name)
        setDescription(data.description)
    }, [data])


    const updateProfile = () => {
        if (profileEdit) {
            setProfileEditLoading(true);
            EditProfile({ name, description }).then((res) => {
                getProfile();
            }).finally(() => {
                setProfileEdit(false)
                setProfileEditLoading(false);
            })
        } else {
            setProfileEdit(true)
        }
    }


    const [CropVisablity, setCropVisablity] = useState(false);
    const [CropImage, setCropImage] = useState(null);

    const onProfileImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setCropImage(e.target.files[0])
            setCropVisablity(true)
            e.target.value = null;
        }
    }
    const onCrop = (croppedImage) => {
        UploadProfileImg(croppedImage.blob).then(() => {
            setCropVisablity(false);
            getProfile();
        })
    }



    return <div className="main-user-profile-box"
        style={profileBoxSizes && profileEditBoxSizes && nameSizes ? {
            flexBasis: !profileEdit ? (profileBoxSizes.height + nameSizes.height) + 10 :
                (profileBoxSizes.height + profileEditBoxSizes.height + 20) - nameSizes.height
        } : {}}>
        <div ref={profileBoxref} className="main-user-profile">
            <div className="profile-image flat-neumorphic-shadow">
                <AspectRatio>
                    <ImageLoader
                        loading={()=><i style={{ fontSize: '3rem' }} className="fal fa-user flex-center"></i>}
                        error={()=><i style={{ fontSize: '3rem' }} className="fal fa-user flex-center"></i>}
                        src={state === 2 ? `${imgsUrl}${data._id}.jpg?v=${data.profileImgVersion}` : null} />
                    <input onChange={onProfileImageChange} style={{ display: 'none' }} type="file" id="p_image" accept="image/jpeg" />
                    {
                        profileEdit ? <label htmlFor="p_image" className="profile-image-edit flex-center">
                            <i className="fal fa-camera"></i>
                        </label> : null
                    }
                </AspectRatio>
            </div>

            <div ref={nameRef} className={`main-user-profile-name ${profileEdit ? 'main-user-profile-name-hidden' : ''}`}>
                <Typography variant="h6">
                    {state === 2 ? data.name : <Skeleton style={{ width: '75%', paddingTop: '0.5rem', margin: '0 auto' }} />}
                </Typography>
            </div>





            <div className={`main-user-profile-edit ${profileEdit ? 'main-user-profile-edit-active' : ''}`} ref={profileEditref}>
                <Input
                    icon={<i className="fal fa-user"></i>}
                    neumorphic={true} type="text" placeholder="Name"
                    value={name}
                    onChange={({ target }) => setName(target.value)}
                />
                <Input
                    type="text"
                    placeholder="Describtion"
                    rows={4} multiline
                    neumorphic={true}
                    icon={<i className="fal fa-quote-left"></i>}
                    value={description}
                    onChange={({ target }) => setDescription(target.value)}
                />
            </div>


            <IconButton onClick={updateProfile}
                className="icon-btn icon-btn-toggle-icon flat-neumorphic-shadow-sm">
                <div className="toggle-icon flex-center">
                    <i className={`fal fa-cog ${!profileEdit ? 'toggle-icon-active' : ''}`}></i>
                    <i className={`fal fa-check ${profileEdit ? profileEditLoading ? '' : 'toggle-icon-active' : ''}`}></i>
                    <div className={`flex-center ${profileEditLoading ? 'toggle-icon-active' : ''}`}>
                        <CircularProgress size="0.9rem" color="inherit" />
                    </div>
                </div>
            </IconButton>
        </div>

        <Crop
            modalTitle="عکس پروفایل"
            modalVisablity={CropVisablity}
            CropAspect='1:1'
            CropShape='round'
            onClose={() => { setCropVisablity(false) }}
            onCropDone={(ci) => { onCrop(ci) }}
            src={CropImage} />
    </div>
}

export default connect(
    state => { return { Profile: state.Profile } },
    dispatch => { return { getProfile: () => dispatch(Profile()) } }
)(UserProfile)