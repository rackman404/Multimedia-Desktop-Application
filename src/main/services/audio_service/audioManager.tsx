import { app } from "electron";
import { AudioBroker } from "./audioIPCBroker";
import path from "path";
import { AudioMetadataReader } from "./audioMetadataReader";

import * as fs from "fs" 
import { DeepLStatistics, DEFAULTSONGMETADATASIMPLE, MiscData, SettingParameters, SongLyricAPIData, SongMetaData, SongMetaDataSimple, SongSearchTypeState } from "../../../types";
import { CONFIGFILE, MISCDATAFILE, PRODUCTIONMUSICFILEDIRECTORY } from "../../main";
import { AudioWebLyricReader } from "./lyrics/audioWebLyricReader";
import { AudioDeepLTranslator } from "./lyrics/audioDeepLTranslator";
import { AudioSearch } from "./filters/audioSearch";
import { AudioPhonetics } from "./phonetics/audioPhonetics";

type MetaDatas = {
    full: SongMetaData[],
    simple: SongMetaDataSimple[]
}

export class AudioManager{
    broker: AudioBroker;
    audioMetadata: AudioMetadataReader;
    audioLyrics: AudioWebLyricReader;
    audioTranslator: AudioDeepLTranslator;
    audioSearch: AudioSearch;
    audioPhonetics: AudioPhonetics

    fileMusicPath: string;

    //songMetaDataFull: SongMetaData[] | undefined
    //songMetaDataSimple: SongMetaDataSimple[] | undefined

    //session metadata stores
    mainSongMetaData: SongMetaDataSimple[] | undefined
    searchMainSongMetaData: SongMetaDataSimple[] | undefined
    playlistSongMetaData: SongMetaDataSimple[] | undefined
    playlistSearchSongMetaData: SongMetaDataSimple[] | undefined

