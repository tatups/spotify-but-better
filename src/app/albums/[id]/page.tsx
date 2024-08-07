import ContextHeader from "~/components/spotify/context-header";
import VirtualTrackList from "~/components/spotify/virtual-track-list";
import { getAlbum } from "~/server/spotify/spotify-api";

export default async function AlbumPage({
  params,
}: {
  params: { id: string };
}) {
  const album = await getAlbum(params.id);

  return (
    <div className="">
      <ContextHeader context={album} />
      <VirtualTrackList context={album} tracks={album.tracks} />
    </div>
  );
}
