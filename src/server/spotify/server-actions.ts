"use server";
import {
  nextTrack,
  previousTrack,
  startResumePlayback,
  stopPlayback,
  transferPlayback,
} from "./spotify-api";
import { type StartResumePlaybackRequest } from "./types";

async function playAction(
  params: StartResumePlaybackRequest,
  trackId?: string,
) {
  // Server Action
  "use server";

  return await startResumePlayback(params, trackId);
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

async function transferPlaybackAction(deviceId: string) {
  // Server Action
  "use server";

  return await transferPlayback(deviceId);
}

export {
  nextAction,
  pauseAction,
  playAction,
  previousAction,
  transferPlaybackAction,
};
