// src/components/Logout/index.js
import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import { ipcRenderer } from 'electron';
import './style.css';
import fireApp from '../fireApp';

const Logout = React.createClass({
  componentDidMount: function() {
    fireApp.auth().signOut().then(function() {
      console.log('Signed Out');
      ipcRenderer.send("logout-event");
    }, function(error) {
      console.error('Sign Out Error', error);
    });
  },
  render: function() {
    return (
      <h1>
        Logging you out...
      </h1>
    );
  }
});

export default Logout
