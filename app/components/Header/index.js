// src/components/Header/index.js
import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
const remote = require('electron').remote;

const headerClasses = classnames('h3','flex','justify-between', 'items-center');
const leftClasses = classnames('w3', 'tc');
const centerClasses = classnames('w5', 'tc', 'f6');
const rightClasses = classnames('w3', 'tc');

export default class Header extends Component {
  onClose = (e) => {
    e.preventDefault();
    if (typeof this.props.onClose === 'function') this.props.onClose();
    if(confirm("Are you sure?")) {
      remote.getCurrentWindow().close();
    }
  }
  onMenu = (e) => {
    e.preventDefault();
    if (typeof this.props.onMenu === 'function') this.props.onMenu();
  }
  render() {
    return (
      <div className={headerClasses}>
        <div className={leftClasses}>
          <a href="#" className="w1 h1 br-100 bg-black-10 dib mv2 mh1 overflow-hidden hover-bg-red" onClick={this.onClose}>Close</a>
        </div>
        <div className={centerClasses}>
          <h1>{this.props.title || ""}</h1>
        </div>
        <div className={rightClasses}>
          <a href="#" onClick={this.onMenu}><i className="material-icons ph1 v-btm">menu</i></a>
        </div>
      </div>
    )
  }
}
