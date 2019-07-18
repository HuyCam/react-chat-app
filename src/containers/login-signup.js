import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser, addConversationMeta } from '../actions/actions';

// import style
import '../styles/login-signup.css';

class Login extends React.Component {
    state = {
        endpoint: 'http://localhost:3001',
        error: '',
        page: 'login'
    }
    componentDidMount() {
        // only add below function this for simulator
        // this.loginSimulation();
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

    handleLoginSubmit = (e) => {
        e.preventDefault();
        const data = {
            email: e.target.email.value,
            password: e.target.password.value
        }

        axios.post(`${this.state.endpoint}/users/login`, data).then(res => {
            const { _id, name, email } = res.data.user;
            const token = res.data.token;
            this.props.fetchUser({ _id, name, email, token });
            this.props.addConversationMeta(res.data.user.conversations);
            this.changeState({ error: '' });
            this.props.history.push('/chatbox');
        }, () => {
            this.changeState({ error: 'Wrong Email or Password' });
        })
    }

    handleSignUpSubmit = (e) => {
        e.preventDefault();
        const data = {
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value
        }

        axios.post(`${this.state.endpoint}/users`, data).then(res => {
            const { _id, name, email } = res.data.user;
            const token = res.data.token;
            this.props.fetchUser({ _id, name, email, token });
            this.props.addConversationMeta(res.data.user.conversations);
            this.changeState({ error: '' });
            this.props.history.push('/chatbox');
        }, () => {
            this.changeState({ error: 'Something wrong' });
        })
    }

    changeState = (object) => {
        this.setState(Object.assign(this.state, object));
    }

    handleClick = (e) => {
        e.preventDefault();
        switch(e.target.name) {
            case 'signup':
                this.changeState({ page: 'signup' });
                break;
            case 'login':
                this.changeState({ page: 'login' });
                break;
            default:
                this.changeState({ page: 'signup' });
                break;
        }
    }

    render() {
        if(this.state.page === 'login') {
            return <div className="container-fluid d-flex justify-content-center login-signup">
            <form onSubmit={this.handleLoginSubmit}>
                <h1>Login</h1>
                <div className="form-group">
                <input type="email" className="form-control" name="email" placeholder="name@email.com"/>
                <input type="password" className="form-control" name="password" placeholder="password"/>
                <p className={`alert alert-danger ${this.state.error ? 'dd' : 'hidden'}` }>{this.state.error}</p>
                <button className="btn btn-primary">Log in</button>
                </div>
                
                <div className="form-group">
                <button onClick={this.handleClick} className="btn btn-secondary" name="signup">Get to Sign Up page</button>
                </div>
                
            </form>
        </div>
        } else {
            return <div className="container-fluid d-flex justify-content-center login-signup">
            <form onSubmit={this.handleSignUpSubmit}>
                <h1>Sign Up</h1>
                <div className="form-group">
                <input type="text" className="form-control" name="name" placeholder="Your Name" />
                <input type="email" className="form-control" name="email" placeholder="name@email.com"/>
                <input type="password" className="form-control" name="password" placeholder="password"/>
                <p className={`alert alert-danger ${this.state.error ? 'dd' : 'hidden'}` }>{this.state.error}</p>
                <button className="btn btn-primary">Sign Up</button>
                </div>
                
                <div className="form-group">
                <button onClick={this.handleClick}  className="btn btn-secondary" name="login">Get to Log In page</button>
                </div>
                
            </form>
        </div>
        }
       
    }
}

const mapDispatchToProps = (dispatch) => {
     return {
         fetchUser: bindActionCreators(fetchUser, dispatch),
         addConversationMeta: bindActionCreators(addConversationMeta, dispatch)
     }
}
export default connect(null, mapDispatchToProps)(Login);