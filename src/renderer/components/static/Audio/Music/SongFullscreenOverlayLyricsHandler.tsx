import {Button, Card, CircularProgress, Divider, FormControl, FormControlLabel, Radio, RadioGroup, Stack, ToggleButton, Typography } from '@mui/material';
import './SongFullscreenOverlay.css';
import { useSelectedSongStore } from '../../../../state_stores/MusicStateStores';
import { useEffect, useState } from 'react';
import { BottomMusicImageHandler } from './BottomMusicImageHandler';
import { SongLyricAPIData } from '../../../../../types';
import { RegularButton } from '../../../../elements/CustomButtons';
import { IPCMethodAPI, ServicesEnum } from '../../../../../typesIPC';

import CheckIcon from '@mui/icons-material/Check';
import { seteuid } from 'process';

type SongFullscreenOverlayLyricsHandlerProps = { //constructor variables
  translated: boolean
};

export const SongFullscreenOverlayLyricsHandler = ({translated}: SongFullscreenOverlayLyricsHandlerProps) => { 
  const LYRICS_DISPLAYED_AT_ONCE = 15;

  const [currentLyric, setCurrentLyric] = useState("");
  const [nextLyrics, setNextLyric] = useState([] as string[]);

  const [currentTranslatedLyric, setCurrentTranslatedLyric] = useState("");
  const [nextTranslatedLyrics, setNextTranslatedLyrics] = useState([] as string[]);

  const [currentPhoneticsLyric, setCurrentPhoneticsLyric] = useState("");
  const [NextPhoneticsLyric, setNextPhoneticsLyrics] = useState([] as string[]);

  const currentSeek = useSelectedSongStore((state) => state.currentSeek);
  
  const [previousTimestamp, setPreviousTimestamp] = useState(0);

  const [fadeState, setFadeState] = useState('fade_in_text');

  const currentOffset = useSelectedSongStore((state) => state.lyricOffset);

  const currentTranslatedLyricData = useSelectedSongStore((state) => state.currentTranslatedLyricData);
  const setCurrentTranslatedLyricData = useSelectedSongStore((state) => state.setCurrentTranslatedLyricData);

  const currentSongData = useSelectedSongStore((state) => state.selectedPlaySongMetaData);


  const currentPhoneticsLyricData = useSelectedSongStore((state) => state.currentPhoneticLyricData);
  const setCurrentPhoneticsLyricData = useSelectedSongStore((state) => state.setCurrentPhoneticLyricData);

  const [usePhonetics, setUsePhonetics] = useState("translated");

  const [canUseBoth, setCanUseBoth] = useState(false);
  
  const lyricData = useSelectedSongStore((state) => state.currentLyricData);
  const autoTranslateAndRomanize = useSelectedSongStore((state) => state.autoTranslateAndRomanize);

  useEffect(() => {
    if (currentTranslatedLyricData.lyrics != undefined && currentPhoneticsLyricData.lyrics != undefined && canUseBoth != true){
      setCanUseBoth(true);
    }
    else if (canUseBoth != false && autoTranslateAndRomanize == false){ //useboth condidition just in case we making unneeded updates to component
      setCanUseBoth(false);
    };
  
  }, [currentTranslatedLyricData, currentPhoneticsLyricData]);

  useEffect(() => { //auto translate and romanize songs
      if (lyricData.statusCode == 100 && (lyricData.lyrics != undefined) && autoTranslateAndRomanize == true && translated == true){// check for translated too since this component is used twice (this use effect wouldd otherwise do this action twice)
        console.log(lyricData.lyrics);
        console.log("AUTO TRANSLATING AND ROMANIZING");
        
        requestTranslation();
        requestPhonetics();
        setUsePhonetics("both");


      }
      else{ //also refresh phonetics data
        setNextPhoneticsLyrics([] as string[]);
        setCurrentPhoneticsLyric("");
      }

    
  }, [lyricData]);


  useEffect(() => {
    console.log("COMMENT IS: " + currentSongData.comments);
  
  }, [currentSongData]);

  function renderMainSwitch() {
    switch(usePhonetics) {
      case "translated": //translation
        return (nextTranslatedLyrics.map((lyric) => 

              <div>

                <br/>
                <Typography color="white" style={{color:"grey"}}> {lyric} </Typography>
                <br/>

              </div>
              
              )  
              
            );
      case "phonetics": //phonetics
        return ( NextPhoneticsLyric.map((lyric) => 

                <div>

                  <br/>
                  <Typography color="white" style={{color:"grey"}}> {lyric} </Typography>
                  <br/>

                </div>
                
                ));
      case "both": //both
        return (nextTranslatedLyrics.map((lyric, index) => 

              <div>
                <br/>
                <Typography color="white" style={{color:"grey"}}> {lyric} </Typography>
                <br/>
                <Typography color="white" style={{color:"yellow"}}> {NextPhoneticsLyric[index]} </Typography>
                <br/>
              </div>
              
              )  
              
            );
    }
  }

  function renderFirstSwitch() {
    switch(usePhonetics) {
      case "translated": //translation
        return (currentTranslatedLyric);
      case "phonetics": //phonetics
        return (currentPhoneticsLyric);
      case "both": //both
        return (<div style={{display:"inline"}}> {currentTranslatedLyric} <br/> <Typography color="yellow">{currentPhoneticsLyric}</Typography> </div>); //inline to prevent addition line break after div end
    }
  }


  useEffect(() => {
    //console.log(lyricData);
    if (lyricData.statusCode == 400){
      setCurrentLyric("Loading...");  
      setNextLyric([]);
      setCurrentTranslatedLyricData({} as SongLyricAPIData);
      setCurrentTranslatedLyric("");
      setCurrentPhoneticsLyricData({} as SongLyricAPIData);
      setNextTranslatedLyrics([""]);




    }
    else if (lyricData.statusCode == 300){
      setCurrentLyric("SERVER ERROR: Could not connect to LRCLIB server.");  
      setCurrentTranslatedLyric("");
      setNextTranslatedLyrics([""]);
      setNextLyric([""]);  

      setPreviousTimestamp(0);
    }
    else if (lyricData.statusCode == 200){
      setCurrentLyric("Lyric Error: No lyrics found for this song.");  
      setCurrentTranslatedLyric("");
      setNextTranslatedLyrics([""]);
      setNextLyric([""]);  

      setPreviousTimestamp(0);
    
    }
    else if (lyricData.lyrics != undefined && lyricData.lyrics.length != 0){
      if (currentLyric == "If this message doesn't disappear after loading bar disappears it means you're fucked bozo"){
        setCurrentLyric("[Instrumental]");
      }
      else{
        //https://stackoverflow.com/questions/4811536/find-the-number-in-an-array-that-is-closest-to-a-given-number 
        //var temp = lyricData.timestamps.slice(); //because sort actually alters a array, we do it on a temp array instead
        //var closest = temp.sort( (a, b) => Math.abs(currentSeek - a) - Math.abs(currentSeek - b))[0];

        //https://stackoverflow.com/questions/33309930/javascript-find-closest-number-in-array-without-going-over

        
        var closest = Math.max.apply(null, lyricData.timestamps.filter(function(v){return v <= (currentSeek+(currentOffset/1000))}));
        var adjustedSeek = currentSeek+(currentOffset/1000);

        var text = lyricData.lyrics[lyricData.timestamps.indexOf(closest)]

        var lyricsTranslated = false;
        translatedText = "";
        if (currentTranslatedLyricData.lyrics != undefined){
          var translatedText = currentTranslatedLyricData.lyrics[lyricData.timestamps.indexOf(closest)];
          lyricsTranslated = true;
        }
        var phoneticsParsed = false;
        phoneticsText = "";
        if (currentPhoneticsLyricData.lyrics != undefined){
          var phoneticsText = currentPhoneticsLyricData.lyrics[lyricData.timestamps.indexOf(closest)];
          phoneticsParsed = true;
        }

        //console.log((closest + " " + (currentSeek+(currentOffset/1000))));

        if ((closest < (adjustedSeek) && (previousTimestamp != closest || previousTimestamp == 0)) || currentLyric == "Loading..." || (currentTranslatedLyric == "" && lyricsTranslated == true) || (currentPhoneticsLyric == "" && phoneticsParsed == true)){
          setFadeState("fade_in_text");
          
          if (text == "" || text == " "){
            setCurrentLyric("[Instrumental]");  
            if (lyricsTranslated == true ){
              setCurrentTranslatedLyric("[Instrumental]");  
            }
            if (phoneticsParsed == true ){
              setCurrentPhoneticsLyric("[Instrumental]");  
            }
          }
          else{
            setCurrentLyric(text);  

            setCurrentTranslatedLyric(translatedText);

            setCurrentPhoneticsLyric(phoneticsText);
          }
          
          var nextLyricsArray = [] as string[];
          var nextTranslatedLyricsArray = [] as string[];
          var nextPhoneticsLyricsArray = [] as string[];
          for (var i = 1; i < LYRICS_DISPLAYED_AT_ONCE + 1; i++){
            if (lyricData.lyrics[lyricData.timestamps.indexOf(closest)+i] == "" || lyricData.lyrics[lyricData.timestamps.indexOf(closest)+i] == " "){
              nextLyricsArray[i] = "[Instrumental]";
                if (lyricsTranslated == true){
                  nextTranslatedLyricsArray[i] = "[Instrumental]";  
                }
                if (phoneticsParsed == true){
                  nextPhoneticsLyricsArray[i] = "[Instrumental]";  
                }
              }

              else{
                nextLyricsArray[i] = (lyricData.lyrics[lyricData.timestamps.indexOf(closest)+i]);
                  if (lyricsTranslated == true){
                    nextTranslatedLyricsArray[i] = currentTranslatedLyricData.lyrics[lyricData.timestamps.indexOf(closest)+i];  
                  }
                  if (phoneticsParsed == true){
                    nextPhoneticsLyricsArray[i] = currentPhoneticsLyricData.lyrics[lyricData.timestamps.indexOf(closest)+i];  
                  }
              }  

              setPreviousTimestamp(closest);
            }

          setNextLyric(nextLyricsArray);
          setNextTranslatedLyrics(nextTranslatedLyricsArray);  
          setNextPhoneticsLyrics(nextPhoneticsLyricsArray);  

            
            //console.log((lyricData.timestamps[lyricData.timestamps.indexOf(closest) + 1]) - currentSeek);
            if (currentOffset < 0){
              if (((lyricData.timestamps[lyricData.timestamps.indexOf(closest) + 1]) + currentSeek) < 0.15 && currentLyric == text){
                setFadeState("fade_out_text");
              }
            }else{
              if (((lyricData.timestamps[lyricData.timestamps.indexOf(closest) + 1]) - currentSeek) < 0.15 && currentLyric == text){
                setFadeState("fade_out_text");
              }
            }
          }
      }   
    }
    else if (lyricData.isInstrumental == true){
      setCurrentLyric("Song is marked as instrumental, no lyrics");  
    }

  }, [currentSeek, currentLyric, currentOffset, previousTimestamp, lyricData]);
  

  async function requestTranslation(){
      console.log("attempting lyric translation");
      if (lyricData.lyrics == undefined){ //need to add a modal here to notify user that translation cannot work
        console.log("lyric data is undefined!, cannot add translated lyrics");
      }
      else{
        const result = await window.electron.ipcRenderer.invoke(ServicesEnum.audio,  {service: IPCMethodAPI.AudioTwoWayIPC.externalTranslatedLyrics, content: [lyricData]}) as SongLyricAPIData;
        setCurrentTranslatedLyricData(result);
      }
  }

  async function requestPhonetics(){
      console.log("attempting phonetics parsing");
      if (lyricData.lyrics == undefined){ //need to add a modal here to notify user that translation cannot work
        console.log("lyric data is undefined!, cannot add phonetics data");
      }
      else{
        const result = await window.electron.ipcRenderer.invoke(ServicesEnum.audio,  {service: IPCMethodAPI.AudioTwoWayIPC.phoneticsParse, content: [lyricData, currentSongData]}) as SongLyricAPIData;
        setCurrentPhoneticsLyricData(result);
      }
  }


  return (
    <div className='containers'>
        {translated === false ? <div>
            <div className='lyric_headers'>
              <Typography color="white"> Synced Lyrics {lyricData.statusCode === 400 ? <Typography color= "grey"> Loading </Typography> : (lyricData.statusCode === 100 ? <Typography color={lyricData.local === false ? "green" : "yellow"}> ({lyricData.local === false ? "Extracted Online" : "Extracted Locally" })  </Typography> : <Typography color="red"> (No Lyrics Found) </Typography>) }  </Typography>
              <Typography color="white"> Detected Language: {lyricData.language} </Typography>
            </div>
            <br/>
            <Divider/> 

            <div className='lyric_text_container'>

              <Typography color="white" className={fadeState} style={{fontStyle: 'oblique'}}> {currentLyric} </Typography>
              <br/>
              {nextLyrics.map((lyric) =>  

              <div>

              <br/>
              <Typography color="white" className={fadeState} style={{color:"grey"}}> {lyric} </Typography>
              <br/>

              </div>
              
              )}



            </div>

            <div className='lyric_text_container_bottom'>
              <Divider/> 
            </div>

        </div>
        :

        <div>
            <div className='lyric_headers'>
              <RegularButton disabled = {lyricData.statusCode === 100 ? false : true} variant='outlined' sx={{height: "2.5vh"}}  onClick={() => (requestTranslation())}><Typography fontSize={"0.75em"} noWrap component="div"> Translate Song </Typography> </RegularButton>
              
              <Stack direction="row">
                <RadioGroup
                  aria-labelledby="lyric-addon-radio-buttons-group-label"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      if ((event.target as HTMLInputElement).value == "translation"){
                        setUsePhonetics("translation");
                      }
                      else if ((event.target as HTMLInputElement).value == "phonetics"){
                        setUsePhonetics("phonetics");
                      }
                      else if ((event.target as HTMLInputElement).value == "both"){
                        setUsePhonetics("both");
                      }
                    }
                  }
                  value={usePhonetics}
                  name="radio-buttons-group"

                   sx={{ height: "5vh", width: "auto", color: "white", textOverflow: "ellipsis"}}
                >
                  <FormControlLabel className='lyric_headers_radio' labelPlacement='top' value="translation" control={<Radio />} label={<Typography fontSize={"0.75em"}  noWrap component="div"> Translation </Typography>} />
                  <FormControlLabel className='lyric_headers_radio' disabled = {canUseBoth === true ? false : true /*we note we flip the boolean cause we disable instead of enable*/} labelPlacement='top' value="both" control={<Radio />} label={<Typography fontSize={"0.75em"}  noWrap component="div"> Both </Typography>} />
                  <FormControlLabel className='lyric_headers_radio' labelPlacement='top' value="phonetics" control={<Radio />} label={<Typography fontSize={"0.75em"}  noWrap component="div"> Romanize  </Typography>} />
                </RadioGroup>
              </Stack>

              <RegularButton disabled = {lyricData.statusCode === 100 ? false : true} variant='outlined' sx={{height: "2.5vh"}} onClick={() => (requestPhonetics())}> <Typography fontSize={"0.75em"}  noWrap component="div"> Romanization </Typography> </RegularButton>
            </div>
            <br/>
            <Divider/> 

            <div className='lyric_text_container'>

              <Typography color="white"  className={fadeState} style={{fontStyle: 'oblique'}}> {renderFirstSwitch() /*usePhonetics === 0 ? currentTranslatedLyric : currentPhoneticsLyric*/} </Typography>
              <br/>
                
              {renderMainSwitch()}
              {/*usePhonetics === false ? nextTranslatedLyrics.map((lyric) => 

              <div>

                <br/>
                <Typography color="white" className={fadeState} style={{color:"grey"}}> {lyric} </Typography>
                <br/>

              </div>
              
              ) : 
              
              NextPhoneticsLyric.map((lyric) => 

                <div>

                  <br/>
                  <Typography color="white" className={fadeState} style={{color:"grey"}}> {lyric} </Typography>
                  <br/>

                </div>
                
                )
              */}



          </div>
          <div className='lyric_text_container_bottom'>
            <Divider/> 
          </div>
        </div>

        }
        

        
</div>

    );



}