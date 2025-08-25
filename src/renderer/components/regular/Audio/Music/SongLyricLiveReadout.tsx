import { AppBar, Box, Button, ButtonBase, ButtonGroup, Card, CardContent, Checkbox, Chip, CircularProgress, Divider, Drawer, IconButton, LinearProgress, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from '@mui/material';
import './SongLyricCard.css';
import React, { useEffect, useState } from 'react';
import { SongLyricAPIData, SongMetaDataSimple } from '../../../../../types';
import { useSelectedSongStore } from '../../../../state_stores/MusicStateStores';
import { RegularButton } from '../../../../elements/CustomButtons';

type SongLiveLyricProps = { //instance variables
  sMetaData: SongMetaDataSimple
}

export const SongLyricLiveReadout = ({sMetaData}: SongLiveLyricProps) => { 
  const [lyricData, setLyricData] = useState({} as SongLyricAPIData);

  const [translatedLyricData, setTranslatedLyricData] = useState({} as SongLyricAPIData);
  const [currentLyric, setCurrentLyric] = useState("");
  const [nextLyric, setNextLyric] = useState("");

  const [currentTranslatedLyric, setCurrentTranslatedLyric] = useState("");
  const [nextTranslatedLyric, setNextTranslatedLyric] = useState("");

  const currentSeek = useSelectedSongStore((state) => state.currentSeek);
  
  const [previousTimestamp, setPreviousTimestamp] = useState(0);

  const [fadeState, setFadeState] = useState('fade_in_text');
  const [currentOffset, setCurrentOffset] = useState(0);

  const [progressIndicator, setProgressIndicator] = useState(<div/>);

  //FOR USE BY OVERLAY
  const currentLyricData = useSelectedSongStore((state) => state.setCurrentLyricData);

  //get new lyric data on recieving new song meta data
  useEffect(() => {
    var abort = false;
    (async () => {
      if (sMetaData.songRawPath != ""){

        currentLyricData({} as SongLyricAPIData);

        setProgressIndicator(<LinearProgress/>)
        const result = await window.electron.ipcRenderer.invoke('audio', ["external_lyrics", sMetaData.songRawPath]) as SongLyricAPIData;
        setLyricData(result);

        if (abort == false){
          console.log("GOT LYRICS FOR" + sMetaData.name);
          currentLyricData(result);
        }

        
        setProgressIndicator(<div/>)
      }

    })();

    return () => {
      // Function returned from useEffect is called on unmount
      // Here it'll abort the fetch
      console.log("DISCARDING LYRIC (no need as this lyric is outdated), was for: " + sMetaData.name);
      abort = true;
    }
  }, [sMetaData]);


  useEffect(() => {
    if (lyricData.lyrics == undefined){
      setCurrentLyric("If this message doesn't disappear after loading bar disappears it means the lyric API could not find lyrics (either doesn't exist or metadata is fucked)");  
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

          if (lyricData.lyrics[lyricData.timestamps.indexOf(closest)+1] == "" || lyricData.lyrics[lyricData.timestamps.indexOf(closest)+1] == " "){
            setNextLyric("[Instrumental]");
              if (lyricsTranslated == true){
                setCurrentTranslatedLyric("[Instrumental]");  
              }
          }

          else{
            setNextLyric(lyricData.lyrics[lyricData.timestamps.indexOf(closest)+1]);
              if (lyricsTranslated == true){
                setNextTranslatedLyric(translatedLyricData.lyrics[lyricData.timestamps.indexOf(closest)+1]);  
              }
          }  

          setPreviousTimestamp(closest);
        }

        
        //console.log((lyricData.timestamps[lyricData.timestamps.indexOf(closest) + 1]) - currentSeek);
        if (((lyricData.timestamps[lyricData.timestamps.indexOf(closest) + 1]) - currentSeek) < 0.15 && currentLyric == text){
          setFadeState("fade_out_text");
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
      const result = await window.electron.ipcRenderer.invoke('audio', ["external_translated_lyrics", lyricData]) as SongLyricAPIData;
      setTranslatedLyricData(result);
    }


  }
  
  return (
      <div className='card_songlyriccard'>
        {/*key needed to actually rerender the fade in properly*/}

          <div className='content_grid_songlyriccard'>
            <div style={{height: "10vh"}}>
              <div key={currentLyric} className={fadeState} style={{fontStyle: 'oblique'}}> {currentLyric} </div>
              <br/>
              <div key={nextLyric} className={fadeState} style={{color:"grey"}}> {nextLyric} </div>
            </div>

            {/*divider*/}
            <div className='center_div_songlyriccard'> <Divider/> {progressIndicator} </div>

            {/*translated lyrics*/}
            <div style={{height: "8vh"}}>
              <div>
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}> Translated Lyrics (Using DeepL) </Typography>
                <RegularButton className='option_button_songlyriccard' onClick={() => (requestTranslation())}><Typography fontSize={"0.75em"} noWrap component="div"> Translate</Typography></RegularButton>
              </div>

              <div key={currentTranslatedLyric} className={fadeState} style={{fontStyle: 'oblique'}}> {currentTranslatedLyric} </div>
              <br/>
              <div key={nextTranslatedLyric} className={fadeState} style={{color:"grey"}}> {nextTranslatedLyric} </div>
              
            </div>

          </div>

          <div className='row_songlyriccard'>
            <RegularButton className='option_button_songlyriccard' onClick={() => (setCurrentOffset(currentOffset-100))}><Typography fontSize={"0.75em"} noWrap component="div">- Offset</Typography></RegularButton>
            <div>Sync Offset: {currentOffset} ms</div>
            <RegularButton className='option_button_songlyriccard' onClick={() => (setCurrentOffset(currentOffset+100))}><Typography fontSize={"0.75em"} noWrap component="div">+ Offset</Typography></RegularButton>
          </div>
          
          
      </div>
    );



}