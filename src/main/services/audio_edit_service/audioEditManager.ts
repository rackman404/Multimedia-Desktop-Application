import { app, BrowserWindow } from "electron";
import { AudioEditBroker } from "./audioEditIPCBroker";
import path from "path";

import * as fs from "fs" 
import { DeepLStatistics, DEFAULTSONGMETADATASIMPLE, MiscData, SettingParameters, SongMetaData, SongMetaDataSimple, SongSearchTypeState } from "../../../types";
import { CONFIGFILE, MISCDATAFILE, MUSIC_EDIT_DIRECTORY, FFMPEG_FILE_DIRECTORY, MUSIC_EDIT_RAW_DIRECTORY, MUSIC_EDIT_PROCESSED_DIRECTORY } from "../../main";
import { AudioManager } from "../audio_service/audioManager";
import { ChildProcess } from "child_process";
import { AudioEditFFmpegController } from "./audioEditFFmpegController";
import { ConsoleLog, ConversionData } from "../../../typesAudioEdit";
import { IPCReturnMethodAPI, IPCServicesMessageReturnInterface, ServicesEnum } from "../../../typesIPC";
import { AudioEditLibraryConverter } from "./audioEditLibraryConverter";

const { dialog } = require('electron')




export class AudioEditManager{
    broker: AudioEditBroker;
    audioManager: AudioManager;
    
    audioEditLibraryConverter: AudioEditLibraryConverter;

    mainWindow: BrowserWindow | undefined;

    //songs: SongMetaDataSimple[][] | undefined

    FFmpegController: AudioEditFFmpegController;
    

    constructor(audioM: AudioManager) {
        this.broker = new AudioEditBroker(this);
        this.audioManager = audioM;
        this.audioEditLibraryConverter = new AudioEditLibraryConverter;

        this.FFmpegController = new AudioEditFFmpegController();
    }

    setWindow(win: BrowserWindow){
        this.mainWindow = win;
        this.FFmpegController.setWindow(win);

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
                console.debug("ERROR IN RECURSIVE METADATA SEARCH " + error);
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
    
    async getSongFiles(): Promise<SongMetaDataSimple[][]>{
        var songs = [[], []] as SongMetaDataSimple[][]; //0 raw, 1 processed
        
        
        songs[0] = await this._recursiveSearchSimple(songs[0], MUSIC_EDIT_RAW_DIRECTORY, 0);
        songs[1] = await this._recursiveSearchSimple(songs[1], MUSIC_EDIT_PROCESSED_DIRECTORY, 0);

        

        return songs;

    }

    async requestCoverImageDialog(): Promise<String>{
        var imgPath = "";

        /*
        dialog.showOpenDialog(this.mainWindow, { properties: ['openFile', 'dontAddToRecent']}).then((result: { canceled: any; filePaths: any; }) => {
            console.log(result.canceled)
            console.log(result.filePaths)

            if (result.canceled == true){
                return imgPath;
            }
            else{
                imgPath = result.filePaths[0];
                return imgPath;
            }
        }).catch((err: any) => {
            console.log(err)
        })
        */

        var paths =  dialog.showOpenDialogSync(this.mainWindow, 
            { properties: ['openFile', 'dontAddToRecent'], 
            filters: [
                { name: 'Images', extensions: ['jpg', 'png'] },
                { name: 'All Files', extensions: ['*'] }
            ]},
        );

        if (paths != undefined){
            imgPath = paths[0];
            console.log(paths[0]);
        }

        return imgPath;
    }

    async getConsoleLog(): Promise<ConsoleLog[]>{
        var data = [] as ConsoleLog[];
        data = this.FFmpegController.getConsoleLogs();

        return data;
    }

    async convertSong(data: ConversionData){
        this.FFmpegController.convertFile(data);


    }

    async libraryConversion(){
        var songs = await this.audioManager.getAllSongDataSimple(false);
    }

}