import React, { Component } from 'react';
import './App.css';
import Login from "./views/Login";
import Profile from "./views/Profile";
import { Router, Route, browserHistory } from 'react-router';


class App extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <div className="App">
          <Route path='/' component={Login} />
          <Route path='/Profile' component={Profile} />
        </div>
      </Router>);
  }
}
export default App;
