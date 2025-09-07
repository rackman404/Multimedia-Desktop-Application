//file for defined ipc method invocation types/enums (instead of using strings)

export enum SettingsOneWayIPC {
    network,
    fullscreen,
    exit,
}

export enum SettingsTwoWayIPC {
    getParameters
}

export type SettingsIPC = {
    oneWay: SettingsOneWayIPC
    twoWay: SettingsTwoWayIPC
}

/*
export enum MusicOneWayIPC {
    placeholder
}

export enum MusicTwoWayIPC {
    getAllMetadataSimple,
    getSelectedMetadataFull,
    externalLyrics,
    externalTranslatedLyrics,
    externalDeepLStats
}

export type MusicIPC = {
    oneWay: MusicOneWayIPC
    twoWay: MusicTwoWayIPC
}

export enum DiscordOneWayIPC {
    enableClient,
    disableClient,
    songNotification
}

export enum DiscordTwoWayIPC {
    clientStatus
}

export type DiscordIPC = {
    oneWay: DiscordOneWayIPC
    twoWay: DiscordTwoWayIPC
}
*/

export type IPCServicesInterface = {
    settings: SettingsIPC
}


export enum ServicesEnum {
    settings = 'settings',
    audio = 'audio',
    discord = 'ipc-example',
    ipcExample = 'ipc-example',
}