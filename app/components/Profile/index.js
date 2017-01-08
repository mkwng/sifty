// src/components/Profile/index.js
import React, { PropTypes, Component } from 'react';
import { ipcRenderer, remote } from 'electron';
import fireApp from '../fireApp';
import classnames from 'classnames';
import PostDetail from '../Post/PostDetail';
import PostThumb from '../Post/PostThumb';
import Header from '../Header';

const profileClasses = classnames('w-100', 'flex', 'flex-wrap');

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
    this.setState({ activePost: (<PostDetail post={post} onClose={this.collapsePost} />) });
  };

  collapsePost = () => {
    this.setState({ activePost: null });
  }

  render() {
    // Loop through posts and create a bunch of links
    let userPosts = [];
    for(var pid in this.state.posts) {
      let thisPid = pid;
      let thisPost = this.state.posts[thisPid];
      var thisJSX = (
        <PostThumb post={thisPost} pid={thisPid} onClick={ (e) => { this.expandPost(e, thisPost); } } />
      );
      userPosts.push(thisJSX);
    }

    return (
      <div className={profileClasses}>
        { this.state.activePost }
        <Header
          title={this.state.uid}
          onClose={ () => {console.log("close")} }
          onMenu={ () => {console.log("menu")} }
        />
        {userPosts}
      </div>
    );
  }
};
