import SpotifyApiTest from "~/components/spotify-api-test";
import { getServerAuthSession } from "~/server/auth";

export default async function MePage() {
  const session = await getServerAuthSession();

  return <div className="">{session?.user && <SpotifyApiTest />}</div>;
}
