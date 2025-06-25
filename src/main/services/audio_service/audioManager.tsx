import { app } from "electron";
import { AudioBroker } from "./audioIPCBroker";
import { AudioPlayBackController } from "./audioPlaybackController";
import path from "path";
import { AudioMetadataReader } from "./audioMetadataReader";

import * as fs from "fs" 
import { SongLyricAPIData, SongMetaData, SongMetaDataSimple } from "../../../types";
import { PRODUCTIONMUSICFILEDIRECTORY } from "../../main";
import { AudioWebLyricReader } from "./lyrics/audioWebLyricReader";

type MetaDatas = {
    full: SongMetaData[],
    simple: SongMetaDataSimple[]
}

export class AudioManager{
    broker: AudioBroker;
    audioPlayback: AudioPlayBackController;
    audioMetadata: AudioMetadataReader;
    audioLyrics: AudioWebLyricReader;
    fileMusicPath: string;

    songMetaDataFull: SongMetaData[] | undefined
    songMetaDataSimple: SongMetaDataSimple[] | undefined


    constructor() {
        this.broker = new AudioBroker(this);
        this.audioPlayback = new AudioPlayBackController();
        this.audioMetadata = new AudioMetadataReader();
        this.audioLyrics = new AudioWebLyricReader();

        if (app.isPackaged == false){ //developmental file path
            this.fileMusicPath = __dirname;
            this.fileMusicPath = path.join(this.fileMusicPath, '../../_sample_development_folder/sample_music');

            console.log("audio manager dev file path: " + this.fileMusicPath);
        }
        else{
            this.fileMusicPath = PRODUCTIONMUSICFILEDIRECTORY;
            //this.fileMusicPath = "";
        }
    }

    async refreshData(){
        this.getSongDataAll().then((result) => {
            this.songMetaDataFull = result.full;
            this.songMetaDataSimple = result.simple;
        });
    }

    async getSongDataAll(): Promise<MetaDatas>{
        var songsPath = fs.readdirSync(this.fileMusicPath);

        var datas = {} as MetaDatas;

        var songDataSimple = [] as SongMetaDataSimple[];
        var songData = [] as SongMetaData[];

        for (var i = 0; i < songsPath.length; i++){
            songData.push(await this.audioMetadata.readMetaData(i, path.join(this.fileMusicPath, songsPath[i])));
            songDataSimple.push({
                metadataFormat: songData[i].metadataFormat,
                id: i,
                name: songData[i].metadataFormat,
                length: songData[i].length,
                artist: songData[i].artist,
                album: songData[i].album,
                genre: songData[i].genre,
                playCount: songData[i].playCount,
                bitrate: songData[i].bitrate,
                songRawPath: songData[i].metadataFormat
            })
        }

        datas.full = songData;

        return datas;
    }

    async requestSimple(): Promise<SongMetaDataSimple[] | undefined>{
        return this.songMetaDataSimple;
    }

    async requestFull(): Promise<SongMetaDataSimple[] | undefined>{
        return this.songMetaDataFull;
    }

    //TEMP
    async getAllSongData(): Promise<SongMetaData[] | undefined>{
        var songsPath = fs.readdirSync(this.fileMusicPath);

        var songData = [] as SongMetaData[];

        for (var i = 0; i < songsPath.length; i++){
            songData.push(await this.audioMetadata.readMetaData(i, path.join(this.fileMusicPath, songsPath[i])));
        }  
        return songData;
    }

    //------- public methods


    async getAllSongDataSimple(): Promise<SongMetaDataSimple[] | undefined>{
        var songsPath = fs.readdirSync(this.fileMusicPath);

        var songData = [] as SongMetaDataSimple[];

        for (var i = 0; i < songsPath.length; i++){
            songData.push(await this.audioMetadata.readMetaDataSimple(i, path.join(this.fileMusicPath, songsPath[i])));
        }  
        return songData;
    }

   async getAllSongDataFull(): Promise<SongMetaData[] | undefined>{
        var songsPath = fs.readdirSync(this.fileMusicPath);

        var songData = [] as SongMetaData[];

        for (var i = 0; i < songsPath.length; i++){
            songData.push(await this.audioMetadata.readMetaDataFull(i, path.join(this.fileMusicPath, songsPath[i])));
        }  
        return songData;
    }

    async getSpecifiedSongDataFull(id: number, song_path: string): Promise<SongMetaDataSimple | undefined>{
        var songsPath = fs.readdirSync(this.fileMusicPath); //remove?
        var songDataFull: SongMetaData;

        songDataFull = (await this.audioMetadata.readMetaDataFull(id, song_path)); 

        return songDataFull;
    }

    async getExternalLyrics(song_path: string): Promise<SongLyricAPIData | undefined>{
        var songData: SongMetaDataSimple
        var lyrics: SongLyricAPIData

        songData = await this.audioMetadata.readMetaDataSimple(-1, song_path);
        lyrics = await this.audioLyrics.requestLyricData(songData);

        return lyrics;
    }

}