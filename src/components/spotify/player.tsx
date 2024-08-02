"use client";
import dayjs from "@/dayjs";
import { BackwardIcon, ForwardIcon } from "@heroicons/react/20/solid";
import { PauseCircleIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import useSpotifyPlayer, { useInitSpotifyPlayer } from "~/hooks/player";

type PlayerProps = {
  spotfifyAccessToken: string;
};

export default function Player({ spotfifyAccessToken }: PlayerProps) {
  useInitSpotifyPlayer(spotfifyAccessToken);

  const { player, playbackState } = useSpotifyPlayer();
  const currentTrack = playbackState?.track_window.current_track ?? null;

  const [volume, setVolume] = useState<number | null>(null);

  useEffect(() => {
    if (player) {
      player
        .getVolume()
        .then((volume) => {
          setVolume(volume * 100);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [player]);

  const handleSetVolume = useDebouncedCallback((value: number) => {
    console.log("volume", value);
    void player?.setVolume(value / 100);
  }, 300);

  return (
    <div className="flex h-16 items-center justify-center space-x-2 bg-fuchsia-800 px-4 py-8 text-lg text-yellow-500">
      {player !== null && (
        <div className="flex items-center space-x-4">
          <BackwardIcon
            className="size-8 cursor-pointer"
            onClick={() => {
              playbackState?.track_window.current_track
                ? void player?.previousTrack()
                : null;
            }}
          />
          {!playbackState?.paused ? (
            <PauseCircleIcon
              className="size-12 cursor-pointer"
              onClick={() => {
                void player?.pause();
              }}
            />
          ) : (
            <PlayCircleIcon
              className="size-12 cursor-pointer"
              onClick={() => {
                void player?.resume();
              }}
            />
          )}
          <ForwardIcon
            className="size-8 cursor-pointer"
            onClick={() => {
              playbackState?.track_window.current_track
                ? void player?.nextTrack()
                : null;
            }}
          />
          <>
            <span>{currentTrack?.name}</span>
            <span>
              {dayjs
                .duration(playbackState?.position ?? 0, "milliseconds")
                .format("m:ss")}
              /
              {dayjs
                .duration(playbackState?.duration ?? 0, "milliseconds")
                .format("m:ss")}
            </span>
            {/* {isLoading && <span>Loading...</span>} */}

            <span>
              <input
                type="range"
                min={0}
                max="100"
                value={volume ?? 50}
                className={`accent-yellow-500`}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  setVolume(value);

                  handleSetVolume(value);
                }}
              />
            </span>
          </>
        </div>
      )}
    </div>
  );
}
