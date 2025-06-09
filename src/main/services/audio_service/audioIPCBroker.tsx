import { ipcMain } from "electron/main";
import * as fs from "fs" 
import { AudioManager } from "./audioManager";

import {Howl, Howler} from 'howler';


export class AudioBroker {
  audioManager: AudioManager;
  
  constructor(audioController: AudioManager) {
    this.audioManager = audioController;
  }

  eventOn(event: Electron.IpcMainEvent, arg: string){
    console.log("handling audio event from broker; arg: " + arg);

    switch(arg.toString()){
      case "get_all_metadata":
        console.log("Sending all audio metadata");
        


        break;

      default:
        console.log("ERROR: AUDIO BROKER (INVALID RESPONSE)");

    }
  }

  eventHandle(event: Electron.IpcMainInvokeEvent, arg: string[]){
    console.log("handling audio event from broker; arg: " + arg);

    switch(arg[0].toString()){
      case "get_all_metadata": //TEST ONLY
        console.log("Sending all audio metadata");
        
        return this.audioManager.getAllSongData();

        break;
      case "get_all_metadata_full":
        console.log("Sending all full audio metadata");
        
        return this.audioManager.getAllSongDataFull();

        break;
      case "get_all_metadata_simple":
        console.log("Sending all simple audio metadata");
        
        return this.audioManager.getAllSongDataSimple();

        break;
      case "get_metadata_full":
        console.log("Sending full data");
        
        return this.audioManager.getSpecifiedSongDataFull(parseInt(arg[1]), arg[2]);

        break;
      case "reload":
        console.log("Reloading metadata");
        
        return this.audioManager.refreshData();

        break;

      default:
        console.log("ERROR: AUDIO BROKER (INVALID RESPONSE)");

    }
  }
  
}


