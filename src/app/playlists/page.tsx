import PlaylistCard from "~/components/spotify/playlist-card";
import { getServerAuthSession } from "~/server/auth";

export default async function PlaylistPage() {
  const session = await getServerAuthSession();

  return <div className="">{session?.user && <PlaylistCard />}</div>;
}
