import React from 'react';
import { connect } from 'react-redux';
import SearchBar from './search-bar';
import ChatList from './chat-list';
import ChatWindow from './chat-window';
import axios from 'axios';
import socketio from 'socket.io-client';

// import actions
import { fetchConversations } from '../actions/actions';
import { bindActionCreators } from 'redux';


class ChatBox extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            endpoint: 'http://localhost:3001'
        };

        this.socket = socketio(this.state.endpoint);

        this.socket.on('message', (body) => {
            console.log(body);
            const {conversationID, senderID, content} = body;
            this.updateConversation(conversationID, senderID, content);
        })
    }
    componentWillMount() {
        if (!this.props.usermeta) {
            this.props.history.push('/');
        }
        // if there is usermeta in store
        if (this.props.usermeta) {
            this.fetchConversation();
        }
    }

    componentDidMount() {
        if (this.props.usermeta) {
            this.socket.emit('addUser', {
                user: this.props.usermeta._id,
                name: this.props.usermeta.name
            });
        }
    }
    // update conversations in the store
    updateConversation = (conversationID, senderID ,content) => {
        const { conversations } = this.props;
        const newCons = conversations.map(val => {
            if (val._id === conversationID) {
                val.dialogs.push({
                    _id: new Date().getTime(),
                    senderID: senderID,
                    content: content
                });

                return val;
            }
            return val
        });
 
        this.props.fetchConversations(newCons);
    }

    // fetch conversations from server
    fetchConversation = () => {
        axios.get(`${this.state.endpoint}/conversations`, {
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
    // send msg to other user
    sendMsg = (senderID, receiverID, conversationID, content) => {
        const fetchConversations = this.props.fetchConversations;
        // send message to server and get acknowledgement
        this.socket.emit('message', {receiverID, senderID, conversationID, content}, (error, success) => {
            if (error) {
                console.log(error);
            } else {
                console.log(success);
                // when success, send API post to server
                this.updateConversation(conversationID, senderID, content);
                this.postDialog(content, conversationID);
            }
        });
    }

    postDialog = (content, conversationID) => {
        axios.patch(`${this.state.endpoint}/send-message/conversations/${conversationID}`, {
            content
        },{
            headers: {
                Authorization: this.props.usermeta.token
            }
        })
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
                        conversations={conversations}
                        currentConID={this.props.currentConID}
                        />
                    </div>
                    <div className="col-md-9 conversation-window">
                        <ChatWindow  sendMsg={this.sendMsg} user={{ userID, userName }} currentCon={currentCon} />
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