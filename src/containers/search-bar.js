import React from 'react';
import axios from 'axios';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// import actions
import { updateTempReceiver, updateCurrentCon } from '../actions/actions';
import '../styles/search-bar.css';

class SearchBar extends React.Component {
    state = {
        user: '',
        displayResult: false
    }

    handleSearch = (e) => {
        e.preventDefault();
        
        axios.get(`http://localhost:3001/search?email=${e.target.email.value}`).then(res => {
            console.log(res.data);
            this.setState({ user: res.data.user, displayResult: true })
        });
        e.target.email.value = '';
    }

    handleBlur = (e) => {
        console.log('blur');
        const state = this.state;

        // call setTimeout because onBlur always happen before other events,
        // I try to delay this a little bit.
        setTimeout(() => {
            this.setState(Object.assign(state, { displayResult: false }))
        }, 200)
        
    }

    handleChange = _.debounce((val) => {
        axios.get(`http://localhost:3001/search?email=${val}`).then(res => {
            this.setState({ user: res.data.user, displayResult: true })
        }, () => { 
            this.setState({ user: '' });
        });
    }, 300)

    handleResultClick = (e) => {
        // find if this user is in current lists of conversation
        const conversation  = this.props.conversationsMeta.find(val => {
            if (val.receiver._id === this.state.user._id) {
                return true;
            }
            return false;
        });

        // check if this user is me
        const isMe = this.isMe(this.state.user._id);

        if (conversation && !isMe) {
            this.props.updateCurrentCon(conversation.conversation);
        } else {
            this.props.updateTempReceiver(this.state.user);
            this.props.updateCurrentCon('TEMP');
        }
        
    }

    isMe = (id) => {
        return id === this.props.usermeta._id;
    }

    render() {
        return (
            <div  className="search-box">
                <form onBlur={this.handleBlur} onSubmit={this.handleSearch} className="email-search">
                    <div>
                    <input onChange={e => { 
                        const value = e.target.value;
                        this.handleChange(value);
                    }} 
                    type="email" 
                    name="email" 
                    placeholder="user@email.com"/>
                    <button><img src="https://image.flaticon.com/icons/png/512/55/55369.png" alt="avatar"/></button>
                    </div>
                    <div onClick={this.handleResultClick} className={"search-result " + (this.state.displayResult ? 'display' : 'hide')}>
                        <p><img src="https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/WPVG_icon_2016.svg/1024px-WPVG_icon_2016.svg.png" alt="avatar" />{this.state.user.name}</p>
                    </div>
                </form>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateTempReceiver: bindActionCreators(updateTempReceiver, dispatch),
        updateCurrentCon: bindActionCreators(updateCurrentCon, dispatch)
    }
}

const mapStateToProps = (state) => {
    return {
        usermeta: state.usermeta,
        conversationsMeta: state.conversationsMeta
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);