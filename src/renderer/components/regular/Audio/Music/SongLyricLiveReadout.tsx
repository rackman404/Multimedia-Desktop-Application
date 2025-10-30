import { AppBar, Box, Button, ButtonBase, ButtonGroup, Card, CardContent, Checkbox, Chip, CircularProgress, Divider, Drawer, IconButton, LinearProgress, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from '@mui/material';
import './SongLyricCard.css';
import React, { useEffect, useState } from 'react';
import { SongLyricAPIData, SongMetaDataSimple } from '../../../../../types';
import { useSelectedSongStore } from '../../../../state_stores/MusicStateStores';
import { RegularButton } from '../../../../elements/CustomButtons';
import { IPCMethodAPI, ServicesEnum } from '../../../../../typesIPC';

type SongLiveLyricProps = { //instance variables
  sMetaData: SongMetaDataSimple
}

export const SongLyricLiveReadout = ({sMetaData}: SongLiveLyricProps) => { 
  const [lyricData, setLyricData] = useState({} as SongLyricAPIData);

  //const [translatedLyricData, setTranslatedLyricData] = useState({} as SongLyricAPIData);
  const [currentLyric, setCurrentLyric] = useState("");
  const [nextLyric, setNextLyric] = useState("");

  const [currentTranslatedLyric, setCurrentTranslatedLyric] = useState("");
  const [nextTranslatedLyric, setNextTranslatedLyric] = useState("");

  const currentSeek = useSelectedSongStore((state) => state.currentSeek);
  
  const [previousTimestamp, setPreviousTimestamp] = useState(0);

  const [fadeState, setFadeState] = useState('fade_in_text');

  const [progressIndicator, setProgressIndicator] = useState(<div/>);

  //FOR USE BY BOTH THIS AND OVERLAY
  const currentTranslatedLyricData = useSelectedSongStore((state) => state.currentTranslatedLyricData);
  const setCurrentTranslatedLyricData = useSelectedSongStore((state) => state.setCurrentTranslatedLyricData);

  const currentOffset = useSelectedSongStore((state) => state.lyricOffset);
  const setCurrentOffset = useSelectedSongStore((state) => state.setLyricOffset);

  //FOR USE BY OVERLAY
  const currentLyricData = useSelectedSongStore((state) => state.setCurrentLyricData);

  
  

  //get new lyric data on recieving new song meta data
  useEffect(() => {
    var abort = false;
    (async () => {
      if (sMetaData.songRawPath != ""){
        setCurrentOffset(0);
        setPreviousTimestamp(0);

        currentLyricData({} as SongLyricAPIData);
        setCurrentTranslatedLyricData({} as SongLyricAPIData);

        setProgressIndicator(<LinearProgress/>)
        const result = await window.electron.ipcRenderer.invoke(ServicesEnum.audio, {service: IPCMethodAPI.AudioTwoWayIPC.externalLyrics, content: [sMetaData.songRawPath]}) as SongLyricAPIData;
        setLyricData(result);

        if (abort == false){
          //console.log("GOT LYRICS FOR " + sMetaData.name);
          currentLyricData(result);
        }

        
        setProgressIndicator(<div/>)
      }

    })();

    return () => { //needed to discard old lyrics if the user skips through multiple songs (which may cause multiple lyric requests at once)
      //console.log("DISCARDING LYRIC (no need as this lyric is outdated), was for: " + sMetaData.name);
      abort = true;
    }
  }, [sMetaData]);


  useEffect(() => {
    if (lyricData.statusCode == 300){
      setCurrentLyric("SERVER ERROR: Could not connect to LRCLIB server.");  
    }
    else if (lyricData.statusCode == 200){
      setCurrentLyric("Lyric Error: No lyrics found for this song.");  
    }
    else if (lyricData.lyrics != undefined && lyricData.lyrics.length != 0){
      if (currentLyric == "If this message doesn't disappear after loading bar disappears it means you're fucked bozo"){ //??
        setCurrentLyric("[Instrumental]");
      }
      else{
        //https://stackoverflow.com/questions/4811536/find-the-number-in-an-array-that-is-closest-to-a-given-number 
        //var temp = lyricData.timestamps.slice(); //because sort actually alters a array, we do it on a temp array instead
        //var closest = temp.sort( (a, b) => Math.abs(currentSeek - a) - Math.abs(currentSeek - b))[0];

        //https://stackoverflow.com/questions/33309930/javascript-find-closest-number-in-array-without-going-over

        /*
        if (currentOffset < 0){
          var closest = Math.max.apply(null, lyricData.timestamps.filter(function(v){return v <= (currentSeek+(currentOffset/1000))}));
          var adjustedSeek = currentSeek+(currentOffset/1000);
        }
        else{
          var closest = Math.max.apply(null, lyricData.timestamps.filter(function(v){return v <= (currentSeek+(currentOffset/1000))}));
          var adjustedSeek = currentSeek+(currentOffset/1000);
        }
        */
     
        var closest = Math.max.apply(null, lyricData.timestamps.filter(function(v){return v <= (currentSeek+(currentOffset/1000))}));
        var adjustedSeek = currentSeek+(currentOffset/1000);
        
        var text = lyricData.lyrics[lyricData.timestamps.indexOf(closest)];

        //console.log(text);
        //console.log(lyricData.lyrics[lyricData.timestamps.indexOf(closest)+1]);

        var lyricsTranslated = false;
        translatedText = "";
        if (currentTranslatedLyricData.lyrics != undefined){
          var translatedText = currentTranslatedLyricData.lyrics[lyricData.timestamps.indexOf(closest)];
          lyricsTranslated = true;
        }

        //console.log((closest + " " + (currentSeek+(currentOffset/1000))));
        
        if (closest < (adjustedSeek) && (previousTimestamp != closest || previousTimestamp == 0)){
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

          if (lyricData.lyrics[lyricData.timestamps.indexOf(closest)+1] == "" || lyricData.lyrics[lyricData.timestamps.indexOf(closest)+1] == " "){
            setNextLyric("[Instrumental]");
              if (lyricsTranslated == true){
                setCurrentTranslatedLyric("[Instrumental]");  
              }
          }

          else{
            setNextLyric(lyricData.lyrics[lyricData.timestamps.indexOf(closest)+1]);
              if (lyricsTranslated == true){
                setNextTranslatedLyric(currentTranslatedLyricData.lyrics[lyricData.timestamps.indexOf(closest)+1]);  
              }
          }  

          setPreviousTimestamp(closest);
        }

        
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
    else if (lyricData.isInstrumental == true){
      setCurrentLyric("Song is marked as instrumental, no lyrics");  
    }

  }, [currentSeek, currentLyric, currentOffset, previousTimestamp]);
  
  async function requestTranslation(){
    console.log("attempting lyric translation");
    if (lyricData.lyrics == undefined){ //need to add a modal here to notify user that translation cannot work
      console.log("lyric data is undefined!, cannot add translated lyrics");
    }
    else{
      const result = await window.electron.ipcRenderer.invoke(ServicesEnum.audio, {service: IPCMethodAPI.AudioTwoWayIPC.externalTranslatedLyrics, content: [lyricData]}) as SongLyricAPIData;
      setCurrentTranslatedLyricData(result);
    }


  }
  
  return (
      <div className='card_songlyriccard'>
        {/*key needed to actually rerender the fade in properly*/}

          <div className='content_grid_songlyriccard'>
            <div style={{height: "10vh"}}>
              <div className={fadeState} style={{fontStyle: 'oblique'}}> {currentLyric} <br/> </div>
              
              <div className={fadeState} style={{color:"grey"}}> <br/>  {nextLyric} </div>
            </div>

            {/*divider*/}
            <div className='center_div_songlyriccard'> <Divider/> {progressIndicator} </div>

            {/*translated lyrics*/}
            <div style={{height: "8vh"}}>
              <div>
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}> Translated Lyrics (Using DeepL) </Typography>
                <RegularButton variant='outlined' className='option_button_songlyriccard' onClick={() => (requestTranslation())}><Typography fontSize={"0.75em"} noWrap component="div"> Translate Song </Typography></RegularButton>
              </div>
              


              <div className={fadeState} style={{fontStyle: 'oblique'}}> <br/> {currentTranslatedLyric} <br/> </div>
              
              <div className={fadeState} style={{color:"grey"}}> <br/> {nextTranslatedLyric} </div>
              
            </div>

          </div>

          <div className='row_songlyriccard'>
            <RegularButton variant='outlined' className='option_button_songlyriccard' onClick={() => (setCurrentOffset(currentOffset-100))}><Typography fontSize={"0.75em"} noWrap component="div">- Offset</Typography></RegularButton>
            <div>Sync Offset: {currentOffset} ms</div>
            <RegularButton variant='outlined' className='option_button_songlyriccard' onClick={() => (setCurrentOffset(currentOffset+100))}><Typography fontSize={"0.75em"} noWrap component="div">+ Offset</Typography></RegularButton>
          </div>
          
          
      </div>
    );



}