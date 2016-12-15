// src/components/Profile/index.js
import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';

export default class Profile extends Component {
  render() {
    return (
      <div>Profile: {this.props.params.user}</div>
    );
  }
};
