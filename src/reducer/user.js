const { actions } = require('../actions/actions');

export const usermeta = (state = null, action) => {
    switch(action.type) {
        case actions.FETCH_USER:
            return action.payload;
        default:
            return state;
    }
}

export const tempReceiver = (state = null, action) => {
    switch(action.type) {
        case actions.ADD_TEMP_RECEIVER:
            return action.payload;
        default:
            return state;
    }
}