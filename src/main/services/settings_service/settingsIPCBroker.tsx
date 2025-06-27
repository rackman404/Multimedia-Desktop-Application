import { ipcMain } from "electron/main";
import * as fs from "fs" 
import { SettingsManager } from "./settingsManager";

import {Howl, Howler} from 'howler';


export class SettingsBroker {
  settingsManager: SettingsManager;
  
  constructor(settingsController: SettingsManager) {
    this.settingsManager = settingsController;
  }

  eventOn(event: Electron.IpcMainEvent, arg: string){
    console.log("handling audio event from broker; arg: " + arg);

    switch(arg.toString()){
      default:
        console.log("ERROR: SETTINGS BROKER ON (INVALID RESPONSE)");

    }
  }

  eventHandle(event: Electron.IpcMainInvokeEvent, arg: string[]){
    console.log("handling settings event from broker; args: " + arg);

    switch(arg[0].toString()){
      case "network": 
        console.log("recieved from broker (changing network)");
        this.settingsManager.SetNetwork(arg[1]);
        break;
      case "fullscreen": 
        console.log("recieved from broker (changing network)");
        this.settingsManager.SetFullscreen(arg[1]);
        break;

      default:
        console.log("ERROR: SETTINGS BROKER HANDLE (INVALID RESPONSE)");

    }
  }
  
}


