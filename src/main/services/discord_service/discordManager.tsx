import { app } from "electron";
import { DiscordBroker } from "./discordIPCBroker";

import path from "path";

import * as fs from "fs" 
import { ChildProcess, spawn} from "child_process";
import { BINARYDEPENDENCYDIRECTORY } from "../../main";


export class DiscordManager{
    broker: DiscordBroker;
    rpcApplication: ChildProcess | undefined;

    constructor() {
        this.broker = new DiscordBroker(this);
                    
        this.enableClient();
        

        this.rpcApplication?.stdout?.on('data', function (data: { toString: (arg0: string) => any; }) {
            console.log("data: ", data.toString('utf8'));
        });
    }


    sendToRPC(detail: string, state: string, startstamp: string, endstamp: string, imageURL: string){
        this.rpcApplication?.stdin?.write(detail.replace(/,/g, " and ") + "," + state.replace(/,/g, " and ") + "," + startstamp + "," + endstamp + "," + imageURL + "\n");
        //this.rpcApplication?.stdin?.end();
    }

    //https://stackoverflow.com/questions/35940290/how-to-convert-base64-string-to-javascript-file-object-like-as-from-file-input-f
    writeThumbnailToFile(base64URL: string){
        //assume base64URL = 'data:image/png;base64....'; 
        fetch(base64URL)
        .then(res => res.blob())
        .then(blob => {
            const file = new File([blob], "File name",{ type: "image/png" })
        })
    }

    disableClient(){
        this.rpcApplication?.kill('SIGINT');
        this.rpcApplication = undefined;
    }

    enableClient(){
        if (this.rpcApplication == undefined){
            var depPath = __dirname;
            if (app.isPackaged == false){ //developmental file path
                depPath = path.join(depPath, '../../_sample_development_folder/binary_dependencies');
            }
            else{ //change to production file path
                depPath = BINARYDEPENDENCYDIRECTORY;
            }

            console.log("spawning discord RPC CLI: " + path.join(depPath, "discord_rpc_cli.exe"));

            try{
                this.rpcApplication = spawn(path.join(depPath, "discord_rpc_cli.exe"));
            }
            catch{
                console.log("NO DISCORD RPC CLI FOUND");
            }
        }
    }

}