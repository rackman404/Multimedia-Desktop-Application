import * as fs from "fs" 
import {SongMetaData, SongMetaDataSimple} from "../../../types"

import { inspect } from 'util';

/*
const defaultSongMetaData: SongMetaData = {
    //OS metadata
    format: string
    fileSize: number //should be in mb

    //Format specific metadata
    metadataFormat: string,
    id: number,
    name: string,
    length: number, //in seconds
    artist: string[],
    genre: string[],
    playCount: number,
    bitrate: number, //in kbps (-1 if no bitrate can be provided)

    coverImage: string

    //misc data
    songRawPath: string,

}

// Create an object with all the necessary defaults
const defaultSomeType = {
    some_other_stat: 8
}
    */

export class AudioMetadataReader{
    

    constructor() {

    }

    //temp
    async readMetaData(id:number, file_path: string): Promise<SongMetaData>{
        var sMetadata = {} as SongMetaData;
        var osStats = fs.statSync(file_path);

    try {
        const mm = await import('music-metadata');
        sMetadata.id = id;
        sMetadata.songRawPath = file_path;
        sMetadata.format = file_path.split(".")[ file_path.split(".").length - 1]; //reads the very last . suffix in case there are other periods in the file path
        sMetadata.fileSize = osStats.size / (1024*1024); //bytes to mega bytes


        const metadata = await mm.parseFile(file_path);
        if (metadata.common.picture?.length != undefined){
            var temp = metadata.common.picture[0] ?? null;
            

            //https://stackoverflow.com/questions/44725664/extract-album-art-image-from-html5-audio-after-metadata-loads-using-javascript 

            //to read image: imgElement.src = `data:${picture.format};base64,${base64String}`;
            if (temp != null){
                //sMetadata.coverImage = btoa(String.fromCharCode(...new Uint8Array(temp.data)));
                //sMetadata.coverImage = _arrayBufferToBase64(temp.data);
                sMetadata.coverImageFormat = metadata.common.picture[0].format;
                
            }
        }
        
        
        sMetadata.bitrate = metadata.format.bitrate ?? -1 
        if (sMetadata.bitrate != -1){
            sMetadata.bitrate = Math.round(sMetadata.bitrate / 1000);
        }

        sMetadata.length = Math.round(metadata.format.duration ?? -1);

        sMetadata.name = metadata.common.title ?? "N/A";
 
        sMetadata.artist = metadata.common.artists ?? ["N/A"];
        sMetadata.genre = metadata.common.genre ?? ["N/A"];
        sMetadata.album = metadata.common.album ?? "N/A";

        if (metadata.common.comment?.length != undefined){
            sMetadata.comment = metadata.common.comment[0].text ?? "";
        }
        else{
            sMetadata.comment = "";
        }

        /*
        console.log(" AUDIO METADATA READER: \n DATA FOR FILE AT: " + sMetadata.songRawPath + "\n OS LEVEL METADATA:");
        console.log(" FILE FORMAT: " + sMetadata.format + "\n"
        + " FILE SIZE: " + sMetadata.fileSize + " (mb) \n\n"
        + " FILE SPECIFIC METADATA: \n"
        + " Bitrate: " + sMetadata.bitrate + " \n\n"
        + " SONG METADATA: \n"
        + " Length: " + sMetadata.length + "\n"
        + " Name: " + sMetadata.name + "\n"
        + " Artist: " + sMetadata.artist + "\n"
        + " Genre: " + sMetadata.genre + "\n"
        );
        */

    } catch (error: any) {
        console.error('Error parsing metadata:', error.message);
    }

    return sMetadata;

        
    }


    editMetaData(){

    }

