import { ADD_MESSAGE_TO_END, EMPTY_MESSAGES, LOAD_MESSAGES, MESSAGES_STATE } from "../types"

const INITAL_STATE = {
    state: 0, // 1=> loading , 2=> loaded , 0=>inital
    list: [],
    endOfList: false,
    skip: 0,
}

export default (messages = INITAL_STATE, action) => {
    let { list, endOfList, skip } = messages;
    switch (action.type) {
        case MESSAGES_STATE: return { ...messages, ...{ state: action.payload.state } }
        case LOAD_MESSAGES:
            
            let { take, dbList } = action.payload;
            
            // if at first data length is less than take 
            // or later if we had no data 
            // means we reached end of the list and no need to call it again
            if ((skip === 0 && dbList.length < take) ||
                (skip > 0 && dbList.length === 0)) endOfList = true;


            if (dbList.length > 0) skip++;


            // add new data to the top of the list
            list = [...dbList, ...list];

            
            return { ...messages, ...{ state: 2, list, endOfList, skip } }

        case ADD_MESSAGE_TO_END:
            let { message } = action.payload;

            list = [...list,...[message]];
            return { ...messages, ...{list}}
        case EMPTY_MESSAGES: return INITAL_STATE
        default:
            return messages
    }
}