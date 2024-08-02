import ContextHeader from "~/components/spotify/context-header";
import TrackList from "~/components/spotify/track-list";
import { getServerAuthSession } from "~/server/auth";
import { getPlaylist } from "~/server/spotify/spotify-api";

export default async function PlaylistPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerAuthSession();

  const playlist = await getPlaylist(params.id);
  const tracks = playlist.tracks.items.map((el) => el.track);

  return (
    <div className="">
      <ContextHeader context={playlist} />
      {session?.user && <TrackList context={playlist} tracks={tracks} />}
    </div>
  );
}
