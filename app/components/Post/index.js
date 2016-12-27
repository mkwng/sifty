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
    debugger;
    // userPosts.on("value", (response) => {
    //   this.setState({
    //     posts: response.val()
    //   });
    // })
  }

  render() {
    return (
      <div>
        <PostDetail post={this.state.post} />
      </div>
    );
  }
};
