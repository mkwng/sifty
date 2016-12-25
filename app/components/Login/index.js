// src/components/Login/index.js
import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import { ipcRenderer } from 'electron';
import './style.css';
import fireApp from '../fireApp';

const Login = React.createClass({
  getInitialState() {
    return {
      hasResponse: false,
      emailValue: "",
      passwordValue: "",
      usernameValue: ""
    }
  },
  componentDidMount: function() {
    fireApp.auth().onAuthStateChanged(function(user) {
      if(user) {
        ipcRenderer.send("login-event", user);
      } else {
        this.setState({hasResponse: true});
      }
    }.bind(this) );
  },
  handleEmailChange: function(event) {
    this.setState({emailValue: event.target.value});
  },
  handlePasswordChange: function(event) {
    this.setState({passwordValue: event.target.value});
  },
  handleUsernameChange: function(event) {
    this.setState({usernameValue: event.target.value});
  },
  clickCreate: function(event) {
    event.preventDefault();
    // Create a user object
    fireApp.auth().createUserWithEmailAndPassword(this.state.emailValue, this.state.passwordValue)
      .then(function(user) {
        // Nothing
      }.bind(this), function(error) {
        console.log("error");
      });
  },
  clickLogin: function(event) {
    event.preventDefault();
    fireApp.auth().signInWithEmailAndPassword(this.state.emailValue, this.state.passwordValue).then(function() {
      ipcRenderer.send("login-event");
    }.bind(this));
  },
  render: function() {
    const { className, ...props } = this.props;
    if(!this.state.hasResponse) {
      return (
        <div>
          Loading...
        </div>
      );
    }
    return (
      <div className={classnames('Login', className)}>
        <h1>
          Login
        </h1>
        Username: <input type="text" value={this.state.usernameValue} onChange={this.handleUsernameChange} /><br />
        Email: <input type="text" value={this.state.emailValue} onChange={this.handleEmailChange} /><br />
        Password: <input type="password" value={this.state.passwordValue} onChange={this.handlePasswordChange} />
        <br />
        <a href="#" onClick={this.clickCreate}>Create Account</a>

        <a href="#" onClick={this.clickLogin}>Log In</a>
      </div>
    );
  }
});

export default Login
