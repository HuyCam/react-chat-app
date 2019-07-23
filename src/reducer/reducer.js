import { combineReducers } from 'redux';
import { usermeta, tempReceiver } from './user';
import { conversations, updateCurrentCon, conversationsMeta } from './conversations';
const Reducer = combineReducers({
    usermeta,
    conversations,
    conversationsMeta,
    currentConID: updateCurrentCon,
    tempReceiver: tempReceiver,
    endpoint: function() {
        return 'http://localhost:3001'
    }
})

export default Reducer;