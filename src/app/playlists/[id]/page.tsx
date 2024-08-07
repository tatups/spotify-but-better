import ContextHeader from "~/components/spotify/context-header";
import VirtualTrackList from "~/components/spotify/virtual-track-list";
import { getPlaylist } from "~/server/spotify/spotify-api";

export default async function PlaylistPage({
  params,
}: {
  params: { id: string };
}) {
  const playlist = await getPlaylist(params.id);

  return (
    <div className="">
      <ContextHeader context={playlist} />

      {playlist.tracks.total > 0 && (
        <VirtualTrackList tracks={playlist.tracks} context={playlist} />
      )}
    </div>
  );
}
