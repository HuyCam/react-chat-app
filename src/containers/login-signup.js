import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser, addConversationMeta } from '../actions/actions';

class Login extends React.Component {
    componentDidMount() {
        this.loginSimulation();
    }
    loginSimulation = async () => {
        const { data } = await axios.get('http://localhost:3001/simulation');
        axios.post('http://localhost:3001/users/login', {
            email: data.email,
            password: data.password
        }).then(res => {
            const { _id, name, email } = res.data.user;
            const token = res.data.token;
            this.props.fetchUser({ _id, name, email, token });
            this.props.addConversationMeta(res.data.user.conversations);
            this.props.history.push('/chatbox');
        });
    }
    render() {
        return <h1>Login Page</h1>
    }
}

const mapDispatchToProps = (dispatch) => {
     return {
         fetchUser: bindActionCreators(fetchUser, dispatch),
         addConversationMeta: bindActionCreators(addConversationMeta, dispatch)
     }
}
export default connect(null, mapDispatchToProps)(Login);