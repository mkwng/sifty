// src/components/Profile/index.js
import React, { PropTypes, Component } from 'react';
import { ipcRenderer, remote } from 'electron';
import fireApp from '../fireApp';
import classnames from 'classnames';
import { Link } from 'react-router';
import PostDetail from '../Post/PostDetail';

export default class Profile extends Component {
  state = {
    uid: this.props.params.user || remote.getGlobal('user').uid,
    posts: {},
    activePost: null
  };

  componentDidMount() {
    let userPosts = fireApp.database().ref('/posts').orderByChild("uid").equalTo(this.state.uid).limitToLast(15);
    userPosts.on("value", (response) => {
      this.setState({
        posts: response.val()
      });
    })
  };

  expandPost = (e, post) => {
    e.preventDefault();
    this.setState({ activePost: (<PostDetail post={post} />) });
  };

  render() {
    // Loop through posts and create a bunch of links
    let userPosts = [];
    for(var pid in this.state.posts) {
      let thisPost = this.state.posts[pid];
      var thisJSX = (
        <Link to={"/"+pid} onClick={ (e) => { this.expandPost(e, this.state.posts[pid]); } }>
          <h3>{thisPost.title}</h3>
          <img src={thisPost.url} />
        </Link>
      );
      userPosts.push(thisJSX);
    }

    return (
      <div>
        { this.state.activePost }
        <h1>Profile: {this.state.uid}</h1>
        {userPosts}
      </div>
    );
  }
};
