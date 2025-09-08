import { AppBar, Box, Button, ButtonBase, ButtonGroup, Card, CardContent, Checkbox, Chip, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ToggleButton, Toolbar, Typography } from '@mui/material';
import './SongLyricCard.css';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { RegularButton } from '../../../../elements/CustomButtons';
import CheckIcon from '@mui/icons-material/Check';
import { useGlobalSettingsState } from '../../../../state_stores/GlobalSettingsStateStore';


type SongToggleButtonProps = { //instance variables
  songID: number
  selectedRef: boolean
  setListStatus: (id: number) => void
}

export const SongToggleButton = ({songID, selectedRef, setListStatus}:SongToggleButtonProps) => { 
  const mouseState = useGlobalSettingsState((state) => state.isMouseDown);

  //on mount and unmount
  useEffect(() => {

  //console.log("table button for: " + songID + " was rerendered");

  //called when the component is unmounted
  return () => {

  };
  }, []);

  /*
  useEffect(() => {
    console.log("button" + songID + " : " + selectedRef);

  }, [selectedRef]);
  */
 
  return (
      <ToggleButton
        selected={selectedRef} 
        value={"check"}
        onClick={event => {
          //setListStatus(songID);
          event.stopPropagation();
        }}
        
        onMouseUp={ event =>
          {
             { 
              setListStatus(songID);
              //event.stopPropagation();
              console.log("up detected");
              event.stopPropagation();
              }
          }
        }
        
        onMouseEnter={event => {
            //console.log(mouseState);

            //console.log("enter detected");
            if (mouseState == true){
              event.stopPropagation();
              //setSelected(!selected);
              setListStatus(songID);
              
            }
          }
        }
        
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
          {selectedRef === true ? <div/>//<CheckIcon fontSize='inherit'/> 
          : <div/>}
        </ToggleButton>
    );



}