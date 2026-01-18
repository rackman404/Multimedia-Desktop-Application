import { create } from 'zustand'
import { ActiveSongListState, SongLyricAPIData, SongMetaData, SongMetaDataSimple, SupportedRomanizationOptions } from '../../types'

import placeholderImage from '../../../assets/music_no_thumbnail.png';

interface ISelectedSongState {
  selectedPlaySongMetaData: SongMetaDataSimple
  setSelectedPlaySongMetaData: (newSelectedPlaySongMetaData: SongMetaDataSimple) => void

  allSongMetaData: SongMetaDataSimple[] | null
  setAllSongMetaData: (newAllSongMetaData: SongMetaDataSimple[] | null) => void

  searchSongMetaData: SongMetaDataSimple[] | null
  setSearchSongMetaData: (newSearchSongMetaData: SongMetaDataSimple[] | null) => void

  playListSongMetaData: SongMetaDataSimple[] | null
  setPlayListSongMetaData: (newPlayListSongMetaData: SongMetaDataSimple[] | null) => void

  searchPlayListSongMetaData: SongMetaDataSimple[] | null
  setSearchplayListSongMetaData: (newSearchPlayListSongMetaData: SongMetaDataSimple[] | null) => void

  activeSongListState: ActiveSongListState
  setActiveSongListState: (newActiveSongListState: ActiveSongListState) => void

  currentlySelectedSongList: SongMetaDataSimple[] | null
  setCurrentlySelectedSongList: (currentlySelectedSongList: SongMetaDataSimple[] | null) => void

  playState: boolean
  setPlayState: (newPlayState: boolean) => void
  currentSeek: number
  setCurrentSeek: (newCurrentSeek: number) => void
  currentVolume: number
  setCurrentVolume: (newCurrentVolume: number) => void

  currentPlayer: Howl | null
  setCurrentPlayer: (newPlayer: Howl | null) => void

  shuffleState: boolean
  setShuffleState: (newshuffleState: boolean) => void

  loopState: boolean
  setLoopState: (newLoopState: boolean) => void

  fullscreenState: boolean
  setFullscreenState: (newFullScreenState: boolean) => void

  thumbnailString: string
  setThumbnailString: (newThumbnalString: string) => void

  lyricOffset: number
  setLyricOffset: (lyricOffset: number) => void
  currentLyricData: SongLyricAPIData
  setCurrentLyricData: (newCurrentLyricData: SongLyricAPIData) => void
  currentTranslatedLyricData: SongLyricAPIData
  setCurrentTranslatedLyricData: (currentTranslatedLyricData: SongLyricAPIData) => void

  currentPhoneticLyricData: SongLyricAPIData
  setCurrentPhoneticLyricData: (currentPhoneticLyricData: SongLyricAPIData) => void

  analyserNode: AnalyserNode | null
  setAnalyserNode: (analyserNode: AnalyserNode) => void
}

export const useSelectedSongStore = create<ISelectedSongState>((set) => ({
  selectedPlaySongMetaData: {
    metadataFormat: '',
    id: 0,
    name: '',
    length: 0,
    artist: [],
    album: '',
    genre: [],
    playCount: 0,
    bitrate: 0,
    songRawPath: '',
    comments: ''
  },
  setSelectedPlaySongMetaData: (newSelectedPlaySongMetaData) =>set((state) => ({ selectedPlaySongMetaData: newSelectedPlaySongMetaData })),
  playState: false, 
  setPlayState: (newPlayState) =>set((state) => ({ playState: newPlayState })),
  currentSeek: 0, 
  setCurrentSeek: (newCurrentSeek) =>set((state) => ({ currentSeek: newCurrentSeek })),
  currentVolume: 100,
  setCurrentVolume: (newCurrentVolume) =>set((state) => ({ currentVolume: newCurrentVolume })),
  currentPlayer: null, 
  setCurrentPlayer: (newPlayer) =>set((state) => ({ currentPlayer: newPlayer })),

  allSongMetaData: null, 
  setAllSongMetaData: (newAllSongMetaData) =>set((state) => ({ allSongMetaData: newAllSongMetaData })),
  searchSongMetaData: null, 
  setSearchSongMetaData: (newSearchSongMetaData) =>set((state) => ({ searchSongMetaData: newSearchSongMetaData })),
  playListSongMetaData: null, 
  setPlayListSongMetaData: (newPlayListSongMetaData) =>set((state) => ({ playListSongMetaData: newPlayListSongMetaData })),
  searchPlayListSongMetaData: null, 
  setSearchplayListSongMetaData: (newSearchPlayListSongMetaData) =>set((state) => ({ searchPlayListSongMetaData: newSearchPlayListSongMetaData })),

  activeSongListState: ActiveSongListState.Main, 
  setActiveSongListState: (newActiveSongListState) =>set((state) => ({ activeSongListState: newActiveSongListState })),
  currentlySelectedSongList: null,
  setCurrentlySelectedSongList: (newCurrentlySelectedSongList) =>set((state) => ({ currentlySelectedSongList: newCurrentlySelectedSongList })),

  shuffleState: false, 
  setShuffleState: (newshuffleState) =>set((state) => ({ shuffleState: newshuffleState })),
  loopState: false, 
  setLoopState: (newLoopState) =>set((state) => ({ loopState: newLoopState })),
  fullscreenState: false, 
  setFullscreenState: (newFullScreenState) =>set((state) => ({ fullscreenState: newFullScreenState })),
  thumbnailString: placeholderImage, 
  setThumbnailString: (newThumbnalString) =>set((state) => ({ thumbnailString: newThumbnalString })),

  lyricOffset: 0, 
  setLyricOffset: (newLyricOffset) =>set((state) => ({ lyricOffset: newLyricOffset })),

  currentLyricData: {
    timestamps: [],
    lyrics: [],
    isInstrumental: false,
    statusCode: 0,
    language: SupportedRomanizationOptions.Indeterminate,
    local: false,
    romanization: undefined
  }, 
  setCurrentLyricData: (newCurrentLyricData) =>set((state) => ({ currentLyricData: newCurrentLyricData })),
  
  currentTranslatedLyricData: {
    timestamps: [],
    lyrics: [],
    isInstrumental: false,
    statusCode: 0,
    language: SupportedRomanizationOptions.Indeterminate,
    local: false,
    romanization: undefined
  }, 
  setCurrentTranslatedLyricData: (newCurrentTranslatedLyricData) =>set((state) => ({ currentTranslatedLyricData: newCurrentTranslatedLyricData })),

  currentPhoneticLyricData: {
    timestamps: [],
    lyrics: [],
    isInstrumental: false,
    statusCode: 0,
    language: SupportedRomanizationOptions.Indeterminate,
    local: false,
    romanization: undefined
  }, 
  setCurrentPhoneticLyricData: (newCurrentPhoneticLyricData) =>set((state) => ({ currentPhoneticLyricData: newCurrentPhoneticLyricData })),

  analyserNode: null, 
  setAnalyserNode: (newAnalyserNode) =>set((state) => ({ analyserNode: newAnalyserNode })),
}))
