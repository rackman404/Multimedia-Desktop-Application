import { Button, Card, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";

import './FFmpegParameters.css';
import { ColumnEnumArray, SongLyricAPIData, SongMetaData, SongMetaDataSimple } from "../../../../types";
import { TableHeaderRow } from "../../../elements/CustomButtons";
import { SongTableRow } from "../Audio/Music/SongTableRow";
import { ServicesEnum, IPCMethodAPI } from "../../../../typesIPC";
import { useEffect, useState } from "react";
import { ConversionData, DEFAULT_CONVERSION_DATA } from "../../../../typesAudioEdit";

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import RemoveIcon from '@mui/icons-material/Remove';

const formats = [
{
    value: '',
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


type FFmpegParametersProps = { //constructor variables
  sMetaDataFull: SongMetaData
}

export const FFmpegParameters = ({sMetaDataFull} : FFmpegParametersProps) => { 
    const [localParameters, setLocalParameters] = useState<ConversionData>(DEFAULT_CONVERSION_DATA);
    const [LRClibValid, isLRClibValid] = useState<boolean | undefined>(undefined);

    const [LRCButtonState, setLRCButtonState] = useState<boolean>(false);

    async function onCoverImageSelect(){
        console.log("Requesting image from backend");
        const result = await window.electron.ipcRenderer.invoke(ServicesEnum.audioEdit, {service: IPCMethodAPI.AudioEditTwoWayIPC.requestCoverImageDialog, content: [false]});
        var dat = localParameters; // we must do this to deep copy a new array as otherwise this component would not update
        dat.coverPath = result;
        console.log(dat.coverPath);
        
        onFieldChange(dat);
    }

    async function onFieldChange(changed: ConversionData){
        var dat = JSON.parse(JSON.stringify(changed)); // we must do this to deep copy a new array as otherwise this component would not update
        setLocalParameters(dat);
    }

    async function checkLRClibValidity(){
        var testData = {artist: [] as string[]} as SongMetaDataSimple;

        if (localParameters.songName != ""){
            testData.name = localParameters.songName;
        }
        else{
           testData.name = sMetaDataFull.name; 
        }

        if (localParameters.songArtist[0] != undefined && localParameters.songArtist[0] != ""){
            //console.log(localParameters.songArtist[0] + "1 ");
            testData.artist[0] = localParameters.songArtist[0];
        }
        else{
            //console.log(sMetaDataFull.artist[0]);
           testData.artist[0] = sMetaDataFull.artist[0]; 
        }
        
        testData.length = sMetaDataFull.length;

        setLRCButtonState(true);
        var lyric = await window.electron.ipcRenderer.invoke(ServicesEnum.audio, {service: IPCMethodAPI.AudioTwoWayIPC.externalLyricsFromMetadata, content: [testData]}) as SongLyricAPIData;
        if (lyric.statusCode == 100){
            isLRClibValid(true);
        }
        else{
            isLRClibValid(false);
        }
        setLRCButtonState(false);
    }

    async function resetAll(){
        var dat = JSON.parse(JSON.stringify(DEFAULT_CONVERSION_DATA)); // we must do this to deep copy a new array as otherwise this component would not update
        setLocalParameters(DEFAULT_CONVERSION_DATA);
    }

    async function StartConversion(){
        localParameters.fileRawPath = sMetaDataFull.songRawPath;
        window.electron.ipcRenderer.sendMessage(ServicesEnum.audioEdit, {service: IPCMethodAPI.AudioEditOneWayIPC.convertSong, content: [localParameters]});  
    }

    useEffect(() => {
       isLRClibValid(undefined); 
    }, [sMetaDataFull]); 

    return(
        <Card className='ffmpeg_parameters_card' variant='outlined' sx={{height: '73vh', borderRadius: 0 }}  >
            <Typography variant="h4" component="div" style={{textAlign: "center"}}>Parameters</Typography>
            <div style={{textAlign: "center"}}>Selected Song: {sMetaDataFull.songRawPath}</div>
            
            <Divider orientation="horizontal" sx={{ borderBottomWidth: 4 , marginBottom: "5px"}}/>
            <div className="ffmpeg_parameters_card_content" >
                <div style={{textAlign: "center"}}>Note: Empty field will mean this field won't be changed for the given song</div>

                
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
                <TableContainer className='table_container_ffmpeg_parameters' id={"scrollable"} component={Paper}  >
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
                                <TableCell align="center">{localParameters.songName}</TableCell>
                                <TableCell style={{textAlign: "right"}}> 
                                    <TextField id="standard-basic" variant="standard"
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => 
                                    {   
                                        var tempData = localParameters;
                                        tempData.songName = event.target.value;
                                        onFieldChange(tempData);
                                    }}
                                    
                                    /> 
                                </TableCell>
                            </TableRow>

                            <TableRow key={1}>
                                <TableCell align="left">Artist(s):</TableCell>
                                <TableCell align="center">{localParameters.songArtist}</TableCell>
                                <TableCell style={{textAlign: "right"}}> 
                                    <TextField id="standard-basic" variant="standard"
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => 
                                    {   
                                        var tempData = localParameters;
                                        tempData.songArtist[0] = event.target.value;
                                        onFieldChange(tempData);
                                    }}
                                    /> 
                                    
                                </TableCell>
                            </TableRow>

                            <TableRow key={2}>
                                <TableCell align="left">Album</TableCell>
                                <TableCell align="center">{localParameters.songAlbum}</TableCell>
                                <TableCell style={{textAlign: "right"}}> 
                                    <TextField id="standard-basic" variant="standard" 
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => 
                                    {   
                                        var tempData = localParameters;
                                        tempData.songAlbum = event.target.value;
                                        onFieldChange(tempData);
                                    }}
                                    /> 
                                </TableCell>
                            </TableRow>

                            <TableRow key={3}>
                                <TableCell align="left">Genre(s)</TableCell>
                                <TableCell align="center">{localParameters.songGenre}</TableCell>
                                <TableCell style={{textAlign: "right"}}> 
                                    <TextField id="standard-basic" variant="standard" 
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => 
                                    {   
                                        var tempData = localParameters;
                                        tempData.songGenre[0] = event.target.value;
                                        onFieldChange(tempData);
                                    }}
                                    /> 
                                </TableCell>
                            </TableRow>

                            <TableRow key={4}>
                                <TableCell align="left">Cover Image</TableCell>
                                <TableCell align="center">{localParameters.coverPath === undefined ? "No Cover Image Selected" : localParameters.coverPath}</TableCell>
                                <TableCell align="right">  <Button onClick={() => {onCoverImageSelect()}}> Select </Button> </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography variant="h5" component="div" style={{textAlign: "center"}}>File Container Fields</Typography>
                <TableContainer className='table_container_ffmpeg_parameters' id={"scrollable"} component={Paper} >
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
                                <TableCell align="center">{localParameters.fileFormat}</TableCell>
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
                                <TableCell align="center">{localParameters.embeddedComment}</TableCell>
                                <TableCell style={{textAlign: "right"}}> 
                                    <TextField id="standard-basic" variant="standard" 
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => 
                                    {   
                                        var tempData = localParameters;
                                        tempData.embeddedComment = event.target.value;
                                        onFieldChange(tempData);
                                    }}
                                    /> 
                                </TableCell>
                            </TableRow>

                            <TableRow key={2}>
                                <TableCell align="left">File Name (Not Recommended):</TableCell>
                                <TableCell align="center">{localParameters.fileName}</TableCell>
                                <TableCell style={{textAlign: "right"}}> 
                                    <TextField id="standard-basic" variant="standard"
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => 
                                    {   
                                        var tempData = localParameters;
                                        tempData.fileName = event.target.value;
                                        onFieldChange(tempData);
                                    }}
                                    /> 
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>


                <Divider/>

                <Typography variant="h5" component="div" style={{textAlign: "center"}}>Custom</Typography>
                <TableContainer className='table_container_ffmpeg_parameters' id={"scrollable"} component={Paper}>
                        <Table size='small' id={"musictable"} stickyHeader aria-label="table">
                            <TableHead id={"musictableheader"} >
                                <TableHeaderRow>
                                    <TableCell width={"60%"}>Parameter</TableCell>
                                    <TableCell align="right">Data Field</TableCell>
                                </TableHeaderRow>


                                <TableRow key={1}>
                                    <TableCell align="left">Custom Params (If Not Empty, Will overrided above):</TableCell>
                                    <TableCell style={{textAlign: "right"}}> 
                                        <TextField id="standard-basic" variant="standard" /> 
                                    </TableCell>    
                                </TableRow>

                                
                                <TableRow key={2}>
                                    <TableCell align="left">Placeholder 1</TableCell>
                                    <TableCell style={{textAlign: "right"}}> 
                                        <TextField id="standard-basic" variant="standard" /> 
                                    </TableCell>    
                                </TableRow>

                                <TableRow key={3}>
                                    <TableCell align="left">Placeholder 2</TableCell>
                                    <TableCell style={{textAlign: "right"}}> 
                                        <TextField id="standard-basic" variant="standard" /> 
                                    </TableCell>    
                                </TableRow>
                            </TableHead>

                    </Table>
                </TableContainer>
            </div>

            


            <div className="ffmpeg_parameters_card_bottom_row_container">
                <Divider orientation="horizontal" sx={{ borderBottomWidth: 4 , marginBottom: "5px"}}/>
                <div className="ffmpeg_parameters_card_bottom_row">

<                   Button onClick={() => StartConversion()}>Convert</Button>
                    <Button disabled>Prefill from Web Scrapers</Button>
                    <Button onClick={() => resetAll()}>Clear All</Button>
                    <Button disabled={LRCButtonState} onClick={() => checkLRClibValidity()}>Check LRClib Validity</Button>
                    {LRClibValid === undefined ? <RemoveIcon fontSize='inherit'/> : LRClibValid === true ? <CheckIcon fontSize='inherit'/> : <ClearIcon fontSize='inherit'/>}
                </div>
            </div>
            
        </Card>



    );

}