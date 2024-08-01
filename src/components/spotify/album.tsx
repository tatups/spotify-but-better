"use client";

import dayjs from "@/dayjs";
import { type Album, type MyAlbum, type Track } from "@/server/spotify/types";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  ChevronRightIcon,
  HandRaisedIcon,
  PlayIcon,
  RocketLaunchIcon,
} from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import useSpotifyPlayer from "~/hooks/player";
import { useSpotifyStore } from "~/store";

function TrackItem({ context, track }: { context: Album; track: Track }) {
  const { player, playbackState: playback, onPlay } = useSpotifyPlayer();

  const [isHovering, setIsHovering] = useState(false);

  const current = playback?.track_window.current_track?.id === track.id;
  const isPlaying = !playback?.paused && current;

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
            onClick={() => {
              void player?.pause();
            }}
          />
        </span>
      )}

      {isHovering && !isPlaying && (
        <PlayIcon
          className="size-6 cursor-pointer text-green-500"
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

      {!isHovering && !isPlaying && <span>{track.track_number}</span>}
      <span>{track.name}</span>
      <span> - </span>
      <span>
        {dayjs.duration(track.duration_ms, "milliseconds").format("m:ss")}
      </span>
    </div>
  );
}

function AlbumListItem({ album }: { album: Album }) {
  const player = useSpotifyPlayer();
  const playbackState = player.playbackState;

  return (
    <li
      className={twMerge(
        "cursor-pointer",
        playbackState?.context?.uri === album.uri ? "bg-orange-400" : "",
      )}
    >
      <Disclosure>
        <DisclosureButton className="group flex items-center p-4 font-semibold">
          <ChevronRightIcon className="size-8 group-data-[open]:rotate-90" />
          <div className="space-x-2">
            <span>{album.artists.map((el) => el.name).join(", ")}</span>
            <span> - </span>
            <span>{album.name}</span>
          </div>
        </DisclosureButton>
        <DisclosurePanel className="p-4">
          {album.tracks.map((track, idx) => (
            <TrackItem key={track.id} track={track} context={album} />
          ))}
        </DisclosurePanel>
      </Disclosure>
    </li>
  );
}

export default function AlbumList({ albums }: { albums: MyAlbum[] }) {
  const setAlbums = useSpotifyStore.use.setAlbums();
  useEffect(() => {
    setAlbums(albums.map((el) => el.album));
  }, [albums, setAlbums]);

  return (
    <ul className="divide-y divide-yellow-700 rounded-md">
      {albums.map((album) => (
        <AlbumListItem key={album.album.id} album={album.album} />
      ))}
    </ul>
  );
}
