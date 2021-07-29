import { combineReducers } from 'redux';
import { USER_LOGOUT } from '../types';
import StatefullReducer from './StatefullReducer'
import SkipTakeReducer from './SkipTakeReducer';
import Login from './Login';



const appReducer = combineReducers({
    LoginState:Login
})

export default (state, action) => {
    if (action.type === USER_LOGOUT) {
        return appReducer(undefined, action)
    }
    return appReducer(state, action)
}

