import { ipcMain } from "electron/main";
import * as fs from "fs" 
import { UtilityManager } from "./utilityManager";

import {Howl, Howler} from 'howler';

import { IPCMethodAPI, IPCServicesMessageInterface } from "../../../typesIPC";

export class UtilityBroker {
  utilityManager: UtilityManager;
  
  constructor(utilityController: UtilityManager) {
    this.utilityManager = utilityController;
  }

  eventOn(event: Electron.IpcMainEvent, arg: IPCServicesMessageInterface){
    console.log("handling settings message event from broker; arg: ");

    switch(arg.service){
      case IPCMethodAPI.UtilityOneWayIPC.placeholder:
        break;
      default:
        console.log("ERROR: SETTINGS BROKER ON (INVALID RESPONSE)");

    }
  }

  eventHandle(event: Electron.IpcMainInvokeEvent, arg: IPCServicesMessageInterface){
    //console.log("handling utility reply event from broker; args: " + arg);

    switch(arg.service){
      case IPCMethodAPI.UtilityTwoWayIPC.imgStringToThumbnail: 
        return this.utilityManager.ImgStringToThumbnail(arg.content[0]);
        break;
      default:
        console.log("ERROR: SETTINGS BROKER HANDLE (INVALID RESPONSE)");

    }
  }
  
}


