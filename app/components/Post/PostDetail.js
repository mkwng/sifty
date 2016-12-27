import React, { Component } from "react";
import classnames from 'classnames';

const postClass = classnames('absolute', 'w-100', 'h-100', 'top-0', 'left-0', 'bg-black-80')
const h1Class = classnames('white');

export default class PostDetail extends Component {
  state = this.props.post;

  onClose = (e) => {
    e.preventDefault();
    this.props.onClose();
  };

  render() {
    return(
      <div className={postClass}>
        <a href="#" onClick={this.onClose}>Close</a>
        <h1 className={h1Class}>Post: {this.state.title}</h1>
        <img src={this.state.url} />
      </div>
    );
  }
}
