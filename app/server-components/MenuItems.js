import { app, Menu, shell } from 'electron';
// let template = [{
//   label: 'Electron',
//   submenu: [{
//     label: 'About ElectronReact',
//     selector: 'orderFrontStandardAboutPanel:'
//   }, {
//     type: 'separator'
//   }, {
//     label: 'Services',
//     submenu: []
//   }, {
//     type: 'separator'
//   }, {
//     label: 'Hide ElectronReact',
//     accelerator: 'Command+H',
//     selector: 'hide:'
//   }, {
//     label: 'Hide Others',
//     accelerator: 'Command+Shift+H',
//     selector: 'hideOtherApplications:'
//   }, {
//     label: 'Show All',
//     selector: 'unhideAllApplications:'
//   }, {
//     type: 'separator'
//   }, {
//     label: 'Quit',
//     accelerator: 'Command+Q',
//     click() {
//       app.quit();
//     }
//   }]
// }, {
//   label: 'Edit',
//   submenu: [{
//     label: 'Undo',
//     accelerator: 'Command+Z',
//     selector: 'undo:'
//   }, {
//     label: 'Redo',
//     accelerator: 'Shift+Command+Z',
//     selector: 'redo:'
//   }, {
//     type: 'separator'
//   }, {
//     label: 'Cut',
//     accelerator: 'Command+X',
//     selector: 'cut:'
//   }, {
//     label: 'Copy',
//     accelerator: 'Command+C',
//     selector: 'copy:'
//   }, {
//     label: 'Paste',
//     accelerator: 'Command+V',
//     selector: 'paste:'
//   }, {
//     label: 'Select All',
//     accelerator: 'Command+A',
//     selector: 'selectAll:'
//   }]
// }, {
//   label: 'View',
//   submenu: [{
//     label: 'Reload',
//     accelerator: 'Command+R',
//     click() {
//       // mainWindow.webContents.reload();
//     }
//   }, {
//     label: 'Toggle Developer Tools',
//     accelerator: 'Alt+Command+I',
//     click() {
//       // mainWindow.toggleDevTools();
//     }
//   }]
// }, {
//   label: 'Window',
//   submenu: [{
//     label: 'Minimize',
//     accelerator: 'Command+M',
//     selector: 'performMiniaturize:'
//   }, {
//     label: 'Close',
//     accelerator: 'Command+W',
//     selector: 'performClose:'
//   }, {
//     type: 'separator'
//   }, {
//     label: 'Bring All to Front',
//     selector: 'arrangeInFront:'
//   }]
// }, {
//   label: 'Help',
//   submenu: [{
//     label: 'Learn More',
//     click() {
//       shell.openExternal('http://electron.atom.io');
//     }
//   }, {
//     label: 'Documentation',
//     click() {
//       shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme');
//     }
//   }, {
//     label: 'Community Discussions',
//     click() {
//       shell.openExternal('https://discuss.atom.io/c/electron');
//     }
//   }, {
//     label: 'Search Issues',
//     click() {
//       shell.openExternal('https://github.com/atom/electron/issues');
//     }
//   }]
// }];
var MenuItems = function() {
  if (process.platform === 'darwin') {
    let template = [
      {
        label: 'Sifty',
        submenu: [
          {
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
          }
        ]
      }
    ]
    console.log("building")
    let menu = Menu.buildFromTemplate(template);
    // Menu.setApplicationMenu(menu);
    console.log("built")
    return menu;
  } else {
    let template = [{
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
    }];
    // {
    //   label: '&View',
    //   submenu: [{
    //     label: '&Reload',
    //     accelerator: 'Ctrl+R',
    //     click() {
    //       // mainWindow.webContents.reload();
    //     }
    //   }, {
    //     label: 'Toggle &Developer Tools',
    //     accelerator: 'Alt+Ctrl+I',
    //     click() {
    //       // mainWindow.toggleDevTools();
    //     }
    //   }]
    // }, {
    //   label: 'Help',
    //   submenu: [{
    //     label: 'Learn More',
    //     click() {
    //       shell.openExternal('http://electron.atom.io');
    //     }
    //   }, {
    //     label: 'Documentation',
    //     click() {
    //       shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme');
    //     }
    //   }, {
    //     label: 'Community Discussions',
    //     click() {
    //       shell.openExternal('https://discuss.atom.io/c/electron');
    //     }
    //   }, {
    //     label: 'Search Issues',
    //     click() {
    //       shell.openExternal('https://github.com/atom/electron/issues');
    //     }
    //   }]
    // }];

    let menu = Menu.buildFromTemplate(template);
    // mainWindow.setMenu(menu);

    return menu;
  }

}

export default MenuItems
