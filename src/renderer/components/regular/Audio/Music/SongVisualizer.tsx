import { AppBar, Box, Button, ButtonBase, ButtonGroup, Card, CardContent, Checkbox, Chip, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ToggleButton, Toolbar, Typography } from '@mui/material';
import './SongLyricCard.css';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { RegularButton } from '../../../../elements/CustomButtons';
import CheckIcon from '@mui/icons-material/Check';
import { useGlobalSettingsState } from '../../../../state_stores/GlobalSettingsStateStore';


import { Howl, Howler } from 'howler';
import { useSelectedSongStore } from '../../../../state_stores/MusicStateStores';
import { buffer } from 'stream/consumers';
import { IPCMethodAPI, ServicesEnum } from '../../../../../typesIPC';
import { GeneralSettingParameters, SettingParameters } from '../../../../../types';


type SongToggleButtonProps = { //instance variables
    timeDomain: boolean
}



export const SongVisualizer = ({timeDomain}:SongToggleButtonProps) => { 

    const [canvasCtx, setCtx] = useState<CanvasRenderingContext2D | null | undefined>(null);
    const [refreshRate, setRefreshRate] = useState<number | null>(null);
    const [isEnabled, setIsEnabled] = useState<boolean>(false);

    const [canDraw, setCanDraw] =  useState<boolean>(false);

    const [drawUpdater, setDrawUpdater] = useState<number>(0);
    
    useEffect(() => {
        getParameters();

    }, []);

    async function getParameters(){
        var params = await (window.electron.ipcRenderer.invoke(ServicesEnum.settings , {service: IPCMethodAPI.SettingsTwoWayIPC.getParameters, content: [""]})) as SettingParameters;
        setRefreshRate(params.MusicSettings.visualizerPollingRate);
        setIsEnabled(params.MusicSettings.visualizerState);

        const interval = setInterval(async () => {   
            setDrawUpdater(Math.random()); 

        }, params.MusicSettings.visualizerPollingRate);  
    }

    useEffect(() => {       
        console.log("DRAWING NOW" + " " + refreshRate);
        if (canvasCtx != null && refreshRate != null && isEnabled == true){ //only start the drawing cycle if refresh rate and canvas object is loaded in
            
            /*
            const interval = setInterval(async () => {   
                draw(); 

            }, refreshRate);  
            */

            setCanDraw(true);
        }   
    }, [canvasCtx, refreshRate, isEnabled]);

    useEffect(() => {
        if (canDraw == true){
            var WIDTH = 256;
            var HEIGHT = 128;

            
            var canvasElement = document.querySelector(`#${CSS.escape("fullscreen_canvas")}`) as HTMLCanvasElement; 
            if (canvasElement != null){
                //var rect = canvasElement.parentElement?.getBoundingClientRect();
                //canvasElement.width = rect?.width ?? 256;
                //canvasElement.height = rect?.height ?? 256;

                var rect = canvasElement.getBoundingClientRect();
                //WIDTH = rect?.width ?? 256;
                //HEIGHT = rect?.height ?? 128;

                WIDTH = canvasElement.width;
                HEIGHT = canvasElement.height;

            }
            


            
            var node = useSelectedSongStore.getState().analyserNode;

            //console.log("DRAWING " + node?.fftSize + " " +  node?.frequencyBinCount);

            if (canvasCtx != null && node != null){
                var bufferLengthThis = node.frequencyBinCount;
                var dataArrayEmpty = new Uint8Array(bufferLengthThis);

                canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

                if (timeDomain == true){
                    node.getByteTimeDomainData(dataArrayEmpty);
                }
                else{
                    node.getByteFrequencyData(dataArrayEmpty);
                }
            
                
                //console.log(dataArrayEmpty);
                

                // Fill solid color
                //canvasCtx.fillStyle = "rgb(200 200 200)";
                //canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
                // Begin the path


                canvasCtx.lineWidth = 2;
                canvasCtx.strokeStyle = "rgb(0 100 0)";
                canvasCtx.beginPath();
                // Draw each point in the waveform
                const sliceWidth = WIDTH / bufferLengthThis;
                let x = 0;
                for (let i = 0; i < bufferLengthThis; i++) {
                    const v = dataArrayEmpty[i] / 256.0;
                    

                    const y = v * (HEIGHT);

                    if (i === 0) {
                    canvasCtx.moveTo(x, y);
                    } else {
                    canvasCtx.lineTo(x, y);
                    }

                    x += sliceWidth;
                }

                // Finish the line
                canvasCtx.lineTo(WIDTH, HEIGHT / 2);
                canvasCtx.stroke();
            }
        }    
        
    }, [canDraw, drawUpdater]);

    /*
    function draw() {
        var WIDTH = 256;
        var HEIGHT = 128;

        
        var canvasElement = document.querySelector(`#${CSS.escape("fullscreen_canvas")}`) as HTMLCanvasElement; 
        if (canvasElement != null){
            //var rect = canvasElement.parentElement?.getBoundingClientRect();
            //canvasElement.width = rect?.width ?? 256;
            //canvasElement.height = rect?.height ?? 256;

            var rect = canvasElement.getBoundingClientRect();
            //WIDTH = rect?.width ?? 256;
            //HEIGHT = rect?.height ?? 128;

            WIDTH = canvasElement.width;
            HEIGHT = canvasElement.height;

        }
        


        
        var node = useSelectedSongStore.getState().analyserNode;

        //console.log("DRAWING " + node?.fftSize + " " +  node?.frequencyBinCount);

        if (canvasCtx != null && node != null){
            var bufferLengthThis = node.frequencyBinCount;
            var dataArrayEmpty = new Uint8Array(bufferLengthThis);

            canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

            if (timeDomain == true){
                node.getByteTimeDomainData(dataArrayEmpty);
            }
            else{
                node.getByteFrequencyData(dataArrayEmpty);
            }
        
            
            //console.log(dataArrayEmpty);
            

            // Fill solid color
            //canvasCtx.fillStyle = "rgb(200 200 200)";
            //canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
            // Begin the path


            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = "rgb(0 100 0)";
            canvasCtx.beginPath();
            // Draw each point in the waveform
            const sliceWidth = WIDTH / bufferLengthThis;
            let x = 0;
            for (let i = 0; i < bufferLengthThis; i++) {
                const v = dataArrayEmpty[i] / 256.0;
                

                const y = v * (HEIGHT);

                if (i === 0) {
                canvasCtx.moveTo(x, y);
                } else {
                canvasCtx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            // Finish the line
            canvasCtx.lineTo(WIDTH, HEIGHT / 2);
            canvasCtx.stroke();
        }

    }
    */




    return (     
        <canvas id='fullscreen_canvas' ref={(c) => setCtx(c?.getContext('2d'))} height={'100%'} style={{width:"95%"}}>
            
        </canvas>
    );



}