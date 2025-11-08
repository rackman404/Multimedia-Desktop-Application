import React, { useState, useEffect, useCallback } from 'react';
import './AudioUtilFFMpeg.css';
import './../../App.css';

import { FileBrowser, FileSongMetaDataSimple } from '../../components/regular/AudioUtils/FileBrowser';
import { DEFAULTSONGMETADATA, DEFAULTSONGMETADATASIMPLE, SongMetaData, SongMetaDataSimple } from '../../../types';
import { ServicesEnum, IPCMethodAPI, IPCServicesMessageReturnInterface, IPCReturnMethodAPI } from '../../../typesIPC';
import { FFmpegConsoleLog } from '../../components/regular/AudioUtils/FFmpegConsoleLog';
import { SongInfoHorizontalCard } from '../../components/regular/AudioUtils/SongInfoHorizontalCard';
import { FFmpegParameters } from '../../components/regular/AudioUtils/FFmpegParameters';
import { FFmpegButtonPanel } from '../../components/regular/AudioUtils/FFmpegButtonPanel';

export const Layout = () => {
  //temp shit from backend
  const [songList, setSongList] = useState<SongMetaDataSimple[][]>([[DEFAULTSONGMETADATASIMPLE],[DEFAULTSONGMETADATASIMPLE]]);
  const [fileSongList, setFileSongList] = useState<FileSongMetaDataSimple[][]>([[{
    id: 1,
    name: '',
    songRawPath: '',
    duplicated: false
  }],[{
    id: 1,
    name: '',
    songRawPath: '',
    duplicated: false
  }]]);

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

  //https://github.com/reZach/secure-electron-template/issues/43
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
    var dat = JSON.parse(JSON.stringify(result)) as SongMetaDataSimple[][]; // we must do this to deep copy a new array as otherwise this component would not update
    

    //absoulte dogshit code in wrong place for handing converted song detection, improve this in later build ---------
    var fileSongList = [[],[]] as FileSongMetaDataSimple[][];
    
    console.log(dat[0].length);
    console.log(dat[1].length);

    for (var i = 0;  dat[0].length > i ; i++){
      fileSongList[0].push({
        id: dat[0][i].id,
        name: dat[0][i].name,
        songRawPath: dat[0][i].songRawPath,
        duplicated: false
      })
    }

    for (var i = 0; dat[1].length > i; i++){
      fileSongList[1].push({
        id: dat[1][i].id,
        name: dat[1][i].name,
        songRawPath: dat[1][i].songRawPath,
        duplicated: false
      })
    }

    console.log("tes");

    function getLastPath (path: string): string | undefined {
        const paths = path.split("\\"); 
        return paths.pop() || paths.pop();
    }

    for (var i = 0; fileSongList[0].length > i; i++){
      
      for (var j = 0; fileSongList[1].length > j; j++){
        console.log(getLastPath(fileSongList[0][i].songRawPath) + " " + getLastPath(fileSongList[1][j].songRawPath));
        if (getLastPath(fileSongList[0][i].songRawPath) == getLastPath(fileSongList[1][j].songRawPath)){
          
          fileSongList[0][i].duplicated = true;
        }
      }
    }

    //absoulte dogshit code in wrong place for handing converted song detection, improve this in later build ---------

    setFileSongList(fileSongList);
    setSongList(dat);
  }




    useEffect(() => {//initial load
        console.log("LOADING MUSIC DATA");

        const onEventHandler = window.electron.ipcRenderer.on(ServicesEnum.audioEdit, listenerFunc);
        //listenerFunc();
        refreshSongs();


        return () => {//for removing event listener, NOTE: theoretically we could just remove all event listeners on this main component here? (since all components are unmounted at this point)
            if (onEventHandler) onEventHandler();
        }
        
    }, []); 



  return (
      <div className='content_audioutil_ffmpeg' style={{animation:  "fadeIn 0.5s"}}>
        <div className='content_audioutil_layout'>
          <div>
            <FileBrowser rows={fileSongList[0]} rawRows={songList[0]} showDuplicate={true} selectedSongFunction={setSelected}/>
            <FileBrowser rows={fileSongList[1]} rawRows={songList[1]} showDuplicate={false} selectedSongFunction={setSelected}/>
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