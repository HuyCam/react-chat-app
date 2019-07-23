import { actions } from '../actions/actions';

export const conversations = (state = null, action) => {
    switch(action.type) {
        case actions.FETCH_CONVERSATIONS:
            return action.payload;
        case actions.ADD_NEW_CON:
            return [...state,action.payload];
        case actions.RESET:
            return null;
        default:
            return state;
    }
}

export const updateCurrentCon = (state = null, action) => {
    switch(action.type) {
        case actions.UPDATE_CURRENT_CON:
            return action.payload;
        case actions.RESET:
            return null;
        default:
            return state;
    }
}

export const conversationsMeta = (state = null, action) => {
    switch(action.type) {
        case actions.ADD_CONVERSATION_META:
            return action.payload;
        case actions.ADD_NEW_CON_META:
            return [...state, action.payload];
        case actions.RESET:
            return null;
        default:
            return state;
    }
}