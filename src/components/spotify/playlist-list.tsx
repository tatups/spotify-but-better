"use client";

import { type SimplePlaylist } from "@/server/spotify/types";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { useSpotifyStore } from "~/store";

function PlaylistListItem({ playlist }: { playlist: SimplePlaylist }) {
  const playback = useSpotifyStore.use.sdkPlaybackState();
  return (
    <li
      className={twMerge(
        "cursor-pointer",
        playback?.context?.uri === playlist.uri ? "bg-orange-400" : "",
      )}
    >
      <div className="space-x-2">
        <Link href={"/playlists/" + playlist.id}>{playlist.name}</Link>
      </div>
    </li>
  );
}

export default function PlaylistList({
  playlists,
}: {
  playlists: SimplePlaylist[];
}) {
  return (
    <ul className="divide-y divide-yellow-700 rounded-md">
      {playlists.map((playlist) => (
        <PlaylistListItem key={playlist.id} playlist={playlist} />
      ))}
    </ul>
  );
}
