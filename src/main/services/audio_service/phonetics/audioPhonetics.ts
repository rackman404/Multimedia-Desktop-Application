import path from "path";
import { SongLyricAPIData, SongMetaDataSimple, SupportedRomanizationOptions } from "../../../../types";

import { RESOURCESDIRECTORY } from "../../../main"; 

import * as fs from "fs" 

const csv = require('csv-parser');




type EmbreeDataFormat = {
    DictWordID: string,
    PojUnicode: string,
    PojInput: string,
    KipUnicode: string,
    KipInput: string,
    Abbreviation: string,
    NounClassifier: string,
    HoaBun: string,
    EngBun: string,
    Synonym: string,
    Confer: string,
    PageNumber: string,
}

export class AudioPhonetics{

    jyutPingDict: string | undefined; //Cantonese phonetics/romanization
    pinyingDict: string | undefined; //Mandarin phonetics/romanization
    embreeDict: EmbreeDataFormat[] | undefined; //Hokkien phonetics/romanization

    forcedOveride: boolean;
    forcedOverideOption: SupportedRomanizationOptions;

    allowedSubstution: boolean; //allows substitution from a different romanization dictionary if applicable (i.e use pinyin for jyutping if character not found)

    constructor() {

        this.forcedOveride = false;
        this.allowedSubstution = false;

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



        if (fs.existsSync(path.join( RESOURCESDIRECTORY , 'ChhoeTaigi_MaryknollTaiengSutian.csv'))){
            console.log("Hokkien Dict file DOES exists");
            this.embreeDict = [] as EmbreeDataFormat[];

            fs.createReadStream(path.join( RESOURCESDIRECTORY , 'ChhoeTaigi_MaryknollTaiengSutian.csv'))
            .pipe(csv({quote: "\""}))
            .on('data', (data: any) => this.embreeDict?.push(data))
            .on('end', () => {
                console.log("PARSED EMBREE DICT, length is: " + this.embreeDict?.length);
                if (this.embreeDict != undefined){
                    console.log("Test ROW: " + this.embreeDict[3].PojInput);
                }
                
                /*
                this._requestFullHokkien({
                    lyrics: ["草木生 春耕農忙風吹薄霧 黃鶯歌唱"],
                    timestamps: [],
                    isInstrumental: false,
                    statusCode: 0,
                    language: "",
                    romanization: undefined,
                    local: false
                })
                */
            });


            //this.embreeDict = fs.readFileSync(RESOURCESDIRECTORY + '/ChhoeTaigi_EmbreeTaiengSutian.csv', 'utf-8');

        }
        else{
            console.log("Hokkien Dict file does not exists");
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

        console.log("FORCED OVERRIDE IS : "  + this.forcedOverideOption);
        console.log("OVERRIDE LANGUAGE IS : " + this.forcedOveride + " " + typeof(this.forcedOveride));
        console.log("ALLOWED SUBSTITUTION IS : " + this.allowedSubstution);
        console.log(lyricData.lyrics.length + " " + songData.name);
        var romanizationOption = this.forcedOverideOption;

        if (this.forcedOveride == false){
            romanizationOption = this._determineRomanization(songData.comments);
            if (romanizationOption == SupportedRomanizationOptions.Indeterminate){ //default to forced option if cannot find
                console.log("COULD NOT FIND ROMANIZATION SPECIFICATION IN COMMENTS");
                romanizationOption = this.forcedOverideOption;
            }
            else{
                console.log("FOUND SPECIFIC ROMANIZATION AS: " + romanizationOption);
            }
        }
        else{
            console.log("FORCED OVERRIDE WAS ENABLED");
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

        else if (romanizationOption == SupportedRomanizationOptions.Hokkien){
           phonetics = await this._requestFullHokkien(lyricData);
           phonetics.romanization = SupportedRomanizationOptions.Hokkien;
           phonetics.language = "Hokkien";
        }
 
        console.log("LINE COUNT: " + phonetics.lyrics.length + " of song: " + songData.name);
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

    async setForcedRomanizationOverride(romanizationOverride: boolean){
        this.forcedOveride = romanizationOverride;
    }

    async getForcedRomanizationOverride(){
        return this.forcedOveride;
    }

    async setAllowedSubstitution(allowedSubstution: boolean){ 
        this.allowedSubstution = allowedSubstution;
    }

    async getAllowedSubstitution(){
        return this.allowedSubstution;
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
            else if (commentString.includes(SupportedRomanizationOptions.Hokkien)){
                console.log("Hokkien Detected");
                return SupportedRomanizationOptions.Hokkien;
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
                    if (index == -1 && this.pinyingDict != undefined && this.allowedSubstution == true){
                        //console.log("Checking Mandarin");
                        var index = this.pinyingDict.search(" " + tempCharList[j] + " ");
                        if (index == -1){
                            var index = this.pinyingDict.search("\n" + tempCharList[j] + " ");
                        }

                        if (index != -1){
                            checkedMandarin = true; //note if true, we implicitly say that the mando dict exists if using this variable
                        }
                    }

                    if (index == -1){
                        var index = this.jyutPingDict.search("\n" + tempCharList[j] + " ");
                    }
                    

                    if (index != -1){
                        if (checkedMandarin == true){
                            //console.log("checking: " + tempCharList[j]);
                            tempPhoneticLine += await this._requestSingularPinyin(tempCharList[j]);
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

    async _requestFullHokkien(lyricData: SongLyricAPIData): Promise<SongLyricAPIData>{ 
        var phonetics = {lyrics: [] as string[]} as SongLyricAPIData;
        if (this.embreeDict != undefined){

            for (var i = 0; i < lyricData.lyrics.length; i++){ //for each lyric line
            if (lyricData.lyrics[i] == " " || lyricData.lyrics[i] == ""){
                lyricData.lyrics[i] = "[Instrumental]";
            }

            var tempCharList = lyricData.lyrics[i].split("");   
            var tempPhoneticLine = "";
                
            for (var j = 0; j < tempCharList.length; j++){ //for each character in lyric line

                /**
                 * 1. Record all characters in line OR until we reach a space in the line up to the current one (i.e if we on character 5 and theres a space in character 9, record the characters 5-8 in temp line)
                 * 2. In temp line, try to find a match in dictionary
                 * 3. if match: record the entire romanized entry and skip forward by the amount of characters in temp line
                 * 4. else: subtract 1 character from temp line and try again
                 * 
                 * 5. if only 1 character left and no record, simply write the character itself in the phonetics line 
                 * 
                */

                var compound = tempCharList[j];
                var n = j;
                if (/[\u3400-\u9FBF]/.test( tempCharList[j] )){ //if a chinese character

                    //1.
                    var parsing = true;              
                    while (parsing == true){
                        if (/[\u3400-\u9FBF]/.test( tempCharList[n+1] ) && tempCharList[n+1] != " ") {//if a actual character  
                            compound += tempCharList[n+1];
                            n++;
                        }
                        else{
                            parsing = false;
                        }    
                    }

                    console.log("SEARCH TERM IS: " + compound);
                    var searching = true;
                    while (searching == true){
                        //2.
                        var element = this.embreeDict.find(item => item.HoaBun === compound) as EmbreeDataFormat;
                        //3.
                        if (element != undefined){
                            tempPhoneticLine += element.PojInput + " ";
                            //amount to skip forward by

                            console.log("SEARCH FOUND FOR: " + compound + ", AS: " + element.PojInput + " " + j + " " + n);
                            searching = false;

                            j = j + compound.length - 1; //wtf even
                        }
                        else if (compound.length == 1){
                            //.5
                            console.log("SEARCH UNSUCCESSFUL: " + compound);

                            //last resort
                            if (this.allowedSubstution == true){
                                compound = await this._requestSingularPinyin(compound);
                            }

                            tempPhoneticLine += compound + " ";
                            searching = false;
                        }
                        else{
                            //.4
                            compound = compound.substring(0, compound.length - 1);
                            //n--;
                            console.log("SEARCH NOT FOUND, REDUCING COMPOUND TO: " + compound);
                        }
                    }
                    
                    


                    /* wtf
                    var compoundSearch = false;
                    var n = j;
                    var compound = tempCharList[j];
                    while (compoundSearch == false){ 
                    
                        var element = this.embreeDict.find(item => item.HoaBun === compound) as EmbreeDataFormat;
                        if (element != undefined){
                            if (n != j){ //compound word
                                tempPhoneticLine += element.PojInput + " ";  
                                compoundSearch = true;
                                j = n;
                            }
                            else{ //first try
                                //console.log("HOKKIEN: " + tempCharList[j]);
                                tempPhoneticLine += element.PojInput + " ";  
                                compoundSearch = true;
                            }

                        } 
                        else{
                            console.log("UNDEFINED HOKKIEN: " + tempCharList[j]);
                            if (n-1 != -1 && tempCharList[n-1] != " "){
                                n--;
                                compound = tempCharList[n] + compound;
                                console.log("NOW SEARCHING: " + compound);    
                            }
                            else{
                                tempPhoneticLine += tempCharList[j] + " "; 
                                compoundSearch = true;
                            }
                        }
                    }
                    */


                    /* single characters
                    var element = this.embreeDict.find(item => item.HoaBun === tempCharList[j]) as EmbreeDataFormat;
                    if (element != undefined){
                        console.log("HOKKIEN: " + tempCharList[j]);
                        tempPhoneticLine += element.PojInput + " ";  
                    } 
                    else{
                        console.log("UNDEFINED HOKKIEN: " + tempCharList[j]);
                        tempPhoneticLine += tempCharList[j] + " ";  
                    }
                    */

                }
                else{
                    tempPhoneticLine += tempCharList[j] + " ";  
                }
            }
            tempPhoneticLine = tempPhoneticLine.replace(/\s\s+/g, ' '); //remove duplicate spacing

            tempPhoneticLine = tempPhoneticLine.replace(/ *\([^)]*\) */g, " ");
            
            console.log("Romanization is: " + tempPhoneticLine);
            phonetics.lyrics.push(tempPhoneticLine);
            
            await new Promise((resolve) => setTimeout(resolve)); //more or less yielding back to the main control flow every so often similar to C# and Java so app doesn't hang 
        
            }
        }
        
        return phonetics;
    }

    /*
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
    */

    async _requestSingularPinyin(char: string): Promise<string>{
        
        if (this.pinyingDict != undefined){

            var index = this.pinyingDict.search(" " + char + " ");
            if (index == -1){
                var index = this.pinyingDict.search("\n" + char + " ");
            }

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