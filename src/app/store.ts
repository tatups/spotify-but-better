import type {} from "@redux-devtools/extension"; // required for devtools typing
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { type PlaybackState } from "~/server/spotify/types";

interface SpotifyState {
  playback: PlaybackState | null;
  setPlayback: (playback: PlaybackState | null) => void;
}

const useSpotifyStore = create<SpotifyState>()(
  devtools(
    persist(
      (set) => ({
        playback: null,
        setPlayback: (playback: PlaybackState | null) => set({ playback }),
      }),
      {
        name: "spotify-storage",
      },
    ),
  ),
);

export { useSpotifyStore };
