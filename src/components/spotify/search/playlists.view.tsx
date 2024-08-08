"use client";

import { PlayCircleIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";
import { type SpotifyPlayer } from "~/hooks/player";
import { type SimplePlaylist } from "~/server/spotify/types";

export default function PlaylistsView({
  playlists,
  spotifyPlayer,
}: {
  playlists: SimplePlaylist[];
  spotifyPlayer: SpotifyPlayer;
}) {
  //take first 5 playlists
  const playlistsSlice = playlists.slice(0, 5);

  return (
    <div className="rounded-md bg-fuchsia-800">
      <div className="px-4 pb-2 pt-3">
        <h2 className="text-2xl font-semibold tracking-wide text-yellow-300">
          Playlists
        </h2>
      </div>
      <div className="flex space-x-3 px-4 pb-4 pt-4">
        {playlistsSlice.map((playlist) => (
          <div key={playlist.id} className="flex flex-col space-y-2">
            <Link href={"/playlists/" + playlist.id} className="relative">
              <Image
                src={playlist.images[0]?.url ?? ""}
                alt="hehe"
                height={250}
                width={250}
              />
              {/* //play icon, absolute */}
              <PlayCircleIcon
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  void spotifyPlayer.onPlay(undefined, playlist);
                }}
                className="absolute bottom-0 right-0 size-14 cursor-pointer text-yellow-400 hover:size-16"
              />
            </Link>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xl font-semibold text-yellow-300">
                  {playlist.name}
                </span>
                <span className="text-yellow-300">
                  {playlist.owner.display_name}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
