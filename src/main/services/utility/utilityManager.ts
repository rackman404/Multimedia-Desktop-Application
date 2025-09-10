import { app, BrowserWindow} from "electron";

import { SettingParameters, ViewState } from "../../../types";

const { session } = require('electron');
import * as fs from "fs" 
import { CONFIGFILE} from "../../main";
import { UtilityBroker } from "./utilityIPCBroker";
import { promises } from "dns";
import path from "path";


//const { parentPort, workerData, Worker  } = require('worker_threads');
import { parentPort, workerData, Worker  } from "worker_threads";


export class UtilityManager{
    broker: UtilityBroker;

    constructor() {
        console.log("Utility Service Initialized");

        this.broker = new UtilityBroker(this);
    }



    // move into separate class if more image related utils needed
    async ImgStringToThumbnail(imgString: any): Promise<any | null>{
        /* single threaded approach
        var binary = '';
        var bytes = new Uint8Array( imgString.data );
        var len = bytes.byteLength;


        //console.log("(Utility Manager) img string length is: " + imgString.data + " ");
        console.log("(Utility Manager) img string length is: " + len + " ");
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
    
        }

        return btoa(binary);
        */

        return await (this.#SubFunction(imgString));
    } 

    //multithreaded approach
    async #SubFunction(imgString: any): Promise<any | null>{
        return new Promise(function (resolve, reject) {

            if (app.isPackaged == false){
                var funcPath = path.join(__filename, '../../../src/main/services/utility/arrayBufferToBase64.js');
            }
            else{
                //var defaultConfig = JSON.stringify(path.join(__dirname, '../../../resources/assets/temp/arrayBufferToBase64.js') , null, 1); 
                //fs.writeFileSync(CONFIGFILE, defaultConfig); 
                //console.log("Config File Successfully created!");
                var funcPath = path.join(__dirname, '../../../assets/temp/arrayBufferToBase64.js');
            }
            

            const worker = new Worker(funcPath, {
            workerData: {data: imgString.data},
            });

            var data = '';

            worker.on('message', (result: any) => {
                console.log("Result from worker: got ");
                resolve(result);
            });


            }
        );
    }


    /*
    async #arrayBufferToBase64( buffer: any) {
        var binary = '';
        var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;

        //var count = 0;
        //var progressCheck = 0;

        var timeTilLoadingIndicator = 0;
        var loadedIndicator = false;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }
        return window.btoa( binary );
    }
    */

} 



