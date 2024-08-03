import { GetMyAlbums, GetMyPlaylists } from "~/server/spotify/spotify-api";
import InitSpotifyData from "./init-data";

export default async function SpotifyContextWindow({
  children,
}: {
  children: React.ReactNode;
}) {
  const playlists = await GetMyPlaylists();
  const albums = await GetMyAlbums();

  return (
    <InitSpotifyData albums={albums} playlists={playlists}>
      {children}
    </InitSpotifyData>
  );
}
