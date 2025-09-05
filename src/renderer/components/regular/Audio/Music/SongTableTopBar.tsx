import { Card, FormControl, InputLabel, Select, TextField, Button, Divider, ListItemText, LinearProgress, SelectChangeEvent, MenuItem, Menu } from "@mui/material";
import { SongSearchTypeState } from "../../../../../types";
import { useState } from "react";
import './SongTable.css';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

type SongTableTopBarProps = { //constructor variables
  scrollToElementInTableRef: (id: number) => void
  setAutoFocusRef: (state: boolean) => void

  currentSongIDRef: number
  infoCardSongIDRef: number

  isDisabledRef: boolean
  autoFocusRef: boolean
  
};

const FONTSCALE = "0.75vw";

export const SongTableTopBar = ({scrollToElementInTableRef, currentSongIDRef, infoCardSongIDRef, isDisabledRef, setAutoFocusRef, autoFocusRef}: SongTableTopBarProps) => { 
    const[search, setSearch] = useState(SongSearchTypeState.Name);
    const[expandHeaderState, setExpandHeaderState] = useState(false);

    const[anchor, setAnchor] = useState<any>(null);
    const[dropDownState, setDropDownState] = useState<boolean>(false);

    const handleSearchChange = (event: SelectChangeEvent) => {
    setSearch(event.target.value as SongSearchTypeState);
    };

    return (
            <Card variant='outlined' className={expandHeaderState === false ? 'top_bar_songtable' : 'top_bar_songtable_expanded'}>
              <div className='top_bar_content_songtable'>
                <div className='top_bar_content_songtable_row'>
                <FormControl sx={{width: "8vw", marginRight: "1vw", marginLeft: "1vw", marginTop: "10px"}}>
                    <InputLabel id="simple-select-label">Filter</InputLabel>
                    <Select sx={{height: "4vh"}}
                    labelId="simple-select-label"
                    id="simple-select"
                    value={search}
                    label= "yes"
                    onChange={handleSearchChange}
                    >
                    <MenuItem value={SongSearchTypeState.Album}>{SongSearchTypeState.Album}</MenuItem>
                    <MenuItem value={SongSearchTypeState.Genre}>{SongSearchTypeState.Genre}</MenuItem>
                    <MenuItem value={SongSearchTypeState.Name}>{SongSearchTypeState.Name}</MenuItem>
                    </Select>
                </FormControl>

                <TextField id="searchfield" label="Search" variant="standard" />          
                <Button disabled><div style={{fontSize: FONTSCALE}}>Submit</div></Button>
                <Button disabled><div style={{fontSize: FONTSCALE}}>Reset Search</div></Button>
                <Divider orientation="vertical" flexItem sx={{marginLeft: "5px", marginRight: "5px"}} />
                <Button onClick={() => scrollToElementInTableRef(currentSongIDRef)}> <div style={{fontSize: FONTSCALE}}>Zoom To Active</div></Button>
                <Button onClick={() => scrollToElementInTableRef(infoCardSongIDRef)}> <div style={{fontSize: FONTSCALE}}>Zoom To Selected</div></Button>
                <Button onClick={() => autoFocusRef === false ? setAutoFocusRef(true) : setAutoFocusRef(false)}> <div style={{fontSize: FONTSCALE}}> {autoFocusRef === false ? "Enable" : "Disable"} Autozoom</div> </Button>
                <Divider orientation="vertical" flexItem sx={{marginLeft: "5px", marginRight: "5px"}} />
                <Button disabled><div style={{fontSize: FONTSCALE}}> Force Reload Song List</div></Button>
                
                <Divider orientation="vertical" flexItem sx={{marginLeft: "5px", marginRight: "5px"}} />
                
                <FormControl sx={{width: "8vw", marginRight: "1vw"}}>
                    <Button disabled onClick={(e) => {setAnchor(e.currentTarget), setDropDownState(true)}}>Columns <ArrowDropDownIcon/></Button>
                    <Menu anchorEl={anchor} open={dropDownState}>
                    <MenuItem defaultChecked > <ListItemText primary="Name" /> </MenuItem>
                    <MenuItem defaultChecked > <ListItemText primary="Name" /> </MenuItem>
                    <MenuItem defaultChecked > <ListItemText primary="Name" /> </MenuItem>
                    </Menu>
                </FormControl>

                <Divider orientation="vertical" flexItem sx={{marginLeft: "-1.5vw", marginRight: "5px"}} />

                <Button onClick={(e) => {setExpandHeaderState(!expandHeaderState)}}> {expandHeaderState === false ? <ArrowDropDownIcon/> : <ArrowDropUpIcon/>} </Button>
                </div>

                <Divider/>

                <div className='top_bar_content_songtable_row'>
                    Placeholder
                </div>

              </div>

              {isDisabledRef === true ? <LinearProgress/> : null
                
              }
      
              {/*
              <FormControl sx={{height: "2.2vh"}}>
                f
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={0}
                  label="Age"
                  onChange={() => {}}
                  >
                  <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
                  <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
                  <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
                </Select>
              </FormControl>
              */} 
          </Card>
    )
}