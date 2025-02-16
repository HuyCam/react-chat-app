import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import socketio from 'socket.io-client';
import { Link } from 'react-router-dom';
// containers
import SearchBar from './search-bar';
import ChatList from './chat-list';
import ChatWindow from './chat-window';

// style
import '../styles/chat-box.css';
// import actions
import { fetchConversations, addNewConMeta, updateCurrentCon, addNewCon, resetStore } from '../actions/actions';
import { bindActionCreators } from 'redux';


class ChatBox extends React.Component{
    constructor(props) {
        super(props);

        this.socket = socketio(this.props.endpoint, { forceNew: true });

        this.socket.on('message', (body) => {
            const {conversationID} = body;
            axios.get(`${this.props.endpoint}/receiver-and-conversation/${conversationID}`, { 
                headers: {
                    'Authorization': 'Bearer ' + this.props.usermeta.token
                }
            }).then(res => {
                console.log('received a message');
                const conversation = res.data.conversations;
                console.log(conversation);
                this.updateConversation(conversation);
            });
            
        });

        this.socket.on('initMsg', (body) => {
            // fetch new conversation that a new user that is not in the chat list pm you
            this.fetchNewConversation(body.conversationID, false);
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
    updateConversation = async (conversation) => {
        const { conversations } = this.props;
        const newCons = conversations.map(val => {
            if (val._id === conversation._id) {
                return conversation;
            }
            return val;
        });
 
        this.props.fetchConversations(newCons);
    }

    // fetch all conversations from server
    fetchConversation = () => {
        axios.get(`${this.props.endpoint}/conversations`, {
            headers: {
                'Authorization': 'Bearer ' + this.props.usermeta.token
            }
        }).then(res => {
            this.props.fetchConversations(res.data);
        })
    }

    getCurrentConversation = () => {
        let currentCon = this.props.conversations.find(con => {
            if (con._id === this.props.currentConID) {
                return true;
            }
            return false;
        });

        return currentCon;
    }

    /* fetch new conversationMeta and new conversation when new user init msg with you or vice versa
    navigateCurrentCon is optional argument. Its purpose is for the receiver when their is a new
    user pm him, his chat box won't automatically point to that conversation.
    */
    fetchNewConversation = (conversationID, navigateCurrentCon = true) => {
        axios.get(`${this.props.endpoint}/receiver-and-conversation/${conversationID}`, { 
            headers: {
                'Authorization': 'Bearer ' + this.props.usermeta.token
            }
        }).then(res => {
            const { conversationMeta, conversations } = res.data;
            this.props.addNewConMeta(conversationMeta);
            this.props.addNewCon(conversations);

            if (navigateCurrentCon) {
                this.props.updateCurrentCon(conversationID);
            }
        }).catch(e => console.log(e));
    }

    // send msg to other user
    sendMsg = async (senderID, receiverID, conversationID, content) => {
        const response = await this.postDialog(content, conversationID);
        // send message to server and get acknowledgement
        this.socket.emit('message', {receiverID, senderID, conversationID, content}, (error, success) => {
            if (error) {
                console.log(error);
            } else {
                console.log(success);
                // when success, send API post to server
                this.updateConversation(response.data);
            }
        });
    }

    // send the first message to the receiver
    initMsg = async (senderID, receiverID, content) => {
        // post a init conversation
        axios.post(`${this.props.endpoint}/new/conversations/${receiverID}`, {
            content,
        } ,{
            headers: {
                'Authorization': 'Bearer ' + this.props.usermeta.token
            }
        }).then(res => {
            let conversationID = res.data._id;

            this.socket.emit('message', { receiverID, senderID, conversationID, content, init: true },  (error, success) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(success);
                    
                    // fetch new conversation and conversationMeta
                    this.fetchNewConversation(conversationID);
                }
            });
        })
    }

    // post a dialog to server
    postDialog = async (content, conversationID) => {
        return await axios.patch(`${this.props.endpoint}/send-message/conversations/${conversationID}`, {
            content
        },{
            headers: {
                Authorization: 'Bearer ' + this.props.usermeta.token
            }
        });
    }

    handleLogout = (e) => {
        e.preventDefault();
        axios.post(`${this.props.endpoint}/users/logout`, null, {
            headers: {
                Authorization: 'Bearer ' + this.props.usermeta.token
            }
        }).then(_ => {
            // reset store to the first state
            this.props.resetStore();

            // disconnect socket io
            this.socket.disconnect();

            // go back to homepage
            this.props.history.push('/');
        });
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
                <div className="navigation">
                    <div className="menu-list">
                        <a onClick={this.handleLogout} href="#">Sign out</a>
                        <Link to="/profile">Personal Info</Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3 chat-info">
                        <SearchBar />
                        <ChatList 
                        receivers={receivers} 
                        conversations={conversations}
                        currentConID={this.props.currentConID}
                        />
                    </div>
                    <div className="col-md-9 conversation-window">
                        <ChatWindow initMsg={this.initMsg} receivers={receivers} sendMsg={this.sendMsg} user={{ userID, userName }} currentCon={currentCon} />
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        usermeta: state.usermeta,
        conversations: state.conversations,
        conversationsMeta: state.conversationsMeta,
        currentConID: state.currentConID,
        tempReceiver: state.tempReceiver,
        endpoint: state.endpoint
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchConversations: bindActionCreators(fetchConversations, dispatch),
        addNewConMeta: bindActionCreators(addNewConMeta, dispatch),
        updateCurrentCon: bindActionCreators(updateCurrentCon, dispatch),
        addNewCon: bindActionCreators(addNewCon, dispatch),
        resetStore: bindActionCreators(resetStore, dispatch)
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(ChatBox);