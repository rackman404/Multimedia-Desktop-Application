import { ipcMain } from "electron/main";
import * as fs from "fs" 
import { AudioManager } from "./audio_controller";

import {Howl, Howler} from 'howler';


export class AudioBroker {
  constructor(audioController: AudioManager) {
    
  }

  eventHandle(event: Electron.IpcMainEvent, arg: string){

  }
}

