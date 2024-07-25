"use client";
import dayjs from "@/dayjs";
import { BackwardIcon, ForwardIcon } from "@heroicons/react/20/solid";
import { PauseCircleIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useSpotifyStore } from "~/app/store";
import {
  type PlaybackState,
  type StartResumePlaybackRequest,
} from "~/server/spotify/types";

type PlaybackProps = {
  playback: PlaybackState | null;
  startPlayback: (
    params: StartResumePlaybackRequest,
  ) => Promise<PlaybackState | null>;
  pausePlayback: () => Promise<PlaybackState | null>;
  nextTrack: (currentTrackId: string) => Promise<PlaybackState | null>;
  previousTrack: (currentTrackId: string) => Promise<PlaybackState | null>;
};

export default function Player({
  playback,
  startPlayback,
  pausePlayback,
  nextTrack,
  previousTrack,
}: PlaybackProps) {
  const [trackProgress, setTrackProgress] = useState(
    playback?.progress_ms ?? 0,
  );

  const { playback: currentPlayback, setPlayback: setCurrentPlayback } =
    useSpotifyStore();
  setCurrentPlayback(playback);

  const [isLoading, setIsLoading] = useState(false);

  const currentTrackId = currentPlayback?.item.id ?? "";

  useEffect(() => {
    const interval = setInterval(() => {
      if (!currentPlayback?.is_playing) return;

      setTrackProgress((prev) => prev + 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPlayback, setTrackProgress]);

  const handleAction = async (action: () => Promise<PlaybackState | null>) => {
    setIsLoading(true);
    try {
      const res = await action();
      setCurrentPlayback(res);
      if (res) {
        setTrackProgress(res.progress_ms);
      }
    } catch (error) {
      console.error("Action failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onPlay = () =>
    handleAction(() => startPlayback({ position_ms: trackProgress }));
  const onPause = () => handleAction(pausePlayback);
  const onNext = () =>
    handleAction(() =>
      currentTrackId ? nextTrack(currentTrackId) : Promise.resolve(null),
    );
  const onPrevious = () =>
    handleAction(() =>
      currentTrackId ? previousTrack(currentTrackId) : Promise.resolve(null),
    );

  return (
    <div className="flex h-16 items-center justify-center space-x-2 bg-fuchsia-800 px-4 py-8 text-lg text-yellow-500">
      {currentPlayback !== null && (
        <div className="flex items-center space-x-4">
          <BackwardIcon
            className="size-8 cursor-pointer"
            onClick={onPrevious}
          />
          {currentPlayback.is_playing ? (
            <PauseCircleIcon
              className="size-12 cursor-pointer"
              onClick={onPause}
            />
          ) : (
            <PlayCircleIcon
              className="size-12 cursor-pointer"
              onClick={onPlay}
            />
          )}
          <ForwardIcon className="size-8 cursor-pointer" onClick={onNext} />
          <>
            <span>{currentPlayback.item.name}</span>
            <span>
              {dayjs.duration(trackProgress).format("m:ss")}/
              {dayjs.duration(currentPlayback.item.duration_ms).format("m:ss")}
            </span>
            {isLoading && <span>Loading...</span>}

            <span></span>
          </>
        </div>
      )}
    </div>
  );
}
