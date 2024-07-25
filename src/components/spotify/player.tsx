"use client";
import dayjs from "@/dayjs";
import { BackwardIcon, ForwardIcon } from "@heroicons/react/20/solid";
import { PauseCircleIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import { type PlaybackState } from "~/server/spotify/types";

import { usePlayer } from "~/hooks/player";

type PlaybackProps = {
  playback: PlaybackState | null;
};

export default function Player({ playback }: PlaybackProps) {
  const {
    playback: currentPlayback,
    isLoading,
    trackProgress,
    onPlay,
    onPause,
    onNext,
    onPrevious,
  } = usePlayer(playback);

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
              onClick={() => onPlay}
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
