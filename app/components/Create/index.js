// src/components/Create/index.js
import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import { ipcRenderer, clipboard, remote } from 'electron';
import fireApp from '../fireApp';
var _ = require('lodash');

const Create = React.createClass({
  getInitialState: function() {
    return {
      type: null,
      image: null,
      desc: null,
      title: "New pasted content",
      contentType: null,
      uploading: false,
      progress: 0
    };
  },
  componentDidMount: function() {
    let formats = clipboard.availableFormats();
    console.log(formats)
    if(_.includes(formats, "image/png")) {
      this.setState({
        contentType: "image/png",
        image: clipboard.readImage()
      });
    } else {
      // this is not a png
    }
    if(_.includes(formats, "text/plain")) {
      this.setState({
        title: clipboard.readText()
      });
    }

    // switch(clipboard.availableFormats()[0]) {
    //   case "text/plain":
    //     this.setState({contentType: "text/plain", desc: clipboard.readText()});
    //     break;
    //   case "image/png":
    //     var image = clipboard.readImage();
    //     this.setState({
    //       contentType: "image/png",
    //       // imageURL: image.toDataURL(),
    //       // imageString: btoa(String.fromCharCode.apply( null, image.toPNG() )),
    //       image: image
    //     });
    //     break;
    //   case "image/jpeg":
    //     break;
    //   default:
    //     break;
    // };

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
        let databaseRef = firebase.database().ref();
        // ipcRenderer.send("image-buffer", {
        //   title:encodeURI(this.state.title.replace(/ /g,"_")),
        //   image:this.state.image.toPNG()
        // });
        console.dir(remote.getGlobal('user'));
        let uploadTask = storageRef.child('/user/' + remote.getGlobal('user').uid + '/uploads/' + encodeURI(this.state.title.replace(/ /g,"_")) + '.png').put(this.state.image.toPNG(), {contentType: 'image/png'});
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
          let downloadURL = uploadTask.snapshot.downloadURL;

          let postKey = databaseRef.child('posts').push().key;
          let updates = {};
          updates['/posts/' + postKey] = {
            uid: remote.getGlobal('user').uid,
            url: downloadURL,
            title: this.state.title
          };
          databaseRef.update(updates, function() {
            clipboard.writeText(downloadURL);
            ipcRenderer.send("upload-event", downloadURL);
          });

        }.bind(this) );

        // ipcRenderer.on('write-complete', (e, url) => {
        // })

        // let uploadTask = storageRef.child('images/' + encodeURI(this.state.title) + '.png').putString(this.state.imageString.substring(this.state.imageString.indexOf(",") + 1), 'base64', {contentType: this.state.contentType});
        // console.log(this.state.image.toPNG())
        // debugger;
        // let uploadTask = storageRef.put(this.state.image.toPNG())
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
          <img src={ this.state.image.toDataURL() } />
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
