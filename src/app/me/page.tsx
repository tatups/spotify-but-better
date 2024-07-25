import AlbumList from "~/components/album-list";
import { getServerAuthSession } from "~/server/auth";

export default async function MePage() {
  const session = await getServerAuthSession();

  return <div className="">{session?.user && <AlbumList />}</div>;
}
