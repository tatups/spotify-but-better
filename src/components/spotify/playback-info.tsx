import { getSpotifyAccessToken } from "~/server/utils";
import Player from "./player";

export default async function PlaybackInfo() {
  const token = await getSpotifyAccessToken();
  console.log("we are running PlaybackInfo server component!", token);

  return (
    <div className="flex h-16 items-center justify-center space-x-2 bg-fuchsia-800 px-4 py-8 text-lg text-yellow-500">
      {token !== null && <Player spotfifyAccessToken={token} />}
    </div>
  );
}
