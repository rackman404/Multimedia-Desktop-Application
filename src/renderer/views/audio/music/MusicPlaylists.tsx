import React, { useState, useEffect } from 'react';
import './MusicPlaylists.css';
import { ActiveSongListState, SongMetaDataSimple } from '../../../../types';
import { useSelectedSongStore } from '../../../state_stores/MusicStateStores';
import { SongLyricCard } from '../../../components/regular/Audio/Music/SongLyricCard';
import { SongInfoCard } from '../../../components/regular/Audio/Music/SongInfoCard';
import { SongTable } from '../../../components/regular/Audio/Music/SongTable';

export const Layout = () => {
   const [metaData, setMetaData] = useState<SongMetaDataSimple[] | null>(null);
  
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
    //https://stackoverflow.com/questions/65827305/passing-a-component-to-the-usestate-hook
    const [secondaryCard, setSecondaryCard] = useState(() => <SongLyricCard key={selectedPlayMetaData.name} sMetaData={selectedPlayMetaData}/>);

    const setActiveSongListState = useSelectedSongStore((state) => state.setActiveSongListState);

    useEffect(() => {//initial load
          setActiveSongListState(ActiveSongListState.Playlist);
    });

    return (
        <div className='content_musicplaylists'>
          <div>
            <SongInfoCard key={selectedInfoCardMetaData.id} sMetaData={selectedInfoCardMetaData} />
            {secondaryCard}
          </div>

          <SongTable isPlaylistTable={true} sMetaData={metaData} selectedInfoCardFunction={setSelectedInfoCardMetaData} selectedPlayDataFunction={setSelectedPlayMetaData}/>
        </div>
    )
  };
export default Layout;