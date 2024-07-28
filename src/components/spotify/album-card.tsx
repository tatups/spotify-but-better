import { GetMyAlbums } from "~/server/spotify/spotify-api";
import AlbumList from "./album";

export default async function AlbumCard() {
  //get the access token from the database

  const data = await GetMyAlbums();

  // const mapped = {
  //   ...data,
  //   items: data.items.map((item) => ({...item, album:
  //   }))
  // };

  // const mappedAlbumItems = data.items.map((item) => {
  //   const tracks = item.album.tracks.items.map((track) => {
  //     return {
  //       ...track,
  //       album: { ...item.album },
  //     };
  //   });
  //   return {
  //     ...item,
  //     album: { ...item.album, tracks },
  //   };
  // });

  const hehe = data.items.map((item) => {
    const tracks = item.album.tracks.items.map((track) => {
      return {
        ...track,
        album: { ...item.album },
      };
    });

    return { ...item, album: { ...item.album, tracks } };
  });

  return (
    <div className="card bg-slate-100">
      <div className="card-body">
        <h1 className="card-title border-b border-red-500 p-4 text-lg">
          Your albums
        </h1>

        <AlbumList albums={hehe} />
      </div>
    </div>
  );
}
