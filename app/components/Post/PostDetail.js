import React, { Component } from "react";
import classnames from 'classnames';

const postClass = classnames('absolute', 'w-100', 'h-100', 'top-0', 'left-0', 'bg-white-90');
const closeClass = classnames('db', 'absolute', 'top-1', 'right-1', 'w2', 'h2', 'bg-red');
const h1Class = classnames();
const imgClass = classnames();

export default class PostDetail extends Component {
  state = this.props.post;

  onClose = (e) => {
    e.preventDefault();
    this.props.onClose();
  };

  render() {
    return(
      <div className={postClass}>
        <a className={closeClass} href="#" onClick={this.onClose}>Close</a>
        <h1 className={h1Class}>Post: {this.state.title}</h1>
        <img className={imgClass} src={this.state.url} />
      </div>
    );
  }
}
