import React, { Component } from "react";

export default class PostDetail extends Component {
  state = this.props.post;

  render() {
    return(
      <div>
        <h1>Post: {this.state.title}</h1>
        <img src={this.state.url} />
      </div>
    );
  }
}
