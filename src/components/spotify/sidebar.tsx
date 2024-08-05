"use client";

import Link from "next/link";
import { useSpotifyStore } from "~/store";

export default function Sidebar() {
  const playlists = useSpotifyStore.use.playlists();
  const albums = useSpotifyStore.use.albums();
  const likedTracks = useSpotifyStore.use.likedTracks();

  return (
    <div className="flex flex-col space-y-4 p-4 font-semibold">
      <div>
        <h2 className="mb-2 text-2xl">Playlists</h2>
        <ul className="space-y-2 text-lg">
          <li>
            <Link href={"/liked-tracks"} className="">
              Liked songs ({likedTracks.tracks.total})
            </Link>
          </li>
          {playlists.map((playlist) => {
            return (
              <li key={playlist.id} className="">
                <Link href={"/playlists/" + playlist.id}>{playlist.name}</Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <h2 className="mb-2 text-2xl">Albums</h2>
        <ul className="space-y-2 text-lg">
          {albums.map((album) => {
            return (
              <li key={album.album.id}>
                <Link href={"/albums/" + album.album.id}>
                  {album.album.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
