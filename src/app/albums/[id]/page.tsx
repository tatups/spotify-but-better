import ContextHeader from "~/components/spotify/context-header";
import TrackList from "~/components/spotify/track-list";
import { getServerAuthSession } from "~/server/auth";
import { getAlbum } from "~/server/spotify/spotify-api";

export default async function AlbumPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerAuthSession();

  const album = await getAlbum(params.id);

  return (
    <div className="">
      <ContextHeader context={album} />
      {session?.user && <TrackList context={album} tracks={album.tracks} />}
    </div>
  );
}
