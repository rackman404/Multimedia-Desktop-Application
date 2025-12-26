import {Button, Card, CircularProgress, Divider, FormControl, FormControlLabel, Radio, RadioGroup, ToggleButton, Typography } from '@mui/material';
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
  const LYRICS_DISPLAYED_AT_ONCE = 10;

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

  const currentPhoneticsLyricData = useSelectedSongStore((state) => state.currentPhoneticLyricData);
  const setCurrentPhoneticsLyricData = useSelectedSongStore((state) => state.setCurrentPhoneticLyricData);

  const [usePhonetics, setUsePhonetics] = useState(false);
  
  const lyricData = useSelectedSongStore((state) => state.currentLyricData);

  useEffect(() => {
    //console.log(lyricData);
    if (lyricData.statusCode == 400){
      setCurrentLyric("Loading...");  
      setNextLyric([]);
      setCurrentTranslatedLyricData({} as SongLyricAPIData);
      setCurrentTranslatedLyric("");
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
        const result = await window.electron.ipcRenderer.invoke(ServicesEnum.audio,  {service: IPCMethodAPI.AudioTwoWayIPC.phoneticsParse, content: [lyricData, true]}) as SongLyricAPIData;
        setCurrentPhoneticsLyricData(result);
      }
  }


  return (
    <div className='containers'>
        {translated === false ? <div>
            <div className='lyric_headers'>
              <Typography color="white"> Synced Lyrics  </Typography>
              <Typography color="white"> Detected Language: {lyricData.language}  </Typography>
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
              <RegularButton variant='outlined' sx={{height: "2.5vh"}}  onClick={() => (requestTranslation())}><Typography fontSize={"0.75em"} noWrap component="div"> Translate Song </Typography> </RegularButton>
              
              <FormControl>
                <RadioGroup
                  aria-labelledby="lyric-addon-radio-buttons-group-label"
                  defaultValue={usePhonetics}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      if ((event.target as HTMLInputElement).value == "false"){
                        setUsePhonetics(false);
                      }
                      else if ((event.target as HTMLInputElement).value == "true"){
                        setUsePhonetics(true);
                      }
                    }
                  }
                  name="radio-buttons-group"
                  row
                  sx={{overflow: "hidden", color: "white", textOverflow: "ellipsis"}}
                >
                  <FormControlLabel labelPlacement='top' value="translation" control={<Radio />} label={<Typography fontSize={"0.75em"}  noWrap component="div"> Translation </Typography>} />
                  <FormControlLabel disabled labelPlacement='top' value="both" control={<Radio />} label={<Typography fontSize={"0.75em"}  noWrap component="div"> Both </Typography>} />
                  <FormControlLabel labelPlacement='top' value="phonetics" control={<Radio />} label={<Typography fontSize={"0.75em"}  noWrap component="div"> Phonetic </Typography>} />
                </RadioGroup>
              </FormControl>

              {/*
              <ToggleButton disabled className='overlay_button_element' sx={{fontSize: '0.5vw'}}
                value="check"
                selected={usePhonetics}
                onChange={() => setUsePhonetics((usePhonetics) => !usePhonetics)}
                >
                Use Translation
              </ToggleButton>

              <ToggleButton disabled className='overlay_button_element' sx={{fontSize: '0.5vw'}}
                value="check"
                selected={usePhonetics}
                onChange={() => setUsePhonetics((usePhonetics) => !usePhonetics)}
                >
                Use Both
              </ToggleButton>

              <ToggleButton className='overlay_button_element' sx={{fontSize: '0.5vw'}}
                value="check"
                selected={usePhonetics}
                onChange={() => setUsePhonetics((usePhonetics) => !usePhonetics)}
                >
                Use Phonetics
              </ToggleButton>
              */}

              <RegularButton variant='outlined' sx={{height: "2.5vh"}} onClick={() => (requestPhonetics())}> <Typography fontSize={"0.75em"}  noWrap component="div"> Convert Phonetics </Typography> </RegularButton>
            </div>
            <br/>
            <Divider/> 

            <div className='lyric_text_container'>

              <Typography color="white"  className={fadeState} style={{fontStyle: 'oblique'}}> {usePhonetics === false ? currentTranslatedLyric : currentPhoneticsLyric} </Typography>
              <br/>
              {usePhonetics === false ? nextTranslatedLyrics.map((lyric) => 

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
              }



          </div>
          <div className='lyric_text_container_bottom'>
            <Divider/> 
          </div>
        </div>

        }
        

        
</div>

    );



}