import { error } from "console";
import { SongLyricAPIData } from "../../../../types";
import * as deepl from 'deepl-node';



//NOTE for anyone using this other than myself: \https://www.deepl.com/en/your-account/keys register for a deepL account if you want access to translator services within this application

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
        var lyricData = {} as SongLyricAPIData;

        //copy the timestamps
        lyricData.timestamps = songLyricData.timestamps;
        lyricData.lyrics = [];

        for (var i = 0; i < songLyricData.lyrics.length; i++){ //must ensure there are no empty strings
            if (songLyricData.lyrics[i] == " " || songLyricData.lyrics[i] == ""){
                songLyricData.lyrics[i] = "[Instrumental]";
            }
        }

        //console.log(songLyricData.lyrics);

        const deeplClient = new deepl.DeepLClient(deepLKey);
        
        await (async () => {
            const targetLang: deepl.TargetLanguageCode = 'en-US';
            const results = await deeplClient.translateText(
                songLyricData.lyrics,
                null,
                targetLang,
            ).catch((error) => {
                console.error(error);
            });

            if (results == undefined){
                lyricData.lyrics = songLyricData.lyrics;
            }
            else{
                results.map((result: deepl.TextResult) => {
                    lyricData.lyrics.push(result.text);
                    //console.log("text");
                    //onsole.log(result.text); // Bonjour, le monde !
                });
            }
            
            
        })();

        console.table(lyricData.timestamps);
        console.table(lyricData.lyrics);

        return lyricData;
    }

}