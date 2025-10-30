import { app } from "electron";
import { AudioEditBroker } from "./audioEditIPCBroker";
import path from "path";

import * as fs from "fs" 
import { DeepLStatistics, DEFAULTSONGMETADATASIMPLE, MiscData, SettingParameters, SongMetaData, SongMetaDataSimple, SongSearchTypeState } from "../../../types";
import { CONFIGFILE, MISCDATAFILE, MUSIC_EDIT_DIRECTORY, FFMPEG_FILE_DIRECTORY } from "../../main";
import { AudioManager } from "../audio_service/audioManager";


type MetaDatas = {
    full: SongMetaData[],
    simple: SongMetaDataSimple[]
}

export class AudioEditManager{
    broker: AudioEditBroker;
    audioManager: AudioManager;

    songs: SongMetaDataSimple[] | undefined


    constructor(audioM: AudioManager) {
        this.broker = new AudioEditBroker(this);
        this.audioManager = audioM;
    }
    
    async _recursiveSearchSimple(datas: SongMetaDataSimple[], recursedPath: string, recursedID: number): Promise<SongMetaDataSimple[]>{
        var songsPath = fs.readdirSync(recursedPath);
        var id = recursedID;
        
        var folderDetected = false;
        for (var i = 0; i < songsPath.length; i++){
            try {
                if (fs.existsSync(path.join(recursedPath, songsPath[i]))) { //check for recursive folder
                    if (fs.lstatSync(path.join(recursedPath, songsPath[i])).isDirectory()){
                        //console.debug("CHECKING RECURSED FOLDER FOR MUSIC METADATA");
                        folderDetected = true;
                        datas = await this._recursiveSearchSimple(datas, path.join(recursedPath, songsPath[i]), id);
                        id = datas[datas.length-1].id+1; //this is needed since once all lower depth folders have been explored, you'd need to ensure a continuous id
                    }
                }
            } 
            catch (error) {
                console.debug("ERROR IN RECURSIVE METADATA SEARCH" + error);
            }

            try{
                if (folderDetected != true){
                    var dataNew = await this.audioManager.audioMetadata.readMetaDataSimple(id, path.join(recursedPath, songsPath[i]));
                    if (dataNew != null){
                        datas.push(dataNew);
                    }
                    else{
                        console.log("recursive song metadata gathering ignored:" + path.join(recursedPath, songsPath[i]));
                        id--;
                    }
                }
                else{
                    id--;//must decrement id when a folder is detected to ensure that the id count doesn't skip 1 everytime a folder is detected
                }
            }
            catch(error) {
                console.debug("ERROR IN METADATA SEARCH" + error);
            }
            
            folderDetected = false;
            id++;
        }  

        return datas;
    }
    
    async getSongFiles(): Promise<SongMetaDataSimple[]>{
        this.songs = [] as SongMetaDataSimple[];

        this.songs = await this._recursiveSearchSimple(this.songs, MUSIC_EDIT_DIRECTORY, 0);

        return this.songs;

    }

}