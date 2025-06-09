import { create } from 'zustand'
import { SongMetaData } from '../../types'

interface ISelectedSongState {
  selectedPlaySongMetaData: SongMetaData
  setSelectedPlaySongMetaData: (newSelectedPlaySongMetaData: SongMetaData) => void
  playState: boolean
  setPlayState: (newPlayState: boolean) => void
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
  setPlayState: (newPlayState) =>set((state) => ({ playState: newPlayState }))
}))
