import './../css/Dashboard.css';
import React, { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import { Button, ButtonGroup, Chip, createTheme, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Switch, ThemeProvider, useColorScheme } from '@mui/material';
import { LeftAudioSidebar } from '../components/static/Audio/Music/LeftAudioSidebar';
import { RegularButton } from '../elements/CustomButtons';
import { ipcRenderer } from 'electron';


export const Layout = () => {



    return (
        <div className='page_content_dashboard'>

            <Card className='card_dashboard'> <h2>Music</h2>  </Card>
            
            <Card className='card_dashboard'> <h2>Welcome</h2> </Card>

            <Card className='card_dashboard'> <h2>Debug</h2> 

            <RegularButton onClick={() => window.electron.ipcRenderer.sendMessage('audio', ['msg'])}>Test send one way</RegularButton>
            <RegularButton onClick={    
                async () => {
                    
                const result = await window.electron.ipcRenderer.invoke('audio', "get_all_metadata");
                console.log("getting results:");
                console.log(JSON.parse(result));
                
            }}>Test Recieve Metadata</RegularButton>
            
            </Card>

            
        </div>
    )
  };
export default Layout;