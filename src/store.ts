import type {} from "@redux-devtools/extension"; // required for devtools typing
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  type Album,
  type PlaybackState,
  type Track,
} from "~/server/spotify/types";

export interface SpotifyState {
  playback: PlaybackState | null;
  setPlayback: (playback: PlaybackState | null) => void;
  setCurrentTrack: (track: Track, progressMs?: number | undefined) => void;
  incrementTrackProgress: (seconds: number) => void;
  setContext: (context: Album) => void;
  albums: Album[];
  setAlbums: (albums: Album[]) => void;
}

const useSpotifyStore = create<SpotifyState>()(
  devtools(
    persist(
      (set) => ({
        playback: null,
        setPlayback: (playback: PlaybackState | null) => set({ playback }),
        setCurrentTrack: (
          track: Track,
          progressMs: number | undefined = undefined,
        ) =>
          set((state) => ({
            playback: state.playback
              ? {
                  ...state.playback,
                  progress_ms: progressMs ?? state.playback.progress_ms,
                  item: track,
                }
              : null,
          })),
        incrementTrackProgress: (seconds: number) =>
          set((state) => ({
            playback: state.playback
              ? {
                  ...state.playback,
                  progress_ms: state.playback.progress_ms + seconds * 1000,
                }
              : null,
          })),
        setContext: (context: Album) =>
          set((state) => ({
            ...state,
            playback: state.playback
              ? {
                  ...state.playback,
                  context: {
                    ...state.playback?.context,
                    type: "album",
                    uri: context.uri,
                  },
                }
              : null,
          })),

        albums: [],
        setAlbums: (albums: Album[]) => set({ albums }),
      }),
      {
        name: "spotify-storage",
      },
    ),
  ),
);

export { useSpotifyStore };
