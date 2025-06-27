import './About.css';
import React, { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import { Button, ButtonGroup, Chip, createTheme, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Switch, ThemeProvider, Typography, useColorScheme } from '@mui/material';
import { ipcRenderer } from 'electron';
import { LinkButton, RegularButton } from '../../elements/CustomButtons';

export const Layout = () => {



    return (
        <div className='page_content_about'>
            <Card className='card_about' variant='outlined'> 
                <h1>About</h1>

                <div className='column_about'>

                <Card className='secondary_card_settings' variant='outlined'> 
                    <h2>Description</h2>
                    
                    <Divider/>
                    <h2>Links (Will popup in browser)</h2>
                    <div>
                    Github Repo: <Button onClick={()=> (window.open('https://github.com/rackman404/Multimedia-Desktop-Application', '_blank', 'top=500,left=200,frame=false,nodeIntegration=no'))}>Link
                    </Button>
                    </div>
                   
                    <div>
                    Github Profile: <Button onClick={()=> (window.open('https://github.com/rackman404', '_blank', 'top=500,left=200,frame=false,nodeIntegration=no'))}>Link</Button>
                    </div>

                    <div>
                    Linkedin: <Button onClick={()=> (window.open('https://www.linkedin.com/in/jacky-zhang404', '_blank', 'top=500,left=200,frame=false,nodeIntegration=no'))}>Link</Button>
                    </div>
                    

                    <Divider/>
                    <h2>Application Information</h2>

                    <Typography noWrap component="div">Current Version: V0.1.0-Alpha-Unsecure</Typography>
                    <Typography noWrap component="div">Version Publication Date: Undefined</Typography>

                </Card>

                </div>

            </Card>
        </div>
    )
  };
export default Layout;