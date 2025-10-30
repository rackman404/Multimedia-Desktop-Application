import React, { useState, useEffect } from 'react';
import './AudioUtilFFMpeg.css';
import './../../App.css';

import { FileBrowser } from '../../components/regular/AudioUtils/FileBrowser';
import { DEFAULTSONGMETADATA, DEFAULTSONGMETADATASIMPLE, SongMetaData, SongMetaDataSimple } from '../../../types';
import { ServicesEnum, IPCMethodAPI } from '../../../typesIPC';
import { FFmpegConsoleLog } from '../../components/regular/AudioUtils/FFmpegConsoleLog';
import { SongInfoHorizontalCard } from '../../components/regular/AudioUtils/SongInfoHorizontalCard';
import { FFmpegParameters } from '../../components/regular/AudioUtils/FFmpegParameters';
import { FFmpegButtonPanel } from '../../components/regular/AudioUtils/FFmpegButtonPanel';

export const Layout = () => {
  //temp shit from backend
  const [songList, setSongList] = useState<SongMetaDataSimple[]>([DEFAULTSONGMETADATASIMPLE]);

  //actual data
  const [selectedSong, setSelectedSong] = useState<SongMetaData>(DEFAULTSONGMETADATA);

  async function setSelected(sMetaData: SongMetaDataSimple){
    const result = await window.electron.ipcRenderer.invoke(ServicesEnum.audio, {service: IPCMethodAPI.AudioTwoWayIPC.getSelectedMetadataFull, content: [sMetaData.id, sMetaData.songRawPath]}) as SongMetaData;
    setSelectedSong(result);
  }

  async function refreshSongs(){
    //PLACEHOLDER
  }


  useEffect(() => {//initial load
  
      (async () => {
          console.log("LOADING MUSIC DATA");
          const result = await window.electron.ipcRenderer.invoke(ServicesEnum.audioEdit, {service: IPCMethodAPI.AudioEditTwoWayIPC.getSongFiles, content: []});
          //setMetaData(result);         
          setSongList(result);
      })();
      
  }, []); 

    return (
        <div className='content_audioutil_ffmpeg' style={{animation:  "fadeIn 0.5s"}}>
          <div className='content_audioutil_layout'>
            <div>
              <FileBrowser rows={songList} rawRows={songList} selectedSongFunction={setSelected}/>
              <SongInfoHorizontalCard sMetaDataFull={selectedSong}/>
              
            </div>

            <div >
              <FFmpegParameters/>
              <div className='console_buttons_layout_audioutil'>
                <FFmpegConsoleLog/>
                <FFmpegButtonPanel/>
              </div>
              
              
              
            </div>

          </div>
          
        </div>
    )
  };
export default Layout;