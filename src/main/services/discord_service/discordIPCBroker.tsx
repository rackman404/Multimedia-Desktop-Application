import { ipcMain } from "electron/main";
import * as fs from "fs" 
import { DiscordManager } from "./discordManager";

import {Howl, Howler} from 'howler';
import { IPCMethodAPI, IPCServicesMessageInterface } from "../../../typesIPC";


export class DiscordBroker {
  discordManager: DiscordManager;
  
  constructor(discordController: DiscordManager) {
    this.discordManager = discordController;
  }

  eventOn(event: Electron.IpcMainEvent, arg: IPCServicesMessageInterface){
    console.log("handling discord message event from broker; arg: " + arg);

    
    switch(arg.service){
      case IPCMethodAPI.DiscordOneWayIPC.enableClient: 
        console.log("recieved from discord broker, enabling client");

        this.discordManager.enableClient();
        break;
      case IPCMethodAPI.DiscordOneWayIPC.disableClient: 
        console.log("recieved from discord broker, disabling client");

        this.discordManager.disableClient();
        break;
      case IPCMethodAPI.DiscordOneWayIPC.songNotification: //TEST ONLY
        console.log("recieved from discord broker, sending song notification");
        console.log(arg.content[0] + " " +  arg.content[1] + " " + arg.content[2] + " " + arg.content[3] + " " + arg.content[4]);
        this.discordManager.sendToRPC(arg.content[0], arg.content[1], arg.content[2], arg.content[3], arg.content[4]);
        break;
      default:
        console.log("ERROR: DISCORD BROKER (INVALID RESPONSE): " + arg.service);

    }
  }

  eventHandle(event: Electron.IpcMainInvokeEvent, arg: IPCServicesMessageInterface){
    console.log("handling audio reply event from broker; arg: " + arg);

    switch(arg.service){
      case IPCMethodAPI.DiscordTwoWayIPC.clientStatus: 
        console.log("recieved from discord broker, sending client status");

        return this.discordManager.getClientStatus();
      break;

      default:
        console.log("ERROR: DISCORD BROKER (INVALID RESPONSE)");

    }
  }
  
}


