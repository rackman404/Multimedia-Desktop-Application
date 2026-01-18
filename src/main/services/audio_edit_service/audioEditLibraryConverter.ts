import { ipcMain } from "electron/main";
import * as fs from "fs" 
import { AudioEditManager } from "./audioEditManager";

import {Howl, Howler} from 'howler';
import { IPCMethodAPI, IPCServicesMessageInterface } from "../../../typesIPC";
import { SongMetaDataSimple } from "../../../types";


type SongConversion = {
    filePath: string,
    needToBeConvertedToMP3: boolean
}

export class AudioEditLibraryConverter {
  constructor() {

  }

  async ConvertSongs(songList: SongMetaDataSimple){
    var conversion = {} as SongConversion[];

    for (var i = 0; i < songList.length; i++){
      //songList[i]
    }

  }
  
}


