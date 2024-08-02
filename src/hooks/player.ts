import { useEffect } from "react";
import {
  type SpotifyPlayer,
  type WebPlaybackState,
} from "~/server/spotify/player-types";
import * as Actions from "~/server/spotify/server-actions";
import {
  type Context,
  type StartResumePlaybackRequest,
  type Track,
} from "~/server/spotify/types";
import { type SpotifyState, useSpotifyStore } from "~/store";

function initializePlayer(
  token: string,
  setSdkPlayer: SpotifyState["setSdkPlayer"],
  setSdkPlaybackState: SpotifyState["setSdkPlaybackState"],
) {
  const scriptId = "spotify-player";

  if (!document.getElementById(scriptId)) {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    script.defer = true;
    script.id = scriptId;
    script.onload = () => {
      console.log("Spotify script loaded");
    };
    script.onerror = (error) => {
      console.error("Spotify script failed to load", error);
    };

    document.body.appendChild(script);
  } else {
    console.log("sdk script already appended");
  }
  if (!window.onSpotifyWebPlaybackSDKReady) {
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
        setSdkPlayer(player);
        void Actions.transferPlaybackAction(params?.device_id);
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
          }
        })
        .catch((error) => {
          console.error("Failed to connect to Spotify player", error);
        });
    };
  } else {
    console.log("onSpotifyWebPlaybackSDKReady already appended");
  }
}

function onStart(
  player: SpotifyPlayer | null,
  playerState: WebPlaybackState | null,
  context: Context | undefined,
  playable: Track | undefined,
) {
  if (!player || !playerState) {
    return;
  }

  const isPlaying = playerState?.paused === false;
  const currentTrack = playerState?.track_window.current_track;
  //case 1: if the current track is paused and the user clicks on the same track, we resume playing

  if (
    !isPlaying &&
    (currentTrack?.uri === playable?.uri || (!playable && !context))
  ) {
    void player.resume();
  }

  if (!context) {
    throw new Error("Context is required when switching to a new track");
  }

  return Actions.playAction(getOnPlayPayload(playable, context), playable?.id);
}

function getOnPlayPayload(
  playable: Track | undefined = undefined,
  context: Context | undefined = undefined, //Optional. Spotify URI of the context to play. Valid contexts are albums, artists & playlists.
  fromPosition = 0,
): StartResumePlaybackRequest {
  const base = { position_ms: fromPosition, context_uri: context?.uri };

  if (!playable && !context) {
    throw new Error("playable or context is required");
  }

  if (!playable && context) {
    return {
      ...base,
      context_uri: context.uri,
      offset: { position: 0 },
    };
  }

  return {
    ...base,
    offset: { uri: playable?.uri },
  };
}

export function useInitSpotifyPlayer(token: string) {
  const setSdkPlayer = useSpotifyStore.use.setSdkPlayer();
  const setSdkPlaybackState = useSpotifyStore.use.setSdkPlaybackState();
  const sdkPlaybackState = useSpotifyStore.use.sdkPlaybackState();
  const setTrackPosition = useSpotifyStore.use.setPosition();
  const sdkPlayer = useSpotifyStore.use.sdkPlayer();

  useEffect(() => {
    if (!sdkPlayer) {
      initializePlayer(token, setSdkPlayer, setSdkPlaybackState);
    }
    return () => {
      if (sdkPlayer) {
        sdkPlayer.disconnect();
      }
    };
  }, [token, setSdkPlayer, setSdkPlaybackState, sdkPlayer]);

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
}

export default function useSpotifyPlayer() {
  const sdkPlaybackState = useSpotifyStore.use.sdkPlaybackState();
  const sdkPlayer = useSpotifyStore.use.sdkPlayer();

  const onPlay = async (
    playable: Track | undefined = undefined,
    context: Context | undefined = undefined,
  ) => {
    await onStart(sdkPlayer, sdkPlaybackState, context, playable);
  };

  return {
    onPlay,
    playbackState: sdkPlaybackState,
    player: sdkPlayer,
  };
}
