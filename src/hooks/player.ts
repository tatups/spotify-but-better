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

  state.setCurrentTrack(track);

  return action(state.playback?.item?.id);
}

function onStartResume(
  state: SpotifyState,
  context: Album | undefined,
  playable: Track | undefined,
) {
  const currentTrack = state.playback?.item;
  //case 1: if the current track is paused and the user clicks on the same track, we resume playing
  if (
    state.playback?.is_playing === false &&
    currentTrack?.uri === playable?.uri
  ) {
    return Actions.playAction({
      position_ms: state.playback?.progress_ms ?? 0,
    });
  }

  if (!context) {
    throw new Error("Context is required when switching to a new track");
  }

  //must switch context if the track is from a different album (or playlist in the future)
  if (state.playback?.context?.uri !== context?.uri) {
    state.setContext(context);
  }

  //case 2: if the user clicks on a different track
  if (playable) {
    state.setCurrentTrack(playable, 0);

    return Actions.playAction(getOnPlayPayload(playable, context), playable.id);
  }

  //case 3: if the user clicks on a different album, we play the first track of that album
  const firstTrack = context.tracks?.[0];
  if (!firstTrack) {
    throw new Error("No tracks found in the context");
  }

  state.setCurrentTrack(firstTrack, 0);
  return Actions.playAction(getOnPlayPayload(undefined, context));
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
  const { playback, setPlayback, incrementTrackProgress, ...rest } =
    useSpotifyStore();
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
    }, 1000);

    return () => clearInterval(interval);
  }, [playback, incrementTrackProgress]);

  const handleAction = async (action: () => Promise<PlaybackState | null>) => {
    setIsLoading(true);
    try {
      const res = await action();
      setPlayback(res);
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
    if (playable === undefined || playable?.id !== playback?.item?.id) {
    }

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
