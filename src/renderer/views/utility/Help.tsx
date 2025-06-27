import './Help.css';
import React, { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import { Button, ButtonGroup, Chip, createTheme, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Switch, ThemeProvider, useColorScheme } from '@mui/material';
import { ipcRenderer } from 'electron';
import { RegularButton } from '../../elements/CustomButtons';

export const Layout = () => {
    return (
        <div className='page_content_help'>

             <Card className='card_help' variant='outlined'> 
                <h1>About</h1>

                <div className='column_help'>

                    <Card className='secondary_card_settings' variant='outlined'> 
                        
                        <div>
                        Find any Bugs or require assistance? <Button onClick={()=> (window.open('https://github.com/rackman404/Multimedia-Desktop-Application/issues', '_blank', 'top=500,left=200,frame=false,nodeIntegration=no'))}>Github Issues Link
                        </Button>
                        </div>
                    </Card>

                </div>

            </Card>


            
        </div>
    )
  };
export default Layout;