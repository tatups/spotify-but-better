import AlbumCard from "~/components/spotify/album-card";
import { getServerAuthSession } from "~/server/auth";

export default async function MePage() {
  const session = await getServerAuthSession();

  return <div className="">{session?.user && <AlbumCard />}</div>;
}
