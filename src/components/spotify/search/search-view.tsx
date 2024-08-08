"use client";

import { usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import useSpotifyPlayer from "~/hooks/player";
import { searchAction } from "~/server/spotify/server-actions";
import { useSpotifyStore } from "~/store";
import AlbumsView from "./albums-view";
import PlaylistsView from "./playlists.view";
import SongsView from "./songs-view";

export function SearchView() {
  const res = useSpotifyStore.use.searchResults();
  const player = useSpotifyPlayer();

  if (!res) {
    return null;
  }

  const { albums, artists, playlists, tracks } = res;

  return (
    <div className="flex flex-col space-y-8">
      <SongsView tracks={tracks.items} spotifyPlayer={player} />
      <AlbumsView albums={albums.items} spotifyPlayer={player} />
      <PlaylistsView playlists={playlists.items} spotifyPlayer={player} />
    </div>
  );
}

export default function SearchField() {
  const router = useRouter();
  const pathname = usePathname();

  const setSearchResults = useSpotifyStore.use.setSearchResults();

  const onSearch = useDebouncedCallback(async (query: string) => {
    if (!query) {
      setSearchResults(null);
      return;
    }
    const res = await searchAction(query);
    setSearchResults(res);
  }, 500);

  return (
    <div className="flex w-full max-w-sm items-center">
      <label htmlFor="email" className="sr-only">
        Search
      </label>
      <input
        id="email"
        name="search"
        type="text"
        placeholder="Search"
        // defaultValue={""}
        onChange={(e) => onSearch(e.target.value)}
        onFocus={() => pathname !== "/search" && router.push("/search")}
        className="block w-full max-w-xl rounded-md border-0 bg-fuchsia-700 py-1.5 text-lg font-semibold text-yellow-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
      />
    </div>
  );
}
