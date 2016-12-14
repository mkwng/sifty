import { app, BrowserWindow, dialog, ipcMain, globalShortcut } from 'electron';

const config = require('./config');
const TrayIcon = require('./server-components/TrayIcon');
const MenuItems = require('./server-components/MenuItems');

let Syft = {};

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support'); // eslint-disable-line
  sourceMapSupport.install();
}

var logout = function(options) {
  options = options || {};

  console.log("logging out...");
  let logoutWindow = new BrowserWindow({
    show: false,
    width: 800,
    height: 600
  });

  logoutWindow.loadURL(`file://${__dirname}/app.html#/logout`);
  if(process.env.NODE_ENV === 'development') {
    logoutWindow.openDevTools();
    logoutWindow.show();
    logoutWindow.focus();
  }

  ipcMain.once('logout-event', (event) => {
    if(typeof options.success === 'function') options.success();
    logoutWindow.close();
  });

  return logoutWindow;
}

var login = function(options) {
  options = options || {};

  console.log("logging in...");
  let loginWindow = new BrowserWindow({
    show: false,
    width: 800,
    height: 600
  });

  loginWindow.loadURL(`file://${__dirname}/app.html#/login`);

  // if(process.env.NODE_ENV === 'development') {
    loginWindow.openDevTools();
    loginWindow.show();
    loginWindow.focus();
  // }

  loginWindow.on('closed', () => {
    loginWindow = null;
  });

  ipcMain.on('login-event', (event, arg) => {
    if(arg) {
      if(typeof options.success === 'function') options.success();
      loginWindow.close();
    } else {
      console.dir(loginWindow)
      loginWindow.show();
      loginWindow.focus();
    }
    // event.sender.send('login-reply', 'pong')
  })
  return loginWindow;
}

var createFromClipboard = function() {
  options = options || {};

  console.log("logging in...");
  loginWindow = new BrowserWindow({
    show: false,
    width: 800,
    height: 600
  });

  loginWindow.loadURL(`file://${__dirname}/app.html#/create`);

  // if(process.env.NODE_ENV === 'development') {
    loginWindow.openDevTools();
    loginWindow.show();
    loginWindow.focus();
  // }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', async () => {

  console.log("MKWNG: Test test test test: Login");
  Syft.login = login({
    success: function() {
      // dialog.showMessageBox({message: "You're logged in!", buttons: ["Ok"], title: "Auth state"})
      Syft.login = null;
    },
    fail: function() {}
  });

  console.log("MKWNG: Test test test test: Menu");
  Syft.login.setMenu( MenuItems() )

  console.log("MKWNG: Test test test test: Shortcut");
  Syft.shortcut = globalShortcut.register('CmdOrCtrl+Shift+P', () => {
    console.log('CmdOrCtrl+Shift+P is pressed')
  })

  console.log("MKWNG: Test test test test: Icon");
  Syft.icon = trayIcon = TrayIcon({
    onLogout: function() {
      logout({
        success: function() {
          dialog.showMessageBox({message: "Successfully signed out", buttons: ["Ok"], title: "Auth state"});
          Syft.login = login();
        }
      });
    },
    onQuit: function() {
      app.quit();
    }
  });

});
