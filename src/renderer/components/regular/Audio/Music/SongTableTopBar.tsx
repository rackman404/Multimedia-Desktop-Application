import { Card, FormControl, InputLabel, Select, TextField, Button, Divider, ListItemText, LinearProgress, SelectChangeEvent, MenuItem, Menu, Checkbox, Popper, Box } from "@mui/material";
import { ColumnEnumArray, SearchEnumArray, SongColumnTypes, SongSearchTypeState } from "../../../../../types";
import { useState } from "react";
import './SongTable.css';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

type SongTableTopBarProps = { //constructor variables
  scrollToElementInTableRef: (id: number) => void
  selectSongsRef: (deselect: boolean) => void

  setAutoFocusRef: (state: boolean) => void
  autoFocusRef: boolean

  setExpandHeaderStateRef: (state: boolean) => void
  expandHeaderStateRef: boolean

  currentSongIDRef: number
  infoCardSongIDRef: number

  isDisabledRef: boolean
  
  setColumnOnRef: (index: number) => void
  columnOnRef: boolean[]
};

const FONTSCALE = "0.75vw";

export const SongTableTopBar = ({scrollToElementInTableRef, currentSongIDRef, infoCardSongIDRef, isDisabledRef, setAutoFocusRef, autoFocusRef, expandHeaderStateRef, setExpandHeaderStateRef, selectSongsRef, setColumnOnRef, columnOnRef}: SongTableTopBarProps) => { 
    const[search, setSearch] = useState(SongSearchTypeState.Name);

    const[anchor, setAnchor] = useState<any>(null);
    const[dropDownState, setDropDownState] = useState<boolean>(false);


    const handleSearchChange = (event: SelectChangeEvent) => {
        setSearch(event.target.value as SongSearchTypeState);
    };

    return (
            <Card variant='outlined' className={expandHeaderStateRef === false ? 'top_bar_songtable' : 'top_bar_songtable_expanded'}>
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
                            {
                                SearchEnumArray.map((val, index) => ( <MenuItem value={val}>{val}</MenuItem> ))
                            }
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
                    
                    {/* 
                    FormControl sx={{width: "8vw", marginRight: "1vw"}}>
                        <Button onClick={(e) => {setAnchor(e.currentTarget), (setDropDownState(!dropDownState))}}>Columns <ArrowDropDownIcon/></Button>
                        <Menu anchorEl={anchor} open={dropDownState}>
                            <MenuItem defaultChecked > <Checkbox/> <ListItemText primary="Name" /> </MenuItem>
                            <MenuItem defaultChecked > <ListItemText primary="Name" /> </MenuItem>
                            <MenuItem defaultChecked > <ListItemText primary="Name" /> </MenuItem>
                        </Menu>
                    </FormControl> 

                    <Divider orientation="vertical" flexItem sx={{marginLeft: "-1.5vw", marginRight: "5px"}} />
                    */}

                    <Button onClick={(e) => {setAnchor(e.currentTarget), (setDropDownState(!dropDownState))}}> Columns {dropDownState === false ? <ArrowDropDownIcon/> : <ArrowDropUpIcon/>}</Button>
                    <Popper className="topbar_dropdown_menu" open={dropDownState} anchorEl={anchor}>
                        <Card variant='outlined' className="topbar_dropdown_content">
                            {
                                ColumnEnumArray.map((val, index) => ( <div> <Checkbox checked={columnOnRef[index]} onClick={() => {setColumnOnRef(index)}} /> {val } </div> ))
                            }
                        </Card>
                    </Popper>

                    <Divider orientation="vertical" flexItem sx={{marginLeft: "5px", marginRight: "5px"}} />

                    <Button onClick={(e) => {setExpandHeaderStateRef(!expandHeaderStateRef)}}> {expandHeaderStateRef === false ? <ArrowDropDownIcon/> : <ArrowDropUpIcon/>} </Button>
                </div>

                <Divider flexItem/>

                {
                    expandHeaderStateRef == true ?
                    <div className='top_bar_content_songtable_row'>
                        <Button onClick={(e) => {selectSongsRef(true)}}><div style={{fontSize: FONTSCALE}}>Deselect All</div></Button>
                        <Button onClick={(e) => {selectSongsRef(false)}}><div style={{fontSize: FONTSCALE}}>Select All</div></Button>
                        <Button disabled><div style={{fontSize: FONTSCALE}}>Add to Playlist(s)</div></Button>
                        <Button disabled><div style={{fontSize: FONTSCALE}}>Remove from Playlist(s)</div></Button>

                        <Divider orientation="vertical" flexItem sx={{marginLeft: "5px", marginRight: "5px"}} />
                    </div>
                    : <div/>
                }


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