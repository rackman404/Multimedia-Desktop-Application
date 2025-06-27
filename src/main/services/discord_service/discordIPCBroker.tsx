import { ipcMain } from "electron/main";
import * as fs from "fs" 
import { DiscordManager } from "./discordManager";

import {Howl, Howler} from 'howler';


export class DiscordBroker {
  discordManager: DiscordManager;
  
  constructor(discordController: DiscordManager) {
    this.discordManager = discordController;
  }



  eventHandle(event: Electron.IpcMainInvokeEvent, arg: string[]){
    console.log("handling audio event from broker; arg: " + arg);

    switch(arg[0].toString()){
      case "test_discord_channel": //TEST ONLY
        console.log("recieved from broker");
        break;

      default:
        console.log("ERROR: AUDIO BROKER (INVALID RESPONSE)");

    }
  }
  
}


