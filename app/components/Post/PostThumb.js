import React, { Component } from "react";
import classnames from 'classnames';
import { Link } from 'react-router';

const postClasses = classnames('w-third');

export default class PostThumb extends Component {
  state = this.props.post;

  onClose = (e) => {
    e.preventDefault();
    this.props.onClose();
  };

  render() {

    return(
      <Link className={postClasses} to={"/"+this.props.pid} onClick={ (e) => { this.props.onClick(e, this.state.post); } }>
        <h3>{this.state.title}</h3>
        <img src={this.state.url} />
      </Link>
    );
  }
}
