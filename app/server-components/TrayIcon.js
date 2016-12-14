import { Menu, Tray, app, dialog, nativeImage } from 'electron';
import path from 'path';
// var iconMac = require('./iconTemplate.png');
// require('./iconTemplate@2x.png');
// var iconWin = require('./windows-icon.png');
//
// console.log(iconMac);

function TrayIcon(options) {
  options = options || {}
  const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png'
  const iconPath = process.env.NODE_ENV === 'development'
    ? path.join(__dirname, '/../public/', iconName)
    : path.join(__dirname, '/public/', iconName)

  dialog.showMessageBox({message: "Trying to make appIcon @ " + iconPath, buttons: ["Ok"], title: "Auth state"})

  var appIcon = new Tray(iconPath)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Capture from clipboard',
      click: function () {
        var newFileWindow = newFileUpload();
        debugger;
        newFileWindow.webContents.send( 'shortcutDetected' );
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Log out',
      click: function () {
        if(typeof options.onLogout === 'function') options.onLogout();
      }
    },
    {
      label: 'Exit',
      click: function () {
        if(typeof options.onQuit === 'function') options.onQuit();
      }
    }
  ])
  appIcon.setToolTip('Tooltip')
  appIcon.setContextMenu(contextMenu)


  appIcon.on('drop-files', function(e,f) {
    if(typeof options.onDrop === 'function') options.onDrop(e,f);
    // mainWindow.webContents.send( 'dropDetected', {"e":e, "f":f} );
  })

  return appIcon;
}

export default TrayIcon
