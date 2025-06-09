import { AppBar, Box, Button, ButtonBase, ButtonGroup, Card, Checkbox, Chip, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from '@mui/material';
import './SongTable.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { TableHeaderRow } from '../../../../elements/CustomButtons';
import { SongMetaData, SongMetaDataSimple } from '../../../../../types';

const dataRowSX: SxProps = {
  display: "table-row",
  ":hover": {
    cursor: "pointer",
  },
};


type SongTableProps = { //constructor variables
  sMetaData: SongMetaDataSimple[] | null
  selectedPlayDataFunction: (data:SongMetaDataSimple) => void
  selectedInfoCardFunction : (data:SongMetaDataSimple) => void
};

export const SongTable = ({sMetaData, selectedPlayDataFunction, selectedInfoCardFunction}: SongTableProps) => { 
  const [highlighted, setHighlighted] = useState();

  async function selectFullDataInfoCard(rowData: SongMetaDataSimple){

    //const result = await window.electron.ipcRenderer.invoke('audio', ["get_metadata_full", rowData.id, rowData.songRawPath]);
    
    selectedInfoCardFunction(rowData);
  }

  return (
      <div className=''>
          <TableContainer component={Paper} sx={{ maxHeight: "83vh", width: "80vw"}}>
              <Table aria-label="simple table">
                  <TableHead>
                      <TableHeaderRow>
                          <TableCell>Name</TableCell>
                          <TableCell align="right">Length</TableCell>
                          <TableCell align="right">Artist</TableCell>
                          <TableCell align="right">Genre</TableCell>
                          <TableCell align="right">Play Count</TableCell>
                          <TableCell align="right">Bit Rate</TableCell>
                          <TableCell align="right">Internal ID</TableCell>
                      </TableHeaderRow>
                  </TableHead>
                  <TableBody>

                  {//https://stackoverflow.com/questions/54045094/use-buttonbase-for-ripple-effect-on-material-ui-tablerow
                  sMetaData ? sMetaData.map((sMetaData) => (
                      <Button className='row_songtable' key={sMetaData.id} component={TableRow} sx={dataRowSX} onClick={() => selectFullDataInfoCard(sMetaData)} onDoubleClick=
                      {(e) => {
                        selectedPlayDataFunction(sMetaData);

                      } }> 

                              <TableCell component="th" scope="row">{sMetaData.name}</TableCell>
                              <TableCell align="right">{Math.round(sMetaData.length)}</TableCell>
                              <TableCell align="right">{sMetaData.artist}</TableCell>
                              <TableCell align="right">{sMetaData.genre}</TableCell>
                              <TableCell align="right">{sMetaData.playCount}</TableCell>
                              <TableCell align="right">{Math.round(sMetaData.bitrate)}</TableCell>    
                              <TableCell align="right">{Math.round(sMetaData.id)}</TableCell>    
                      </Button>
                  )) : null
                  }
                  </TableBody>
              </Table>
          </TableContainer>
      </div>

  );



}