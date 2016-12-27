// src/components/Post/index.js
import React, { PropTypes, Component } from 'react';
import PostDetail from './PostDetail';
import fireApp from '../fireApp';
import classnames from 'classnames';

export default class Post extends Component {
  state = {
    post: null,
    pid: this.props.params.post
  }

  componentDidMount() {
    let activePost = fireApp.database().ref('/posts/'+this.state.pid);
    activePost.on("value", (response) => {
      this.setState({
        post: response.val()
      });
    });
  }

  render() {
    let post = this.state.post ? (<PostDetail post={this.state.post} />) : "Loading...";
    return (
      <div>
        { post }
      </div>
    );
  }
};
