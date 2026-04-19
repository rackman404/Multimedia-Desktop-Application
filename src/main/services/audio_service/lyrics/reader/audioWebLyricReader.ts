import { SongLyricAPIData, SongMetaDataSimple, SupportedRomanizationOptions } from "../../../../../types";
import { AudioLocalLyricReader } from "./audioLocalLyricReader";

const axios = require('axios'); 


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
            await axios.get(QUERY_URL + songSearchData.artist[0].replace(/ /g,"+") + TRACK_HEADER + songSearchData.name.replace(/ /g,"+") + DURATION_HEADER + songSearchData.length)
            // @ts-ignore
            .then(({ data }) => { 
                lyricData.isInstrumental = data['instrumental'];
                lyricData.lyrics = []
                lyricData.timestamps = []
                

                //code below will fix formatting (i.e remove carriage return), then splits raw synced lyrics into a list of timestamps and corresponding lyrics
                data['syncedLyrics'] = data['syncedLyrics'].replace(/[\r]/g, ''); //remove carriage return (if any)
                data['syncedLyrics'] = data['syncedLyrics'].replace(/\n\n+$/, ""); //remove trailing new line (if any)
                data['syncedLyrics'] = data['syncedLyrics'].replace(/\n+$/, ""); //remove trailing new line (if any)

                //https://stackoverflow.com/questions/22962220/remove-multiple-line-breaks-n-in-javascript
                //remove double new lines (lrclib may stack 2 which fucks the formatting) (comment line out if bugs occur)
                data['syncedLyrics'] = data['syncedLyrics'].replace(/(\r\n|\r|\n){2}/g, '$1').replace(/(\r\n|\r|\n){3,}/g, '$1\n');

                //console.debug("Raw with stripped extras:" + JSON.stringify(data['syncedLyrics']));

                lyricData.raw = data['syncedLyrics'];

                var lyrics =  data['syncedLyrics'].split(/\n/);
                

                //initialize the arrays
                var prev = -1;
                for (var i = 0; i < lyrics.length; i++){
                    var separated = lyrics[i].split("]");
        
                    var rawTimestampConversion = separated[0].replace("[", "").replace(":", ".").split(".");
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

                
            })
        } catch (error: any) {
            console.error('Error Accessing LrcLib API:', error.message + " Path: " + QUERY_URL + songSearchData.artist[0].replace(/ /g,"+") + TRACK_HEADER + songSearchData.name.replace(/ /g,"+") + DURATION_HEADER + songSearchData.length);
            console.log("will attempt again with no & marks and with spaces");

            try{
            await axios.get(QUERY_URL + songSearchData.artist[0].replace(/ /g,"+").replace(/&/g,"") + TRACK_HEADER + songSearchData.name.replace(/ /g,"+") + DURATION_HEADER + songSearchData.length)
            // @ts-ignore
            .then(({ data }) => { 
                lyricData.isInstrumental = data['instrumental'];
                lyricData.lyrics = []
                lyricData.timestamps = []

                if (data['syncedLyrics'] != null){
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
                }
                
            })
            }
            catch (error: any) {
                if (error.status == 404){
                    console.log(error.status);
                    console.error('Error Accessing LrcLib API:', error.message + " Path: " + QUERY_URL + songSearchData.artist[0].replace(/ /g,"+").replace(/&/g,"") + TRACK_HEADER + songSearchData.name.replace(/ /g,"+") + DURATION_HEADER + songSearchData.length);
                    lyricData.statusCode = 200;
                    lyricData.language = SupportedRomanizationOptions.Indeterminate;
                }
                else{
                    console.log(error.status);
                    console.error('final error:', error.message + " Path: " + QUERY_URL + songSearchData.artist[0].replace(/ /g,"+").replace(/&/g,"") + TRACK_HEADER + songSearchData.name.replace(/ /g,"+") + DURATION_HEADER + songSearchData.length);
                    console.error("Server Error Response");
                    lyricData.statusCode = 300;
                    lyricData.language = SupportedRomanizationOptions.Indeterminate;
                }

                return lyricData; 
            }
        }

        //console.log("table length: " + lyricData.lyrics.length + " " +  lyricData.timestamps.length);
        console.log("lyrics successfully retrieved at path: " + QUERY_URL + songSearchData.artist[0].replace(/ /g,"+").replace(/&/g,"")  + TRACK_HEADER + songSearchData.name.replace(/ /g,"+") + DURATION_HEADER + songSearchData.length)
        //console.table(lyricData.timestamps);
        //console.table(lyricData.lyrics);
        if (lyricData.lyrics.length == 0 && lyricData.isInstrumental == false){
            console.log("null lyric was found");
            lyricData.statusCode = 200;  
            lyricData.language = SupportedRomanizationOptions.Indeterminate; 
        }
        else{
            lyricData.statusCode = 100;
        }
        //console.log(lyricData.lyrics.toString().replace(/,/g,"."));
        //console.log("LYRIC LANGUAGE: " + this.lngDetector.detect(lyricData.lyrics.toString().replace(/,/g,". ")));
        
        lyricData.local = false;
        return lyricData;
    }



}