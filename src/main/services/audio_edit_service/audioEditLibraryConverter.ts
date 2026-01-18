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

export class AudioEdditLibraryConverter {
  constructor() {

  }

  async GetListOfSongs(){
    var conversion = {} as SongConversion[];
  }
  
}


