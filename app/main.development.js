import { app, BrowserWindow, Menu, shell, dialog, ipcMain } from 'electron';
var XMLHttpRequest = require('xhr2');

// var firebase = require('firebase/app');
// require('firebase/auth');
// require('firebase/database');
// require('firebase/storage');

const config = require('./config');
const TrayIcon = require('./server-components/TrayIcon');

let menu;
let template;
let loginWindow = null;
let trayIcon = null;
let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support'); // eslint-disable-line
  sourceMapSupport.install();
}

var logout = function() {
  console.log("logging out...");
  let logoutWindow = new BrowserWindow({
    show: false,
    width: 800,
    height: 600
  });

  logoutWindow.loadURL(`file://${__dirname}/app.html#/logout`);
  logoutWindow.openDevTools();
  logoutWindow.show();
  logoutWindow.focus();

  ipcMain.once('logout-event', (event) => {
    logoutWindow.close();
    login();
  });

}

var login = function() {
  console.log("logging in...");
  loginWindow = new BrowserWindow({
    show: false,
    width: 800,
    height: 600
  });

  loginWindow.loadURL(`file://${__dirname}/app.html#/login`);
  loginWindow.openDevTools();
  loginWindow.show();
  loginWindow.focus();

  // loginWindow.on('did-finish-load', () => {
  //   loginWindow.show();
  //   loginWindow.focus();
  // });

  loginWindow.on('closed', () => {
    loginWindow = null;
  });

  ipcMain.on('login-event', (event, arg) => {
    if(arg) {
      dialog.showMessageBox(loginWindow, {message: "You're already logged in!", buttons: ["Ok"], title: "Auth state"})
      // loginWindow.close();
    } else {
      loginWindow.show();
      loginWindow.focus();
    }
    // event.sender.send('login-reply', 'pong')
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', async () => {

  // mainWindow = new BrowserWindow();
  // mainWindow.loadURL(`file://${__dirname}/app.html`);

  trayIcon = TrayIcon({
    onLogout: logout,
    onQuit: function() {
      app.quit();
    }
  });

  login();

  if (process.platform === 'darwin') {
    template = [{
      label: 'Electron',
      submenu: [{
        label: 'About ElectronReact',
        selector: 'orderFrontStandardAboutPanel:'
      }, {
        type: 'separator'
      }, {
        label: 'Services',
        submenu: []
      }, {
        type: 'separator'
      }, {
        label: 'Hide ElectronReact',
        accelerator: 'Command+H',
        selector: 'hide:'
      }, {
        label: 'Hide Others',
        accelerator: 'Command+Shift+H',
        selector: 'hideOtherApplications:'
      }, {
        label: 'Show All',
        selector: 'unhideAllApplications:'
      }, {
        type: 'separator'
      }, {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() {
          app.quit();
        }
      }]
    }, {
      label: 'Edit',
      submenu: [{
        label: 'Undo',
        accelerator: 'Command+Z',
        selector: 'undo:'
      }, {
        label: 'Redo',
        accelerator: 'Shift+Command+Z',
        selector: 'redo:'
      }, {
        type: 'separator'
      }, {
        label: 'Cut',
        accelerator: 'Command+X',
        selector: 'cut:'
      }, {
        label: 'Copy',
        accelerator: 'Command+C',
        selector: 'copy:'
      }, {
        label: 'Paste',
        accelerator: 'Command+V',
        selector: 'paste:'
      }, {
        label: 'Select All',
        accelerator: 'Command+A',
        selector: 'selectAll:'
      }]
    }, {
      label: 'View',
      submenu: [{
        label: 'Reload',
        accelerator: 'Command+R',
        click() {
          mainWindow.webContents.reload();
        }
      }, {
        label: 'Toggle Developer Tools',
        accelerator: 'Alt+Command+I',
        click() {
          mainWindow.toggleDevTools();
        }
      }]
    }, {
      label: 'Window',
      submenu: [{
        label: 'Minimize',
        accelerator: 'Command+M',
        selector: 'performMiniaturize:'
      }, {
        label: 'Close',
        accelerator: 'Command+W',
        selector: 'performClose:'
      }, {
        type: 'separator'
      }, {
        label: 'Bring All to Front',
        selector: 'arrangeInFront:'
      }]
    }, {
      label: 'Help',
      submenu: [{
        label: 'Learn More',
        click() {
          shell.openExternal('http://electron.atom.io');
        }
      }, {
        label: 'Documentation',
        click() {
          shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme');
        }
      }, {
        label: 'Community Discussions',
        click() {
          shell.openExternal('https://discuss.atom.io/c/electron');
        }
      }, {
        label: 'Search Issues',
        click() {
          shell.openExternal('https://github.com/atom/electron/issues');
        }
      }]
    }];

    menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  } else {
    template = [{
      label: '&File',
      submenu: [{
        label: '&Open',
        accelerator: 'Ctrl+O'
      }, {
        label: '&Close',
        accelerator: 'Ctrl+W',
        click() {
          mainWindow.close();
        }
      }]
    }, {
      label: '&View',
      submenu: [{
        label: '&Reload',
        accelerator: 'Ctrl+R',
        click() {
          mainWindow.webContents.reload();
        }
      }, {
        label: 'Toggle &Developer Tools',
        accelerator: 'Alt+Ctrl+I',
        click() {
          mainWindow.toggleDevTools();
        }
      }]
    }, {
      label: 'Help',
      submenu: [{
        label: 'Learn More',
        click() {
          shell.openExternal('http://electron.atom.io');
        }
      }, {
        label: 'Documentation',
        click() {
          shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme');
        }
      }, {
        label: 'Community Discussions',
        click() {
          shell.openExternal('https://discuss.atom.io/c/electron');
        }
      }, {
        label: 'Search Issues',
        click() {
          shell.openExternal('https://github.com/atom/electron/issues');
        }
      }]
    }];

    menu = Menu.buildFromTemplate(template);
    // mainWindow.setMenu(menu);
  }
});
