if(typeof require !== 'undefined') {  
  const electron = require('electron');
  const {clipboard, ipcRenderer} = require('electron');

  // function pasteFromClipboard() {
  //   debugger
  //   const message = clipboard.readText()
  //   console.log(message)
  // }
  //
  // function dropOnIcon(data) {
  //   console.log(data)
  // }

  function test(pasteFromClipboard, dropOnIcon) {
    ipcRenderer.on('pasteDetected', function() { pasteFromClipboard( clipboard ) }.bind(this) );
    ipcRenderer.on('dropDetected', dropOnIcon);
}
}