    constructor() {
        this.broker = new AudioBroker(this);
        this.audioMetadata = new AudioMetadataReader();
        this.audioLyrics = new AudioWebLyricReader();
        this.audioTranslator = new AudioDeepLTranslator();
        this.audioSearch = new AudioSearch();
        this.audioPhonetics = new AudioPhonetics();

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
    

    /*
    * Algorithm Steps:
    * 1. create list of files in directory and copy highest id from higher depth folder (before it invokes the current search iteration)
    * 2. for all files in direcotry
    *   3. if file exists and is a folder directory
    *       4. go back to step 1
    *       4b. after step 4 is complete (whereby all lower depth folders are explored), copy the id into current iteration and continue to step 5
    *   5. get file metadata and record into metadata list
    * 6. return final metadata list
    *  
    * To ensure that ID count is continuous and does not repeat, note that the id at the current depth will have its id replaced by the 'deepest' step as seen in id = datas[datas.length-1].id+1;.
    */
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
                    var dataNew = await this.audioMetadata.readMetaDataSimple(id, path.join(recursedPath, songsPath[i]));
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

    //------- public methods

    async getAllSongDataSimple(refresh: boolean): Promise<SongMetaDataSimple[] | undefined>{
        var songData = [] as SongMetaDataSimple[];

        if (this.mainSongMetaData == undefined || refresh == true){
            var songsPath = fs.readdirSync(this.fileMusicPath);
            songData = await this._recursiveSearchSimple(songData, this.fileMusicPath, 0);

            this.mainSongMetaData = songData;

            return songData;
        }
        else{
            return this.mainSongMetaData;
        }
    }

    /* unused?
   async getAllSongDataFull(): Promise<SongMetaData[] | undefined>{
        var songsPath = fs.readdirSync(this.fileMusicPath);

        var songData = [] as SongMetaData[];

        for (var i = 0; i < songsPath.length; i++){
            songData.push(await this.audioMetadata.readMetaDataFull(i, path.join(this.fileMusicPath, songsPath[i])));
        }  

        return songData;
    }
    */

    async getSpecifiedSongDataFull(id: number, song_path: string): Promise<SongMetaDataSimple | undefined>{
        //var songsPath = fs.readdirSync(this.fileMusicPath); //remove?
        var songDataFull: SongMetaData;

        songDataFull = (await this.audioMetadata.readMetaDataFull(id, song_path)); 

        return songDataFull;
    }

    async getExternalLyrics(song_path: string): Promise<SongLyricAPIData | undefined>{
        var songData: SongMetaDataSimple | null;
        var lyrics: SongLyricAPIData

        songData = await this.audioMetadata.readMetaDataSimple(-1, song_path);
        if (songData != null){
            lyrics = await this.audioLyrics.requestLyricData(songData);
        }
        else{
            return undefined;
        }

        return lyrics;
    }

    async getExternalLyricsFromMetadata(metadata: SongMetaDataSimple): Promise<SongLyricAPIData | undefined>{
        var lyrics: SongLyricAPIData
        if (metadata != null){
            lyrics = await this.audioLyrics.requestLyricData(metadata);
        }
        else{
            return undefined;
        }

        return lyrics;
    }

    
    async getExternalTranslatedLyrics(songData: any): Promise<SongLyricAPIData | undefined>{
        var lyrics: SongLyricAPIData
        var DeepLKey: string


        //var rawdata = fs.readFileSync(path.join(this.fileConfigPath, 'config.json'));
        var rawdata = fs.readFileSync(CONFIGFILE);
        var jsonConfig = JSON.parse(rawdata.toString()) as SettingParameters;
        DeepLKey = jsonConfig.MusicSettings.DeepLKey;

        if (DeepLKey == ""){//no deepL key was provided, return the original
            return songData;
        }

        lyrics = await this.audioTranslator.requestDeepLTranslation(songData, DeepLKey);

        return lyrics;
    }

    async getDeepLStatistics(): Promise<DeepLStatistics | undefined>{
        var DeepLKey: string

        
        //var rawdata = fs.readFileSync(path.join(this.fileConfigPath, 'config.json'));
        var rawdata = fs.readFileSync(CONFIGFILE);
        var jsonConfig = JSON.parse(rawdata.toString()) as SettingParameters;
        DeepLKey = jsonConfig.MusicSettings.DeepLKey;

        var characters = await this.audioTranslator.requestDeepLStatistics(DeepLKey);

        return characters;
    }

    //song search
    async searchAllSongsSimple(searchString: string, searchType: SongSearchTypeState): Promise<SongMetaDataSimple[] | undefined>{
        var list = await this.audioSearch.searchSongs(searchString, searchType, this.mainSongMetaData);
        this.searchMainSongMetaData = list;
        return list;
    }

    
    async getLastSearchedAllSongSimple(): Promise<SongMetaDataSimple[] | undefined>{ //unused
        return this.searchMainSongMetaData;
    }

    async searchPlaylistSongsSimple(searchString: string, searchType: SongSearchTypeState): Promise<SongMetaDataSimple[] | undefined>{ //implement when playlists are implemented
        return undefined;
    }

    //Misc. 
    async storeLastPlayedSong(song: SongMetaDataSimple): Promise<SongMetaDataSimple | undefined>{
        var miscDataFile = fs.readFileSync(MISCDATAFILE);
        var jsonData = JSON.parse(miscDataFile.toString()) as MiscData;
        
        jsonData.lastPlayedSong = song;

        var updated = JSON.stringify(jsonData, null, 1); 
        fs.writeFileSync(MISCDATAFILE, updated); 

        return undefined;
    }

    async retrieveLastPlayedSong(): Promise<SongMetaDataSimple | undefined>{
        var miscDataFile = fs.readFileSync(MISCDATAFILE);
        var jsonData = JSON.parse(miscDataFile.toString()) as MiscData;

        if (fs.existsSync(jsonData.lastPlayedSong.songRawPath) == false){
            console.log("(AUDIO MANAGER) LAST PLAYED SONG DOESN'T EXIST");
            return DEFAULTSONGMETADATASIMPLE;
            
        }

        return jsonData.lastPlayedSong;
    }

    async PhoneticsParse(lyrics: SongLyricAPIData, jyutping: boolean): Promise<SongLyricAPIData | undefined>{
        var phonetics = this.audioPhonetics.requestPhonetics(lyrics, jyutping);

        return phonetics;
    }


}