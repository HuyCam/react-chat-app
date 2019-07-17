import { actions } from '../actions/actions';

export const conversations = (state = null, action) => {
    switch(action.type) {
        case actions.FETCH_CONVERSATIONS:
            return action.payload;
        case actions.ADD_NEW_CON:
            state.push(action.payload);
            return state;
        default:
            return state;
    }
}

export const updateCurrentCon = (state = null, action) => {
    switch(action.type) {
        case actions.UPDATE_CURRENT_CON:
            return action.payload;
        default:
            return state;
    }
}

export const conversationsMeta = (state = null, action) => {
    switch(action.type) {
        case actions.ADD_CONVERSATION_META:
            return action.payload;
        case actions.ADD_NEW_CON_META:
            state.push(action.payload);
            console.log('conversation meta', state);
            return state;
        default:
            return state;
    }
}