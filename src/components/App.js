import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// import component
import ChatBox from '../containers/chat-box';
import Login from '../containers/login-signup';
import Profile from '../containers/profile';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      endpoint: 'localhost:3001'
    }
  }

  render() {
    return (
      <div className="app">
      <Router>
            <Route path="/" exact component={Login} />
            <Route path="/chatbox" component={ChatBox} />
            <Route path="/profile" component={Profile} />
          </Router>
      </div>
    );
  }
}



export default App;
