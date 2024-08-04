"use client";

import dayjs from "@/dayjs";
import { type Context, type Track } from "@/server/spotify/types";
import {
  HandRaisedIcon,
  PlayIcon,
  RocketLaunchIcon,
} from "@heroicons/react/16/solid";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import useSpotifyPlayer from "~/hooks/player";

function TrackItem({
  context,
  track,
  number,
}: {
  context: Context;
  track: Track;
  number?: number;
}) {
  const { player, playbackState: playback, onPlay } = useSpotifyPlayer();

  const [isHovering, setIsHovering] = useState(false);

  const current = playback?.track_window.current_track?.id === track.id;
  const isPlaying = !playback?.paused && current;

  return (
    <div
      key={track.id}
      className={twMerge(
        "flex items-center space-x-2 px-2 py-2 text-lg text-yellow-500",
        current ? "text-green-500" : "",
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isHovering && isPlaying && (
        <span>
          <HandRaisedIcon
            className="size-6 cursor-pointer text-gray-800"
            onClick={() => {
              void player?.pause();
            }}
          />
        </span>
      )}

      {isHovering && !isPlaying && (
        <PlayIcon
          className="size-6 cursor-pointer text-yellow-500"
          onClick={() => {
            if (current) {
              void player?.resume();
            } else {
              void onPlay(track, context);
            }
          }}
        />
      )}

      {!isHovering && isPlaying && (
        <RocketLaunchIcon className="size-6 cursor-pointer text-red-500" />
      )}

      {!isHovering && !isPlaying && <span>{number ?? track.track_number}</span>}
      <span>{track.name}</span>
      <span> - </span>
      <span>
        {dayjs.duration(track.duration_ms, "milliseconds").format("m:ss")}
      </span>
    </div>
  );
}

export default function TrackList({
  context,
  tracks,
}: {
  context: Context;
  tracks: Track[];
}) {
  return (
    <ul className="divide-y divide-yellow-700 rounded-md text-yellow-500" on>
      {tracks.map((track, idx) => (
        <TrackItem
          key={track.id}
          track={track}
          context={context}
          number={idx + 1}
        />
      ))}
    </ul>
  );
}
