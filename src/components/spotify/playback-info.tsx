import {
  getPlaybackState,
  nextTrack,
  previousTrack,
  startResumePlayback,
  stopPlayback,
} from "~/server/spotify/spotify-api";
import { type StartResumePlaybackRequest } from "~/server/spotify/types";
import Player from "./player";

export default async function PlaybackInfo() {
  const playback = await getPlaybackState();

  async function playAction(params: StartResumePlaybackRequest) {
    // Server Action
    "use server";

    return await startResumePlayback(params);
  }

  async function pauseAction() {
    // Server Action
    "use server";

    return await stopPlayback();
  }

  async function nextAction(currentTrackId: string) {
    // Server Action
    "use server";

    return await nextTrack(currentTrackId);
  }

  async function previousAction(currentTrackId: string) {
    // Server Action
    "use server";

    return await previousTrack(currentTrackId);
  }

  return (
    <div className="flex h-16 items-center justify-center space-x-2 bg-fuchsia-800 px-4 py-8 text-lg text-yellow-500">
      <Player
        playback={playback}
        startPlayback={playAction}
        pausePlayback={pauseAction}
        nextTrack={nextAction}
        previousTrack={previousAction}
      />
    </div>
  );
}
