import { CURRENT_CHAT } from "../types"

const INITAL_STATE = {
    _id: null
}

export default (state = INITAL_STATE , action) => {
    switch (action.type) {
        case CURRENT_CHAT:
            return {...state,...action.payload}
        default:
            return state
    }
}