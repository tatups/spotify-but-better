import ContextHeader from "~/components/spotify/context-header";
import VirtualTrackList from "~/components/spotify/virtual-track-list";
import { getAlbum } from "~/server/spotify/spotify-api";

export default async function AlbumPage({
  params,
}: {
  params: { id: string };
}) {
  const album = await getAlbum(params.id);

  //sleep for 1 second to simulate loading
  await new Promise((resolve) => setTimeout(resolve, 3000));

  throw new Error("Not implemented");

  return (
    <div className="">
      <ContextHeader context={album} />
      <VirtualTrackList context={album} tracks={album.tracks} />
    </div>
  );
}
