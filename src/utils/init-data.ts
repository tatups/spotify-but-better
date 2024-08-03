import { type Album, type Playlist } from "~/server/spotify/types";
import { useSpotifyStore } from "~/store";

type InitData = {
  albums: Album[];
  playlists: Playlist[];
};

export default function initSpotifyStore({ albums, playlists }: InitData) {
  const setAlbums = useSpotifyStore.use.setAlbums();
  const setPlaylists = useSpotifyStore.use.setPlaylists();

  setAlbums(albums);
  setPlaylists(playlists);
}
