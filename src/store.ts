import type {} from "@redux-devtools/extension"; // required for devtools typing
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  type Album,
  type PlaybackState,
  type Track,
} from "~/server/spotify/types";
import {
  type SpotifyPlayer,
  type WebPlaybackState,
} from "./server/spotify/player-types";

export interface SpotifyState {
  playback: PlaybackState;
  setPlayback: (playback: PlaybackState) => void;
  setCurrentTrack: (track: Track, progressMs?: number | undefined) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  incrementTrackProgress: (seconds: number) => void;
  setTrackProgress: (trackProgress: number) => void;
  setContext: (context: Album) => void;
  albums: Album[];
  setAlbums: (albums: Album[]) => void;

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

      playback: { ...emptyPlaybackState },
      setPlayback: (playback: PlaybackState) => set({ playback }),
      setIsPlaying: (isPlaying: boolean) =>
        set((state) => ({
          ...state,
          playback: { ...state.playback, is_playing: isPlaying },
        })),
      setCurrentTrack: (
        track: Track,
        progressMs: number | undefined = undefined,
      ) =>
        set((state) => ({
          playback: {
            ...state.playback,
            progress_ms: progressMs ?? state.playback.progress_ms,
            item: track,
          },
        })),
      incrementTrackProgress: (seconds: number) =>
        set((state) => ({
          playback: {
            ...state.playback,
            progress_ms: (state.playback.progress_ms ?? 0) + seconds * 1000,
          },
        })),
      setTrackProgress: (trackProgress: number) =>
        set((state) => ({
          playback: {
            ...state.playback,
            progress_ms: trackProgress,
          },
        })),
      setContext: (context: Album) =>
        set((state) => ({
          ...state,
          playback: {
            ...state.playback,
            context: {
              external_urls: { spotify: context.external_urls.spotify },
              href: context.href,
              type: "album",
              uri: context.uri,
            },
          },
        })),

      albums: [],
      setAlbums: (albums: Album[]) => set({ albums }),
    }),
    {
      name: "spotify-storage",
    },
  ),
);

const useSpotifyStore = createSelectors(useSpotifyStoreBase);

export { useSpotifyStore };
