import { Card, FormControl, InputLabel, Select, TextField, Button, Divider, ListItemText, LinearProgress, SelectChangeEvent, MenuItem, Menu, Checkbox, Popper, Box } from "@mui/material";
import { ActiveSongListState, ColumnEnumArray, SearchEnumArray, SongColumnTypes, SongMetaDataSimple, SongSearchTypeState } from "../../../../../types";
import { useState } from "react";
import './SongTable.css';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { useSelectedSongStore } from "../../../../state_stores/MusicStateStores";
import { IPCMethodAPI, ServicesEnum } from "../../../../../typesIPC";

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

  setTableDisabledRef: (state: boolean) => void

  isPlaylistTableRef: boolean

  inSearchModeRef: boolean
  setInSearchModeRef: (state: boolean) => void
};

const FONTSCALE = "0.75vw";

export const SongTableTopBar = ({scrollToElementInTableRef, currentSongIDRef, infoCardSongIDRef, isDisabledRef, setAutoFocusRef, autoFocusRef, expandHeaderStateRef, setExpandHeaderStateRef, selectSongsRef, setColumnOnRef, columnOnRef, setTableDisabledRef, isPlaylistTableRef, inSearchModeRef, setInSearchModeRef}: SongTableTopBarProps) => { 
    const[search, setSearch] = useState(SongSearchTypeState.Name);

    const[anchor, setAnchor] = useState<any>(null);
    const[dropDownState, setDropDownState] = useState<boolean>(false); 

    const[refreshButtonState, setRefreshButtonState] = useState<boolean>(false);
    const[searchButtonState, setSearchButtonState] = useState<boolean>(false);

    const [searchValue, setSearchValue] = useState('');

    const handleSearchChange = (event: SelectChangeEvent) => {
        setSearch(event.target.value as SongSearchTypeState);
    };

    const setSelectedPlayMetaData = useSelectedSongStore((state) => state.setSelectedPlaySongMetaData);

    const setAllMetaData = useSelectedSongStore((state) => state.setAllSongMetaData);
    const setActiveSongListState = useSelectedSongStore((state) => state.setActiveSongListState);
    
    async function RefreshMetaData(){
        ResetSearch();
        
        setAllMetaData(null);
        setRefreshButtonState(true);
        setTableDisabledRef(true);
        if (isPlaylistTableRef == false){
            const result = await window.electron.ipcRenderer.invoke(ServicesEnum.audio, {service: IPCMethodAPI.AudioTwoWayIPC.getAllMetadataSimple, content: [true]});  
            setAllMetaData(result);
        }
        else{

        }
        setTableDisabledRef(false);     
        setRefreshButtonState(false);

    }

    const setSearchSongMetaData = useSelectedSongStore((state) => state.setSearchSongMetaData);
    async function SearchMetadata(){
        setSearchButtonState(true);
        setTableDisabledRef(true);
        if (isPlaylistTableRef == false){
            const result = await window.electron.ipcRenderer.invoke(ServicesEnum.audio, {service: IPCMethodAPI.AudioTwoWayIPC.searchAllSongsSimple, content: [searchValue, search]});  
            setSearchSongMetaData(result);
            setInSearchModeRef(true);
            setActiveSongListState(ActiveSongListState.SearchMain);

            setSelectedPlayMetaData({
                metadataFormat: "",
                id: 0,
                name: "",
                length: 0,
                artist: [],
                album: "",
                genre: [],
                playCount: 0,
                bitrate: 0,
                songRawPath: ""
            });
        }
        else{
            //TO DO
        }
        setTableDisabledRef(false);     
        setSearchButtonState(false);
    }

    async function ResetSearch(){
        setSearchSongMetaData([] as SongMetaDataSimple[]);
        setActiveSongListState(ActiveSongListState.Main);
        setInSearchModeRef(false);

        setSelectedPlayMetaData({
            metadataFormat: "",
            id: 0,
            name: "",
            length: 0,
            artist: [],
            album: "",
            genre: [],
            playCount: 0,
            bitrate: 0,
            songRawPath: ""
        });
    }

    return (
            <Card variant='outlined' className={expandHeaderStateRef === false ? 'top_bar_songtable' : 'top_bar_songtable_expanded'}>
              <div className='top_bar_content_songtable'>
                <div className='top_bar_content_songtable_row'>
                    <FormControl  variant="standard" sx={{width: "8vw", marginRight: "1vw", marginLeft: "1vw"}}>
                        <InputLabel >Filter By:</InputLabel>
                        <Select sx={{height: "3.5vh"}}
                        labelId="simple-select-label"
                        value={search}
                        onChange={handleSearchChange}
                        >
                            {
                                SearchEnumArray.map((val, index) => ( <MenuItem value={val}>{val}</MenuItem> ))
                            }
                        </Select>
                    </FormControl>

                    <TextField value={searchValue} id="searchfield" label="Search" variant="standard" onChange={(event: React.ChangeEvent<HTMLInputElement>) => 
                    {
                        setSearchValue(event.target.value);
                    }}
                    />          
                    <Button disabled={searchButtonState} onClick={() => SearchMetadata()}><div style={{fontSize: FONTSCALE}}>Submit</div></Button>
                    <Button onClick={() => ResetSearch()} disabled={searchButtonState}><div style={{fontSize: FONTSCALE}}>Reset Search</div></Button>
                    <Divider orientation="vertical" flexItem sx={{marginLeft: "5px", marginRight: "5px"}} />
                    <Button onClick={() => scrollToElementInTableRef(currentSongIDRef)}> <div style={{fontSize: FONTSCALE}}>Zoom To Active</div></Button>
                    <Button onClick={() => scrollToElementInTableRef(infoCardSongIDRef)}> <div style={{fontSize: FONTSCALE}}>Zoom To Selected</div></Button>
                    <Button onClick={() => autoFocusRef === false ? setAutoFocusRef(true) : setAutoFocusRef(false)}> <div style={{fontSize: FONTSCALE}}> {autoFocusRef === false ? "Enable" : "Disable"} Autozoom</div> </Button>
                    <Divider orientation="vertical" flexItem sx={{marginLeft: "5px", marginRight: "5px"}} />
                    <Button disabled={refreshButtonState} onClick={() => RefreshMetaData()}><div style={{fontSize: FONTSCALE}}> Refresh Songs </div></Button>
                    
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