import { app, BrowserWindow, utilityProcess } from "electron";
import { PlayerIPCBroker } from "./playerIPCBroker";
import path from "path";
import { ChildProcess, spawn } from "child_process";

const { session } = require('electron');

import { BINARYDEPENDENCYDIRECTORY } from "../../main";


//with major assistance from https://github.com/electron/electron/issues/10547/
export class PlayerManager{
    broker: PlayerIPCBroker;
    playerWindow: BrowserWindow | null = null;

    playerWindowHWND: any | null = null;

    mpvPlayerProcess: any;

    constructor() {
        this.broker = new PlayerIPCBroker(this);
    }

    

    LaunchPlayer(playerWindow: BrowserWindow){
        this.playerWindow = playerWindow;
        this.playerWindowHWND = this.playerWindow.getNativeWindowHandle();

        var depPath = __dirname;
        if (app.isPackaged == false){ //developmental file path
            depPath = path.join(depPath, '../../_sample_development_folder/binary_dependencies');
        }
        else{ //change to production file path
            depPath = BINARYDEPENDENCYDIRECTORY;
        }

        console.log("spawning mpv: " + path.join(depPath, "mpv/mpv.exe"));

        try{
            var samplePath = path.join(depPath, '../../_sample_development_folder/video');
            var child = spawn;
            this.mpvPlayerProcess = child(path.join(depPath, "mpv/ss.exe"), ["-parentHWND", this.playerWindowHWND.readUInt32LE(0), "delayed"]);

            //this.mpvPlayerProcess = spawn(path.join(depPath, "mpv/mpv.exe"), [path.join(samplePath, "video.mkv")]);
        }
        catch{
            console.log("NO APPLICATION FOUND");
        }

        
        
    } 
} 


