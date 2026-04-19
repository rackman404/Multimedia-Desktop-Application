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

        songLyricData.raw = songLyricData.raw.replace(/\[.+?\]/igm, ''); 


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

                
                //code below will fix formatting (i.e remove carriage return), then splits raw synced lyrics into a list of timestamps and corresponding lyrics
                text = text.replace(/[\r]/g, ''); //remove carriage return (if any)
                text = text.replace(/\n\n+$/, ""); //remove trailing new line (if any)
                text = text.replace(/\n+$/, ""); //remove trailing new line (if any)


                //https://stackoverflow.com/questions/22962220/remove-multiple-line-breaks-n-in-javascript
                //remove double new lines (lrclib may stack 2 which fucks the formatting) (comment line out if bugs occur)
                text = text.replace(/(\r\n|\r|\n){2}/g, '$1').replace(/(\r\n|\r|\n){3,}/g, '$1\n');


                var lyrics =  text.split(/\n/);
                
                
                //initialize the arrays
                var prev = -1;
                for (var i = 0; i < lyrics.length; i++){
                    lyricData.lyrics.push(lyrics[i]);
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