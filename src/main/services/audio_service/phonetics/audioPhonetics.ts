import path from "path";
import { SongLyricAPIData, SongMetaDataSimple } from "../../../../types";

import { RESOURCESDIRECTORY } from "../../../main"; 

import * as fs from "fs" 

export class AudioPhonetics{

    jyutPingDict: string | undefined //Cantonese phonetics/romanization
    pinyingDict: string | undefined //Mandarin phonetics/romanization

    constructor() {
        if (fs.existsSync(path.join( RESOURCESDIRECTORY , 'cccanto-webdist.txt'))){
            console.log("JYUTPING Dict file DOES exists");
            this.jyutPingDict = fs.readFileSync(RESOURCESDIRECTORY + '/cccanto-webdist.txt', 'utf-8');
        }
        else{
            console.log("JYUTPING Dict file does not exists");
        }

        //var test = {lyrics:["如何面對()TEST 誰問 暗 但 望 曾一起走過的日子", "" , " ", "有你 有我 有情 有天 有海 有地"]} as SongLyricAPIData;
        ////var test = {lyrics:["如 ", "有", "對"]} as SongLyricAPIData;
        //var phoneTest = this.requestPhonetics(test, true);
    }
 
    async requestPhonetics(lyricData: SongLyricAPIData, jyutping: boolean): Promise<SongLyricAPIData>{
        var phonetics = {lyrics: [] as string[]} as SongLyricAPIData;
        //var count = 0; 

        console.log("READING JYUTPING");

        if (jyutping == true && this.jyutPingDict != undefined){
            
                for (var i = 0; i < lyricData.lyrics.length; i++){ //for each lyric line
                    if (lyricData.lyrics[i] == " " || lyricData.lyrics[i] == ""){
                        lyricData.lyrics[i] = "[Instrumental]";
                    }

                    var tempCharList = lyricData.lyrics[i].split("");   
                    var tempPhoneticLine = "";
                     


                    for (var j = 0; j < tempCharList.length; j++){ //for each character in lyric line
                        
                        if (/[\u3400-\u9FBF]/.test( tempCharList[j] )){ //if a chinese character
                            var index = this.jyutPingDict.search(" " + tempCharList[j] + " ");
                            if (index == -1){
                                var index = this.jyutPingDict.search("\n" + tempCharList[j] + " ");
                            }
                            //console.log(index);

                            if (index != -1){
                                var endOfReading = false;
                                var dataLine = ""; //where format is CHAR CHAR [PINYIN] {JYUTPING}
                                while (endOfReading == false){
                                    if (this.jyutPingDict[index-1] == "}"){
                                        endOfReading = true;
                                    }  
                                    
                                    dataLine += this.jyutPingDict[index-1];

                                    index++;
                                }
                                console.log(dataLine);

                                var regExp = /\{([^)]+)\}/;
                                var jyutpingRead = regExp.exec(dataLine);

                                console.log(jyutpingRead?.at(1));

                                tempPhoneticLine += jyutpingRead?.at(1) + " ";

                            }
                            else{
                                tempPhoneticLine += " " + tempCharList[j] ; //simply return the character if search is undef
                            }
                            
                        }
                        else{
                          tempPhoneticLine += tempCharList[j];  
                        }
                    }
                    console.log(tempPhoneticLine);
                    phonetics.lyrics.push(tempPhoneticLine);
                    
                    await new Promise((resolve) => setTimeout(resolve)); //more or less yielding back to the main control flow every so often similar to C# and Java so app doesn't hang 
                }
            }

        console.log("LINE COUNT: " + phonetics.lyrics.length);
        for (var i = 0; i < phonetics.lyrics.length; i++){ //for each character in lyric line
            console.log("reading line " + i + " as: " + phonetics.lyrics[i]);
        }

        return phonetics;
    }



}