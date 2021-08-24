import { combineReducers } from 'redux';
import { USER_LOGOUT , USER_INFO} from '../types';
import StatefullReducer from './StatefullReducer'
import SkipTakeReducer from './SkipTakeReducer';
import Login from './Login';
import Users from './Users';
import CurrentChat from './CurrentChat';



const appReducer = combineReducers({
    LoginState:Login,
    Profile:StatefullReducer(USER_INFO),
    Users:Users,
    CurrentChat:CurrentChat
})

export default (state, action) => {
    if (action.type === USER_LOGOUT) {
        return appReducer(undefined, action)
    }
    return appReducer(state, action)
}