    async readMetaDataFull(id:number, file_path: string): Promise<SongMetaData>{
        var sMetadata = {} as SongMetaData;
        var osStats = fs.statSync(file_path);

    try {
        const mm = await import('music-metadata');
        sMetadata.id = id;
        sMetadata.songRawPath = file_path;
        sMetadata.format = file_path.split(".")[ file_path.split(".").length - 1]; //reads the very last . suffix in case there are other periods in the file path
        sMetadata.fileSize = osStats.size / (1024*1024); //bytes to mega bytes


        const metadata = await mm.parseFile(file_path);
        if (metadata.common.picture?.length != undefined){
            var temp = metadata.common.picture[0] ?? null;
            

            //https://stackoverflow.com/questions/44725664/extract-album-art-image-from-html5-audio-after-metadata-loads-using-javascript 

            //to read image: imgElement.src = `data:${picture.format};base64,${base64String}`;
            if (temp != null){
                //sMetadata.coverImage = btoa(String.fromCharCode(...new Uint8Array(temp.data)));
                //sMetadata.coverImage = _arrayBufferToBase64(temp.data);

                sMetadata.coverImage = btoa(new Uint8Array(temp.data).reduce(function (data, byte) {
                    return data + String.fromCharCode(byte);
                }, ''));


                sMetadata.coverImageFormat = metadata.common.picture[0].format;
                
            }
        }
        
        
        sMetadata.bitrate = metadata.format.bitrate ?? -1 
        if (sMetadata.bitrate != -1){
            sMetadata.bitrate = Math.round(sMetadata.bitrate / 1000);
        }

        sMetadata.length = Math.round(metadata.format.duration ?? -1);

        sMetadata.name = metadata.common.title ?? "N/A";
 
        sMetadata.artist = metadata.common.artists ?? ["N/A"];
        sMetadata.genre = metadata.common.genre ?? ["N/A"];
        sMetadata.album = metadata.common.album ?? "N/A";

        if (metadata.common.comment?.length != undefined){
            sMetadata.comment = metadata.common.comment[0].text ?? "";
        }
        else{
            sMetadata.comment = "";
        }

        /*
        console.log(" AUDIO METADATA READER: \n DATA FOR FILE AT: " + sMetadata.songRawPath + "\n OS LEVEL METADATA:");
        console.log(" FILE FORMAT: " + sMetadata.format + "\n"
        + " FILE SIZE: " + sMetadata.fileSize + " (mb) \n\n"
        + " FILE SPECIFIC METADATA: \n"
        + " Bitrate: " + sMetadata.bitrate + " \n\n"
        + " SONG METADATA: \n"
        + " Length: " + sMetadata.length + "\n"
        + " Name: " + sMetadata.name + "\n"
        + " Artist: " + sMetadata.artist + "\n"
        + " Genre: " + sMetadata.genre + "\n"
        );
        */

        if (metadata.common.lyrics != undefined){
            
        }
        

    } catch (error: any) {
        console.error('Error parsing metadata:', error.message);
    }

    return sMetadata;

        
    }

    async readMetaDataSimple(id:number, file_path: string): Promise<SongMetaDataSimple>{
        var sMetadata = {} as SongMetaDataSimple;
        var osStats = fs.statSync(file_path);

        try {
            const mm = await import('music-metadata');
            sMetadata.id = id;
            sMetadata.songRawPath = file_path;

            const metadata = await mm.parseFile(file_path);
            if (metadata.common.picture?.length != undefined){
                var temp = metadata.common.picture[0] ?? null;
                

                //https://stackoverflow.com/questions/44725664/extract-album-art-image-from-html5-audio-after-metadata-loads-using-javascript 
                if (temp != null){
                    
                }
            }
              
            sMetadata.bitrate = metadata.format.bitrate ?? -1 
            if (sMetadata.bitrate != -1){
                sMetadata.bitrate = Math.round(sMetadata.bitrate / 1000);
            }

            sMetadata.length = Math.round(metadata.format.duration ?? -1);

            sMetadata.name = metadata.common.title ?? "N/A";
    
            sMetadata.artist = metadata.common.artists ?? ["N/A"];
            sMetadata.genre = metadata.common.genre ?? ["N/A"];
            sMetadata.album = metadata.common.album ?? "N/A";

        } catch (error: any) {
            console.error('Error parsing metadata:', error.message);
        }

        return sMetadata;   
    }

    async readLyricData(file_path: string): Promise<{unsynced: string, synced: string[]}>{
        const mm = await import('music-metadata');

        const metadata = await mm.parseFile(file_path);
        var lyrics = {} as {unsynced: string, synced: string[]};

            if (metadata.common.lyrics != undefined){
                if (metadata.common.lyrics[0].text != undefined){
                    lyrics["unsynced"] = metadata.common.lyrics[0].text;
                    console.log(lyrics["unsynced"]);
                }
            }


        return lyrics;
    }

    async readExternalLyricData(file_path: string){
        const mm = await import('music-metadata');

        const metadata = await mm.parseFile(file_path);

    }

}