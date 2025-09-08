//file for defined ipc method invocation types/enums (instead of using strings)

export namespace IPCMethodAPI{
    export enum SettingsOneWayIPC {
        network,
        fullscreen,
        exit,
    }

    export enum SettingsTwoWayIPC {
        getParameters
    }

    export enum AudioOneWayIPC {
        placeholder
    }

    export enum AudioTwoWayIPC {
        getAllMetadataSimple,
        getSelectedMetadataFull,
        externalLyrics,
        externalTranslatedLyrics,
        externalDeepLStats,

        //song search
        searchAllSongsSimple,
        searchPlaylistSongsSimple
    }

    export enum DiscordOneWayIPC {
        enableClient,
        disableClient,
        songNotification
    }

    export enum DiscordTwoWayIPC {
        clientStatus
    }
}

export type IPCServicesMessageInterface = {
    //service: IPCServicesInterface //which service's methods to use
    service: IPCMethodAPI.SettingsOneWayIPC | 
    IPCMethodAPI.SettingsTwoWayIPC | 
    IPCMethodAPI.DiscordOneWayIPC | 
    IPCMethodAPI.DiscordTwoWayIPC | 
    IPCMethodAPI.AudioOneWayIPC | 
    IPCMethodAPI.AudioTwoWayIPC 

    content: any[] //the content to send to method
}

/*
export type IPCServicesMessageReturnInterface = {
    code: any
    content: any[] //the content to send to method
}
*/


export enum ServicesEnum {
    settings = 'settings',
    audio = 'audio',
    discord = 'discord',
    ipcExample = 'ipc-example',
}
