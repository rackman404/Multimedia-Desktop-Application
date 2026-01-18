import path from "path";
import { SongLyricAPIData, SongMetaDataSimple, SupportedRomanizationOptions } from "../../../../types";

import { RESOURCESDIRECTORY } from "../../../main"; 

import * as fs from "fs" 




export class AudioPhonetics{

    jyutPingDict: string | undefined; //Cantonese phonetics/romanization
    pinyingDict: string | undefined; //Mandarin phonetics/romanization

    forcedOveride: boolean;
    forcedOverideOption: SupportedRomanizationOptions;

    constructor() {

        this.forcedOveride = false;
        this.forcedOverideOption = SupportedRomanizationOptions.Jyutping;

        if (fs.existsSync(path.join( RESOURCESDIRECTORY , 'cccanto-webdist.txt'))){
            console.log("JYUTPING Dict file DOES exists");
            this.jyutPingDict = fs.readFileSync(RESOURCESDIRECTORY + '/cccanto-webdist.txt', 'utf-8');
        }
        else{
            console.log("JYUTPING Dict file does not exists");
        }

        if (fs.existsSync(path.join( RESOURCESDIRECTORY , 'cedict_ts.u8'))){
            console.log("PINYING Dict file DOES exists");
            this.pinyingDict = fs.readFileSync(RESOURCESDIRECTORY + '/cedict_ts.u8', 'utf-8');
        }
        else{
            console.log("PINYING Dict file does not exists");
        }

        //var test = {lyrics:["如何面對()TEST 誰問 暗 但 望 曾一起走過的日子", "" , " ", "有你 有我 有情 有天 有海 有地"]} as SongLyricAPIData;
        ////var test = {lyrics:["如 ", "有", "對"]} as SongLyricAPIData;
        //var phoneTest = this.requestPhonetics(test, true);
    }
    
    /**
     * 1. determine romanization option
     *  1.a if forced overide is enabled, ignore automatic romanization detection, else
     *  1.b find automatic romanization detection using embedded song comments
     * 2. perform romanization (assuming dict exists)
     */
    async requestPhonetics(lyricData: SongLyricAPIData, songData: SongMetaDataSimple): Promise<SongLyricAPIData>{
        var phonetics = {lyrics: [] as string[]} as SongLyricAPIData;
        //var count = 0; 

        var romanizationOption = this.forcedOverideOption;
        if (this.forcedOveride == false){
            romanizationOption = this._determineRomanization(songData.comments);

            if (romanizationOption == SupportedRomanizationOptions.Indeterminate){ //default to forced option if cannot find
                console.log("COULD NOT FIND ROMANIZATION SPECIFICATION IN COMMENTS");
                romanizationOption = this.forcedOverideOption;
            }
        }

        console.log("PERFORMING ROMANISATION: " + romanizationOption);

        if (romanizationOption == SupportedRomanizationOptions.Jyutping){
           phonetics = await this._requestFullJyutping (lyricData);
           phonetics.romanization = SupportedRomanizationOptions.Jyutping;
           phonetics.language = "Cantonese";
        }

        else if (romanizationOption == SupportedRomanizationOptions.Pinyin){
           phonetics = await this._requestFullPinyin (lyricData);
           phonetics.romanization = SupportedRomanizationOptions.Pinyin;
           phonetics.language = "Mandarin";
        }

        console.log("LINE COUNT: " + phonetics.lyrics.length);
        for (var i = 0; i < phonetics.lyrics.length; i++){ //for each character in lyric line
            //console.log("reading line " + i + " as: " + phonetics.lyrics[i]);
        }

        return phonetics;
    }

    async setJyutping(romanization: SupportedRomanizationOptions){ //cannot be bothered to rename this shit
        this.forcedOverideOption = romanization;
    }

    async getJyutping(){
        return this.forcedOverideOption;
    }

    async setForcedRomanizationOverride(romanizationOverride: boolean){ //cannot be bothered to rename this shit
        this.forcedOveride = romanizationOverride;
    }

    async getForcedRomanizationOverride(){
        return this.forcedOveride;
    }

    _determineRomanization(commentString : string): SupportedRomanizationOptions{
        if (commentString != undefined){
            console.log("Determining Romanization: " + commentString);

            //ultra dog shit if else chain
            if (commentString.includes(SupportedRomanizationOptions.Jyutping)){
                console.log("Cantonese Detected");
                return SupportedRomanizationOptions.Jyutping;
            }
            else if (commentString.includes(SupportedRomanizationOptions.Pinyin)){
                console.log("Mandarin Detected");
                return SupportedRomanizationOptions.Pinyin;
            }
        }
        else{
            console.log("No Comment String: " + commentString);
        }

        return SupportedRomanizationOptions.Indeterminate;
    }

