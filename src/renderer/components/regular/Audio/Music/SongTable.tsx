import { AppBar, Box, Button, ButtonBase, ButtonGroup, Card, CardActionArea, Checkbox, Chip, Divider, Drawer, FormControl, FormControlLabel, IconButton, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Paper, Select, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from '@mui/material';
import './SongTable.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { RegularButton, TableHeaderRow } from '../../../../elements/CustomButtons';
import { SongMetaData, SongMetaDataSimple } from '../../../../../types';
import { useSelectedSongStore } from '../../../../state_stores/MusicStateStores';
import { fmtMSS } from '../../../../Common';
import { blueGrey, grey } from '@mui/material/colors';

import PlayCircleIcon from '@mui/icons-material/PlayCircle';

/*
const dataRowSX: SxProps = {
  display: "table-row",
  ":hover": {
    cursor: "pointer",
  },
};
*/
const dataRowSX: SxProps = {
  display: "table-row",
  '&[data-active]': {
    backgroundColor: 'action.selected',
  },
  '&:hover': {
    backgroundColor: 'action.selectedHover',
  },
  
};

const dataRowSelectedSX: SxProps = {
  display: "table-row",
  '&[data-active]': {
    backgroundColor: 'action.selected',
  },
  '&:hover': {
    backgroundColor: 'action.selectedHover',
  },
  background: grey[800],
};


type SongTableProps = { //constructor variables
  sMetaData: SongMetaDataSimple[] | null
  selectedPlayDataFunction: (data:SongMetaDataSimple) => void
  selectedInfoCardFunction : (data:SongMetaDataSimple) => void
};

export const SongTable = ({sMetaData, selectedPlayDataFunction, selectedInfoCardFunction}: SongTableProps) => { 
  const [highlighted, setHighlighted] = useState<number | undefined>();

  const [autoFocus, setAutoFocus] = useState(false);
  

  const currentSong = useSelectedSongStore((state) => state.selectedPlaySongMetaData);
  const [infoCardSongID, setInfoCardSongID] = useState(0);

  async function selectFullDataInfoCard(rowData: SongMetaDataSimple){
    //const result = await window.electron.ipcRenderer.invoke('audio', ["get_metadata_full", rowData.id, rowData.songRawPath]);
    //setHighlighted(rowData.id);
    selectedInfoCardFunction(rowData);

    setInfoCardSongID(rowData.id);

    setHighlighted(rowData.id);
  }

  useEffect(() => {
    if (autoFocus == true){
      scrollToElementInTable(currentSong.id);
    }

    setHighlighted(currentSong.id);
  }, [currentSong]);   
  

  function scrollToElementInTable(songID: number){
    var childelement = document.querySelector(`#${CSS.escape("tablerow" + songID.toString())}`); 
    var headeroffsetelement = document.querySelector(`#${CSS.escape("musictableheader")}`); 
    var tableelement = document.querySelector(`#${CSS.escape("musictable")}`); 
    var scrollelement = document.querySelector(`#${CSS.escape("scrollable")}`); 
    
    var songRect = childelement?.getBoundingClientRect();
    var headeroffsetRect = headeroffsetelement?.getBoundingClientRect();
    var scrollRect = scrollelement?.getBoundingClientRect();
    var tableRect = tableelement?.getBoundingClientRect();
    
    //goal is to match the same relative percentage to top between the scrollwheel and the table

    //1. get scale factor between table and scrollbar

    //2. get table and scrollbar true size

    //3. get percentage to top of table for song element

    //4. get the scaled percentage to top of scrollbar

    //5. ???

    //6. PROFIT

    if (songRect != null && scrollRect != null && tableRect != null && headeroffsetRect != null){

        var scrollRectScreenSizeY = scrollRect.bottom - scrollRect.top;
        var tableRectScreenSizeY = tableRect.bottom - tableRect.top;

        var factorOfScrollToTable = tableRectScreenSizeY/scrollRectScreenSizeY;
        console.log("Factor: " + (factorOfScrollToTable));

        //position of song in table
        var songPosInTable = tableRect.top - songRect.top;

        var percentageToTopOfTableSong = (Math.abs(songPosInTable)/tableRectScreenSizeY);

        console.log("total size of scroll: " + scrollRectScreenSizeY );
        console.log("total size of table: " + tableRectScreenSizeY );
        console.log("position of song from top: " + Math.abs(songPosInTable));
        console.log("Percentage to top of table: " + (percentageToTopOfTableSong));


        var scrollTarget = scrollRectScreenSizeY * percentageToTopOfTableSong * factorOfScrollToTable

        console.log("target: " + (scrollTarget));
        
        scrollelement?.scroll({ top: (scrollTarget - scrollRectScreenSizeY/2), behavior: "smooth",})

    
    }

  }

  function scrollToTop(){
    var parentelement = document.querySelector(`#${CSS.escape("musictable")}`); 

    parentelement?.scroll({ top: 0,
          behavior: "smooth",})
  }

  return (
      <div className='body_songtable'>
          <Card variant='outlined' className='top_bar_songtable'>
            <div className='top_bar_content_songtable'>
              <TextField id="searchfield" label="Search" variant="standard" />          
              <Button>Submit</Button>
              <Button>Reset Search</Button>
              <Divider orientation="vertical" flexItem sx={{marginLeft: "5px", marginRight: "5px"}} />
              <Button onClick={() => scrollToElementInTable(currentSong.id)}>Zoom To Active</Button>
              <Button onClick={() => scrollToElementInTable(infoCardSongID)}>Zoom To Selected</Button>
              <Button onClick={() => autoFocus === false ? setAutoFocus(true) : setAutoFocus(false)}> {autoFocus === false ? "Enable" : "Disable"} Autozoom</Button>
              <Divider orientation="vertical" flexItem sx={{marginLeft: "5px", marginRight: "5px"}} />
              <Button>Force Reload Song List</Button>
              <Button>Translate Song Titles</Button>
              <Divider orientation="vertical" flexItem sx={{marginLeft: "5px", marginRight: "5px"}} />
              
              {/*
              <FormControl sx={{height: "2.2vh"}}>
                f
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={0}
                  label="Age"
                  onChange={() => {}}
                  >
                  <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
                  <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
                  <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
                </Select>
              </FormControl>
              */}
            </div>
          </Card>
          
          <TableContainer id={"scrollable"} component={Paper} sx={{ maxHeight: "77.8vh", width: "80vw" }} >
              <Table size='small' id={"musictable"} stickyHeader aria-label="table">
                  <TableHead id={"musictableheader"}>
                      <TableHeaderRow>
                          <TableCell> Playing </TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell align="right">Length (Mins)</TableCell>
                          <TableCell align="right">Artist</TableCell>
                          <TableCell align="right">Genre</TableCell>
                          {/* <TableCell align="right">Play Count</TableCell> */}
                          <TableCell align="right">Bit Rate (kbps)</TableCell>
                          <TableCell align="right">Internal ID</TableCell>
                      </TableHeaderRow>
                  </TableHead>
                  <TableBody>

                  {//https://stackoverflow.com/questions/54045094/use-buttonbase-for-ripple-effect-on-material-ui-tablerow
                  sMetaData ? sMetaData.map((sMetaData, index) => (

                      <CardActionArea className='row_songtable' id={"tablerow" + sMetaData.id} key={"tablerow" + sMetaData.id}  component={TableRow} sx={highlighted === index ? dataRowSelectedSX : dataRowSX } onClick={() => selectFullDataInfoCard(sMetaData)} 
                      onDoubleClick=
                      {(e) => {
                        selectedPlayDataFunction(sMetaData);
                      }}
                      >                 
                        <TableCell component="th" scope="row"> {currentSong.id === index ? <PlayCircleIcon/> : " "} </TableCell>
                        <TableCell  component="th" scope="row">{sMetaData.name}</TableCell>
                        <TableCell align="right">{fmtMSS(sMetaData.length)}</TableCell>
                        <TableCell align="right">{sMetaData.artist?.map((artist, index) => ( index === 0 ? artist : " and " + artist))}</TableCell>
                        <TableCell align="right">{sMetaData.genre?.map((genre, index) => ( index === 0 ? genre : ", " + genre))}</TableCell>
                        {/* <TableCell align="right">{sMetaData.playCount}</TableCell> */}
                        <TableCell align="right">{Math.round(sMetaData.bitrate)}</TableCell>    
                        <TableCell align="right">{Math.round(sMetaData.id)}</TableCell>    
                      </CardActionArea>

                  )) : null
                  }
                  </TableBody>
              </Table>
          </TableContainer>
      </div>

  );



}