import { AppBar, Box, Button, ButtonBase, ButtonGroup, Card, CardContent, Checkbox, Chip, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from '@mui/material';
import './SongLyricCard.css';
import React, { useEffect, useState } from 'react';
import { SongLyricAPIData, SongMetaDataSimple } from '../../../../../types';
import { useSelectedSongStore } from '../../../../state_stores/MusicStateStores';

type SongLiveLyricProps = { //instance variables
  sMetaData: SongMetaDataSimple
}

export const SongLyricLiveReadout = ({sMetaData}: SongLiveLyricProps) => { 
  const [lyricData, setLyricData] = useState({} as SongLyricAPIData);
  const [currentLyric, setCurrentLyric] = useState("");
  const currentSeek = useSelectedSongStore((state) => state.currentSeek);

  const [fadeState, setFadeState] = useState('fade_in_text');

  useEffect(() => {
    (async () => {
      if (sMetaData.songRawPath != ""){
        const result = await window.electron.ipcRenderer.invoke('audio', ["external_lyrics", sMetaData.songRawPath]) as SongLyricAPIData;
        console.log(result);
        setLyricData(result);
      }

    })();
  }, [sMetaData]);

  useEffect(() => {
    if (lyricData.lyrics == undefined){
      setCurrentLyric("If this message doesn't disappear it means external API can't find shit");  
    }
    else if (lyricData.lyrics != undefined && lyricData.lyrics.length != 0){
      if (currentLyric == "If this message doesn't disappear it means external API can't find shit"){
        setCurrentLyric("");
      }
      else{
        //@ts-ignore
        var temp = lyricData.timestamps.slice(); //because sort actually alters a array, we do it on a temp array instead

        //https://stackoverflow.com/questions/4811536/find-the-number-in-an-array-that-is-closest-to-a-given-number 
        //var closest = temp.sort( (a, b) => Math.abs(currentSeek - a) - Math.abs(currentSeek - b))[0];
        //https://stackoverflow.com/questions/33309930/javascript-find-closest-number-in-array-without-going-over
        var closest = Math.max.apply(null, temp.filter(function(v){return v <= currentSeek}))
        var text = lyricData.lyrics[lyricData.timestamps.indexOf(closest)]
        
        if (closest < currentSeek && currentLyric != text){
          setFadeState("fade_in_text");
          setCurrentLyric(text);
          console.log(text);
        }

        
        console.log((lyricData.timestamps[lyricData.timestamps.indexOf(closest) + 1]) - currentSeek);
        if (((lyricData.timestamps[lyricData.timestamps.indexOf(closest) + 1]) - currentSeek) < 0.25 && currentLyric == text){
          setFadeState("fade_out_text");
        }
        
      }   
    }
    else if (lyricData.isInstrumental == true){
      setCurrentLyric("Song is marked as instrumental, no lyrics");  
    }
    
  }, [currentSeek, currentLyric]);
  

  return (
      <div>
        {/*key needed to actually rerender the fade in properly*/}
          <div key={currentLyric} className={fadeState}> {currentLyric} </div>
      </div>
    );



}