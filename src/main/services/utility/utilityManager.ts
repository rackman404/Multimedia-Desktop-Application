import { app, BrowserWindow} from "electron";

import { SettingParameters, ViewState } from "../../../types";

const { session } = require('electron');
import * as fs from "fs" 
import { CONFIGFILE} from "../../main";
import { UtilityBroker } from "./utilityIPCBroker";
import { promises } from "dns";
import path from "path";


const { parentPort, workerData, Worker  } = require('worker_threads');


export class UtilityManager{
    broker: UtilityBroker;

    constructor() {
        console.log("Utility Service Initialized");

        this.broker = new UtilityBroker(this);
    }

    // move into separate class if more image related utils needed
    async ImgStringToThumbnail(imgString: any): Promise<any | null>{
        var binary = '';
        var bytes = new Uint8Array( imgString.data );
        var len = bytes.byteLength;


        //console.log("(Utility Manager) img string length is: " + imgString.data + " ");
        console.log("(Utility Manager) img string length is: " + len + " ");
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
    
        }

        return binary;

        /*
        console.log("img string is: " + imgString);

        return new Promise((result, reject) => {
            var funcPath = path.join(__filename, '../../../src/main/services/utility/arrayBufferToBase64.ts');

            const worker = new Worker(funcPath, {
            workerData: {data: imgString},
            });

            worker.on('message', (result: any) => {
                console.log("Result from worker: " + result);
                return (result);
            });

            worker.on('error', reject);
            worker.on('exit', (code: number) => {
            if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
            });

        });
        */
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



