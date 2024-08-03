export type Device = {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
  supports_volume: boolean;
};

export type PlaybackState = {
  device: Device;
  repeat_state: string;
  shuffle_state: boolean;
  context: {
    type: "album";
    href: string;
    external_urls: { spotify: string };
    uri: string;
  } | null;
  timestamp: number;
  progress_ms: number | null;
  is_playing: boolean;
  item: Track | null;
  currently_playing_type: string;
  actions: PlaybackActions;
};

export type PlaybackActions = {
  interrupting_playback: boolean;
  pausing: boolean;
  resuming: boolean;
  seeking: boolean;
  skipping_next: boolean;
  skipping_prev: boolean;
  toggling_repeat_context: boolean;
  toggling_shuffle: boolean;
  toggling_repeat_track: boolean;
  transferring_playback: boolean;
};

export type Album = {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: { spotify: string };
  href: string;
  id: string;
  images: { url: string; height: number; width: number }[];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions: { reason: string };
  type: "album";
  uri: string;
  artists: Artist[];
  tracks: Track[];
};

export type ResponseMyAlbum = {
  album: Album & { tracks: PaginatedResponse<SimpleTrack> };
  added_at: string;
};

export type ResponseAlbum = Album & { tracks: PaginatedResponse<SimpleTrack> };

export type MyAlbum = {
  added_at: string;
  album: Album;
};

export type SimplePlaylist = {
  collaborative: boolean;
  description: string | null;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  name: string;
  owner: {
    display_name: string;
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  public: boolean | null;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
  type: "playlist";
  uri: string;
};

export type Playlist = SimplePlaylist & {
  tracks: PaginatedResponse<PlaylistTrack>;
};

type PlaylistTrack = {
  added_at: string;
  is_local: boolean;
  track: Track;
};

export type Artist = {
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
};

export type SimpleTrack = {
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: { spotify: string };
  href: string;
  id: string;
  is_playable: boolean;
  linked_from: {
    external_urls: { spotify: string };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  restrictions: { reason: string };
  name: string;
  preview_url: string;
  track_number: number;
  type: "track";
  uri: string;
  is_local: boolean;
};

export type Track = SimpleTrack & {
  album: Album;
};

export type LikedTrack = {
  added_at: string;
  track: Track;
};

export type PaginatedResponse<T> = {
  href: string;
  items: T[];
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
};

export const emptyPaginatedResponse = {
  href: "",
  items: [],
  limit: 0,
  next: "",
  offset: 0,
  previous: "",
  total: 0,
};

export type StartResumePlaybackRequest = {
  context_uri?: string;
  offset?: { position?: number; uri?: string };
  position_ms: number;
  uris?: string[];
};

export type Context = Album | Playlist;
