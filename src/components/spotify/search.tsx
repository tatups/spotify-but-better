"use client";

import { usePathname, useRouter } from "next/navigation";
import { searchAction } from "~/server/spotify/server-actions";
import { useSpotifyStore } from "~/store";

function SearchView() {
  const res = useSpotifyStore.use.searchResults();

  if (!res) {
    return null;
  }

  const { albums, artists, playlists, tracks } = res;

  return (
    <div className="flex flex-col space-y-8">
      <div>{/* Songs */}
    {tracks.items.map((track) => (
        

      </div>
    </div>
  );
}

export default function SearchField() {
  const router = useRouter();
  const pathname = usePathname();

  const setSearchResults = useSpotifyStore.use.setSearchResults();

  const onSearch = async (query: string) => {
    const res = await searchAction(query);
    setSearchResults(res);
  };

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
