import { GetMyPlaylists } from "~/server/spotify/spotify-api";
import PlaylistList from "./playlist-list";

export default async function PlaylistCard() {
  const data = await GetMyPlaylists();

  return (
    <div className="card bg-fuchsia-400">
      <div className="card-body">
        <h1 className="card-title border-b border-yellow-700 p-4 text-lg font-semibold">
          Your playlists
        </h1>

        <PlaylistList playlists={data.items} />
      </div>
    </div>
  );
}
