"use client";

import ContextHeader from "~/components/spotify/context-header";
import VirtualTrackList from "~/components/spotify/virtual-track-list";
import {
  type LikedTrack,
  type PaginatedResponse,
} from "~/server/spotify/types";
import { useSpotifyStore } from "~/store";

export default function LikedTracks() {
  const liked = useSpotifyStore.use.likedTracks();
  const setLiked = useSpotifyStore.use.setLikedTracks();

  const setTracks = (tracks: PaginatedResponse<LikedTrack>) => {
    setLiked({
      ...liked,
      tracks: {
        ...tracks,
      },
    });
  };

  return (
    <div className="h-full">
      <ContextHeader context={liked} />

      {liked.tracks.total > 0 && (
        <VirtualTrackList
          tracks={liked.tracks}
          context={liked}
          setTracks={setTracks}
        />
      )}
    </div>
  );
}
