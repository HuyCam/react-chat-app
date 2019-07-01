export const actions = {
    FETCH_USER: 'FETCH_USER',
    FETCH_CONVERSATIONS: 'FETCH_CONVERSATIONS',
    UPDATE_CURRENT_CON: 'UPDATE_CURRENT_CON',
    ADD_CONVERSATION_META: 'ADD_CONVERSATION_META'
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