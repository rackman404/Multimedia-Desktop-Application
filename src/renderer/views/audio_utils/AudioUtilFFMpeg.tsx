import React, { useState, useEffect, useCallback } from 'react';
import './AudioUtilFFMpeg.css';
import './../../App.css';

import { FileBrowser } from '../../components/regular/AudioUtils/FileBrowser';
import { DEFAULTSONGMETADATA, DEFAULTSONGMETADATASIMPLE, SongMetaData, SongMetaDataSimple } from '../../../types';
import { ServicesEnum, IPCMethodAPI, IPCServicesMessageReturnInterface, IPCReturnMethodAPI } from '../../../typesIPC';
import { FFmpegConsoleLog } from '../../components/regular/AudioUtils/FFmpegConsoleLog';
import { SongInfoHorizontalCard } from '../../components/regular/AudioUtils/SongInfoHorizontalCard';
import { FFmpegParameters } from '../../components/regular/AudioUtils/FFmpegParameters';
import { FFmpegButtonPanel } from '../../components/regular/AudioUtils/FFmpegButtonPanel';

export const Layout = () => {
  //temp shit from backend
  const [songList, setSongList] = useState<SongMetaDataSimple[][]>([[DEFAULTSONGMETADATASIMPLE],[DEFAULTSONGMETADATASIMPLE]]);

  /* old version of event handler
  function listenerFunc(){
    //Main to Renderer update
    window.electron.ipcRenderer.on(ServicesEnum.audioEdit, (value) => { //should probably directly return new song results intstead of this
        var content = value as IPCServicesMessageReturnInterface;

        if (content.service == IPCReturnMethodAPI.AudioReturnIPC.returnSongList){
          console.log("PROCESS FINISHED, REFRESHING SONG LIST");
          refreshSongs();
        }
    })
  }
  */

  const listenerFunc = (value: any) => {
    var content = value as IPCServicesMessageReturnInterface;

    if (content.service == IPCReturnMethodAPI.AudioReturnIPC.returnSongList){
      console.log("PROCESS FINISHED, REFRESHING SONG LIST");
      refreshSongs();
    }
  };

  useEffect(() => {//initial load
    console.log("LOADING MUSIC DATA");

    const onEventHandler = window.electron.ipcRenderer.on(ServicesEnum.audioEdit, listenerFunc);
    //listenerFunc();
    refreshSongs();


    return () => {//for removing event listener, NOTE: theoretically we could just remove all event listeners on this main component here? (since all components are unmounted at this point)
      if (onEventHandler) onEventHandler();
    }
      
  }, []); 

  //actual data
  const [selectedSong, setSelectedSong] = useState<SongMetaData>(DEFAULTSONGMETADATA);

  async function setSelected(sMetaData: SongMetaDataSimple){
    const result = await window.electron.ipcRenderer.invoke(ServicesEnum.audio, {service: IPCMethodAPI.AudioTwoWayIPC.getSelectedMetadataFull, content: [sMetaData.id, sMetaData.songRawPath]}) as SongMetaData;
    setSelectedSong(result);
  }

  async function refreshSongs(){
    const result = await window.electron.ipcRenderer.invoke(ServicesEnum.audioEdit, {service: IPCMethodAPI.AudioEditTwoWayIPC.getSongFiles, content: []});
    var dat = JSON.parse(JSON.stringify(result)); // we must do this to deep copy a new array as otherwise this component would not update
    setSongList(dat);
  }



  return (
      <div className='content_audioutil_ffmpeg' style={{animation:  "fadeIn 0.5s"}}>
        <div className='content_audioutil_layout'>
          <div>
            <FileBrowser rows={songList[0]} rawRows={songList[0]} selectedSongFunction={setSelected}/>
            <FileBrowser rows={songList[1]} rawRows={songList[1]} selectedSongFunction={setSelected}/>
            <SongInfoHorizontalCard sMetaDataFull={selectedSong}/>
          </div>

          <div >
            <FFmpegParameters sMetaDataFull={selectedSong}/>
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