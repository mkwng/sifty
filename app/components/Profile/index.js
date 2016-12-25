// src/components/Profile/index.js
import React, { PropTypes, Component } from 'react';
import { ipcRenderer, remote } from 'electron';
import fireApp from '../fireApp';
import classnames from 'classnames';

export default class Profile extends Component {
  state = {
    posts: {}
  };

  componentDidMount() {
    let uid = remote.getGlobal('user').uid;
    let userPosts = fireApp.database().ref('/posts').orderByChild("uid").equalTo(uid).limitToLast(15);
    userPosts.on("value", (response) => {
      this.setState({
        posts: response.val()
      });
    })
  };

  render() {
    // let userPosts = this.state.posts.map( (post) => {
    //   return (
    //     <div>
    //       <h3>{post.title}</h3>
    //       <img src={post.url} />
    //     </div>
    //   );
    // } );
    let userPosts = [];
    for(var post in this.state.posts) {
      let thisPost = this.state.posts[post];
      var thisJSX = (
        <div>
          <h3>{thisPost.title}</h3>
          <img src={thisPost.url} />
        </div>
      );
      userPosts.push(thisJSX);
    }
    return (
      <div>
        <h1>Profile: {this.props.params.user}</h1>
        {userPosts}
      </div>

    );
  }
};
