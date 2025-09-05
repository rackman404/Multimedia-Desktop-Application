import { AppBar, Box, Button, ButtonBase, ButtonGroup, Card, CardActionArea, Checkbox, Chip, CircularProgress, Divider, Drawer, FormControl, FormControlLabel, IconButton, InputLabel, LinearProgress, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Paper, Select, SelectChangeEvent, StepIcon, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ToggleButton, Toolbar, Typography } from '@mui/material';
import './SongTable.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { RegularButton, TableHeaderRow } from '../../../../elements/CustomButtons';
import { SongMetaData, SongMetaDataSimple, SongSearchTypeState} from '../../../../../types';
import { useSelectedSongStore } from '../../../../state_stores/MusicStateStores';
import { fmtMSS } from '../../../../Common';
import { blueGrey, grey } from '@mui/material/colors';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import CheckIcon from '@mui/icons-material/Check';
import { SongToggleButton } from './SongToggleButton';
import { SongTableTopBar } from './SongTableTopBar';

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

const FONTSCALE = "0.75vw";

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

  const[isDisabled, setDisabled] = useState (true);

  //const[anchor, setAnchor] = useState<any>(null);
  //const[dropDownState, setDropDownState] = useState<boolean>(false);

  //const[selectedList, setSelectedList] = useState([] as SongMetaDataSimple[]); //not needed, can just retrieve songs based on button id anyways
  const[selectedButtonList, setSelectedButtonList] = useState([] as boolean[]);

  //const[expandHeaderState, setExpandHeaderState] = useState(false);

  async function selectFullDataInfoCard(rowData: SongMetaDataSimple){
    //const result = await window.electron.ipcRenderer.invoke('audio', ["get_metadata_full", rowData.id, rowData.songRawPath]);
    //setHighlighted(rowData.id);
    selectedInfoCardFunction(rowData);

    setInfoCardSongID(rowData.id);

    setHighlighted(rowData.id);
  }

  async function setSelectStatus(index: number){
    var altered = selectedButtonList;
    altered[index] = !selectedButtonList[index];
    setSelectedButtonList(altered);

    //console.log("selected: " + index + "state: " + selectedButtonList[index] +  " " + selectedButtonList.length);
  }

  useEffect(() => {
    if (autoFocus == true){
      scrollToElementInTable(currentSong.id);
    }

    setHighlighted(currentSong.id);
    setInfoCardSongID(currentSong.id);
  }, [currentSong]);   
  
  useEffect(() => {
    if (sMetaData != null){ //songs are now loaded
      setDisabled(false);
      setSelectedButtonList(new Array(sMetaData?.length).fill(false));
    }

  }, [sMetaData]);   

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

  return (
      <div className='body_songtable'>

          <SongTableTopBar scrollToElementInTableRef={scrollToElementInTable} currentSongIDRef={currentSong.id} infoCardSongIDRef={infoCardSongID} isDisabledRef={isDisabled} setAutoFocusRef={setAutoFocus} autoFocusRef={autoFocus} />
          
          {/*
          <Card variant='outlined' className='top_bar_songtable'>
              
              <div className='top_bar_content_songtable'>
              <FormControl sx={{width: "8vw", marginRight: "1vw", marginLeft: "1vw", marginTop: "10px"}}>
                <InputLabel id="simple-select-label">Filter</InputLabel>
                <Select sx={{height: "4vh"}}
                  labelId="simple-select-label"
                  id="simple-select"
                  value={search}
                  label= "yes"
                  onChange={handleSearchChange}
                >
                  <MenuItem value={SongSearchTypeState.Album}>{SongSearchTypeState.Album}</MenuItem>
                  <MenuItem value={SongSearchTypeState.Genre}>{SongSearchTypeState.Genre}</MenuItem>
                  <MenuItem value={SongSearchTypeState.Name}>{SongSearchTypeState.Name}</MenuItem>
                </Select>
              </FormControl>

              <TextField id="searchfield" label="Search" variant="standard" />          
              <Button disabled><div style={{fontSize: FONTSCALE}}>Submit</div></Button>
              <Button disabled><div style={{fontSize: FONTSCALE}}>Reset Search</div></Button>
              <Divider orientation="vertical" flexItem sx={{marginLeft: "5px", marginRight: "5px"}} />
              <Button onClick={() => scrollToElementInTable(currentSong.id)}> <div style={{fontSize: FONTSCALE}}>Zoom To Active</div></Button>
              <Button onClick={() => scrollToElementInTable(infoCardSongID)}> <div style={{fontSize: FONTSCALE}}>Zoom To Selected</div></Button>
              <Button onClick={() => autoFocus === false ? setAutoFocus(true) : setAutoFocus(false)}> <div style={{fontSize: FONTSCALE}}> {autoFocus === false ? "Enable" : "Disable"} Autozoom</div> </Button>
              <Divider orientation="vertical" flexItem sx={{marginLeft: "5px", marginRight: "5px"}} />
              <Button disabled><div style={{fontSize: FONTSCALE}}> Force Reload Song List</div></Button>
              
              <Divider orientation="vertical" flexItem sx={{marginLeft: "5px", marginRight: "5px"}} />
              
              <FormControl sx={{width: "8vw", marginRight: "1vw"}}>
                <Button disabled onClick={(e) => {setAnchor(e.currentTarget), setDropDownState(true)}}>Columns <ArrowDropDownIcon/></Button>
                <Menu anchorEl={anchor} open={dropDownState}>
                 <MenuItem defaultChecked > <ListItemText primary="Name" /> </MenuItem>
                 <MenuItem defaultChecked > <ListItemText primary="Name" /> </MenuItem>
                 <MenuItem defaultChecked > <ListItemText primary="Name" /> </MenuItem>
                </Menu>
              </FormControl>

              <Divider orientation="vertical" flexItem sx={{marginLeft: "-1.5vw", marginRight: "5px"}} />

              <Button onClick={(e) => {setExpandHeaderState(!expandHeaderState)}}> <ArrowDropDownIcon/></Button>
              
              </div>
              {isDisabled === true ? <LinearProgress/> : null
                
              }
      

          </Card>
          */}
          
          {isDisabled === false ? 
          <TableContainer className='table_container_songtable' id={"scrollable"} component={Paper} sx={{ maxHeight: "77.8vh", width: "80vw"}} >
              <Table size='small' id={"musictable"} stickyHeader aria-label="table">
                  <TableHead id={"musictableheader"} >
                      <TableHeaderRow>
                        <TableCell>Select</TableCell>
                          <TableCell>Playing</TableCell>
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
                  sMetaData ? sMetaData.map((sMetaDataThis, index) => (

                      <CardActionArea className='row_songtable' id={"tablerow" + sMetaDataThis.id} key={"tablerow" + sMetaDataThis.id}  component={TableRow} sx={highlighted === index ? dataRowSelectedSX : dataRowSX } onClick={() => selectFullDataInfoCard(sMetaDataThis)} 
                      onDoubleClick=
                      {(e) => {
                        selectedPlayDataFunction(sMetaDataThis);
                      }}
                      > 
                        <TableCell  component="th" scope="row">
                          <SongToggleButton songID={index} setListStatus={setSelectStatus}/>
                        </TableCell>
                        
                        <TableCell component="th" scope="row"> {currentSong.id === index ? <PlayCircleIcon/> : " "} </TableCell>
                        <TableCell  component="th" scope="row">{sMetaDataThis.name}</TableCell>
                        <TableCell align="right">{fmtMSS(sMetaDataThis.length)}</TableCell>
                        <TableCell align="right">{sMetaDataThis.artist?.map((artist, index) => ( index === 0 ? artist : " and " + artist))}</TableCell>
                        <TableCell align="right">{sMetaDataThis.genre?.map((genre, index) => ( index === 0 ? genre : ", " + genre))}</TableCell>
                        {/* <TableCell align="right">{sMetaData.playCount}</TableCell> */}
                        <TableCell align="right">{Math.round(sMetaDataThis.bitrate)}</TableCell>    
                        <TableCell align="right">{Math.round(sMetaDataThis.id)}</TableCell>    
                      </CardActionArea>

                  )) : null
                  }
                  </TableBody>
              </Table>
          </TableContainer>
          :
          <div className='centered_songtable'>
            <CircularProgress size={"7.5rem"}/>
          </div>
          }


      </div>

  );



}