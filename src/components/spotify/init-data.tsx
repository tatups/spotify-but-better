"use client";
import { useEffect } from "react";
import {
  type LikedTrackList,
  type MyAlbum,
  type SimplePlaylist,
} from "~/server/spotify/types";
import { useSpotifyStore } from "~/store";

type InitData = {
  albums: MyAlbum[];
  playlists: SimplePlaylist[];
  likedTracks: LikedTrackList;
  children: React.ReactNode;
};

export default function InitSpotifyData({
  albums,
  playlists,
  likedTracks,
  children,
}: InitData) {
  const setAlbums = useSpotifyStore.use.setAlbums();
  const setPlaylists = useSpotifyStore.use.setPlaylists();
  const setLikedTracks = useSpotifyStore.use.setLikedTracks();

  useEffect(() => {
    setAlbums(albums);
    setPlaylists(playlists);
    setLikedTracks(likedTracks);
  }, [albums, playlists, likedTracks, setAlbums, setPlaylists, setLikedTracks]);

  return <>{children}</>;
}
