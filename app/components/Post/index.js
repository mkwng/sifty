// src/components/Post/index.js
import React, { PropTypes, Component } from 'react';
import PostDetail from './PostDetail';
import classnames from 'classnames';

export default class Post extends Component {
  state = {
    pid: this.props.params.post,
    url: this.props.params.url,
    title: this.props.params.title
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        <PostDetail post={{
          pid: this.props.params.post,
          url: this.props.params.url,
          title: this.props.params.title
        }} />
      </div>
    );
  }
};
