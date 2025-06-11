import { AppBar, Box, Button, ButtonBase, ButtonGroup, Card, CardContent, Checkbox, Chip, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from '@mui/material';
import './SongLyricCard.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { RegularButton } from '../../../../elements/CustomButtons';


export const SongLyricCard = () => { 
  //const [headerText, setHeaderText] = useState("placeholder");
  const [lyricMode, setLyricMode] = useState({component: <></>, mode: "raw"});

  function SetLyrics(bool: boolean): void{
    if (bool == true){
      //setLyricMode({component: })
    }
  }

  function headerText(): string{
    if (lyricMode.mode == "raw"){
      return "From Metadata";
    }
    else{
      return "From External API";
    }
  }



  return (
      <div>
          <Card variant='outlined' className="card_songeditcard" component={Paper} sx={{ height: "26.5vh", width: "20vw"}}>
            <CardContent>
            <div className='top_bar_row_songlyriccard'>
              <RegularButton className='option_button_songlyriccard' onClick={() => (SetLyrics(true))}>Raw Lyrics</RegularButton>

              <div>
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                  {headerText()}
                </Typography>

                <Typography variant="h5" component="div">
                  Song Lyrics
                </Typography>
              </div>

              <RegularButton className='option_button_songlyriccard' onClick={() => (SetLyrics(false))}>Live Lyrics</RegularButton>

            </div>

            <div style={{ textAlign: "left", padding: "5px"}}>
              Cock and Balls

            </div>

            </CardContent>
          </Card>
      </div>
    );



}