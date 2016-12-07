import React, { Component } from 'react';
import firebase from 'firebase';
import chalk from 'chalk';

import config from './config';

import './App.css';

firebase.initializeApp(config);
firebase.auth().signInAnonymously().catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
  console.log(error);
});

if(typeof test === 'function') {
  function pasteFromClipboard(clipboard) {
    console.log(clipboard.availableFormats());
    switch(clipboard.availableFormats()[0]) {
      case "text/plain":
        console.log(chalk.bgGreen("Pasted text: ") + clipboard.readText());
        break;
      case "image/png":
      case "image/jpeg":
        var image = clipboard.readImage();
        var el = document.createElement("img");
        el.width = image.getSize().width;
        el.height = image.getSize().height;
        // http://stackoverflow.com/questions/13950865/javascript-render-png-stored-as-uint8array-onto-canvas-element-without-data-uri
        el.src = 'data:image/png;base64,' + btoa(String.fromCharCode.apply(null, image.toPNG()));
        document.body.appendChild(el);


        // https://firebase.google.com/docs/storage/web/upload-files
        var metadata = {
          contentType: 'image/png'
        };
        var storageRef = firebase.storage().ref();
        // var imageRef = storageRef.child('image.png');
        var uploadTask = storageRef.child('images/' + 'image.png').putString(btoa(String.fromCharCode.apply(null, image.toPNG())), 'base64', metadata);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          function(snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
          }, function(error) {
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
          console.log(downloadURL);
        });

        break;
      default:
        console.log(chalk.bgRed("Unsupported file type: ") + clipboard.availableFormats());
    }
  }

  function dropOnIcon(data) {
    console.log(data)
  }

  test(pasteFromClipboard,dropOnIcon);
}

class App extends Component {
  render() {
    return (
      <div className="App">
        Hello, world
      </div>
    );
  }
}

export default App;
