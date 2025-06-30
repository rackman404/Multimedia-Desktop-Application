import { ipcMain } from "electron/main";
import * as fs from "fs" 
import { DiscordManager } from "./discordManager";


export class DiscordBroker {
  discordManager: DiscordManager;
  
  constructor(discordController: DiscordManager) {
    this.discordManager = discordController;
  }

  eventOn(event: Electron.IpcMainEvent, arg: string){
    console.log("handling discord message event from broker; arg: " + arg);

    
    switch(arg[0].toString()){
      case "enable_client": 
        console.log("recieved from discord broker, enabling client");

        this.discordManager.enableClient();
        break;
      case "disable_client": 
        console.log("recieved from discord broker, disabling client");

        this.discordManager.disableClient();
        break;
      case "song_notification": //TEST ONLY
        console.log("recieved from discord broker, sending song notification");

        this.discordManager.sendToRPC(arg[1], arg[2], arg[3], arg[4], arg[5]);
        break;
      default:
        console.log("ERROR: DISCORD BROKER (INVALID RESPONSE)");

    }
  }

  eventHandle(event: Electron.IpcMainInvokeEvent, arg: string[]){
    console.log("handling audio reply event from broker; arg: " + arg);

    switch(arg[0].toString()){
      case "client_status": 
        console.log("recieved from discord broker, sending client status");

        return this.discordManager.getClientStatus();
      break;

      default:
        console.log("ERROR: DISCORD BROKER (INVALID RESPONSE)");

    }
  }
  
}


