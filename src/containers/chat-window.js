import React from 'react';
import socketio from 'socket.io-client';
import { connect } from 'react-redux';

class ChatWindow extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            endpoint: 'localhost:3001'
        };

        this.socket = socketio(this.state.endpoint);
    }

    componentDidMount() {
        this.socket.on('message', (body) => {
            console.log(body);
        })

        if (this.props.user.name) {
            this.socket.emit('addUser', {
                user: this.props.user._id,
                name: this.props.user.name
            });
        }
        
    }

    send = (msg) => {
        this.socket.emit('message', msg);
    }

    handleSubmit = (e) => {
        e.preventDefault();
    }

    render() {
        return (
            <div className="chat-window">
                <div className="conversation">
                    <div className="left">
                        <p>something</p>
                    </div>
                    <div className="right">
                        <p>something else</p>
                    </div>
                    <div className="right">
                        <p>something else</p>
                    </div>
                    <div className="left">
                        <p>something</p>
                    </div>
                    <div className="right">
                        <p>something else</p>
                    </div>
                    <div className="right">
                        <p>something else</p>
                    </div>
                    <div className="right">
                        <p>something else</p>
                    </div>
                    <div className="right">
                        <p>something else</p>
                    </div>
                    <div className="right">
                        <p>something else</p>
                    </div>
                </div>
                <form onSubmit={this.handleSubmit} className="text-message">
                    <input type="text" />
                    <button onClick={this.handleSubmit}>Send</button>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        conversation: state.currentCon
    }
}

export default connect(mapStateToProps)(ChatWindow);