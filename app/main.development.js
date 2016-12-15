import { app, BrowserWindow, dialog, ipcMain, globalShortcut } from 'electron';
import fs from 'fs';
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
      global.user = arg
    } else {
      app.dock.show();
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
    show: true,
    width: 800,
    height: 600
  });

  createWindow.loadURL(`file://${__dirname}/app.html#/create`);
  createWindow.focus();

  if(process.env.NODE_ENV === 'development') {
    createWindow.openDevTools();
  }

  // ipcMain.once('image-buffer', function writeImage(event, arg) {
  //   let imagePath = `${__dirname}/public/uploads/` + arg.title + ".png"
  //   console.log(imagePath);
  //   fs.writeFile(imagePath, arg.image ,"base64", function(err) {
  //     if (err) throw err;
  //     if(createWindow) createWindow.webContents.send('write-complete', `file://` + imagePath);
  //   })
  // } );

  ipcMain.once('upload-event', (event, arg) => {
    // ipcMain.removeListener('image-buffer', writeImage);
    if(typeof options.success === 'function') options.success();
    console.log(arg)
    if(createWindow !== null) createWindow.close();
  } );
}

var openProfile = function() {
  app.dock.show();

  let profileWindow = new BrowserWindow({
    show: true,
    width: 800,
    height: 600
  });
  profileWindow.loadURL(`file://${__dirname}/app.html#/profile/mkwng`);
  profileWindow.focus();

  if(process.env.NODE_ENV === 'development') {
    profileWindow.openDevTools();
  }

  return profileWindow;
}

app.dock.hide();

app.on('window-all-closed', () => {
  app.dock.hide();

  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {

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
  Syft.tray = TrayIcon({
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
    },
    onProfile: function() {
      Syft.mainWindow = openProfile();
    }
  });
  Syft.tray.setToolTip("Syft");

});
