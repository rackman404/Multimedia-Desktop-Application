import { ipcMain } from "electron/main";
import * as fs from "fs" 
import { AudioManager } from "./audioManager";

import {Howl, Howler} from 'howler';
import { IPCMethodAPI, IPCServicesMessageInterface } from "../../../typesIPC";
import { SongLyricAPIData, SongMetaDataSimple, SupportedRomanizationOptions } from "../../../types";



export class AudioBroker {
  audioManager: AudioManager;
  
  constructor(audioController: AudioManager) {
    this.audioManager = audioController;
  }

  eventOn(event: Electron.IpcMainEvent, arg: IPCServicesMessageInterface){
    console.log("handling audio event from broker; arg: " + arg);

    switch(arg.service){
      case IPCMethodAPI.AudioOneWayIPC.storeLastPlayedSong:
        console.log("Storing Last Played Song");
        this.audioManager.storeLastPlayedSong(arg.content[0] as SongMetaDataSimple);
        break;

      case IPCMethodAPI.AudioOneWayIPC.setJyutping:
        console.log("setting romanization as: " + arg.content[0] as SupportedRomanizationOptions);
        this.audioManager.PhoneticsSetJyutping(arg.content[0] as SupportedRomanizationOptions);
        break;
        
      case IPCMethodAPI.AudioOneWayIPC.setForcedRomanizationOverride:
        console.log("setting romanization override");
        this.audioManager.PhoneticsSetForcedRomanizationOverride(arg.content[0] as boolean);
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
        
        return this.audioManager.getAllSongDataSimple(arg.content[0]);

        break;
      case IPCMethodAPI.AudioTwoWayIPC.getSelectedMetadataFull:
        console.log("Sending full data");
        
        return this.audioManager.getSpecifiedSongDataFull(parseInt(arg.content[0]), arg.content[1]);

        break;
      case IPCMethodAPI.AudioTwoWayIPC.externalLyrics:
        console.log("getting lyrics");
        
        return this.audioManager.getExternalLyrics(arg.content[0]);

        break;

      case IPCMethodAPI.AudioTwoWayIPC.externalLyricsFromMetadata:
        console.log("getting lyrics From Metadata");
        
        return this.audioManager.getExternalLyricsFromMetadata(arg.content[0]);

        break;

      case IPCMethodAPI.AudioTwoWayIPC.externalTranslatedLyrics:
        console.log("getting translated lyrics");
          
        return this.audioManager.getExternalTranslatedLyrics(arg.content[0]);

      break;

      case IPCMethodAPI.AudioTwoWayIPC.externalDeepLStats:
        console.log("getting deepL statistics");
          
        return this.audioManager.getDeepLStatistics();

      break;

      case IPCMethodAPI.AudioTwoWayIPC.searchAllSongsSimple:
        console.log("searching all songs list: " + arg.content.toString());
          
        return this.audioManager.searchAllSongsSimple(arg.content[0], arg.content[1]);

      break;

      case IPCMethodAPI.AudioTwoWayIPC.searchPlaylistSongsSimple:
        console.log("searching specified playlist list");
          
        return this.audioManager.searchPlaylistSongsSimple(arg.content[0], arg.content[1]);

      break;
      case IPCMethodAPI.AudioTwoWayIPC.retrieveLastPlayedSong:
        console.log("retrieving last played song");
          
        return this.audioManager.retrieveLastPlayedSong();

      break;

      case IPCMethodAPI.AudioTwoWayIPC.phoneticsParse:
        console.log("retrieving phonetics translation");
          
        return this.audioManager.PhoneticsParse(arg.content[0] as SongLyricAPIData, arg.content[1] as SongMetaDataSimple);

      break;

      
      case IPCMethodAPI.AudioTwoWayIPC.getJyutping:
        console.log("retrieving phonetics translation");
          
        return this.audioManager.PhoneticsGetJyutping();

      break;

      case IPCMethodAPI.AudioTwoWayIPC.getForcedRomanizationOverride:
        console.log("retrieving phonetics translation");
          
        return this.audioManager.PhoneticsGetForcedRomanizationOverride();

      break;


      default:
        console.log("ERROR: AUDIO BROKER (INVALID RESPONSE): " + arg);

    }
  }
  
}


