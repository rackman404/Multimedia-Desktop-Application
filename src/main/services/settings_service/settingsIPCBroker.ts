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
    console.log("handling settings message event from broker; arg: " + arg);

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
        console.log("ERROR: SETTINGS BROKER ON (INVALID RESPONSE)");

    }
  }

  eventHandle(event: Electron.IpcMainInvokeEvent, arg: string[]){
    console.log("handling settings reply event from broker; args: " + arg);

    switch(arg[0].toString()){
      case "get_parameters": 
        console.log("recieved from broker (getting parameters)");
        return this.settingsManager.GetParameters();
        break;
      default:
        console.log("ERROR: SETTINGS BROKER HANDLE (INVALID RESPONSE)");

    }
  }
  
}