    async _requestFullJyutping(lyricData: SongLyricAPIData): Promise<SongLyricAPIData>{
        var phonetics = {lyrics: [] as string[]} as SongLyricAPIData;
        if (this.jyutPingDict != undefined)
        {
            for (var i = 0; i < lyricData.lyrics.length; i++){ //for each lyric line
            if (lyricData.lyrics[i] == " " || lyricData.lyrics[i] == ""){
                lyricData.lyrics[i] = "[Instrumental]";
            }

            var tempCharList = lyricData.lyrics[i].split("");   
            var tempPhoneticLine = "";
                
            for (var j = 0; j < tempCharList.length; j++){ //for each character in lyric line
                
                if (/[\u3400-\u9FBF]/.test( tempCharList[j] )){ //if a chinese character
                    var index = this.jyutPingDict.search(" " + tempCharList[j] + " ");
                    var checkedMandarin = false;

                    //perform a search checking the mandarin dict if it exists (as a temporary solution to the fact many cantonese words are missing in CC-Canto)
                    if (index == -1 && this.pinyingDict != undefined){
                        var index = this.pinyingDict.search(" " + tempCharList[j] + " ");
                        checkedMandarin = true; //note if true, we implicitly say that the mando dict exists if using this variable
                    }

                    if (index == -1){
                        var index = this.jyutPingDict.search("\n" + tempCharList[j] + " ");
                    }
                    //console.log(index);

                    if (index != -1){
                        if (checkedMandarin == true){
                            tempPhoneticLine += await this._requestSingularPinyin(tempCharList[j], index);
                        }
                        else{
                            var endOfReading = false;
                            var dataLine = ""; //where format is CHAR CHAR [PINYIN] {JYUTPING}
                            while (endOfReading == false){
                                if (this.jyutPingDict[index-1] == "}"){
                                    endOfReading = true;
                                }  
                                
                                dataLine += this.jyutPingDict[index-1];

                                index++;
                            }
                            //console.log(dataLine);

                            var regExp = /\{([^)]+)\}/;
                            var jyutpingRead = regExp.exec(dataLine);

                            //console.log(jyutpingRead?.at(1));

                            tempPhoneticLine += jyutpingRead?.at(1) + " ";
                        }
                        

                    }
                    else{
                        tempPhoneticLine += " " + tempCharList[j] ; //simply return the character if search is undef
                    }
                    
                }
                else{
                    tempPhoneticLine += tempCharList[j];  
                }
            }
            //console.log(tempPhoneticLine);
            phonetics.lyrics.push(tempPhoneticLine);
            
            await new Promise((resolve) => setTimeout(resolve)); //more or less yielding back to the main control flow every so often similar to C# and Java so app doesn't hang 
        }

        }
        
        return phonetics;
    }

    async _requestFullPinyin(lyricData: SongLyricAPIData): Promise<SongLyricAPIData>{ //mostly duplicated code cause im retarded
        var phonetics = {lyrics: [] as string[]} as SongLyricAPIData;
        if (this.pinyingDict != undefined)
        {
            for (var i = 0; i < lyricData.lyrics.length; i++){ //for each lyric line
            if (lyricData.lyrics[i] == " " || lyricData.lyrics[i] == ""){
                lyricData.lyrics[i] = "[Instrumental]";
            }

            var tempCharList = lyricData.lyrics[i].split("");   
            var tempPhoneticLine = "";
                 
            for (var j = 0; j < tempCharList.length; j++){ //for each character in lyric line
                
                if (/[\u3400-\u9FBF]/.test( tempCharList[j] )){ //if a chinese character
                    var index = this.pinyingDict.search(" " + tempCharList[j] + " ");

                    if (index == -1){
                        var index = this.pinyingDict.search("\n" + tempCharList[j] + " ");
                    }
                    //console.log(index);

                    if (index != -1){


                        var endOfReading = false;
                        var dataLine = ""; //where format is CHAR CHAR [PINYIN] {JYUTPING}
                        while (endOfReading == false){
                            if (this.pinyingDict[index-1] == "]"){
                                endOfReading = true;
                            }  
                            
                            dataLine += this.pinyingDict[index-1];

                            index++;
                        }
                        //console.log(dataLine);

                        var regExp = /\[([^)]+)\]/;
                        var jyutpingRead = regExp.exec(dataLine);

                        //console.log(jyutpingRead?.at(1));

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
            //console.log(tempPhoneticLine);
            phonetics.lyrics.push(tempPhoneticLine);
            
            await new Promise((resolve) => setTimeout(resolve)); //more or less yielding back to the main control flow every so often similar to C# and Java so app doesn't hang 
        }

        }
        
        return phonetics;
    }

    async _requestSingularPinyin(char: string, index: number): Promise<string>{
        var char = "";
        if (this.pinyingDict != undefined){
            var endOfReading = false;
            var dataLine = ""; //where format is CHAR CHAR [PINYIN] {JYUTPING}
            while (endOfReading == false){
                if (this.pinyingDict[index-1] == "]"){
                    endOfReading = true;
                }  
                
                dataLine += this.pinyingDict[index-1];

                index++;
            }
            //console.log("PINYIN: " + dataLine);

            var regExp = /\[([^)]+)\]/;
            var jyutpingRead = regExp.exec(dataLine);
            
            var char = jyutpingRead?.at(1) + " ";
        }
       

        return char;
    }

    
}