import {LOGIN_STATE, USER_INFO, USER_LOGOUT} from '../types';
import api from '../../api';
import {setCookie, deleteAllCookies, jsonToFormData} from '../../utills';
import history from '../../history';



export const ApiLogin = (userName,password) => async (dispatch) => {
    dispatch({type: LOGIN_STATE, payload: {state:1}});
    return api.post('/login', {"userName": userName,"password":password}).then((res)=>{
        var oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        setCookie("Authorization", res.data.Authorization,oneYearFromNow);
        setCookie("RefreshToken", res.data.RefreshToken,oneYearFromNow);
        dispatch({type: LOGIN_STATE, payload: {state:2}});
    }).catch((err)=>{
        let payload = {state:0}
        if(err.response && (err.response.status===404||err.response.status===400)){
            payload.err = err.response.data;
            payload.state = 4
        }
        dispatch({type: LOGIN_STATE, payload: payload});
    });
}
export const SignUp = (name,userName,password) => async (dispatch) => {
    dispatch({type: LOGIN_STATE, payload: {state:1}});
    return api.post('/register', {"name":name,"userName": userName,"password": password}).catch((err)=>{
        let payload = {state:0}
        if(err.response && err.response.status===400){
            payload.err = err.response.data;
            payload.state = 4
        }
        dispatch({type: LOGIN_STATE, payload: payload});
    });
}
export const Logout = () => (dispatch)=>{
    deleteAllCookies()
    dispatch({type:USER_LOGOUT,payload:null})
    history.push('/Login')
}










export const Profile = () => stateFullDataRevicer(api,USER_INFO,'/profile',{})
export const EditProfile = ({name,description})=>{
    return api.post('/editProfile',{name,description});
}
export const UploadProfileImg = (ProfileImg)=>{
    return api.post('/uploadProfileImage',jsonToFormData({"profile_img":ProfileImg}));
}



























const emptyState = (actionType)=>async(dispatch)=>{
    dispatch({type:`EMPTY_${actionType}`})
}
const stateFullDataRevicer = (instance,actionType,url,defualtData = null)=>async(dispatch)=>{
    dispatch(payload(1,defualtData,actionType))
    return instance.get(url).then((res)=>{dispatch(payload(2,res.data,actionType))})
    .catch(()=>{dispatch(payload(0,defualtData,actionType))});
}
const payload = (state,data,action) => {return {type:action,payload:{state:state,data:data}}}


