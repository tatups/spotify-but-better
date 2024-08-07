import type {} from "@redux-devtools/extension"; // required for devtools typing
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  emptyPaginatedResponse,
  type LikedTrackList,
  type MyAlbum,
  type SearchResult,
  type SimplePlaylist,
} from "~/server/spotify/types";
import {
  type SpotifyPlayer,
  type WebPlaybackState,
} from "./server/spotify/player-types";

export interface SpotifyState {
  albums: MyAlbum[];
  setAlbums: (albums: MyAlbum[]) => void;
  playlists: SimplePlaylist[];
  setPlaylists: (playlists: SimplePlaylist[]) => void;
  likedTracks: LikedTrackList;
  setLikedTracks: (likedTracks: LikedTrackList) => void;

  sdkPlayer: SpotifyPlayer | null;
  sdkPlaybackState: WebPlaybackState | null;

  setSdkPlayer: (player: SpotifyPlayer) => void;
  setSdkPlaybackState: (state: WebPlaybackState) => void;
  setPosition: (position: number) => void;

  searchResults: SearchResult | null;
  setSearchResults: (results: SearchResult) => void;
}

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
      likedTracks: {
        type: "liked-track-list",
        tracks: { ...emptyPaginatedResponse },
        uri: "",
      },
      setLikedTracks: (likedTracks: LikedTrackList) => set({ likedTracks }),

      searchResults: null,
      setSearchResults: (results: SearchResult) =>
        set({ searchResults: results }),
    }),
    {
      name: "spotify-storage",
    },
  ),
);

const useSpotifyStore = createSelectors(useSpotifyStoreBase);

export { useSpotifyStore };
