// src/components/Profile/index.js
import React, { PropTypes, Component } from 'react';
import { ipcRenderer, remote } from 'electron';
import fireApp from '../fireApp';
import classnames from 'classnames';
import { Link } from 'react-router';
import PostDetail from '../Post/PostDetail';
import Header from '../Header';

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
        <Link to={"/"+thisPid} onClick={ (e) => { this.expandPost(e, thisPost); } }>
          <h3>{thisPost.title}</h3>
          <img src={thisPost.url} />
        </Link>
      );
      userPosts.push(thisJSX);
    }

    return (
      <div>
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
