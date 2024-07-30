export type SpotifyPlayer = {
  name: string;
  getOAuthToken: (cb: (token: string) => void) => void;
  volume?: number;
  enableMediaSession?: boolean;

  connect: () => Promise<boolean>;
  disconnect: () => void;
  addListener: (
    event_name: SpotifyPlayerEvent,
    callback?: (params: EventPayload) => void,
  ) => boolean;
  removeListener: (
    event_name: string,
    callback?: (params: EventPayload) => void,
  ) => boolean;
  getCurrentState: () => Promise<WebPlaybackState | null>;
  setName: (name: string) => Promise<void>;
  getVolume: () => Promise<number>;
  setVolume: (volume: number) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  togglePlay: () => Promise<void>;
  seek: (position_ms: number) => Promise<void>;
  previousTrack: () => Promise<void>;
  nextTrack: () => Promise<void>;
  activateElement: () => Promise<void>;
};

export type SpotifyPlayerEvent =
  | "ready"
  | "not_ready"
  | "player_state_changed"
  | "autoplay_failed";

export type SpotifyPlayerEventReady = {
  device_id: string;
};

export type SpotifyPlayerEventNotReady = {
  device_id: string;
};

export type SpotifyPlayerEventPlayerStateChanged = {
  device_id: string;
  message: WebPlaybackState;
};

type EventPayload =
  | SpotifyPlayerEventReady
  | SpotifyPlayerEventNotReady
  | SpotifyPlayerEventPlayerStateChanged
  | undefined;

export type WebPlaybackState = {
  context: {
    uri: string | null;
    metadata: Record<string, unknown> | null;
  };
  disallows: {
    pausing?: boolean;
    peeking_next?: boolean;
    peeking_prev?: boolean;
    resuming?: boolean;
    seeking?: boolean;
    skipping_next?: boolean;
    skipping_prev?: boolean;
  };
  paused: boolean;
  position: number;
  repeat_mode: 0 | 1 | 2;
  shuffle: boolean;
  track_window: {
    current_track: WebPlaybackTrack;
    previous_tracks: WebPlaybackTrack[];
    next_tracks: WebPlaybackTrack[];
  };
};

export type WebPlaybackTrack = {
  uri: string;
  id: string | null;
  type: "track" | "episode" | "ad";
  media_type: "audio" | "video";
  name: string;
  is_playable: boolean;
  album: {
    uri: string;
    name: string;
    images: { url: string }[];
  };
  artists: { uri: string; name: string }[];
};

type WebPlaybackError = {
  message: string;
};
