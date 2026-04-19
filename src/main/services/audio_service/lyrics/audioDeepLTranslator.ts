import { Console, error } from "console";
import { DeepLStatistics, SongLyricAPIData, SupportedRomanizationOptions } from "../../../../types";
import * as deepl from 'deepl-node';
import { loadESLint } from "eslint";



//NOTE for anyone using this other than myself: \https://www.deepl.com/en/your-account/keys register for a deepL account if you want access to translator services within this application


const optionsApplication = {appInfo: { appName: 'Node Song Lyric Translation Service', appVersion: 'N/A' },};

export class AudioDeepLTranslator{

    constructor() {
        this.testRequest();

    }

    async testRequest(){
        //const deeplClient = new deepl.DeepLClient("");

        
        (async () => {
            //const result = await deeplClient.translateText('Hello, world!', null, 'fr');
            //console.debug(result.text); // Bonjour, le monde !
        })();
    }

    async requestDeepLTranslation(songLyricData: SongLyricAPIData, deepLKey: string): Promise<SongLyricAPIData>{
    

        console.log("TRANSLATING : ");
        console.log(songLyricData);
        console.log(songLyricData.raw);
        var lyricData = {} as SongLyricAPIData;
        //copy the timestamps
        lyricData.timestamps = songLyricData.timestamps;
        lyricData.lyrics = [];


        //console.log(songLyricData.lyrics);

        const deeplClient = new deepl.DeepLClient(deepLKey, optionsApplication);

        await (async () => {
            const targetLang: deepl.TargetLanguageCode = 'en-US';
            const Canto: deepl.SourceLanguageCode = 'yue';

            var lang = null;
            if (songLyricData.romanization == SupportedRomanizationOptions.Jyutping){
                lang = Canto;
                console.log("TRANSLATING USING CANTONESE");
            }

            

            const results = await deeplClient.translateText(
                songLyricData.raw,
                lang,
                targetLang,
                {
                    splitSentences: 'nonewlines',
                    preserveFormatting: true,
                    //formality: 'prefer_less',
                    modelType: 'prefer_quality_optimized',
                    //context: 'Song Lyrics' //https://developers.deepl.com/docs/learning-how-tos/cookbook/context-parameter-examples#example-context-parameter-examples
                }
            ).catch((error) => {
                console.error(error);
            });

            if (results == undefined){
                //lyricData.lyrics = songLyricData.lyrics;  
               
            }

            else{
                console.log(results.text);
                var text = results.text;
                var lyrics =  text.split(/\n/);
                
                
                //initialize the arrays
                var prev = -1;
                for (var i = 0; i < lyrics.length; i++){
                    //console.log(lyrics[i]);
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
                
               // console.log("PARSED DEEPL" + lyrics.length);
                for (var i = 0; i < lyricData.lyrics.length; i++){
                    //console.log(lyricData.timestamps[i] +  "::" + lyricData.lyrics[i]);
                }

            }
            
            
        })();

        //version where each line is read without context
        /*




        for (var i = 0; i < songLyricData.lyrics.length; i++){ //must ensure there are no empty strings
            if (songLyricData.lyrics[i] == " " || songLyricData.lyrics[i] == ""){
                songLyricData.lyrics[i] = "[Instrumental]";
            }
        }

        
        await (async () => {
            const targetLang: deepl.TargetLanguageCode = 'en-US';
            const results = await deeplClient.translateText(
                songLyricData.lyrics,
                null,
                targetLang,
                {
                    splitSentences: 'nonewlines',
                    preserveFormatting: true,
                    //formality: 'prefer_less',
                    modelType: 'prefer_quality_optimized',
                    //context: 'Song Lyrics' //https://developers.deepl.com/docs/learning-how-tos/cookbook/context-parameter-examples#example-context-parameter-examples
                }
            ).catch((error) => {
                console.error(error);
            });

            if (results == undefined){
                //lyricData.lyrics = songLyricData.lyrics;
            }

            else{
                results.map((result: deepl.TextResult) => {
                    lyricData.lyrics.push(result.text);
                    //console.log("text");
                    //onsole.log(result.text); // Bonjour, le monde !
                });
            }
            
            
        })();
        */

        //console.table(lyricData.timestamps);
        //console.table(lyricData.lyrics);

        //console.debug(await this.requestDeepLCharacterLimit(deepLKey));

        return lyricData;
    }

    async requestDeepLStatistics(deepLKey: string): Promise<DeepLStatistics>{
        var stats = {} as DeepLStatistics;

        if (deepLKey != ""){
            const deeplClient = new deepl.DeepLClient(deepLKey, optionsApplication);
            
            stats.deepLConnectionStatus = "Connected";
            const usage = await deeplClient.getUsage().catch((error) => {
                console.error(error);
                stats.deepLConnectionStatus = "No Connection (Check API Key or Internet Connection)"; //replace the OK connection status above if connection not working
            });

            stats.characterUsage = (usage?.character?.count)?.toString() ?? "N/A";
        }

        return stats;
    }
}