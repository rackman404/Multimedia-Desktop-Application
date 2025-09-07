import { ipcMain } from "electron/main";
import * as fs from "fs" 
import { SettingsManager } from "./settingsManager";

import {Howl, Howler} from 'howler';

import { IPCMethodAPI, IPCServicesMessageInterface } from "../../../typesIPC";

export class SettingsBroker {
  settingsManager: SettingsManager;
  
  constructor(settingsController: SettingsManager) {
    this.settingsManager = settingsController;
  }

  eventOn(event: Electron.IpcMainEvent, arg: IPCServicesMessageInterface){
    console.log("handling settings message event from broker; arg: " + arg);

    switch(arg.service){
      case IPCMethodAPI.SettingsOneWayIPC.network:
        console.log("recieved from broker (changing network)");
        this.settingsManager.SetNetwork(arg.content[0]);
        break;
      case IPCMethodAPI.SettingsOneWayIPC.fullscreen:
        console.log("recieved from broker (changing full screen)");
        this.settingsManager.SetFullscreen(arg.content[0]);
        break;
      case IPCMethodAPI.SettingsOneWayIPC.exit:
        console.log("recieved from broker (exit application)");
        this.settingsManager.ExitApplication();
        break;
      default:
        console.log("ERROR: SETTINGS BROKER ON (INVALID RESPONSE)");

    }
  }

  eventHandle(event: Electron.IpcMainInvokeEvent, arg: IPCServicesMessageInterface){
    console.log("handling settings reply event from broker; args: " + arg);

    switch(arg.service){
      case IPCMethodAPI.SettingsTwoWayIPC.getParameters: 
        console.log("recieved from broker (getting parameters)");
        return this.settingsManager.GetParameters();
        break;
      default:
        console.log("ERROR: SETTINGS BROKER HANDLE (INVALID RESPONSE)");

    }
  }
  
}


