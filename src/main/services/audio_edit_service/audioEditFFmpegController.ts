import { ChildProcess, spawn } from "child_process";
import { BrowserWindow, app } from "electron";
import path from "path";
import { SongMetaDataSimple } from "../../../types";
import { FFMPEG_FILE_DIRECTORY, MUSIC_EDIT_DIRECTORY, MUSIC_EDIT_PROCESSED_DIRECTORY, MUSIC_EDIT_RAW_DIRECTORY } from "../../main";
import { AudioManager } from "../audio_service/audioManager";
import { AudioEditBroker } from "./audioEditIPCBroker";


import * as fs from "fs" 

export class AudioEditFFmpegController{
    mainWindow: BrowserWindow | undefined

    consoleLog: string[] | undefined

    FFmpegProcess: ChildProcess | undefined;

   

    constructor() {
        this.convertFile();

    }


    loadFFmpegProcess(FFmpegArgs: string[]){


            console.log("spawning FFmpeg process " + FFMPEG_FILE_DIRECTORY);
            if (fs.existsSync(FFMPEG_FILE_DIRECTORY) == true){
                try{
                    this.FFmpegProcess = spawn(path.resolve(FFMPEG_FILE_DIRECTORY), FFmpegArgs); //note setting CWD gives ENOENT errors, fix later
                }
                catch(error){
                    console.log("Error in creating FFmpeg Process: " + error);
                }

                this.FFmpegProcess?.stdout?.on('data', function (data) {
                    console.log('stdout: ' + data);
                
                });

                this.FFmpegProcess?.stderr?.on('data', function (data) {
                    console.log('stderr: ' + data);
                });

                this.FFmpegProcess?.on('exit', function (code) {
                    console.log('child process exited with code ' + code);
                });

            }
            else{
                console.log("FFmpeg EXE NOT FOUND");
            }


            


        
    }

    //closeFFmpegProcess(){

        //this.FFmpegProcess = undefined;
    //}

    convertFile(){
        //var testArgs = ["-i", "bliss.flac", "-ab", "320k", "bliss.mp3"];
        var testArgs = ["-i", path.resolve(MUSIC_EDIT_RAW_DIRECTORY + "\\bliss.flac"), "-ab",  "320k", path.resolve(MUSIC_EDIT_PROCESSED_DIRECTORY) + "\\bliss.mp3"];
        this.loadFFmpegProcess(testArgs);



    }

}