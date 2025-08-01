/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import * as fs from "fs" 

import { AudioManager } from './services/audio_service/audioManager';
import { NyaaScraper } from './services/nyaa_service/nyaaScraper';
import { SettingsManager } from './services/settings_service/settingsManager';
import { DiscordManager } from './services/discord_service/discordManager';
import { ServiceManager } from './services/serviceManager';


export const PRODUCTIONMUSICFILEDIRECTORY = path.join(__dirname, '../../../../' + "music");
export const BINARYDEPENDENCYDIRECTORY = path.join(__dirname, '../../../../' + "binary_dependencies");
//export const PRODUCTIONMUSICFILEDIRECTORY = __dirname + '../../../../' + "music";

export const MINIMUMWINDOWSIZE = {x: 1920/2, y:1080/2};

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug').default();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};



/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);


//---------------------- Backend Setup

/*
var audioManager = new AudioManager();
var settingsManager = new SettingsManager();
var discordManager = new DiscordManager();
*/

var test = new NyaaScraper();

var serviceManager = new ServiceManager();


//----------------- IPC Handlers, Rout to services


ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

/*
ipcMain.on('audio', async (event, arg) => {
  if (arg != ""){
    audioManager.broker.eventOn(event, arg);
  }
  else{
    event.reply('audio', console.log("Undefined ipc one way from bus audio"));
  }

});

ipcMain.handle('audio', async (event, arg) => {
    if (arg != ""){
      return audioManager.broker.eventHandle(event, arg);
    }
  }

);

ipcMain.on('settings', async (event, arg) => {
  if (arg != ""){
    settingsManager.broker.eventOn(event, arg);
  }
  else{
    event.reply('settings', console.log("Undefined ipc one way from bus settings"));
  }

});

ipcMain.handle('settings', async (event, arg) => {
    if (arg != ""){
      return settingsManager.broker.eventHandle(event, arg);
    }
  }
);

ipcMain.on('discord', async (event, arg) => {
  if (arg != ""){
    discordManager.broker.eventOn(event, arg);
  }
  else{
    event.reply('discord', console.log("Undefined ipc one way from bus discord"));
  }

});

ipcMain.handle('discord', async (event, arg) => {
    if (arg != ""){
      return discordManager.broker.eventHandle(event, arg);
    }
  }
);
*/

//-----------------

const createWindow = async () => {
  //backend folder setup
  if (app.isPackaged == false){ // fork process directly from main.py when not packaged (compiled into exe)

  }
  else{
    
    if (!fs.existsSync(PRODUCTIONMUSICFILEDIRECTORY)){
      fs.mkdirSync(PRODUCTIONMUSICFILEDIRECTORY);
    }
    //fs.writeFileSync(PRODUCTIONMUSICFILEDIRECTORY, "Hey there!");
  }; 

      
  //---------------------------------
  

  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      webSecurity: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
    fullscreenable: false,
  });
  
  mainWindow.setMinimumSize(MINIMUMWINDOWSIZE.x, MINIMUMWINDOWSIZE.y);
  mainWindow.maximize();

  serviceManager.settingsManager.SetWindow(mainWindow);

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    app.quit();
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  


  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};



