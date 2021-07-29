import { LOGIN_STATE } from "../types"
const INITAL_STATE = {
    state:0,
    err:null
}

export default (state = INITAL_STATE , action) => {
    switch (action.type) {
        case LOGIN_STATE:
            return {...state,...action.payload}
        default:
            return state
    }
}