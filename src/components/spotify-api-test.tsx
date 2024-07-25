import dayjs from "@/dayjs";
import { type Album } from "@/server/spotify/types";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { GetMyAlbums } from "~/server/spotify/spotify-api";

function AlbumListItem({ album }: { album: Album }) {
  return (
    <li className="">
      <Disclosure>
        <DisclosureButton className="space-x-2 p-4">
          <span>{album.album.artists.map((el) => el.name).join(", ")}</span>
          <span> - </span>
          <span>{album.album.name}</span>
        </DisclosureButton>
        <DisclosurePanel className="p-4">
          {album.album.tracks.items.map((track) => (
            <div key={track.id} className="space-x-2">
              <span>{track.name}</span>

              <span> - </span>
              <span>
                {dayjs
                  .duration(track.duration_ms, "milliseconds")
                  .format("m:ss")}
              </span>
            </div>
          ))}
        </DisclosurePanel>
      </Disclosure>
    </li>
  );
}

export default async function SpotifyApiTest() {
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
            <AlbumListItem key={album.album.id} album={album} />
          ))}
        </ul>
      </div>
    </div>
  );
}
