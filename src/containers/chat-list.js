import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateCurrentCon } from '../actions/actions';
import '../styles/chat-list.css';

import Contact from './contact';
import { bindActionCreators } from 'redux';

class ChatList extends Component {
    renderContact = () => {
        return this.props.receivers.map(meta => {
            const conversation = this.props.conversations.find(con => {
                if (con._id === meta.conversation ) {
                    return true;
                }
                return false;
            })

            const { dialogs } = conversation;
            return <Contact handleUpdateCon={this.updateCurrentConversation}  
                            key={meta._id} receiver={meta.receiver}  
                            lastDialog={dialogs[dialogs.length - 1] } 
                            conversation={conversation}/>
        })
    }

    updateCurrentConversation = (conversation) => {
        console.log('Conversation click');
        this.props.updateCurrentCon(conversation);
    }

    render() {
        if (!this.props.receivers.length && !this.props.conversations.length) {
            return <div className="chat-list">
                        Loading...
                    </div>
        }
        return (
            <div className="chat-list">
                <div >
                    {this.renderContact()}
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateCurrentCon: bindActionCreators(updateCurrentCon, dispatch)
    }
}

export default connect(null, mapDispatchToProps)(ChatList);