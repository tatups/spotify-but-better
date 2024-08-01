import { useEffect, useRef } from "react";
import {
  type SpotifyPlayer,
  type WebPlaybackState,
} from "~/server/spotify/player-types";
import { useSpotifyStore } from "~/store";

export default function useInitSpotifyPlayer(token: string) {
  const setSdkPlayer = useSpotifyStore.use.setSdkPlayer();
  const setSdkPlaybackState = useSpotifyStore.use.setSdkPlaybackState();
  const sdkPlaybackState = useSpotifyStore.use.sdkPlaybackState();
  const setTrackPosition = useSpotifyStore.use.setPosition();
  const playerRef = useRef<SpotifyPlayer | null>(null);

  useEffect(() => {
    if (sdkPlaybackState) {
      const interval = setInterval(() => {
        if (sdkPlaybackState.paused || sdkPlaybackState.loading) {
          return;
        }
        setTrackPosition(sdkPlaybackState.position + 1000);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [sdkPlaybackState, setTrackPosition]);

  useEffect(() => {
    const scriptId = "spotify-player";

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      script.defer = true;
      script.id = scriptId;
      script.onload = () => {
        console.log("Spotify script loaded");
        initializePlayer();
      };
      script.onerror = (error) => {
        console.error("Spotify script failed to load", error);
      };

      document.body.appendChild(script);
    } else {
      initializePlayer();
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "spotify-but-better",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      player.addListener("ready", (params) => {
        console.log("Ready with Device ID", params?.device_id);
      });

      player.addListener("not_ready", (params) => {
        console.log("Device ID has gone offline", params?.device_id);
      });

      player.addListener("player_state_changed", (params) => {
        console.log("player_state_changed", params);
        setSdkPlaybackState((params as WebPlaybackState) ?? null);
      });

      player
        .connect()
        .then((success) => {
          if (success) {
            console.log(
              "The Web Playback SDK successfully connected to Spotify!",
            );
            setSdkPlayer(player);
          }
        })
        .catch((error) => {
          console.error("Failed to connect to Spotify player", error);
        });
    };
  }, [token, setSdkPlayer, setSdkPlaybackState]);
}
