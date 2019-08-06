import React from 'react';
import { connect } from 'react-redux';
import {} from 'redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

// style
import '../styles/profile.css';

class Profile extends React.Component {
    state = {
        isAvatarPage: true,
        files: []
    }
    componentWillMount() {
        // if user data is not in the store, return to login site
        if (!this.props.usermeta) {
            this.props.history.push('/');
        }
    }

    handlePageSwitch = (e) => {
        e.preventDefault();
        this.setState(Object.assign(this.state, { isAvatarPage: !this.state.isAvatarPage}));
    }

    handleSubmitAvatar = (e) => {
        e.preventDefault();
        console.log(e.target.parentNode.avatar.files[0]);
        const files = e.target.parentNode.avatar.files;
        const formData = new FormData();

        formData.append('avatar', files[0]);

        axios.post(`${this.props.endpoint}/users/me/avatar`, formData, {
            headers: {
                'Authorization': 'Bearer ' + this.props.usermeta.token
            }
        }).then(res => console.log(res.data));
    }

    handleFileChange = (e) => {
        this.setState(Object.assign(this.state, { files: e.target.files }))
    }

    render() {
        let imgName = '';
        if (this.state.files[0]) {
            imgName = this.state.files[0].name;
        }
        
        if (this.state.isAvatarPage) {
            return <div id="profile" className="container-fluid">
            <div className="navbar  d-flex justify-content-end">
                <Link to="/chatbox" className="nav-link btn btn-dark">Chat Box</Link>
            </div>
            <div className="form-group d-flex justify-content-center">
                        <button onClick={this.handlePageSwitch} className="btn btn-secondary" name="userinfo">Change user Info</button>
            </div>
            <div className="d-flex justify-content-center align-items-md-center">
                <form className="form md-form">
                    <h1>Avatar</h1>
                    <div className="file-field form-group">
                        <label>
                            <div className="btn btn-primary btn-sm">
                                <span>Choose file</span>
                                <input className="input-file" onChange={this.handleFileChange} type="file" name="avatar" />
                            </div>
                        </label>
                        <input className="form-control" type="text" placeholder="File Name" defaultValue={imgName}/>
                    </div>
                    <button onClick={this.handleSubmitAvatar} className="btn btn-primary" name="submit">Submit</button>
                </form>
            </div>
        </div>
        } else {
            return <div id="profile" className="container-fluid">
            <div className="navbar d-flex justify-content-end">
                <Link to="/chatbox" className="nav-link btn btn-dark">Chat Box</Link>
            </div>
            <div className="form-group d-flex justify-content-center">
                    <button onClick={this.handlePageSwitch} className="btn-secondary" name="userinfo">Change user Info</button>
                </div>
            <div className="d-flex justify-content-center align-items-md-center">
                <form class="form">
                    <h1>User Info</h1>
                    <div className="form-group">
                        <input type="text" className="form-control" placeholder="name" />
                    </div>
                </form> 
            </div>
        </div>
        }
    }
}

const mapStateToProps = (state) => {
    return {
        usermeta: state.usermeta,
        endpoint: state.endpoint
    }
}

export default connect(mapStateToProps)(Profile);