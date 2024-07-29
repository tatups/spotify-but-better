import { getSpotifyAccessToken } from "../utils";
import {
  type PaginatedResponse,
  type PlaybackState,
  type Playlist,
  type ResponseAlbum,
  type StartResumePlaybackRequest,
} from "./types";

export async function GetMyAlbums(): Promise<PaginatedResponse<ResponseAlbum>> {
  const token = await getSpotifyAccessToken();
  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch("https://api.spotify.com/v1/me/albums", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch albums: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as PaginatedResponse<ResponseAlbum>;

  return data;
}

export async function GetMyPlaylists(): Promise<PaginatedResponse<Playlist>> {
  const token = await getSpotifyAccessToken();
  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch("https://api.spotify.com/v1/me/playlists", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch albums: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as PaginatedResponse<Playlist>;

  return data;
}

export async function getPlaybackState(): Promise<PlaybackState | null> {
  const token = await getSpotifyAccessToken();
  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch("https://api.spotify.com/v1/me/player", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch playback state: ${response.status} ${response.statusText}`,
    );
  }

  if (response.status === 204) {
    return null;
  }
  const data = (await response.json()) as PlaybackState;

  return data;
}

export async function startResumePlayback(
  params: StartResumePlaybackRequest,
  currentTrackId?: string,
) {
  const token = await getSpotifyAccessToken();
  if (!token) {
    throw new Error("No access token found");
  }
  console.log(JSON.stringify(params), currentTrackId, "startResumePlayback");
  const response = await fetch("https://api.spotify.com/v1/me/player/play", {
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(params),
    method: "PUT",
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      `Failed to start/resume playback: ${response.status} ${response.statusText}`,
      errorText,
    );

    throw new Error(
      `Failed to start/resume playback: ${response.status} ${response.statusText}`,
    );
  }

  return currentTrackId
    ? await pollForPlaybackState(currentTrackId, 5, 500, true)
    : await getPlaybackState();
}

export async function stopPlayback() {
  const token = await getSpotifyAccessToken();
  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch("https://api.spotify.com/v1/me/player/pause", {
    headers: { Authorization: `Bearer ${token}` },
    method: "PUT",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to stop playback: ${response.status} ${response.statusText}`,
    );
  }

  return await getPlaybackState();
}

export async function nextTrack(currentTrackId: string) {
  const token = await getSpotifyAccessToken();
  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch("https://api.spotify.com/v1/me/player/next", {
    headers: { Authorization: `Bearer ${token}` },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to play next track: ${response.status} ${response.statusText}`,
    );
  }

  return await pollForPlaybackState(currentTrackId);
}

export async function previousTrack(currentTrackId: string) {
  const token = await getSpotifyAccessToken();
  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch(
    "https://api.spotify.com/v1/me/player/previous",
    {
      headers: { Authorization: `Bearer ${token}` },
      method: "POST",
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to play previous track: ${response.status} ${response.statusText}`,
    );
  }

  return await pollForPlaybackState(currentTrackId);
}

async function pollForPlaybackState(
  trackId: string,
  tries = 3,
  interval = 500,
  trackIdEqual = false,
): Promise<PlaybackState | null> {
  try {
    for (let i = 0; i < tries; i++) {
      await new Promise((resolve) => setTimeout(resolve, interval));

      const state = await getPlaybackState();

      if (
        (trackIdEqual && state?.item?.id === trackId) ||
        (!trackIdEqual && state?.item?.id !== trackId)
      ) {
        return state;
      }
    }
    throw new Error("Polling for playback state timed out");
  } catch (error) {
    console.error("Failed to fetch playback state", error);
    return null;
  }
}
