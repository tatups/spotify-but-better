import type {} from "@redux-devtools/extension"; // required for devtools typing
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { type MyAlbum, type SimplePlaylist } from "~/server/spotify/types";
import {
  type SpotifyPlayer,
  type WebPlaybackState,
} from "./server/spotify/player-types";

export interface SpotifyState {
  albums: MyAlbum[];
  setAlbums: (albums: MyAlbum[]) => void;
  playlists: SimplePlaylist[];
  setPlaylists: (playlists: SimplePlaylist[]) => void;

  sdkPlayer: SpotifyPlayer | null;
  sdkPlaybackState: WebPlaybackState | null;

  setSdkPlayer: (player: SpotifyPlayer) => void;
  setSdkPlaybackState: (state: WebPlaybackState) => void;
  setPosition: (position: number) => void;
}

export const emptyPlaybackState = {
  device: {
    id: "",
    is_active: false,
    is_private_session: false,
    is_restricted: false,
    name: "",
    type: "",
    volume_percent: 0,
    supports_volume: false,
  },
  repeat_state: "",
  shuffle_state: false,
  context: null,
  timestamp: 0,
  progress_ms: null,
  is_playing: false,
  item: null,
  currently_playing_type: "",
  actions: {
    interrupting_playback: false,
    pausing: false,
    resuming: false,
    seeking: false,
    skipping_next: false,
    skipping_prev: false,
    toggling_repeat_context: false,
    toggling_shuffle: false,
    toggling_repeat_track: false,
    transferring_playback: false,
  },
};

import { type StoreApi, type UseBoundStore } from "zustand";

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

const useSpotifyStoreBase = create<SpotifyState>()(
  devtools(
    (set) => ({
      sdkPlaybackState: null,
      sdkPlayer: null,
      setSdkPlayer: (player: SpotifyPlayer) => set({ sdkPlayer: player }),
      setSdkPlaybackState: (state: WebPlaybackState) =>
        set({ sdkPlaybackState: state }),
      setPosition: (position: number) =>
        set((state) => ({
          ...state,
          sdkPlaybackState: state.sdkPlaybackState
            ? { ...state.sdkPlaybackState, position }
            : null,
        })),

      albums: [],
      setAlbums: (albums: MyAlbum[]) => set({ albums }),
      playlists: [],
      setPlaylists: (playlists: SimplePlaylist[]) => set({ playlists }),
    }),
    {
      name: "spotify-storage",
    },
  ),
);

const useSpotifyStore = createSelectors(useSpotifyStoreBase);

export { useSpotifyStore };
