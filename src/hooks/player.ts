import { useEffect, useState } from "react";
import { useSpotifyStore } from "~/app/store";
import * as Actions from "~/server/spotify/server-actions";
import {
  type Album,
  type PlaybackState,
  type Track,
} from "~/server/spotify/types";

export function usePlayer(playbackState?: PlaybackState | null) {
  const { playback, setPlayback } = useSpotifyStore();
  const [isLoading, setIsLoading] = useState(false);
  const [trackProgress, setTrackProgress] = useState(
    playback?.progress_ms ?? 0,
  );

  useEffect(() => {
    if (playbackState) {
      setPlayback(playbackState);
      setTrackProgress(playbackState.progress_ms);
    }
  }, [playbackState, setPlayback]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!playback?.is_playing) return;

      setTrackProgress((prev) => prev + 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, [playback, setTrackProgress]);

  const handleAction = async (action: () => Promise<PlaybackState | null>) => {
    setIsLoading(true);
    try {
      const res = await action();
      setPlayback(res);
      if (res) {
        setTrackProgress(res.progress_ms);
      }
    } catch (error) {
      console.error("Action failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onPlay = (playable: Track | Album | undefined = undefined) =>
    handleAction(() =>
      playable
        ? Actions.playAction(
            {
              position_ms: 0,
              uris: [playable.uri],
            },
            playable.id,
          )
        : Actions.playAction({ position_ms: trackProgress }),
    );
  const onPause = () => handleAction(Actions.pauseAction);
  const onNext = () =>
    handleAction(() =>
      playback?.item.id
        ? Actions.nextAction(playback.item.id)
        : Promise.resolve(null),
    );
  const onPrevious = () =>
    handleAction(() =>
      playback?.item.id
        ? Actions.previousAction(playback.item.id)
        : Promise.resolve(null),
    );

  return {
    playback,
    isLoading,
    trackProgress,
    onPlay,
    onPause,
    onNext,
    onPrevious,
  };
}
