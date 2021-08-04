import { ALL_USERS, USER_ADDED, USER_OFFLINE, USER_ONLINE, USER_REMOVED, USER_UPDATE } from "../types"

const innitialState = []

export default (state = innitialState, action) => {
    let userIndex;
    switch (action.type) {
        case ALL_USERS: return action.users.sort((x, y) => (x.isOnline === y.isOnline) ? 0 : x.isOnline ? -1 : 1);
        case USER_ADDED: if (state.filter(u => u._id === action.id).length === 0) return [...state, action.fields]
        case USER_REMOVED: return state.filter(u => u._id !== action.id)
        case USER_UPDATE:
            userIndex = findUserIndexById(state, action.id);
            if (userIndex !== -1)
                state[userIndex] = { ...state[userIndex], ...action.fields }
            return [...state]
        case USER_ONLINE:
        case USER_OFFLINE:
            userIndex = findUserIndexById(state, action.id);
            if (userIndex !== -1)
                state[userIndex].isOnline = action.type === USER_ONLINE;
            //sort the onlines first
            return [...state.sort((x, y) => (x.isOnline === y.isOnline) ? 0 : x.isOnline ? -1 : 1)];
        default:
            return state;
    }
}
const findUserIndexById = (users, id) => {
    for (let u in users) {
        if (users[u]._id === id) return u;
    }
    return -1;
}

