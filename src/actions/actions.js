export const actions = {
    FETCH_USER: 'FETCH_USER',
    FETCH_CONVERSATIONS: 'FETCH_CONVERSATIONS',
    UPDATE_CURRENT_CON: 'UPDATE_CURRENT_CON',
    ADD_CONVERSATION_META: 'ADD_CONVERSATION_META',
    ADD_TEMP_RECEIVER: 'ADD_TEMP_RECEIVER',
    ADD_NEW_CON_META: 'ADD_NEW_CON_META',
    ADD_NEW_CON: 'ADD_NEW_CON',
    RESET: 'RESET'
}

export const fetchUser = (user) => {
    return {
        type: actions.FETCH_USER,
        payload: user
    }
}

export const addConversationMeta = (conversationMeta) => {
    return {
        type: actions.ADD_CONVERSATION_META,
        payload: conversationMeta
    }
}

export const fetchConversations = (conversations) => {
    return {
        type: actions.FETCH_CONVERSATIONS,
        payload: conversations
    }
}

// update current conversation
export const updateCurrentCon = (conversation) => {
    return {
        type: actions.UPDATE_CURRENT_CON,
        payload: conversation
    }
}

// add new conversation Meta docs
export const addNewConMeta = (conversationMeta) => {
    return {
        type: actions.ADD_NEW_CON_META,
        payload: conversationMeta
    }
}

// add new conversation to docs
export const addNewCon = (conversation) => {
    return {
        type: actions.ADD_NEW_CON,
        payload: conversation
    }
}

// add a temporary conversation
export const updateTempReceiver = (receiver) => {
    return {
        type: actions.ADD_TEMP_RECEIVER,
        payload: receiver
    }
}

// reset store (log out)
export const resetStore = () => {
    return {
        type: actions.RESET
    }
}