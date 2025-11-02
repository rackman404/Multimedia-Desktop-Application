import { ChildProcess, spawn } from "child_process";
import { BrowserWindow, app } from "electron";
import path from "path";
import { SongMetaDataSimple } from "../../../types";
import { FFMPEG_FILE_DIRECTORY, MUSIC_EDIT_DIRECTORY, MUSIC_EDIT_PROCESSED_DIRECTORY, MUSIC_EDIT_RAW_DIRECTORY } from "../../main";
import { AudioManager } from "../audio_service/audioManager";
import { AudioEditBroker } from "./audioEditIPCBroker";


import * as fs from "fs" 
import { ConsoleLog, ConsoleOutputType } from "../../../typesAudioEdit";
import { IPCMethodAPI, ServicesEnum } from "../../../typesIPC";

export class AudioEditFFmpegController{
    mainWindow: BrowserWindow | undefined;

    consoleLog: ConsoleLog[];

    FFmpegProcess: ChildProcess | undefined;

    constructor() {
        this.consoleLog = [] as ConsoleLog[];
        //this.convertFile();
        
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

            this.FFmpegProcess?.on('exit', (data: string) => this.#updateConsoleLog(data.toString(), ConsoleOutputType.endOfConversion))


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
            var logRow = {id: this.consoleLog.length, output: "child process exited with code " + data, outputType: type } as ConsoleLog;
        }
        
        
        this.consoleLog.push(logRow);
        console.log(this.consoleLog[this.consoleLog.length-1]);

        //this.mainWindow?.webContents.send(ServicesEnum.audioEdit, this.consoleLog);
        if (this.mainWindow != undefined){
            console.log("SENDING FROM MAIN TO RENDERER (FFmpeg Controller)");
            this.mainWindow.webContents.send(ServicesEnum.audioEdit, this.consoleLog);
        }
        
    }

    //closeFFmpegProcess(){

        //this.FFmpegProcess = undefined;
    //}

    convertFile(){
        //var testArgs = ["-i", "bliss.flac", "-ab", "320k", "bliss.mp3"];
        var testArgs = ["-y" , "-i", path.resolve(MUSIC_EDIT_RAW_DIRECTORY + "\\bliss.flac"), "-ab",  "320k", path.resolve(MUSIC_EDIT_PROCESSED_DIRECTORY) + "\\bliss.mp3"];
        this.#loadFFmpegProcess(testArgs);
    }

    getConsoleLogs(): ConsoleLog[]{
        return this.consoleLog;

    }

}