import React from 'react';
import { connect } from 'react-redux';
import SearchBar from './search-bar';
import ChatList from './chat-list';
import ChatWindow from './chat-window';
import axios from 'axios';

// import actions
import { fetchConversations } from '../actions/actions';
import { bindActionCreators } from 'redux';


class ChatBox extends React.Component{
    componentWillMount() {
        if (!this.props.usermeta) {
            this.props.history.push('/');
        }
        // if there is usermeta in store
        if (this.props.usermeta) {
            this.fetchConversation();
        }

    }

    fetchConversation = () => {
        axios.get('http://localhost:3001/conversations', {
            headers: {
                'Authorization': 'Bearer ' + this.props.usermeta.token
            }
        }).then(res => {
            this.props.fetchConversations(res.data);
        })
    }

    getCurrentConversation = () => {
        const currentCon = this.props.conversations.find(con => {
            if (con._id === this.props.currentConID) {
                return true;
            }
            return false;
        });

        return currentCon;
    }

    render() {
        let receivers = [], conversations = [];
        let userID = '', userName = '', currentCon = null;

        // extract data to pass to relevant component
        if (this.props.usermeta && this.props.conversations && this.props.conversationsMeta) {
            const { _id, name } = this.props.usermeta;
            receivers = this.props.conversationsMeta;
            conversations = this.props.conversations;
            userID = _id;
            userName = name;
            currentCon = this.getCurrentConversation();
        }
        return(
            <div className="container-fluid main-chat">
                <div className="row">
                    <div className="col-md-3 chat-info">
                        <SearchBar />
                        <ChatList receivers={receivers} 
                        conversations={conversations}/>
                    </div>
                    <div className="col-md-9 conversation-window">
                        <ChatWindow  user={{ userID, userName }} currentCon={currentCon} />
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    if (!state.usermeta) {
        return {
            usermeta: null
        }
    }
    return {
        usermeta: state.usermeta,
        conversations: state.conversations,
        conversationsMeta: state.conversationsMeta,
        currentConID: state.currentConID
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchConversations: bindActionCreators(fetchConversations, dispatch)
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(ChatBox);