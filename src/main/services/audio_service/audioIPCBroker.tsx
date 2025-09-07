import { ipcMain } from "electron/main";
import * as fs from "fs" 
import { AudioManager } from "./audioManager";

import {Howl, Howler} from 'howler';
import { IPCMethodAPI, IPCServicesMessageInterface } from "../../../typesIPC";


export class AudioBroker {
  audioManager: AudioManager;
  
  constructor(audioController: AudioManager) {
    this.audioManager = audioController;
  }

  eventOn(event: Electron.IpcMainEvent, arg: IPCServicesMessageInterface){
    console.log("handling audio event from broker; arg: " + arg);

    switch(arg.service){
      case IPCMethodAPI.AudioOneWayIPC.placeholder:
        console.log("Sending all audio metadata");
        
        break;

      default:
        console.log("ERROR: AUDIO BROKER (INVALID RESPONSE)");

    }
  }

  eventHandle(event: Electron.IpcMainInvokeEvent, arg: IPCServicesMessageInterface){
    console.log("handling audio event from broker; arg: " + arg);

    switch(arg.service){
      /* unused?
      case "get_all_metadata": //TEST ONLY
        console.log("Sending all audio metadata");
        
        return this.audioManager.getAllSongData();

        break;
      */
      /* unused?
      case "get_all_metadata_full":
        console.log("Sending all full audio metadata");
        
        return this.audioManager.getAllSongDataFull();

        break;
      */
      case IPCMethodAPI.AudioTwoWayIPC.getAllMetadataSimple:
        console.log("Sending all simple audio metadata");
        
        return this.audioManager.getAllSongDataSimple();

        break;
      case IPCMethodAPI.AudioTwoWayIPC.getSelectedMetadataFull:
        console.log("Sending full data");
        
        return this.audioManager.getSpecifiedSongDataFull(parseInt(arg.content[0]), arg.content[1]);

        break;
      case IPCMethodAPI.AudioTwoWayIPC.externalLyrics:
        console.log("getting lyrics");
        
        return this.audioManager.getExternalLyrics(arg.content[0]);

        break;

      case IPCMethodAPI.AudioTwoWayIPC.externalTranslatedLyrics:
        console.log("getting translated lyrics");
          
          return this.audioManager.getExternalTranslatedLyrics(arg.content[0]);

          break;

      case IPCMethodAPI.AudioTwoWayIPC.externalDeepLStats:
        console.log("getting deepL statistics");
          
          return this.audioManager.getDeepLStatistics();

          break;

      default:
        console.log("ERROR: AUDIO BROKER (INVALID RESPONSE)");

    }
  }
  
}


