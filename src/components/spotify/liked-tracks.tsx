"use client";

import ContextHeader from "~/components/spotify/context-header";
import VirtualTrackList from "~/components/spotify/virtual-track-list";
import { type LikedTrack } from "~/server/spotify/types";
import { useSpotifyStore } from "~/store";

export default function LikedTracks() {
  const liked = useSpotifyStore.use.likedTracks();

  console.log(liked, "liked");

  const setTracks = (tracks: LikedTrack[]) => {
    //console.log(tracks, "tracks");
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
