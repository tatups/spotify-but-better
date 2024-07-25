import { getPlaybackState } from "~/server/spotify/spotify-api";
import Player from "./player";

export default async function PlaybackInfo() {
  const playback = await getPlaybackState();

  return (
    <div className="flex h-16 items-center justify-center space-x-2 bg-fuchsia-800 px-4 py-8 text-lg text-yellow-500">
      <Player playback={playback} />
    </div>
  );
}
