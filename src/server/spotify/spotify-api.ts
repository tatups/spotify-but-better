import { getSpotifyAccessToken } from "../utils";
import {
  type LikedTrack,
  type MyAlbum,
  type PaginatedResponse,
  type PlaybackState,
  type Playlist,
  type ResponseAlbum,
  type ResponseMyAlbum,
  type SearchResult,
  type SimplePlaylist,
  type StartResumePlaybackRequest,
} from "./types";

export async function GetMyAlbums(): Promise<MyAlbum[]> {
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

  const data = (await response.json()) as PaginatedResponse<ResponseMyAlbum>;

  const mapped = data.items.map((item) => {
    const tracks = item.album.tracks.items.map((track) => {
      return {
        ...track,
        album: { ...item.album },
      };
    });

    return { ...item, album: { ...item.album, tracks } };
  });

  return mapped;
}

export async function GetMyPlaylists(): Promise<SimplePlaylist[]> {
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

  const data = (await response.json()) as PaginatedResponse<SimplePlaylist>;

  const mapped = data.items.map((item) => {
    return item;
  });

  return mapped;
}

export async function getPlaylist(playlistId: string): Promise<Playlist> {
  const token = await getSpotifyAccessToken();
  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch playlist: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as Playlist;

  return data;
}

export async function getAlbum(albumId: string): Promise<ResponseAlbum> {
  const token = await getSpotifyAccessToken();
  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch album: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as ResponseAlbum;
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

export async function transferPlayback(deviceId: string) {
  const token = await getSpotifyAccessToken();
  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch(`https://api.spotify.com/v1/me/player`, {
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ device_ids: [deviceId] }),
    method: "PUT",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to transfer playback: ${response.status} ${response.statusText}`,
    );
  }
}

async function getToken() {
  const token = await getSpotifyAccessToken();
  if (!token) {
    throw new Error("No access token found");
  }

  return token;
}

export async function getMySavedTracks(): Promise<
  PaginatedResponse<LikedTrack>
> {
  const token = await getToken();

  const params = new URLSearchParams({
    limit: "20",
  });
  const res = await fetch(
    "https://api.spotify.com/v1/me/tracks?" + params.toString(),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    console.log(await res.json(), "res");
    throw new Error(
      `Failed to fetch saved tracks: ${res.status} ${res.statusText}`,
    );
  }

  const data = (await res.json()) as PaginatedResponse<LikedTrack>;

  return data;
}

export async function getNextPage<T>(
  url: string,
): Promise<PaginatedResponse<T>> {
  const token = await getToken();

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch next page: ${res.status} ${res.statusText}`,
    );
  }

  const data = (await res.json()) as PaginatedResponse<T>;

  return data;
}

export async function search(query: string) {
  const token = await getToken();

  const params = new URLSearchParams({
    limit: "5",
    q: query,
    type: ["album", "artist", "playlist", "track"].join(","),
  });
  const res = await fetch(
    "https://api.spotify.com/v1/search?" + params.toString(),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    console.log(await res.json(), "res");
    throw new Error(
      `Failed to fetch saved tracks: ${res.status} ${res.statusText}`,
    );
  }

  const data = (await res.json()) as SearchResult;

  return data;
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
