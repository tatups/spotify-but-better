"use client";

import { type Album, type MyAlbum } from "@/server/spotify/types";
import Link from "next/link";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import useSpotifyPlayer from "~/hooks/player";
import { useSpotifyStore } from "~/store";

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
      <div className="space-x-2 p-4">
        <Link href={"/albums/" + album.id}>
          <span>{album.artists.map((el) => el.name).join(", ")}</span>
          <span> - </span>
          <span>{album.name}</span>
        </Link>
      </div>
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
