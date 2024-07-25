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
    type: string;
    href: string;
    external_urls: { spotify: string };
    uri: string;
  };
  timestamp: number;
  progress_ms: number;
  is_playing: boolean;
  item: Track;
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
  added_at: string;
  album: {
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
    type: string;
    uri: string;
    artists: Artist[];
    tracks: PaginatedResponse<Track>;
  };
};

export type Artist = {
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
};

export type Track = {
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
  type: string;
  uri: string;
  is_local: boolean;
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
};
