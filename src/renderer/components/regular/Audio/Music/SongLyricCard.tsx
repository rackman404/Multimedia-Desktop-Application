import { AppBar, Box, Button, ButtonBase, ButtonGroup, Card, CardContent, Checkbox, Chip, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from '@mui/material';
import './SongLyricCard.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { RegularButton } from '../../../../elements/CustomButtons';
import { SongMetaDataSimple } from '../../../../../types';
import { SongLyricStaticReadout } from './SongLyricStaticReadout';
import { SongLyricLiveReadout } from './SongLyricLiveReadout';

type SongLyricProps = { //constructor variables
  sMetaData: SongMetaDataSimple
}

export const SongLyricCard = ({sMetaData}: SongLyricProps) => { 
  //const [headerText, setHeaderText] = useState("placeholder");
  const [lyricMode, setLyricMode] = useState(() => <SongLyricLiveReadout sMetaData={sMetaData}></SongLyricLiveReadout>);

  function SetLyrics(bool: boolean): void{
    if (bool == true){
      setLyricMode(() => <SongLyricStaticReadout></SongLyricStaticReadout>)
    }
    if (bool == false){
      console.log("setting to live lyrics " + sMetaData.songRawPath);
      setLyricMode(() => <SongLyricLiveReadout sMetaData={sMetaData}></SongLyricLiveReadout>)
    }
  }

  function headerText(): any{
    if (lyricMode.type == SongLyricStaticReadout){
      return "From Metadata";
    }
    else{
      return <div>From External API <br/> (liblrc.net) </div>;
    }
  }

  return (
      <div>
          <Card variant='outlined' className="card_songlyriccard" component={Paper} sx={{ height: "26.5vh", width: "20vw"}}>
            <CardContent>
            <div className='top_bar_row_songlyriccard'>
              <RegularButton className='option_button_songlyriccard' onClick={() => (SetLyrics(true))}><Typography fontSize={"0.75em"} noWrap component="div">Raw Lyrics</Typography></RegularButton>

              <div>
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                  {headerText()}
                </Typography>

                <Typography variant="h5" component="div">
                  Song Lyrics
                </Typography>
              </div>

              <RegularButton className='option_button_songlyriccard' onClick={() => (SetLyrics(false))}><Typography fontSize={"0.75em"} noWrap component="div">Live Lyrics</Typography></RegularButton>

            </div>

            <div style={{ textAlign: "left", padding: "5px"}}>
              {lyricMode}

            </div>

            </CardContent>
          </Card>
      </div>
    );



}