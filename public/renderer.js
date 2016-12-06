const electron = require('electron');
const {clipboard, ipcRenderer} = require('electron');


function pasteFromClipboard() {
  debugger
  const message = clipboard.readText()
  console.log(message)
  document.getElementById('paste').innerHTML = message
}

function dropOnIcon(data) {
  console.log(data)
}

ipcRenderer.on('pasteDetected', pasteFromClipboard);

ipcRenderer.on('dropDetected', dropOnIcon);
