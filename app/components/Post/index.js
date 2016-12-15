// src/components/Post/index.js
import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';

export default class Post extends Component {
  render() {
    return (
      <div>{this.props.params.user}'s Post</div>
    );
  }
};
