import { AppBar, Box, Button, ButtonBase, ButtonGroup, Card, CardActionArea, Checkbox, Chip, CircularProgress, Divider, Drawer, FormControl, FormControlLabel, IconButton, InputLabel, LinearProgress, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Paper, Select, SelectChangeEvent, StepIcon, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ToggleButton, Toolbar, Typography } from '@mui/material';
import './SongTable.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { RegularButton, TableHeaderRow } from '../../../../elements/CustomButtons';
import { ColumnEnumArray, SongMetaData, SongMetaDataSimple, SongSearchTypeState} from '../../../../../types';
import { useSelectedSongStore } from '../../../../state_stores/MusicStateStores';
import { fmtMSS } from '../../../../Common';
import { blueGrey, grey } from '@mui/material/colors';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import CheckIcon from '@mui/icons-material/Check';
import { SongToggleButton } from './SongToggleButton';
import { SongTableTopBar } from './SongTableTopBar';
import {SongTableRow} from './SongTableRow';

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

  isPlaylistTable: boolean
};

export const SongTable = ({sMetaData, selectedPlayDataFunction, selectedInfoCardFunction, isPlaylistTable}: SongTableProps) => { 
  const [highlighted, setHighlighted] = useState<number | undefined>();

  const [autoFocus, setAutoFocus] = useState(false);
  
  const currentSong = useSelectedSongStore((state) => state.selectedPlaySongMetaData);
  const [infoCardSongID, setInfoCardSongID] = useState(0);

  const[isDisabled, setDisabled] = useState (true);

  //const[anchor, setAnchor] = useState<any>(null);
  //const[dropDownState, setDropDownState] = useState<boolean>(false);

  //const[selectedList, setSelectedList] = useState([] as SongMetaDataSimple[]); //not needed, can just retrieve songs based on button id anyways
  const[selectedButtonList, setSelectedButtonList] = useState([] as boolean[]);

  //shared by table content and top bar
  const[expandHeaderState, setExpandHeaderState] = useState(false);

  //shared by table content and top bar column states
  const[columnOn, setColumnOn] = useState([] as boolean[]);

  const [inSearchMode, setInSearchMode] = useState<boolean>(false);

  //const searchPlayListSongMetaData = useSelectedSongStore((state) => state.searchPlayListSongMetaData);
  const setSearchPlayListSongMetaData = useSelectedSongStore((state) => state.setSearchSongMetaData);
  const searchSongMetaData = useSelectedSongStore((state) => state.searchSongMetaData);
  const setSearchSongMetaData = useSelectedSongStore((state) => state.setSearchSongMetaData);

  const currentlySelectedSongList = useSelectedSongStore((state) => state.currentlySelectedSongList);

  

  //on mount and unmount
  useEffect(() => {

    //called when the component is unmounted
    return () => {
      setSearchPlayListSongMetaData(null);
      setSearchSongMetaData(null);
    };
  }, []);

  async function selectFullDataInfoCard(rowData: SongMetaDataSimple){
    //const result = await window.electron.ipcRenderer.invoke('audio', ["get_metadata_full", rowData.id, rowData.songRawPath]);
    //setHighlighted(rowData.id);
    selectedInfoCardFunction(rowData);

    setInfoCardSongID(rowData.id);

    setHighlighted(rowData.id);
  }

  async function setSelectStatus(index: number){
    //should not use this, should create an entirely new array else theres issues with rerendering
    //var altered = selectedButtonList;
    //altered[index] = !altered[index];
    
    var old = selectedButtonList;
    var altered = old.slice();
    altered[index] = !altered[index];

    console.log("selected: " + index + "state: " + selectedButtonList[index] +  " " + selectedButtonList.length);

    setSelectedButtonList(altered);
    
  }

  async function setColumnState(index: number){
    var old = columnOn;
    var altered = old.slice();
    altered[index] = !altered[index];

    setColumnOn(altered);
  }

  async function selectSongs(deselect: boolean){
    if (deselect == true){
      setSelectedButtonList(new Array(sMetaData?.length).fill(false));
    }
    else{
      setSelectedButtonList(new Array(sMetaData?.length).fill(true));
    }
    
    
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
      var colStates = new Array(ColumnEnumArray?.length).fill(true);
      colStates[0] = false;
      setColumnOn(colStates);
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

          <SongTableTopBar  
            scrollToElementInTableRef={scrollToElementInTable} 
            currentSongIDRef={currentSong.id} 
            infoCardSongIDRef={infoCardSongID} 
            isDisabledRef={isDisabled} 
            setAutoFocusRef={setAutoFocus} 
            autoFocusRef={autoFocus}
            expandHeaderStateRef={expandHeaderState}
            setExpandHeaderStateRef={setExpandHeaderState} 
            selectSongsRef={selectSongs}
            setColumnOnRef={setColumnState}
            columnOnRef={columnOn}
            setTableDisabledRef={setDisabled}
            isPlaylistTableRef={isPlaylistTable}
            inSearchModeRef={inSearchMode}
            setInSearchModeRef={setInSearchMode}
          />
          
          {isDisabled === false ? 
          <TableContainer className='table_container_songtable' id={"scrollable"} component={Paper} sx={{ maxHeight: (expandHeaderState == false ? "77.8vh" : "72.6vh"), width: "80vw"}} >
              <Table size='small' id={"musictable"} stickyHeader aria-label="table">
                  <TableHead id={"musictableheader"} >
                      <TableHeaderRow>
                        {ColumnEnumArray.map((val, index) => ( columnOn[index] === true ? <TableCell align="left">{val}</TableCell> : undefined))}
                      </TableHeaderRow>
                  </TableHead>
                  <TableBody>
              
                  {//https://stackoverflow.com/questions/54045094/use-buttonbase-for-ripple-effect-on-material-ui-tablerow
                  currentlySelectedSongList?.map((sMetaDataThis, index) => (
                    <SongTableRow 
                      sMetaDataThisRef={sMetaDataThis}
                      indexRef={index}
                      columnOnRef={columnOn}
                      currentSongRef={currentSong.id === index ? true : false}
                      selectedButtonStateRef={selectedButtonList[index]}
                      setSelectStatusRef={setSelectStatus}
                      selectFullDataInfoCardRef={selectFullDataInfoCard} 
                      selectedPlayDataFunctionRef={selectedPlayDataFunction}     
                      selectedRef={highlighted === index ? true : false}               
                    ></SongTableRow>
                  )) 


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