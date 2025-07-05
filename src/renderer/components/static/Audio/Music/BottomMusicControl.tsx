import { AppBar, Box, Button, ButtonGroup, Card, CardMedia, Chip, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Slider, TextField, ToggleButton, Toolbar, Typography } from '@mui/material';
import './BottomMusicControl.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RegularButton } from '../../../../elements/CustomButtons';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { useSelectedSongStore } from '../../../../state_stores/MusicStateStores';
import { fmtMSS } from '../../../../Common';

import placeholderImage from '../../../../../../assets/music_no_thumbnail.png';
import { SongMetaData } from '../../../../../types';

import Marquee from "react-fast-marquee";
import { checkTextOverflow } from '../../../../../utils';
import { grey } from '@mui/material/colors';

type MusicControlProps = { //constructor variables
  setSeek: (newSeek:number) => void
  setVolume: (newVolume: number)  => void
  setNext: ()  => void
  setPrev: ()  => void
};

export const BottomMusicControl = ({setSeek, setVolume, setNext, setPrev}:MusicControlProps) => {
    const updatePlayState = useSelectedSongStore((state) => state.setPlayState);
    const PlayState = useSelectedSongStore((state) => state.playState);
    const currentSeek = useSelectedSongStore((state) => state.currentSeek);
    const currentVolume = useSelectedSongStore((state) => state.currentVolume);
    const currentSong = useSelectedSongStore((state) => state.selectedPlaySongMetaData);

    const shuffleState = useSelectedSongStore((state) => state.shuffleState);
    const setShuffleState = useSelectedSongStore((state) => state.setShuffleState);

    const loopState = useSelectedSongStore((state) => state.loopState);
    const setLoop = useSelectedSongStore((state) => state.setLoopState);

    const [cover, setCover] = useState<any>(<CardMedia
        component="img"
        width="100%"
        height="65%"
        image= {placeholderImage}
        alt="Song Thumbnail Image"         
        sx={{objectFit: "contain" }}
    />);

    const [artistElement, setArtistElement] = useState<HTMLDivElement | null>();
    const [nameElement, setNameElement] = useState<HTMLDivElement | null>();

    const [artistMarqueeState, setArtistMarqueeState] = useState(false);
    const [nameMarqueeState, setNameMarqueeState] = useState(false);

    //on mount and unmount
    useEffect(() => {

    //called when the component is unmounted
    return () => {
        setCover(<div/>);
    };
    }, []);

    
    //check for overflow and set a marquee if it does
    useEffect(() => {

        if (artistElement != null && nameElement != null){
            setArtistMarqueeState(checkTextOverflow(artistElement));
            setNameMarqueeState(checkTextOverflow(nameElement));
        }
        

    }, [artistElement, nameElement]);

    useEffect(() => {

        (async () => {
            if (currentSong.songRawPath != ""){
                const result = await window.electron.ipcRenderer.invoke('audio', ["get_metadata_full", currentSong.id, currentSong.songRawPath]) as SongMetaData;
                //console.log("cover image" +  sMetaData?.coverImage);
                //console.log(result);

                var cImg = placeholderImage;
                if(result.coverImage != null){
                cImg = await _arrayBufferToBase64(result.coverImage.data);
                cImg = 'data:' + result.coverImageFormat + ';base64,'+ cImg;
                }

                /* old
                var cImg = placeholderImage;
                if(result.coverImage != null){
                cImg = result.coverImage;
                cImg = 'data:' + result.coverImageFormat + ';base64,'+ cImg;
                }
                */
        
                
        setCover(<img
        width="100%"
        height="100%"
        src= {cImg}
        alt="Song Thumbnail Image"  
        style={{objectFit: "contain", animation: "fadeIn 0.50s", objectPosition: "left" }}
                />);
            }
        })();
    }, [currentSong]);


    const userSeekChange = (event: Event, newValue: number) => {
        setSeek(newValue);
    };

    const userVolumeChange = (event: Event, newValue: number) => {
        setVolume(newValue);
    };

    //https://stackoverflow.com/questions/38432611/converting-arraybuffer-to-string-maximum-call-stack-size-exceeded
    //https://stackoverflow.com/questions/64814478/how-can-a-javascript-async-function-explicitly-yield-control-at-a-specific-point
    async function _arrayBufferToBase64( buffer: any) {
        var binary = '';
        var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;

        var count = 0;
        var progressCheck = 0;

        var timeTilLoadingIndicator = 0;
        var loadedIndicator = false;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
            count++;
            progressCheck++

            if (count == 20000){
                count = 0;
                timeTilLoadingIndicator++;
                await new Promise((resolve) => setTimeout(resolve)); //more or less yielding back to the main control flow every so often  similar to C# and Java so app doesn't hang 
            }
    
        }
        return window.btoa( binary );
    }

    return (
        <div className='content_bottommusiccontrol'>        
                <Card className='left_card_bottommusiccontrol' variant='outlined'>
                    {cover}
                    <div>
                        <div ref={(el) => {setNameElement(el)}} id = "name" className='left_card_text_container_bottommusiccontrol'>
                        {nameMarqueeState === true ? 
                        <Marquee speed={25} delay={1}>{<div style={{paddingRight: "5px"}}>{currentSong.name} {" "} | </div>}</Marquee>
                        : currentSong.name}
                        </div>

                        <br/>
                        
                        
                        <div ref={(el) => {setArtistElement(el)}} id = "artist" className='left_card_text_container_bottommusiccontrol'>
                            {artistMarqueeState === true ? 
                            <Marquee speed={25} delay={1}><div style={{paddingRight: "5px"}}>{currentSong.artist?.map((artist, index) => ( index === 0 ? artist : " and " + artist))} {" "} |</div></Marquee>
                            : currentSong.artist.map((artist, index) => ( index === 0 ? artist : " and " + artist))}
                        </div>
                    </div>
                </Card>

                <Divider orientation="vertical" />
                
                <Card className='center_card_bottommusiccontrol' variant='outlined'>
                    <div className='centered_control_bottommusiccontrol'>
                        <div>
                            <Button onClick={setPrev}><ArrowBackIosNewIcon/></Button>
                            <ToggleButton value="control"  selected={PlayState} onChange={() => updatePlayState(!PlayState)}><PlayCircleIcon/></ToggleButton>
                            <Button onClick={setNext}><ArrowForwardIosIcon/></Button>
                        </div>
                                
                        <div className='right_control_center_bottommusiccontrol'>
                            <div>
                            <Button onClick={() => shuffleState === false ? setShuffleState(true) : setShuffleState(false)}> {shuffleState === false ? "Enable" : "Disable"} Shuffle </Button>
                            </div>

                            <div>
                            <Button onClick={() => loopState === false ? setLoop(true) : setLoop(false)}> {loopState === false ? "Enable" : "Disable"} Loop </Button>
                            </div>

                        </div>

                        <div className='left_control_center_bottommusiccontrol'>
                            <div>
                            <Button onClick={() => shuffleState === false ? setLoop(true) : setLoop(false)}> {shuffleState === false ? "Hide" : "Show"} Controls </Button>
                            </div>

                            <div>
                            <Button onClick={() => shuffleState === false ? setLoop(true) : setLoop(false)}> {shuffleState === false ? "Enable" : "Disable"} Normalization </Button>
                            </div>
                        </div>
                    </div>

                    <div className='seek_component_bottommusiccontrol'>
                        <Toolbar>
                            {fmtMSS(Math.round(currentSeek))}
                            <Slider size="small" aria-label="Volume" value={currentSeek} max={currentSong.length} sx={{maxWidth: "50em", marginLeft: "10px", marginRight: "10px"}} onChange={userSeekChange} />
                            {fmtMSS(Math.round(currentSong.length))}
                        </Toolbar>
                    </div>
                </Card>

                <Divider orientation="vertical" />

                <Card className='right_card_bottommusiccontrol' variant='outlined'>
                    <div className='volume_control_bottommusiccontrol' style={{marginTop: "2.3vh"}}>
                        Volume
                    </div>
                
                    <Toolbar> {currentVolume} <Slider size="small" aria-label="Volume" value={currentVolume} max={100} onChange={userVolumeChange} sx={{marginLeft: "10px"}} /> </Toolbar>
                </Card>
            </div>       
    );



}