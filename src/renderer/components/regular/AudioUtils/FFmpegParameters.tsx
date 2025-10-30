import { Button, Card, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";

import './FFmpegParameters.css';
import { ColumnEnumArray } from "../../../../types";
import { TableHeaderRow } from "../../../elements/CustomButtons";
import { SongTableRow } from "../Audio/Music/SongTableRow";
import { ServicesEnum, IPCMethodAPI } from "../../../../typesIPC";
import { useEffect } from "react";




const formats = [
{
    value: 'null',
    label: 'No Change',
  },
  {
    value: 'mp3',
    label: '.mp3',
  },
  {
    value: 'flac',
    label: '.flac',
  }
];



export const FFmpegParameters = () => { 

    async function onCoverImageSelect(){
        console.log("Requesting image from backend");
        const result = await window.electron.ipcRenderer.invoke(ServicesEnum.audioEdit, {service: IPCMethodAPI.AudioEditTwoWayIPC.requestCoverImageDialog, content: [false]});
        
    }

    return(
        <Card className='ffmpeg_parameters_card' variant='outlined' sx={{height: '73vh'}}>

            <div className="ffmpeg_parameters_card_content">
                <Typography variant="h4" component="div" style={{textAlign: "center"}}>Parameters</Typography>
                <div style={{textAlign: "center"}}>Note: Empty field will mean this field won't be changed for the given song</div>
                <Divider orientation="horizontal" sx={{ borderBottomWidth: 4 , marginBottom: "5px"}}/>
                
                {/*
                <div className="ffmpeg_parameters_card_grid">
                    <div className="ffmpeg_parameters_card_column">
                        <Typography variant="h5" component="div" style={{textAlign: "center"}}>Metadata Fields</Typography>
                        <Typography variant="body2" ><div className='text_fade_in_songinfohorizontalcard'>Name: </div></Typography>
                        <Typography variant="body2" ><div className='text_fade_in_songinfohorizontalcard'>Artist(s): </div></Typography>
                        <Typography variant="body2" ><div className='text_fade_in_songinfohorizontalcard'>Album: </div></Typography>
                        <Typography variant="body2" ><div className='text_fade_in_songinfohorizontalcard'>Genre: </div></Typography>
                        <Typography variant="body2" ><div className='text_fade_in_songinfohorizontalcard'>Cover Image: </div></Typography>

                        <Typography variant="h5" component="div" style={{textAlign: "center"}}>File Container Fields</Typography>
                        <Typography variant="body2" ><div className='text_fade_in_songinfohorizontalcard'>File Format: </div></Typography>
                        <Typography variant="body2" ><div className='text_fade_in_songinfohorizontalcard'>Embedded Comment: </div></Typography>
                    </div>

                    <div className="ffmpeg_parameters_card_column">
                        <Typography variant="h5" component="div" style={{textAlign: "center"}}>Edit</Typography>
                    </div>

                </div>
                */}
                <Typography variant="h5" component="div" style={{textAlign: "center"}}>Metadata Fields</Typography>
                <TableContainer className='table_container_ffmpeg_parameters' id={"scrollable"} component={Paper} sx={{ height: "20.8v"}} >
                    <Table size='small' id={"musictable"} stickyHeader aria-label="table">
                        <TableHead id={"musictableheader"} >
                            <TableHeaderRow>
                                 <TableCell width={"30%"}>Metadata Parameter</TableCell>
                                 <TableCell align="center">Current Data</TableCell>
                                 <TableCell align="right">Data Field</TableCell>
                            </TableHeaderRow>
                        </TableHead>

                        <TableBody>
                            <TableRow key={0}>
                                <TableCell align="left">Name:</TableCell>
                                <TableCell align="center">Lorum Ipsum:</TableCell>
                                <TableCell style={{textAlign: "right"}}> 
                                    <TextField id="standard-basic" variant="standard" /> 
                                </TableCell>
                            </TableRow>

                            <TableRow key={1}>
                                <TableCell align="left">Artist(s):</TableCell>
                                <TableCell align="center">Lorum Ipsum:</TableCell>
                                <TableCell style={{textAlign: "right"}}> 
                                    <TextField id="standard-basic" variant="standard" /> 
                                </TableCell>
                            </TableRow>

                            <TableRow key={2}>
                                <TableCell align="left">Album</TableCell>
                                <TableCell align="center">Lorum Ipsum:</TableCell>
                                <TableCell style={{textAlign: "right"}}> 
                                    <TextField id="standard-basic" variant="standard" /> 
                                </TableCell>
                            </TableRow>

                            <TableRow key={3}>
                                <TableCell align="left">Genre(s)</TableCell>
                                <TableCell align="center">Lorum Ipsum:</TableCell>
                                <TableCell style={{textAlign: "right"}}> 
                                    <TextField id="standard-basic" variant="standard" /> 
                                </TableCell>
                            </TableRow>

                            <TableRow key={4}>
                                <TableCell align="left">Cover Image</TableCell>
                                <TableCell align="center">{"No Cover Image Selected"}</TableCell>
                                <TableCell align="right">  <Button onClick={() => {onCoverImageSelect()}}> Select </Button> </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography variant="h5" component="div" style={{textAlign: "center"}}>File Container Fields</Typography>
                <TableContainer className='table_container_ffmpeg_parameters' id={"scrollable"} component={Paper} sx={{ height: "20.8v"}} >
                    <Table size='small' id={"musictable"} stickyHeader aria-label="table">
                        <TableHead id={"musictableheader"} >
                            <TableHeaderRow>
                                 <TableCell width={"30%"}>File Parameter</TableCell>
                                 <TableCell align="center">Current Data</TableCell>
                                 <TableCell align="right">Data Field</TableCell>
                            </TableHeaderRow>
                        </TableHead>

                        <TableBody>
                            <TableRow key={0}>
                                <TableCell align="left">File Format:</TableCell>
                                <TableCell align="center">Lorum Ipsum:</TableCell>
                                <TableCell style={{textAlign: "right"}}> 
                                    <TextField id="standard-basic" variant="standard" defaultValue="null" select
                                        slotProps={{
                                            select: {
                                            native: true,
                                            },
                                        }}>
                                        {formats.map((option) => (
                                            <option key={option.value} value={option.value}>
                                            {option.label}
                                            </option>
                                        ))}
                                    </TextField> 
                                    
                                </TableCell>
                            </TableRow>

                            <TableRow key={1}>
                                <TableCell align="left">Embedded Comment:</TableCell>
                                <TableCell align="center">Lorum Ipsum:</TableCell>
                                <TableCell style={{textAlign: "right"}}> 
                                    <TextField id="standard-basic" variant="standard" /> 
                                </TableCell>
                            </TableRow>

                            <TableRow key={2}>
                                <TableCell align="left">File Name (Not Recommended):</TableCell>
                                <TableCell align="center">Lorum Ipsum:</TableCell>
                                <TableCell style={{textAlign: "right"}}> 
                                    <TextField id="standard-basic" variant="standard" /> 
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <div className="ffmpeg_parameters_card_bottom_row_container">
                <Divider orientation="horizontal" sx={{ borderBottomWidth: 4 , marginBottom: "5px"}}/>
                <div className="ffmpeg_parameters_card_bottom_row">
                    <Button>Prefill from Web Scrapers</Button>
                    <Button>Clear All</Button>
                </div>
            </div>
            
        </Card>



    );

}