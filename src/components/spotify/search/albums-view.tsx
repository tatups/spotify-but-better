"use client";

import { PlayCircleIcon } from "@heroicons/react/20/solid";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { type SpotifyPlayer } from "~/hooks/player";
import { type Album } from "~/server/spotify/types";

export default function AlbumsView({
  albums,
  spotifyPlayer,
}: {
  albums: Album[];
  spotifyPlayer: SpotifyPlayer;
}) {
  //take first 5 albums
  const albumsSlice = albums.slice(0, 5);

  return (
    <div className="rounded-md bg-fuchsia-800">
      <div className="px-4 pb-2 pt-3">
        <h2 className="text-2xl font-semibold tracking-wide text-yellow-300">
          Albums
        </h2>
      </div>
      <div className="flex space-x-3 px-4 pb-4 pt-4">
        {albumsSlice.map((album) => (
          <div key={album.id} className="flex flex-col space-y-2">
            <Link href={"/albums/" + album.id} className="relative">
              <Image
                src={album.images[0]?.url ?? ""}
                alt="hehe"
                height={album.images[0]?.height}
                width={album.images[0]?.width}
              />
              {/* //play icon, absolute */}
              <PlayCircleIcon
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  void spotifyPlayer.onPlay(undefined, album);
                }}
                className="absolute bottom-0 right-0 size-14 cursor-pointer text-yellow-400 hover:size-16"
              />
            </Link>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xl font-semibold text-yellow-300">
                  {album.name}
                </span>
                <span className="text-yellow-300">
                  {dayjs(album.release_date).format("YYYY")}
                  {/* bullet point */}
                  <span className="text-xl"> • </span>
                  {album.artists.map((artist) => artist.name).join(", ")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
