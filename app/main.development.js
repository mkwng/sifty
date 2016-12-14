import { app, BrowserWindow, dialog, ipcMain, globalShortcut } from 'electron';

const config = require('./config');
const TrayIcon = require('./server-components/TrayIcon');
const MenuItems = require('./server-components/MenuItems');

var Syft = {
  tray: null
};
var SyftTray = null;


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

var createFromClipboard = function(options) {
  options = options || {};

  app.dock.show();

  let createWindow = new BrowserWindow({
    show: false,
    width: 800,
    height: 600
  });

  createWindow.loadURL(`file://${__dirname}/app.html#/create`);

  // if(process.env.NODE_ENV === 'development') {
    createWindow.openDevTools();
    createWindow.show();
    createWindow.focus();
  // }

  ipcMain.once('upload-event', (event, arg) => {
    if(typeof options.success === 'function') options.success();
    console.log(arg)
    if(createWindow) createWindow.close();
  } );
}

app.dock.hide();

app.on('window-all-closed', () => {
  app.dock.hide();

  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', async () => {


  console.log("1: login");
  Syft.login = login({
    success: function() {
      Syft.login = null;
    },
    fail: function() {}
  });

  console.log("2: menu");
  Syft.login.setMenu( MenuItems() )

  console.log("3: shortcut");
  Syft.shortcut = globalShortcut.register('CmdOrCtrl+Shift+P', () => {
    createFromClipboard();
  })

  console.log("4: tray");
  SyftTray = trayIcon = TrayIcon({
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
    },
    onCapture: function() {
      createFromClipboard();
    }
  });
  SyftTray.setToolTip("Syft");

});
