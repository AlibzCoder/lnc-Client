import { ALL_USERS } from "../types"

const innitialState = {}

export default (state = innitialState,action)=>{
    switch(action.type){
        case ALL_USERS :
            return action.users
        default:
            return state;
    }
}