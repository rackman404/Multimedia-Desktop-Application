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

  currentPlayer: Howl | null
  setCurrentPlayer: (newPlayer: Howl | null) => void
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
  playState: false, //note that this causes a trailing garbage error, likely hard
  setPlayState: (newPlayState) =>set((state) => ({ playState: newPlayState })),
  currentSeek: 0, //note that this causes a trailing garbage error, likely hard
  setCurrentSeek: (newCurrentSeek) =>set((state) => ({ currentSeek: newCurrentSeek })),
  currentPlayer: null, //note that this causes a trailing garbage error, likely hard
  setCurrentPlayer: (newPlayer) =>set((state) => ({ currentPlayer: newPlayer })),
  allSongMetaData: null, //note that this causes a trailing garbage error, likely hard
  setAllSongMetaData: (newAllSongMetaData) =>set((state) => ({ allSongMetaData: newAllSongMetaData }))
}))
