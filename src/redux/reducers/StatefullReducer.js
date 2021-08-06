const INITAL_STATE = {
    state: 0,
    data:{}
}
export default (actionType) => (state = INITAL_STATE , action) => {
    switch (action.type) {
        case actionType:
            return { ...state,state:action.payload.state,data:action.payload.data}
        case `EMPTY_${actionType}`:
            return INITAL_STATE
        default:
            return state
    }
}