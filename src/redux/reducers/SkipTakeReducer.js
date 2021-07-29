const INITAL_STATE = {
    state: 0,
    data:null,
    endOfList:false,
    skip:0
}
export default (actionType) => (state = INITAL_STATE , action) => {
    switch (action.type) {
        case actionType:
            return { ...state,
                state:action.payload.state,
                data:action.payload.data,
                endOfList:action.payload.endOfList,
                skip:action.payload.skip,
            }
        default:
            return state
    }
}