import path from "path";
import { SongLyricAPIData, SongMetaDataSimple, SupportedRomanizationOptions } from "../../../../../types";
import * as fs from "fs" 

export class AudioLocalLyricReader{


    constructor() {
        /*
        this.requestLyricData({
            songRawPath: "D:\\Programming\\Major Projects\\Music Player\\_sample_development_folder\\sample_music\\Test Recursive Folder\\Chinese\\01. 塞壬唱片-MSR,BaoUner,吴奕妤,付小远 - Missy.flac",
            metadataFormat: "",
            id: 0,
            name: "",
            length: 0,
            artist: [],
            album: "",
            genre: [],
            playCount: 0,
            bitrate: 0
        })*/
    }

    async requestLyricData(songSearchData: SongMetaDataSimple): Promise<SongLyricAPIData>{
        var lyricData = {} as SongLyricAPIData;
        lyricData.isInstrumental = false;
        lyricData.local = true;
        lyricData.language = SupportedRomanizationOptions.Indeterminate;

        var lrcPath = songSearchData.songRawPath.replace(/\.[^/.]+$/, '') + ".lrc";
        if (fs.existsSync(lrcPath)) { //check if lrcfile exists
            console.log("LRC file Exists: " + lrcPath);
            
            var raw = await this.readLRCFile(lrcPath);
            lyricData.raw = raw;

            var rawArray = raw.split("\n");

            lyricData.lyrics = []
            lyricData.timestamps = []

            var prev = -1;
            for (var i = 0; i < rawArray.length - 1; i++){
                if (rawArray[i] == "" || rawArray[i] == "\n" || rawArray[i] == " " || rawArray[i] == "\r"){ //in case file starts with new lines or just has empty lines in general (shit ass way of doing it though ngl)
                    console.log("discarding empty lyric line");
                }
                else{
                    var separated = rawArray[i].split("]");
    
                    var rawTimestampConversion = separated[0].replace("[", "").replace(":", ".").split(".");
                    //in case miliseconds are not in 2 digits
                    
                    if (rawTimestampConversion[2] != undefined){
                        if (rawTimestampConversion[2].length >= 3){
                            var temp = rawTimestampConversion[2];
                            rawTimestampConversion[2] = temp[2][0] + temp[2][1];
                        }
                    }

                    var timestampConversion = (parseFloat(rawTimestampConversion[0]) * 60 + parseFloat(rawTimestampConversion[1]) + parseFloat(rawTimestampConversion[2])/100);
                    //console.debug(prev + " "+ timestampConversion);

                    //some lyric files may contain duplicate timestamps (for translations of same lyrics or other purposes), this code chunk deals with it
                    if (prev != timestampConversion){ //push normally     
                        //min:sec:millisec
                        lyricData.timestamps.push(timestampConversion);
                        lyricData.lyrics.push(separated[1]);
                    }
                    else{ //if duplicate timestamp, push the duplicated timestamp's lyrics onto the latest lyric index
                        lyricData.lyrics[(lyricData.lyrics.length - 1)] += " - " + separated[1];
                    }
                    prev = timestampConversion;
                }
            }

            
            for (var i = 0; i < lyricData.lyrics.length; i++){
                console.log(lyricData.timestamps[i] +  "::" + lyricData.lyrics[i]);
            }
            

            lyricData.statusCode = 100;

        }
        else{
            console.log("LRC Does not exist:" + lrcPath);

            lyricData.statusCode = 200;
        }
       
        return lyricData;
    }

    async readLRCFile(lrcFilePath: string): Promise<string>{
        var string = fs.readFileSync(lrcFilePath, 'utf-8');
        console.log(string);

        return string;
    }

}