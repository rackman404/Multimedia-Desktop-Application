import { ChildProcess, spawn } from "child_process";
import { BrowserWindow, app } from "electron";
import path from "path";
import { SongMetaDataSimple } from "../../../types";
import { FFMPEG_FILE_DIRECTORY, MUSIC_EDIT_DIRECTORY, MUSIC_EDIT_PROCESSED_DIRECTORY, MUSIC_EDIT_RAW_DIRECTORY } from "../../main";
import { AudioManager } from "../audio_service/audioManager";
import { AudioEditBroker } from "./audioEditIPCBroker";


import * as fs from "fs" 
import { ConsoleLog, ConsoleOutputType, ConversionData } from "../../../typesAudioEdit";
import { IPCMethodAPI, IPCReturnMethodAPI, IPCServicesMessageReturnInterface, ServicesEnum } from "../../../typesIPC";

export class AudioEditFFmpegController{
    mainWindow: BrowserWindow | undefined;

    consoleLog: ConsoleLog[];

    FFmpegProcess: ChildProcess | undefined;

    constructor() {
        this.consoleLog = [] as ConsoleLog[]; 
    }

    setWindow(win: BrowserWindow){
        this.mainWindow = win;

    }

    /*
    1. Clear initial console logs (from previous conversions)
    2. Perform Conversion
    3. During Conversion Process, add new stdout: to consoleLog 
    */
    #loadFFmpegProcess(FFmpegArgs: string[]){
        this.consoleLog = [] as ConsoleLog[];

        console.log("spawning FFmpeg process " + FFMPEG_FILE_DIRECTORY);
        if (fs.existsSync(FFMPEG_FILE_DIRECTORY) == true){
            try{
                this.FFmpegProcess = spawn(path.resolve(FFMPEG_FILE_DIRECTORY), FFmpegArgs); //note setting CWD gives ENOENT errors, fix later
            }
            catch(error){
                console.log("Error in creating FFmpeg Process: " + error);
            }

            this.FFmpegProcess?.stderr?.on('data', (data: string) => this.#updateConsoleLog(data.toString(), ConsoleOutputType.stdout));  
            /*
            this.FFmpegProcess?.stdout?.on('data', function (data) {
                console.log('stderr: ' + data);
            });
            */

            this.FFmpegProcess?.on('exit', (data: string) => {this.#updateConsoleLog(data.toString(), ConsoleOutputType.endOfConversion)})
        }
        else{
            console.log("FFmpeg EXE NOT FOUND");
        }



    }

    #updateConsoleLog(data: string, type: ConsoleOutputType){
        

        if (type == ConsoleOutputType.stdout){
            console.log('\n STDOUT: ---------------------------------------------------- \n' + data);
            var logRow = {id: this.consoleLog.length, output: data, outputType: type} as ConsoleLog;
        }
        else{
            console.log('\n STDEND: ---------------------------------------------------- \n' + data);
            if (data == "0"){
                var logRow = {id: this.consoleLog.length, output: "child process exited with code " + data, outputType: type } as ConsoleLog;

            }
            else{
                var logRow = {id: this.consoleLog.length, output: "child process exited with code " + data, outputType: ConsoleOutputType.error } as ConsoleLog;
            }

            //refresh the song list on song conversion
            if (this.mainWindow != undefined){
                console.log("ffmpeg controller: end of process message sent to renderer");
                this.mainWindow.webContents.send(ServicesEnum.audioEdit, {service: IPCReturnMethodAPI.AudioReturnIPC.returnSongList, content: [true]} as IPCServicesMessageReturnInterface);
            }
            
        }
        
        
        this.consoleLog.push(logRow);
        console.log(this.consoleLog[this.consoleLog.length-1]);

        //this.mainWindow?.webContents.send(ServicesEnum.audioEdit, this.consoleLog);
        if (this.mainWindow != undefined){
            console.log("SENDING FROM MAIN TO RENDERER (FFmpeg Controller)");
            this.mainWindow.webContents.send(ServicesEnum.audioEdit, {service: IPCReturnMethodAPI.AudioReturnIPC.returnConsoleLog, content: [this.consoleLog]} as IPCServicesMessageReturnInterface);
        }
        
    }

    //closeFFmpegProcess(){

        //this.FFmpegProcess = undefined;
    //}

    //https://wiki.multimedia.cx/index.php/FFmpeg_Metadata
    convertFile(data: ConversionData){
        //var testArgs = ["-y" , "-i", path.resolve(MUSIC_EDIT_RAW_DIRECTORY + "\\bliss.flac"), "-metadata", "title=\"Movie Title\"", "-ab",  "320k", path.resolve(MUSIC_EDIT_PROCESSED_DIRECTORY) + "\\bliss.mp3"];  

        var fileName = this.#getLastPath(data.fileRawPath);
        console.log("FILENAME: " + fileName);
        
        var inputArgs = ["-y", "-i", path.resolve(MUSIC_EDIT_RAW_DIRECTORY + "\\" + fileName)] as string[];

        // Basic Metadata Manipulation 
        if (data.coverPath != ""){
            inputArgs.push("-i");
            inputArgs.push( data.coverPath);
            inputArgs.push("-map");
            inputArgs.push("0:0");
            inputArgs.push("-map");
            inputArgs.push("1:0");
            inputArgs.push("-c");
            inputArgs.push("copy");
            inputArgs.push("-disposition:v:0");
            inputArgs.push("attached_pic");
        }

        if (data.songName != ""){
            inputArgs.push("-metadata");
            inputArgs.push( "title=" + data.songName);
        }
        if (data.songArtist[0] != undefined){
            inputArgs.push("-metadata");
            inputArgs.push("author=" + data.songArtist[0] );
            inputArgs.push("-metadata");
            inputArgs.push("album_artist=" + data.songArtist[0] );
            inputArgs.push("-metadata");
            inputArgs.push("artist=" + data.songArtist[0] ); //contributing artist
        }
        if (data.songGenre[0] != undefined){
            inputArgs.push("-metadata");
            inputArgs.push("genre=" + data.songGenre[0]) ;
        }
        if (data.songAlbum != ""){
            inputArgs.push("-metadata");
            inputArgs.push("album=" + data.songAlbum);
        }



        var outputArgs = [path.resolve(MUSIC_EDIT_PROCESSED_DIRECTORY + "\\" + fileName)] as string[];

        var totalArgs = [];
        totalArgs.push(...inputArgs); //... = spread operator
        totalArgs.push(...outputArgs);

        console.log(totalArgs.toString());

        this.#loadFFmpegProcess(totalArgs);

    }

    //https://stackoverflow.com/questions/62705412/getting-the-last-segment-of-an-url
    #getLastPath = (path: string) => {
        const paths = path.split("\\"); 
        return paths.pop() || paths.pop();
    }

    getConsoleLogs(): ConsoleLog[]{
        return this.consoleLog;

    }

}