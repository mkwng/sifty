const electron = require('electron');
const {app, BrowserWindow, Menu, Tray, ipcMain, nativeImage, globalShortcut} = require('electron');

const path = require('path')
const url = require('url')

function isDevelopment() {
  return process.env.NODE_ENV === 'development'
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
let mainWindow;

// Quit when all windows are closed.
// app.on('window-all-closed', () => {
//   if (process.platform != 'darwin')
//     app.quit();
// });

function putInTray() {
  const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png'
  const iconPath = `${__dirname}/build/${iconName}`

  appIcon = new Tray(iconPath)
  const contextMenu = Menu.buildFromTemplate([{
    label: 'Test',
    click: function () {
      console.log("test");
    }
  }])
  appIcon.setToolTip('Tooltip')
  appIcon.setContextMenu(contextMenu)


  appIcon.on('drop-files', function(e,f) {
    console.log({"e":e, "f":f})
    // e.sender.
    mainWindow.webContents.send( 'dropDetected', {"e":e, "f":f} );
  })
}

function registerShortcut() {
  globalShortcut.register('CommandOrControl+Alt+L', function() {
    mainWindow.webContents.send( 'pasteDetected' );
  })
}

function setupMenu() {
  var application_menu = [
    {
      label: 'menu1',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            electron.dialog.showOpenDialog({ properties: [ 'openFile', 'openDirectory', 'multiSelections' ]});
          }
        },
        {
          label: 'submenu1',
          submenu: [
            {
              label: 'item1',
              accelerator: 'CmdOrCtrl+A',
              click: () => {
                mainWindow.openDevTools();
              }
            },
            {
              label: 'item2',
              accelerator: 'CmdOrCtrl+B',
              click: () => {
                mainWindow.closeDevTools();
              }
            }
          ]
        }
      ]
    }
  ];
  if (process.platform == 'darwin') {
    const name = app.getName();
    application_menu.unshift({
      label: name,
      submenu: [
        {
          label: 'About ' + name,
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          label: 'Services',
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          label: 'Hide ' + name,
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          role: 'hideothers'
        },
        {
          label: 'Show All',
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => { app.quit(); }
        },
      ]
    });
  }

  menu = Menu.buildFromTemplate(application_menu);
  Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  mainWindow.webContents.openDevTools()

  // and load the index.html of the app.
  const appUrl = isDevelopment() 
    ? `http://localhost:${process.env.PORT || 3000}/`
    : `file://${__dirname}/build/index.html`
  mainWindow.loadURL(appUrl);
  
  putInTray();
  setupMenu();
  registerShortcut();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});