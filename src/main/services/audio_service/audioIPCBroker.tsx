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

  eventHandle(event: Electron.IpcMainInvokeEvent, arg: string){
    console.log("handling audio event from broker; arg: " + arg);

    switch(arg.toString()){
      case "get_all_metadata":
        console.log("Sending all audio metadata");
        
        return this.audioManager.getAllSongData();

        break;

      default:
        console.log("ERROR: AUDIO BROKER (INVALID RESPONSE)");

    }
  }
  
}


