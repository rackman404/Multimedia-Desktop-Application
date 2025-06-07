import { AppBar, Box, Button, ButtonBase, ButtonGroup, Card, Checkbox, Chip, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from '@mui/material';
import './SongTable.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { TableHeaderRow } from '../../../../elements/CustomButtons';


function sampleCreateData(
    id: number,
    name: string,
    length: number,
    artist: string,
    genre: string,
    playCount: number,
    bitrate: number,
) {
  return { name, length, artist, genre, playCount, bitrate };
}

const sampleRows = [
  sampleCreateData(0,'Song 1', 80, "John Doe", "Rock", 1300,132),
  sampleCreateData(1,'Song 2', 32.2, "Jean Doe", "J-Pop", 352, 320),
  sampleCreateData(2, 'Song 3', 43, "John Doe", "Other", 4, 320),
  sampleCreateData(3, 'Song 4', 140, "Jean Doe", "French", 321, 320),
  sampleCreateData(4, 'Song 5', 33, "John Doe", "Japanese Pop", 631, 320),
    sampleCreateData(0,'Song 1', 80, "John Doe", "Rock", 1300,132),
  sampleCreateData(1,'Song 2', 32.2, "Jean Doe", "J-Pop", 352, 320),
  sampleCreateData(2, 'Song 3', 43, "John Doe", "Other", 4, 320),
  sampleCreateData(3, 'Song 4', 140, "Jean Doe", "French", 321, 320),
  sampleCreateData(4, 'Song 5', 33, "John Doe", "Japanese Pop", 631, 320),
    sampleCreateData(0,'Song 1', 80, "John Doe", "Rock", 1300,132),
  sampleCreateData(1,'Song 2', 32.2, "Jean Doe", "J-Pop", 352, 320),
  sampleCreateData(2, 'Song 3', 43, "John Doe", "Other", 4, 320),
  sampleCreateData(3, 'Song 4', 140, "Jean Doe", "French", 321, 320),
  sampleCreateData(4, 'Song 5', 33, "John Doe", "Japanese Pop", 631, 320),
      sampleCreateData(0,'Song 1', 80, "John Doe", "Rock", 1300,132),
  sampleCreateData(1,'Song 2', 32.2, "Jean Doe", "J-Pop", 352, 320),
  sampleCreateData(2, 'Song 3', 43, "John Doe", "Other", 4, 320),
  sampleCreateData(3, 'Song 4', 140, "Jean Doe", "French", 321, 320),
  sampleCreateData(4, 'Song 5', 33, "John Doe", "Japanese Pop", 631, 320),
  
];

const dataRowSX: SxProps = {
  display: "table-row",
  ":hover": {
    cursor: "pointer",
  },
};

export const SongTable = () => { 
    const [currentViewText, setCurrentViewText] = React.useState("Dashboard");

    return (
        <div className='songtable'>
            <TableContainer component={Paper} sx={{ maxHeight: "93vh", width: "99vw"}}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableHeaderRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Length</TableCell>
                            <TableCell align="right">Artist</TableCell>
                            <TableCell align="right">Genre</TableCell>
                            <TableCell align="right">Play Count</TableCell>
                            <TableCell align="right">Bit Rate</TableCell>
                        </TableHeaderRow>
                    </TableHead>
                    <TableBody>
                    {//https://stackoverflow.com/questions/54045094/use-buttonbase-for-ripple-effect-on-material-ui-tablerow
                    sampleRows.map((sampleRows) => (
                        <ButtonBase key={sampleRows.name} component={TableRow} sx={dataRowSX}>  
                                <TableCell component="th" scope="row">{sampleRows.name}</TableCell>
                                <TableCell align="right">{sampleRows.length}</TableCell>
                                <TableCell align="right">{sampleRows.artist}</TableCell>
                                <TableCell align="right">{sampleRows.genre}</TableCell>
                                <TableCell align="right">{sampleRows.playCount}</TableCell>
                                <TableCell align="right">{sampleRows.bitrate}</TableCell>
                            
                        </ButtonBase>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>

    );



}