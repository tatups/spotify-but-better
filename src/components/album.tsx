"use client";

import dayjs from "@/dayjs";
import { type Album, type Track } from "@/server/spotify/types";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  HandRaisedIcon,
  PlayIcon,
  RocketLaunchIcon,
} from "@heroicons/react/16/solid";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { usePlayer } from "~/hooks/player";

function TrackItem({ track, number }: { track: Track; number: number }) {
  const { playback, onPause, onPlay } = usePlayer();
  const [isHovering, setIsHovering] = useState(false);

  const current = playback?.item.id === track.id;
  const isPlaying = playback?.is_playing && current;

  return (
    <div
      key={track.id}
      className={twMerge(
        "flex items-center space-x-2 px-2 py-2 text-lg text-gray-800",
        current ? "bg-gray-200 text-green-500" : "",
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isHovering && isPlaying && (
        <span>
          <HandRaisedIcon
            className="size-6 cursor-pointer text-gray-500"
            onClick={onPause}
          />
        </span>
      )}

      {isHovering && !isPlaying && (
        <PlayIcon className="size-6 cursor-pointer text-green-500" onClick={() => onPlay(track) } />
      )}

      {!isHovering && isPlaying && (
        <RocketLaunchIcon className="size-6 cursor-pointer text-red-500" />
      )}

      {!isHovering && !isPlaying && <span>{track.track_number}</span>}
      <span>{track.name}</span>
      <span> - </span>
      <span>
        {dayjs.duration(track.duration_ms, "milliseconds").format("m:ss")}
      </span>
    </div>
  );
}

export default function AlbumListItem({ album }: { album: Album }) {
  return (
    <li className="">
      <Disclosure>
        <DisclosureButton className="space-x-2 p-4">
          <span>{album.artists.map((el) => el.name).join(", ")}</span>
          <span> - </span>
          <span>{album.name}</span>
        </DisclosureButton>
        <DisclosurePanel className="p-4">
          {album.tracks.items.map((track, idx) => (
            <TrackItem key={track.id} track={track} number={idx + 1} />
          ))}
        </DisclosurePanel>
      </Disclosure>
    </li>
  );
}
