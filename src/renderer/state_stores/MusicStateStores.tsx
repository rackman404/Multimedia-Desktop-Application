import { create } from 'zustand'
import { SongMetaData, SongMetaDataSimple } from '../../types'

interface ISelectedSongState {
  selectedPlaySongMetaData: SongMetaDataSimple
  setSelectedPlaySongMetaData: (newSelectedPlaySongMetaData: SongMetaDataSimple) => void

  allSongMetaData: SongMetaDataSimple[] | null
  setAllSongMetaData: (newAllSongMetaData: SongMetaDataSimple[] | null) => void

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
}

export const useSelectedSongStore = create<ISelectedSongState>((set) => ({
  selectedPlaySongMetaData: {
    format: '',
    fileSize: 0,
    metadataFormat: '',
    id: 0,
    name: '',
    length: 0,
    artist: [],
    album: '',
    genre: [],
    playCount: 0,
    bitrate: 0,
    coverImage: '',
    coverImageFormat: '',
    songRawPath: '',
    comment: ''
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
  shuffleState: false, 
  setShuffleState: (newshuffleState) =>set((state) => ({ shuffleState: newshuffleState })),
  loopState: false, 
  setLoopState: (newLoopState) =>set((state) => ({ loopState: newLoopState }))
}))
