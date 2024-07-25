import { GetMyAlbums } from "~/server/spotify/spotify-api";
import AlbumListItem from "./album";

export default async function AlbumList() {
  //get the access token from the database

  const data = await GetMyAlbums();

  return (
    <div className="card bg-slate-100">
      <div className="card-body">
        <h1 className="card-title border-b border-red-500 p-4 text-lg">
          Your albums
        </h1>

        <ul className="divide-y divide-pink-500 rounded-md">
          {data.items.map((album) => (
            <AlbumListItem key={album.album.id} album={album.album} />
          ))}
        </ul>
      </div>
    </div>
  );
}
