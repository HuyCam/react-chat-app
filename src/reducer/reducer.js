import { combineReducers } from 'redux';
import { usermeta } from './user';
import { conversations, updateCurrentCon, conversationsMeta } from './conversations';
const Reducer = combineReducers({
    usermeta,
    conversations,
    conversationsMeta,
    currentConID: updateCurrentCon
})

export default Reducer;