import React, { useState, useEffect } from 'react';
import './../../../css/audio/MusicHome.css';
import { LeftAudioSidebar } from '../../../components/static/Audio/Music/LeftAudioSidebar';
import { SongTable } from '../../../components/regular/Audio/Music/SongTable';
import { SongInfoCard } from '../../../components/regular/Audio/Music/SongInfoCard';
import { SongEditCard } from '../../../components/regular/Audio/Music/SongEditCard';
import { SongMetaData, SongMetaDataSimple } from '../../../../types';
import { useSelectedSongStore } from '../../../state_stores/MusicStateStores';
import { SongLyricCard } from '../../../components/regular/Audio/Music/SongLyricCard';
import { RegularButton } from '../../../elements/CustomButtons';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Card, Paper } from '@mui/material';

export const Layout = () => {


    const [metaData, setMetaData] = useState<SongMetaDataSimple[]>([{
        name: "NO MUSIC",
        metadataFormat: '',
        id: 0,
        length: 0,
        artist: [],
        genre: [],
        playCount: 0,
        bitrate: 0,
        songRawPath: '',
        album: ''
    }]);

    const [selectedInfoCardMetaData, setSelectedInfoCardMetaData] = useState<SongMetaDataSimple>({
        name: "NO MUSIC",
        metadataFormat: '',
        id: 0,
        length: 0,
        artist: [],
        genre: [],
        playCount: 0,
        bitrate: 0,
        songRawPath: '',
        album: ''
    });

    const selectedPlayMetaData = useSelectedSongStore((state) => state.selectedPlaySongMetaData);
    const setSelectedPlayMetaData = useSelectedSongStore((state) => state.setSelectedPlaySongMetaData);
    const setAllMetaData = useSelectedSongStore((state) => state.setAllSongMetaData);
    const [refreshState, setRefreshState] = useState(false);
    const [secondaryCard, setSecondaryCard] = useState(<SongLyricCard sMetaData={selectedInfoCardMetaData}/>);



    useEffect(() => {//initial load
        (async () => {
            console.log("LOADING MUSIC DATA");
            const result = await window.electron.ipcRenderer.invoke('audio', ["get_all_metadata_simple"]);
            setMetaData(result);         
            setAllMetaData(result);
    })();
        
    }, []); 

    useEffect(() => {
        setSelectedInfoCardMetaData(selectedPlayMetaData);
        
    }, [selectedPlayMetaData, metaData]); 

    
    useEffect(() => {
        const interval = setInterval(async () => {  
            if (refreshState == true){
                
            }

        }, 1000);

        return () => clearInterval(interval);
    }, [refreshState]); 
    
    function setSecondaryLyric(){
        setSecondaryCard(<SongLyricCard sMetaData={selectedInfoCardMetaData}/>);
    }

    function setSecondaryEdit(){
        setSecondaryCard(<SongEditCard/>);
    }

    return (
        <div className='content_musichome'>
            <div>
                <div className='access_button_row_musichome'>
                    <RegularButton onClick={setSecondaryLyric} style={{height: '20px', width: '10vw'}}>Lyrics</RegularButton>
                    <RegularButton onClick={setSecondaryEdit} style={{height: '20px', width: '10vw'}}>Edit Metadata</RegularButton>
                </div> 
                <SongInfoCard sMetaData={selectedInfoCardMetaData} />
                {secondaryCard}
            </div>
            
            <SongTable sMetaData={metaData} selectedInfoCardFunction={setSelectedInfoCardMetaData} selectedPlayDataFunction={setSelectedPlayMetaData}/>
            
        </div>
    )
  };
export default Layout;