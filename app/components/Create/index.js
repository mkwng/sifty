// src/components/Create/index.js
import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import { ipcRenderer, clipboard } from 'electron';

const Create = React.createClass({
  getInitialState: function() {
    return {
      type: null,
      imageString: null,
      desc: null,
      title: "New pasted content",
      contentType: null,
      uploading: false,
      progress: 0
    };
  },
  componentDidMount: function() {
    console.log(clipboard.availableFormats())

    switch(clipboard.availableFormats()[0]) {
      case "text/plain":
        this.setState({contentType: "text/plain", desc: clipboard.readText()});
        break;
      case "image/png":
        var image = clipboard.readImage();
        this.setState({contentType: "image/png", imageString: btoa(String.fromCharCode.apply( null, image.toPNG() )) });
        break;
      case "image/jpeg":
        break;
      default:
        break;
    };

  },
  handleTitleChange: function() {
    this.setState({title: event.target.value});
  },
  upload: function(e) {
    e.preventDefault();

    this.setState({uploading: true});

    switch(this.state.contentType) {
      case "text/plain":
        content = (
          <span>{this.state.desc}</span>
        )
        break;
      case "image/png":
        let storageRef = firebase.storage().ref();
        let uploadTask = storageRef.child('images/' + encodeURI(this.state.title) + '.png').putString(this.state.imageString, 'base64', {contentType: this.state.contentType});
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
          function(snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            this.setState({progress: progress});
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
          }.bind(this), function(error) {
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;

            case 'storage/canceled':
              // User canceled the upload
              break;

            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        }, function() {
          // Upload completed successfully, now we can get the download URL
          var downloadURL = uploadTask.snapshot.downloadURL;
          clipboard.writeText(downloadURL);
          ipcRenderer.send("upload-event", downloadURL);
        }.bind(this) );
        break;
      default:
        break;
    }

  },
  render: function() {
    let content;
    switch(this.state.contentType) {
      case "text/plain":
        content = (
          <span>{this.state.desc}</span>
        )
        break;
      case "image/png":
        content = (
          <img src={ 'data:image/png;base64,' + this.state.imageString } />
        )
        break;
      default:
        break;
    }

    var buttonText = this.state.uploading
      ? "Upload is " + this.state.progress + "% done"
      : "Upload"
    return (
      <div>
        <div className="content">
          Title: <input type="text" value={this.state.title} onChange={this.handleTitleChange} />
          { content }
        </div>
        <a href="#" onClick={ this.state.uploading ? function() {} : this.upload }>{buttonText}</a>
      </div>
    )
  }
});

export default Create
