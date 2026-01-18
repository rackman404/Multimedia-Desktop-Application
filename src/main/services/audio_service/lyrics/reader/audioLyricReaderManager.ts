import { SongLyricAPIData, SongMetaDataSimple } from "../../../../../types";
import { AudioLocalLyricReader } from "./audioLocalLyricReader";
import { AudioWebLyricReader } from "./audioWebLyricReader";
const LanguageDetect = require('languagedetect');

export class AudioLyricReaderManager{
    lngDetector: any
    webLyricReader: AudioWebLyricReader;
    localLyricReader: AudioLocalLyricReader;

    constructor() {
        this.webLyricReader = new AudioWebLyricReader();
        this.localLyricReader = new AudioLocalLyricReader();
        this.lngDetector = new LanguageDetect();
    }

    async requestLyrics(songSearchData: SongMetaDataSimple): Promise<SongLyricAPIData>{
        var lyrics = await this.localLyricReader.requestLyricData(songSearchData);

        if (lyrics.statusCode != 100){ //failed to get lyrics, find online next
            lyrics = await this.webLyricReader.requestLyricData(songSearchData);
        }

        if (lyrics.statusCode == 100){
            if (lyrics.isInstrumental == false){
                try{
                    //Asian detection
                    var totalChar = 0;
                    var alternateChar = 0;
                    for (var i = 0; i < lyrics.lyrics.length; i++){
                        for (var j = 0; j < lyrics.lyrics[i].length; j++){
                            if (/[\u3400-\u9FBF]/.test( lyrics.lyrics[i][j] )){ //if a chinese character
                            alternateChar++;
                            }

                            totalChar++;

                        }
                    }

                    if (alternateChar < totalChar/2){ //if not chinese dominated lyrics
                        lyrics.language = this.lngDetector.detect(lyrics.lyrics.toString().replace(/,/g,""))[0][0];
                    }
                    else{
                        lyrics.language = "Asian";
                    }
                    
                }
                catch{
                    lyrics.language = "";
                }
                
            }
            else{
                lyrics.language = "";
            }
        }

        return lyrics;

    }

}