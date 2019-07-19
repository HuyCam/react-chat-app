import React from 'react';

import { connect } from 'react-redux';

class ChatWindow extends React.Component {
    componentDidMount() {
        this.scrollToBottom();
    }
    // get receiverID in owners array of currentCon
    getReceiverID = () => {
        if (this.props.currentCon && this.props.user) {
            return this.props.currentCon.owners.find(val => val !== this.props.user.userID);
        }

        return null;
    }

    // render each dialog
    renderCon() {
        const userID = this.props.user.userID;
        if (this.props.currentCon) {
            const { dialogs } = this.props.currentCon;
            const dialogsHTML = dialogs.map(val => {
                if (val.senderID === userID) {
                    return <div key={val._id} className="right"><p>{val.content}</p></div>
                } else {
                    return <div key={val._id} className="left"><p>{val.content}</p></div>
                }
            });

            return dialogsHTML;
        } else {
            return <div>You haven't start a conversation yet</div>
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { user: { userID }, currentCon } = this.props;

        const receiverID = this.getReceiverID();
        // if user has not open any conversation
        if (!receiverID || !currentCon) {
            return;
        }

        // if input content has nothing or empty string
        if (!e.target.parentElement.content.value.trim()) {
            return;
        }
        // send message to other user
        this.props.sendMsg(userID, receiverID, currentCon._id, e.target.parentElement.content.value);
        

        // reset input value
        e.target.parentElement.content.value = '';
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom = () => {
    this.el.scrollIntoView({ behavior: 'smooth' });
    }

    getReceiverInfo = () => {
        // if user has clicked on a contact to show conversation
        if (this.props.currentCon) {
            const receiver = this.props.receivers.find(val => {
                return val.conversation === this.props.currentCon._id;
            });

            return receiver.receiver;
        } else if (this.props.currentConID === 'TEMP') {
            return this.props.tempReceiver;
        }

        return null;
    }

    handleSubmitTemp = (e) => {
        e.preventDefault();
        const { user: { userID }} = this.props;

        const { _id: receiverID }= this.getReceiverInfo();

        // if user has not open any conversation
        if (!receiverID) {
            return;
        }

        // if input content has nothing or empty string
        if (!e.target.parentElement.content.value.trim()) {
            return;
        }
        // send message to other user
        this.props.initMsg(userID, receiverID, e.target.parentElement.content.value)
        
        // reset input value
        e.target.parentElement.content.value = '';
    }

    render() {
        const receiver = this.getReceiverInfo();
        // check if user will be able to send msg if a conversation has been selected
        const canSendMsg = this.props.currentCon ? false : true;

        if (this.props.currentConID === 'TEMP') {
            return <div className="chat-window">
                    <div className="conversation">
                        <div><h2>Talking to { receiver ? receiver.name : '...' }</h2></div>
                        <div ref={el => { this.el = el; }} />
                    </div>
                    <form onSubmit={this.handleSubmitTemp} className="text-message">
                        <input type="text" name="content"/>
                        <button onClick={this.handleSubmitTemp}>Send</button>
                    </form>
                </div>
        }
        return (
            <div className="chat-window">
                <div className="conversation">
                    <div><h2>Talking to { receiver ? receiver.name : '...' }</h2></div>
                    {this.renderCon()}
                    <div ref={el => { this.el = el; }} />
                </div>
                <form onSubmit={this.handleSubmit} className="text-message">
                    <input type="text" name="content" autoComplete="off" />
                    <button onClick={this.handleSubmit} disabled={canSendMsg}>Send</button>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        currentConID: state.currentConID,
        tempReceiver: state.tempReceiver
    }
}

export default connect(mapStateToProps)(ChatWindow);