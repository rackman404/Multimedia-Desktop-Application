import { AppBar, Box, Button, ButtonBase, ButtonGroup, Card, CardContent, Checkbox, Chip, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ToggleButton, Toolbar, Typography } from '@mui/material';
import './SongLyricCard.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { RegularButton } from '../../../../elements/CustomButtons';
import CheckIcon from '@mui/icons-material/Check';
import { useGlobalSettingsState } from '../../../../state_stores/GlobalSettingsStateStore';


type SongToggleButtonProps = { //instance variables
  songID: number
  setListStatus: (id: number) => void
}

export const SongToggleButton = ({songID, setListStatus}:SongToggleButtonProps) => { 
  const[selected, setSelected] = useState(false);
  const mouseState = useGlobalSettingsState((state) => state.isMouseDown);

  const[clicked, setClicked] = useState(false);

  return (
      <ToggleButton
        selected={selected} 
        value={"check"}
        onClick={event => {event.stopPropagation();}}
        
        onMouseDown={ event =>
          {
             { /**/
              setClicked(true);
              
              setSelected(!selected);
              setListStatus(songID);
              console.log("on mouse down detected");
              event.stopPropagation();
              }
          }
        }
        

        onMouseEnter={event => {
            //console.log(mouseState);

            if (mouseState == true){
              console.log("on mouse enter detected");
              setSelected(!selected);
              setListStatus(songID);
              
            }
          }
        }

        onMouseLeave={() => setClicked(false)}

        onChange={event => 
          {
            /*
            setSelected(!selected);
            setListStatus(songID);
            event.stopPropagation();
            */
          }
        }
        >
          {selected === true ? <div/>//<CheckIcon fontSize='inherit'/> 
          : <div/>}
        </ToggleButton>
    );



}