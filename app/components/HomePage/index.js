// src/components/HomePage/index.js
import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import macIcon from '../../public/iconTemplate.png';
import macIcon2 from '../../public/iconTemplate@2x.png';
import winIcon from '../../public/windows-icon@2x.png';

import logo from './logo.svg';
import './style.css';

const HomePage = React.createClass({
  render: function() {
    return (
      <div>
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
});

export default HomePage;
