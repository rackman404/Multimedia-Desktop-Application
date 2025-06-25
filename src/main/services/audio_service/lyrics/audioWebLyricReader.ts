import { promises } from "dns";
import { SongLyricAPIData, SongMetaDataSimple } from "../../../../types";

const axios = require('axios'); 
const cheerio = require('cheerio'); 

const THROTTLE_TIMER = 2;
const QUERY_URL = 'https://lrclib.net/api/get?artist_name=';
const TRACK_HEADER = '&track_name=';
const DURATION_HEADER = '&duration=';


export class AudioWebLyricReader{

    constructor() {
        /*
        this.requestLyricData({
            metadataFormat: "",
            id: 0,
            name: "Angels (Radio Edit)",
            length: 214,
            artist: ["Vicetone"],
            album: "",
            genre: [],
            playCount: 0,
            bitrate: 0,
            songRawPath: ""
        });
        */
    }

    async requestLyricData(songSearchData: SongMetaDataSimple): Promise<SongLyricAPIData>{
        var lyricData = {} as SongLyricAPIData;
        
        try{  
            await axios.get(QUERY_URL + songSearchData.artist[0].replace(/ /g,"+") + TRACK_HEADER + songSearchData.name + DURATION_HEADER + songSearchData.length)
            // @ts-ignore
            .then(({ data }) => { 
                lyricData.isInstrumental = data['instrumental'];
                lyricData.lyrics = []
                lyricData.timestamps = []

                //console.debug(lyricData.isInstrumental);

                var lyrics =  data['syncedLyrics'].split(/\n/);

                //initialize the arrays
                for (var i = 0; i < lyrics.length; i++){
                    var separated = lyrics[i].split("] ");
                
                    var timestampConversion = separated[0].replace("[", "").replace(":", ".").split(".");

                    //min:sec:millisec
                    lyricData.timestamps.push(parseFloat(timestampConversion[0]) * 60 + parseFloat(timestampConversion[1]) + parseFloat(timestampConversion[2])/100);
                    lyricData.lyrics.push(separated[1]);
                }

                
            })
        } catch (error: any) {
            console.error('Error Accessing LrcLib API:', error.message + " Path: " + QUERY_URL + songSearchData.artist[0].replace(/ /g,"+") + TRACK_HEADER + songSearchData.name + DURATION_HEADER + songSearchData.length);
        }

        //console.log("table length: " + lyricData.lyrics.length + " " +  lyricData.timestamps.length);
        console.table(lyricData.timestamps);
        console.table(lyricData.lyrics);
        return lyricData;
    }



}