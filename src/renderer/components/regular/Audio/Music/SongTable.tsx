import { AppBar, Box, Button, ButtonBase, ButtonGroup, Card, CardActionArea, Checkbox, Chip, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from '@mui/material';
import './SongTable.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { TableHeaderRow } from '../../../../elements/CustomButtons';
import { SongMetaData, SongMetaDataSimple } from '../../../../../types';
import { useSelectedSongStore } from '../../../../state_stores/MusicStateStores';
import { fmtMSS } from '../../../../Common';
import { blueGrey, grey } from '@mui/material/colors';

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
  const currentSong = useSelectedSongStore((state) => state.selectedPlaySongMetaData);
  

  async function selectFullDataInfoCard(rowData: SongMetaDataSimple){
    //const result = await window.electron.ipcRenderer.invoke('audio', ["get_metadata_full", rowData.id, rowData.songRawPath]);
    //setHighlighted(rowData.id);
    selectedInfoCardFunction(rowData);
  }

  useEffect(() => {//highlight active song
    setHighlighted(currentSong.id);
  }, [currentSong]);   

  return (
      <div className='body_songtable'>
          <Card variant='outlined' className='top_bar_songtable'>
            <div className='top_bar_content_songtable'>
              <TextField id="searchfield" label="Search" variant="standard" />          
              <Button>Submit</Button>
              <Button>Reset Search</Button>
              <Divider orientation="vertical" flexItem sx={{marginLeft: "5px", marginRight: "5px"}} />
              <Button>Zoom To Current Song</Button>
              <Button>Autofocus (on/off) Song</Button>
              <Button>Force Reload Song List</Button>
              <Divider orientation="vertical" flexItem sx={{marginLeft: "5px", marginRight: "5px"}} />
              <Button>Toggle Shuffle</Button>
              <Button>Translate Song Titles</Button>
            </div>
          </Card>
          
          <TableContainer component={Paper} sx={{ maxHeight: "77.8vh", width: "80vw" }} >
              <Table size='small' stickyHeader aria-label="table">
                  <TableHead>
                      <TableHeaderRow>
                          <TableCell>Name</TableCell>
                          <TableCell align="right">Length (Mins)</TableCell>
                          <TableCell align="right">Artist</TableCell>
                          <TableCell align="right">Genre</TableCell>
                          <TableCell align="right">Play Count</TableCell>
                          <TableCell align="right">Bit Rate</TableCell>
                          <TableCell align="right">Internal ID</TableCell>
                      </TableHeaderRow>
                  </TableHead>
                  <TableBody>

                  {//https://stackoverflow.com/questions/54045094/use-buttonbase-for-ripple-effect-on-material-ui-tablerow
                  sMetaData ? sMetaData.map((sMetaData, index) => (

                      <CardActionArea className='row_songtable' key={sMetaData.id}  component={TableRow} sx={highlighted === index ? dataRowSelectedSX : dataRowSX } onClick={() => selectFullDataInfoCard(sMetaData)} 
                      onDoubleClick=
                      {(e) => {
                        selectedPlayDataFunction(sMetaData);
                      }}
                      /*data-active={highlighted === index ? "" : undefined} */
                      > 
                        <TableCell component="th" scope="row">{sMetaData.name}</TableCell>
                        <TableCell align="right">{fmtMSS(sMetaData.length)}</TableCell>
                        <TableCell align="right">{sMetaData.artist}</TableCell>
                        <TableCell align="right">{sMetaData.genre}</TableCell>
                        <TableCell align="right">{sMetaData.playCount}</TableCell>
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