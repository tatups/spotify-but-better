import ContextHeader from "~/components/spotify/context-header";
import VirtualTrackList from "~/components/spotify/virtual-track-list";
import { getServerAuthSession } from "~/server/auth";
import { getPlaylist } from "~/server/spotify/spotify-api";

export default async function PlaylistPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerAuthSession();

  const playlist = await getPlaylist(params.id);

  return (
    <div className="">
      <ContextHeader context={playlist} />
      {/* {session?.user && <TrackList context={playlist} tracks={tracks} />} */}

      {playlist.tracks.total > 0 && (
        <VirtualTrackList tracks={playlist.tracks} context={playlist} />
      )}
    </div>
  );
}
