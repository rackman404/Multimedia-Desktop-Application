import { ipcMain } from "electron/main";
import * as fs from "fs" 
import { AudioEditManager } from "./audioEditManager";

import {Howl, Howler} from 'howler';
import { IPCMethodAPI, IPCServicesMessageInterface } from "../../../typesIPC";
import { SongMetaDataSimple } from "../../../types";




export class AudioEditBroker {
  audioEditManager: AudioEditManager;
  
  constructor(audioEditController: AudioEditManager) {
    this.audioEditManager = audioEditController;
  }

  eventOn(event: Electron.IpcMainEvent, arg: IPCServicesMessageInterface){
    console.log("handling audio event from broker; arg: " + arg);

    switch(arg.service){
        case IPCMethodAPI.AudioEditOneWayIPC.convertSong:
          console.log("converting song");
          
          this.audioEditManager.convertSong();
        break;

      default:
        console.log("ERROR: AUDIO BROKER (INVALID RESPONSE)");

    }
  }

  eventHandle(event: Electron.IpcMainInvokeEvent, arg: IPCServicesMessageInterface){
    console.log("handling audio event from broker; arg: " + arg);

    switch(arg.service){
    
      case IPCMethodAPI.AudioEditTwoWayIPC.getSongFiles:
        console.log("retrieving songs from ffmpeg edit folder");
        
        return this.audioEditManager.getSongFiles();
        break;

      case IPCMethodAPI.AudioEditTwoWayIPC.requestCoverImageDialog:
        console.log("retrieving cover image from file explorer selection");
        
        return this.audioEditManager.requestCoverImageDialog();
        break;

      case IPCMethodAPI.AudioEditTwoWayIPC.getConsoleLog:
        console.log("retrieving console logs");
        
        return this.audioEditManager.getConsoleLog();
        break;


      default:
        console.log("ERROR: AUDIO BROKER (INVALID RESPONSE): " + arg);

    }
  }
  
}


