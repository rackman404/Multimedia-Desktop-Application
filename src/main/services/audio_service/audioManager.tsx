import { app } from "electron";
import { AudioBroker } from "./audioIPCBroker";
import { AudioPlayBackController } from "./audioPlaybackController";
import path from "path";
import { AudioMetadataReader } from "./audioMetadataReader";

import * as fs from "fs" 
import { SongMetaData } from "../../../types";



export class AudioManager{
    broker: AudioBroker;
    audioPlayback: AudioPlayBackController;
    audioMetadata: AudioMetadataReader;
    fileMusicPath: string;

    constructor() {
        this.broker = new AudioBroker(this);
        this.audioPlayback = new AudioPlayBackController();
        this.audioMetadata = new AudioMetadataReader();

        if (app.isPackaged == false){ //developmental file path
            this.fileMusicPath = __dirname;
            this.fileMusicPath = path.join(this.fileMusicPath, '../../_sample_development_folder/sample_music');

            console.log("audio manager dev file path: " + this.fileMusicPath);
            

            this.getAllSongData();
        }
        else{
            this.fileMusicPath = __dirname;
        }
    }

    async getAllSongData(): Promise<SongMetaData[]>{
        var songsPath = fs.readdirSync(this.fileMusicPath);

        var songData = [] as SongMetaData[];

        for (var i = 0; i < songsPath.length; i++){
            songData.push(await this.audioMetadata.readMetaData(i, path.join(this.fileMusicPath, songsPath[i])));
        }

        
        return songData;

    }

}