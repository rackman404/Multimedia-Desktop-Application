import { create } from 'zustand'


interface IGlobalSettingsState {
    discordRichPresenceState: boolean
    setDiscordRichPresenceState: (newDiscordRichPresenceState: boolean) => void
    networkState: boolean
    setNetworkState: (newNetworkState: boolean) => void
    fullscreenState: boolean
    setFullscreenState: (newFullScreenState: boolean) => void

}

export const useGlobalSettingsState = create<IGlobalSettingsState>((set) => ({
    discordRichPresenceState: true,
    setDiscordRichPresenceState: (newDiscordRichPresenceState) =>set((state) => ({ discordRichPresenceState: newDiscordRichPresenceState })),
    networkState: true,
    setNetworkState: (newNetworkState) =>set((state) => ({ networkState: newNetworkState })),
    fullscreenState: false,
    setFullscreenState: (newFullScreenState) =>set((state) => ({ fullscreenState: newFullScreenState })),
}))
