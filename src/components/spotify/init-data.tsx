"use client";
import { useEffect } from "react";
import { type MyAlbum, type SimplePlaylist } from "~/server/spotify/types";
import { useSpotifyStore } from "~/store";

type InitData = {
  albums: MyAlbum[];
  playlists: SimplePlaylist[];
  children: React.ReactNode;
};

export default function InitSpotifyData({
  albums,
  playlists,
  children,
}: InitData) {
  const setAlbums = useSpotifyStore.use.setAlbums();
  const setPlaylists = useSpotifyStore.use.setPlaylists();

  useEffect(() => {
    setAlbums(albums);
    setPlaylists(playlists);
  }, [albums, playlists, setAlbums, setPlaylists]);

  return <>{children}</>;
}
