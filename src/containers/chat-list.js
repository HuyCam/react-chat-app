import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateCurrentCon } from '../actions/actions';
import '../styles/chat-list.css';

import Contact from './contact';
import { bindActionCreators } from 'redux';

class ChatList extends Component {
    renderContact = () => {

        // return all contacts with information of receiver and the last dialog to
        // render in chat list
        return this.props.receivers.map(receiver => {

            // pair the right conversation for the right person
            const conversation = this.props.conversations.find(con => {
                if (con._id === receiver.conversation ) {
                    return true;
                }
                return false;
            })

            const { dialogs } = conversation;
            const isSelected = conversation._id === this.props.currentConID;
            return <Contact handleUpdateCon={this.updateCurrentConversation}  
                            key={receiver._id} receiver={receiver.receiver}  
                            lastDialog={dialogs[dialogs.length - 1] } 
                            conversation={conversation}
                            isSelected={isSelected}
                            />
        })
    }

    // currentConversation is updated using ID
    updateCurrentConversation = (conversation) => {
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