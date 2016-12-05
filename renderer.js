// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const clipboard = require('electron').clipboard
const ipc = require('electron').ipcRenderer

function pasteFromClipboard() {
  debugger
  const message = clipboard.readText()
  console.log(message)
  document.getElementById('paste').innerHTML = message
}

ipc.on('pasteDetected', pasteFromClipboard);
