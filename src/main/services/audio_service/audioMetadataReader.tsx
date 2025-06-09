import * as fs from "fs" 
import {SongMetaData} from "../../../types"

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

function _arrayBufferToBase64( buffer: any ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return btoa( binary );
}

export class AudioMetadataReader{
    

    constructor() {

    }

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
                sMetadata.coverImage = _arrayBufferToBase64(temp.data);
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


}