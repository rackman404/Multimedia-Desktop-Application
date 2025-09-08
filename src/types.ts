
export type SongMetaData = {
    //OS metadata
    format: string
    fileSize: number //should be in mb

    //Format specific metadata
    metadataFormat: string,
    id: number,
    name: string,
    length: number, //in seconds
    artist: string[],
    album: string,
    genre: string[],
    playCount: number,
    bitrate: number, //in kbps (-1 if no bitrate can be provided)

    coverImage: any
    coverImageFormat: string

    //misc data
    songRawPath: string,
    comment: string

}

//simplified for performance
export type SongMetaDataSimple = {
    //Format specific metadata
    metadataFormat: string,
    id: number,
    name: string,
    length: number, //in seconds
    artist: string[],
    album: string,
    genre: string[],
    playCount: number,
    bitrate: number, //in kbps (-1 if no bitrate can be provided)

    //misc data
    songRawPath: string,
}

export type NyaaWebData = {
    title: string;
    magnet : string;
    size: string;
    dateCreated : string;
    leechers: number;
    seeders: number;
    totalDownloads: number;
}

export type SongLyricAPIData = {
    timestamps: number[]
    lyrics: string[]
    isInstrumental: boolean
}


export type IPCData = {
    type: string
    content: string 
}


/* peristent settings */
export type SettingParameters = {
    GeneralSettings: GeneralSettingParameters,
    MusicSettings: MusicSettingParameters
}

/* peristent settings */
export type GeneralSettingParameters = {
    //main window settings
    fullscreenState: boolean
    networkState: boolean

    //misc settings
    discordRichPresenceState: boolean
}

export type MusicSettingParameters = {
    //Lyrics
    DeepLKey: string,

    DefaultLyricOffset: number,
    DefaultOffstepIncrement: number,
}

export const DefaultMusicSettingParameters: MusicSettingParameters = {
    DeepLKey: " ",
    DefaultLyricOffset: 0,
    DefaultOffstepIncrement: 0
}

export const DefaultGeneralSettingParameters: GeneralSettingParameters = {
    fullscreenState: false,
    networkState: true,
    discordRichPresenceState: false

}

export const DefaultSettingParameters: SettingParameters = {
    GeneralSettings: DefaultGeneralSettingParameters,
    MusicSettings: DefaultMusicSettingParameters
}

/* peristent settings */


 
export enum ViewState {
    Dashboard,
    Music,
    Video,
    Comic,
    Settings,
}


export type DeepLStatistics = {
    characterUsage: string;
    deepLConnectionStatus: string;
}

//for use by song table view selection ---
export enum ActiveSongListState {
    Main,
    SearchMain,
    Playlist,
    SearchPlaylist
}

export enum SongSearchTypeState {
    Artist = "Artist",
    Name = "Name",
    Genre = "Genre",
    Album = "Album"
}

export enum SongColumnTypes {
    Select = "Select",
    Playing = "Playing",
    Name = "Name",
    Length = "Length",
    Artist = "Artist",
    Genre = "Genre",
    Bitrate = "Bitrate",
    InternalID = "Internal ID"
}

export const ColumnEnumArray: SongColumnTypes[] = Object.keys(SongColumnTypes) as SongColumnTypes[];
export const SearchEnumArray: SongSearchTypeState[] = Object.keys(SongSearchTypeState) as SongSearchTypeState[];

/*
//https://stackoverflow.com/questions/62082215/typescript-map-all-enum-values-as-key
export const SongSearchTypeStateMap: Record<SongSearchTypeState, string> = {
    [SongSearchTypeState.Artist]: "Artist",
    [SongSearchTypeState.Name]: "Name",
    [SongSearchTypeState.Genre]: "Genre",
    [SongSearchTypeState.Album]: "Album"
};
*/
// ---