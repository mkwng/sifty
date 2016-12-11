// src/components/Login/index.js
import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
var firebase = require('firebase');
// var fireApp = require('electron').remote.getGlobal('fireApp');

import './style.css';

const Login = React.createClass({
  // static propTypes = {}
  // static defaultProps = {}
  // state = {}
  getInitialState() {
    return {
      emailValue: "",
      passwordValue: ""
    }
  },
  handleEmailChange: function(event) {
    this.setState({emailValue: event.target.value});
  },
  handlePasswordChange: function(event) {
    this.setState({passwordValue: event.target.value});
  },
  clickCreate: function(event) {
    event.preventDefault();
    // fireApp.auth().createUserWithEmailAndPassword(this.state.emailValue, this.state.passwordValue).catch(function(error) {
    //   // Handle Errors here.
    //   debugger;
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   // ...
    // });
  },
  clickLogin: function(event) {
    event.preventDefault();
    // fireApp.auth().signInWithEmailAndPassword(this.state.emailValue, this.state.passwordValue).catch(function(error) {
    //   // Handle Errors here.
    //   debugger;
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   // ...
    // });
  },
  render: function() {
    const { className, ...props } = this.props;
    return (
      <div className={classnames('Login', className)} {...props}>
        <h1>
          Login
        </h1>
        Email: <input type="text" value={this.state.emailValue} onChange={this.handleEmailChange} />
        Password: <input type="password" value={this.state.passwordValue} onChange={this.handlePasswordChange} />
        <br />
        <a href="#" onClick={this.clickCreate}>Create Account</a>

        <a href="#" onClick={this.clickLogin}>Log In</a>
      </div>
    );
  }
});

export default Login
