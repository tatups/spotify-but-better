"use client";

import { type PlaybackState, type Playlist } from "@/server/spotify/types";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { twMerge } from "tailwind-merge";
import { useSpotifyStore } from "~/store";

function PlaylistListItem({
  playlist,
  playback,
}: {
  playlist: Playlist;
  playback: PlaybackState;
}) {
  return (
    <li
      className={twMerge(
        "cursor-pointer",
        playback.context?.uri === playlist.uri ? "bg-orange-400" : "",
      )}
    >
      <Disclosure>
        <DisclosureButton className="group flex items-center p-4 font-semibold">
          <ChevronRightIcon className="size-8 group-data-[open]:rotate-90" />
          <div className="space-x-2">
            <span>{playlist.name}</span>
          </div>
        </DisclosureButton>
        <DisclosurePanel className="p-4">
          {/* {album.tracks.map((track, idx) => (
            <TrackItem key={track.id} track={track} context={album} />
          ))} */}
        </DisclosurePanel>
      </Disclosure>
    </li>
  );
}

export default function PlaylistList({ playlists }: { playlists: Playlist[] }) {
  const { setAlbums, playback } = useSpotifyStore();

  return (
    <ul className="divide-y divide-yellow-700 rounded-md">
      {playlists.map((playlist) => (
        <PlaylistListItem
          key={playlist.id}
          playlist={playlist}
          playback={playback}
        />
      ))}
    </ul>
  );
}
