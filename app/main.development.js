import { app, BrowserWindow, dialog, ipcMain, globalShortcut } from 'electron';
import fs from 'fs';
const config = require('./config');
const TrayIcon = require('./server-components/TrayIcon');
const MenuItems = require('./server-components/MenuItems');

let Sifty = {};

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support'); // eslint-disable-line
  sourceMapSupport.install();
}

var logout = function(options) {
  options = options || {};

  console.log("logging out...");
  let logoutWindow = new BrowserWindow({
    show: false,
    width: 375,
    height: 480,
    frame: false
  });

  logoutWindow.loadURL(`file://${__dirname}/app.html#/logout`);
  if(process.env.NODE_ENV === 'development') {
    logoutWindow.openDevTools();
    logoutWindow.show();
    logoutWindow.focus();
  }

  ipcMain.once('logout-event', (event) => {
    if(typeof options.success === 'function') options.success();
  });

  return logoutWindow;
}

const loginOptions = {
  success: function(user) {
    global.user = user;
    Sifty.login.close();
    Sifty.login = null;
  },
  fail: function() {}
};
var login = function(options) {
  options = options || {};
  app.dock.show();

  console.log("logging in...");
  let loginWindow = new BrowserWindow({
    show: false,
    width: 375,
    height: 480,
    frame: false
  });

  loginWindow.loadURL(`file://${__dirname}/app.html#/login`);

  if(process.env.NODE_ENV === 'development') {
    app.dock.show();
    loginWindow.openDevTools();
    loginWindow.show();
    loginWindow.focus();
  }

  ipcMain.on('login-event', (event, user) => {
    if(user) {
      if(typeof options.success === 'function') options.success(user);
    } else {
      app.dock.show();
      loginWindow.show();
      loginWindow.focus();
    }
    // event.sender.send('login-reply', 'pong')
  })

  //
  // ipcMain.on('finish-login-event', (event) => {
  //   console.log("MKWNG:FINISH FINISH FINISH")
  //   if(typeof options.success === 'function') options.success();
  // });
  return loginWindow;
}

var createFromClipboard = function(options) {
  options = options || {};

  app.dock.show();

  let createWindow = new BrowserWindow({
    show: true,
    width: 375,
    height: 480,
    frame: false
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
  } );
  return createWindow;
}

var openProfile = function() {
  app.dock.show();

  let profileWindow = new BrowserWindow({
    show: true,
    width: 375,
    height: 480,
    frame: false
  });
  profileWindow.loadURL(`file://${__dirname}/app.html#/u/${global.user.uid}`);
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
  Sifty.login = login(loginOptions);

  console.log("2: menu");
  Sifty.login.setMenu( MenuItems() )

  console.log("3: shortcut");
  Sifty.shortcut = globalShortcut.register('CmdOrCtrl+Shift+P', () => {
    // If another window is already open, prompt to save? Allow multiple windows?
    // if(Sifty.createWindow !== null) {
    //   Sifty.createWindow.close();
    //   Sifty.createWindow = null;
    // }
    Sifty.createWindow = createFromClipboard({
      success: function() {
        Sifty.createWindow.close();
        Sifty.createWindow = null;
      }
    });
  })

  console.log("4: tray");
  Sifty.tray = TrayIcon({
    onLogout: function() {
      Sifty.logoutWindow = logout({
        success: function() {
          dialog.showMessageBox({message: "Successfully signed out", buttons: ["Ok"], title: "Auth state"});
          Sifty.logoutWindow.close();
          Sifty.logoutWindow = null;
          Sifty.login = login(loginOptions);
        }
      });
    },
    onQuit: function() {
      app.quit();
    },
      onCapture: function() {
      // If another window is already open, prompt to save? Allow multiple windows?
      // if(Sifty.createWindow !== null) {
      //   Sifty.createWindow.close();
      //   Sifty.createWindow = null;
      // }
      Sifty.createWindow = createFromClipboard({
        success: function() {
          Sifty.createWindow.close();
          Sifty.createWindow = null;
        }
      });
    },
    onProfile: function() {
      Sifty.mainWindow = openProfile();
    }
  });
  Sifty.tray.setToolTip("Sifty");

});
