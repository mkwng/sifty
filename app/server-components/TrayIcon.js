import { Menu, Tray, app } from 'electron';

function TrayIcon(options) {
  options = options || {}
  const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png'
  const iconPath = `${__dirname}/../public/${iconName}`

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
