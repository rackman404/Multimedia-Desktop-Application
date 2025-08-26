import {Button, Card, CircularProgress, Typography } from '@mui/material';
import './SongFullscreenOverlay.css';
import { useSelectedSongStore } from '../../../../state_stores/MusicStateStores';
import { useEffect, useState } from 'react';
import { BottomMusicImageHandler } from './BottomMusicImageHandler';
import { SongLyricAPIData } from '../../../../../types';
import { RegularButton } from '../../../../elements/CustomButtons';


type SongFullscreenOverlayLyricsHandlerProps = { //constructor variables
  translated: boolean
};

export const SongFullscreenOverlayLyricsHandler = ({translated}: SongFullscreenOverlayLyricsHandlerProps) => { 
  const LYRICS_DISPLAYED_AT_ONCE = 10;

  const [currentLyric, setCurrentLyric] = useState("");
  const [nextLyrics, setNextLyric] = useState([] as string[]);

  const [currentTranslatedLyric, setCurrentTranslatedLyric] = useState("");
  const [nextTranslatedLyrics, setNextTranslatedLyrics] = useState([] as string[]);

  const currentSeek = useSelectedSongStore((state) => state.currentSeek);
  
  const [previousTimestamp, setPreviousTimestamp] = useState(0);

  const [fadeState, setFadeState] = useState('fade_in_text');
  const [currentOffset, setCurrentOffset] = useState(0);

  const [progressIndicator, setProgressIndicator] = useState(<div/>);

  //FOR USE BY OVERLAY
  const lyricData = useSelectedSongStore((state) => state.currentLyricData);
  const [translatedLyricData, setTranslatedLyricData] = useState({} as SongLyricAPIData); //NOT IMPLEMENTED

  useEffect(() => {
    //console.log(lyricData);
    if (lyricData.lyrics == undefined){
      setCurrentLyric("No Lyrics / Loading");  
      setNextLyric([""]);  
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

        
        if (currentOffset < 0){
          var closest = Math.max.apply(null, lyricData.timestamps.filter(function(v){return v <= (currentSeek-(currentOffset/1000))}));
          var adjustedSeek = currentSeek-(currentOffset/1000);
        }
        else{
          var closest = Math.max.apply(null, lyricData.timestamps.filter(function(v){return v <= (currentSeek+(currentOffset/1000))}));
          var adjustedSeek = currentSeek+(currentOffset/1000);
        }
        
        var text = lyricData.lyrics[lyricData.timestamps.indexOf(closest)]

        var lyricsTranslated = false;
        translatedText = "";
        if (translatedLyricData.lyrics != undefined){
          var translatedText = translatedLyricData.lyrics[lyricData.timestamps.indexOf(closest)];
          lyricsTranslated = true;
        }

        //console.log((closest + " " + (currentSeek+(currentOffset/1000))));

        if (closest < (adjustedSeek) && previousTimestamp != closest){
          setFadeState("fade_in_text");
          
          if (text == "" || text == " "){
            setCurrentLyric("[Instrumental]");  
            if (lyricsTranslated == true ){
              setCurrentTranslatedLyric("[Instrumental]");  
            }
          }
          else{
            setCurrentLyric(text);  

            setCurrentTranslatedLyric(translatedText);
          }
          
          var nextLyricsArray = [] as string[];
          var nextTranslatedLyricsArray = [] as string[];
          for (var i = 1; i < LYRICS_DISPLAYED_AT_ONCE + 1; i++){
            if (lyricData.lyrics[lyricData.timestamps.indexOf(closest)+i] == "" || lyricData.lyrics[lyricData.timestamps.indexOf(closest)+i] == " "){
              nextLyricsArray[i] = "[Instrumental]";
                if (lyricsTranslated == true){
                  nextTranslatedLyricsArray[i] = "[Instrumental]";  
                }
              }

              else{
                nextLyricsArray[i] = (lyricData.lyrics[lyricData.timestamps.indexOf(closest)+i]);
                  if (lyricsTranslated == true){
                    nextTranslatedLyricsArray[i] = translatedLyricData.lyrics[lyricData.timestamps.indexOf(closest)+i];  
                  }
              }  

              setPreviousTimestamp(closest);
            }

          setNextLyric(nextLyricsArray);
          setNextTranslatedLyrics(nextTranslatedLyricsArray);  

            
          //console.log((lyricData.timestamps[lyricData.timestamps.indexOf(closest) + 1]) - currentSeek);
            if (((lyricData.timestamps[lyricData.timestamps.indexOf(closest) + LYRICS_DISPLAYED_AT_ONCE + 1]) - currentSeek) < 0.15 && currentLyric == text){
              setFadeState("fade_out_text");
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
        const result = await window.electron.ipcRenderer.invoke('audio', ["external_translated_lyrics", lyricData]) as SongLyricAPIData;
        setTranslatedLyricData(result);
      }
  }


  return (
    <div className='containers'>
        {translated === false ? <div>
            <div className='lyric_headers'>
              <Typography color="white"> Synced Lyrics </Typography>
            </div>
            <br/>
            <Typography color="white" key={currentLyric} className={fadeState} style={{fontStyle: 'oblique'}}> {currentLyric} </Typography>
            <br/>
            {nextLyrics.map((lyric) => 

            <div>

            <br/>
            <Typography color="white" className={fadeState} style={{color:"grey"}}> {lyric} </Typography>
            <br/>

            </div>
            
            )}
        </div>
        :

        <div>
            <div className='lyric_headers'>
              <RegularButton onClick={() => (requestTranslation())}><Typography fontSize={"0.75em"} noWrap component="div"> Translate</Typography></RegularButton>
            </div>
            <br/>
            <Typography color="white" key={currentLyric} className={fadeState} style={{fontStyle: 'oblique'}}> {currentTranslatedLyric} </Typography>
            <br/>
            {nextTranslatedLyrics.map((lyric) => 

            <div>

            <br/>
            <Typography color="white" className={fadeState} style={{color:"grey"}}> {lyric} </Typography>
            <br/>

            </div>
            
            )}
        </div>

        }
        

        
</div>

    );



}