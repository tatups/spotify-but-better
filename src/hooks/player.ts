import { useEffect, useState } from "react";
import * as Actions from "~/server/spotify/server-actions";
import {
  type Album,
  type PlaybackState,
  type StartResumePlaybackRequest,
  type Track,
} from "~/server/spotify/types";
import { type SpotifyState, useSpotifyStore } from "~/store";

function navigateWithinContext(
  state: SpotifyState,
  direction: "next" | "previous",
) {
  const context = state.playback?.context;
  const action =
    direction === "next" ? Actions.nextAction : Actions.previousAction;

  if (!context || !state.playback?.item) {
    return Promise.resolve(null);
  }

  const contextMap = {
    album: state.albums,
    // artist: state.artists,
    // playlist: state.playlists,
  };
  const tracks =
    (contextMap[context.type] ?? []).find((el) => el.uri === context.uri)
      ?.tracks ?? [];

  const currentIndex = tracks.findIndex(
    (item) => item.uri === state.playback?.item?.uri,
  );

  if (currentIndex === -1) {
    throw new Error(`Could not find current track for ${context.type}`);
  }

  const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

  //use the current track if we are attempting to go back from the first track
  const track = newIndex < 0 ? tracks[currentIndex] : tracks[newIndex];

  if (!track) {
    throw new Error(
      `Could not find current track for ${context.type} in "${direction}" direction`,
    );
  }

  state.setCurrentTrack(track, 0);

  return action(state.playback?.item?.id);
}

function onStartResume(
  state: SpotifyState,
  context: Album | undefined,
  playable: Track | undefined,
) {
  const currentTrack = state.playback.item;

  if (!playable && !context && state.playback.is_playing === true) {
    return;
  }

  const newPlaybackState = { ...state.playback };
  newPlaybackState.is_playing = true;

  //case 1: if the current track is paused and the user clicks on the same track, we resume playing

  if (
    state.playback?.is_playing === false &&
    (currentTrack?.uri === playable?.uri || (!playable && !context))
  ) {
    state.setPlayback(newPlaybackState);

    return Actions.playAction({
      position_ms: state.playback?.progress_ms ?? 0,
    });
  }

  if (!context) {
    throw new Error("Context is required when switching to a new track");
  }

  newPlaybackState.context = {
    external_urls: { spotify: context.external_urls.spotify },
    href: context.href,
    type: "album",
    uri: context.uri,
  };
  newPlaybackState.progress_ms = 0;
  newPlaybackState.item = playable ?? context.tracks?.[0] ?? null;

  if (!newPlaybackState.item) {
    throw new Error("No tracks found in the context");
  }

  state.setPlayback(newPlaybackState);

  return Actions.playAction(getOnPlayPayload(playable, context), playable?.id);
}

function getOnPlayPayload(
  playable: Track | undefined = undefined,
  context: Album | undefined = undefined, //Optional. Spotify URI of the context to play. Valid contexts are albums, artists & playlists.
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

export function usePlayer(playbackState?: PlaybackState | null) {
  const spotifyState = useSpotifyStore();
  const {
    playback,
    setPlayback,
    incrementTrackProgress,
    setTrackProgress,
    ...rest
  } = useSpotifyStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (playbackState) {
      setPlayback(playbackState);
    }
  }, [playbackState, setPlayback]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!playback?.is_playing) return;

      incrementTrackProgress(1);

      if (playback.progress_ms === playback.item?.duration_ms) {
        setTrackProgress(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [playback, incrementTrackProgress, setTrackProgress]);

  const handleAction = async (action: () => Promise<PlaybackState | null>) => {
    setIsLoading(true);
    try {
      const res = await action();

      if (res) {
        setPlayback(res);
      }
    } catch (error) {
      console.error("Action failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onPlay = async (
    playable: Track | undefined = undefined,
    context: Album | undefined = undefined,
  ) => {
    await onStartResume(spotifyState, context, playable);
  };

  const onPause = () => handleAction(Actions.pauseAction);

  const onNext = () =>
    handleAction(() => navigateWithinContext(spotifyState, "next"));
  const onPrevious = () =>
    handleAction(() => navigateWithinContext(spotifyState, "previous"));

  return {
    playback,
    isLoading,
    onPlay,
    onPause,
    onNext,
    onPrevious,
  };
}
