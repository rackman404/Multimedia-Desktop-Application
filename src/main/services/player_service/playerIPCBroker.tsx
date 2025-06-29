import { ipcMain } from "electron/main";
import * as fs from "fs" 
import { PlayerManager } from "./playerManager";

import {Howl, Howler} from 'howler';


export class PlayerIPCBroker {
  settingsManager: PlayerManager;
  
  constructor(settingsController: PlayerManager) {
    this.settingsManager = settingsController;
  }

  eventOn(event: Electron.IpcMainEvent, arg: string){
    console.log("handling player message event player broker; arg: " + arg);

    switch(arg[0].toString()){
      case "placeholder": 
        console.log("recieved from player broker ");
        break;
      default:
        console.log("ERROR: SETTINGS BROKER ON (INVALID RESPONSE)");

    }
  }

  eventHandle(event: Electron.IpcMainInvokeEvent, arg: string[]){
    console.log("handling settings reply event from player broker; args: " + arg);
    switch(arg[0].toString()){
      default:
        console.log("ERROR: SETTINGS BROKER HANDLE (INVALID RESPONSE)");

    }
  }
  
}


