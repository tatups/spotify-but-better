import { eq } from "drizzle-orm";
import ContextHeader from "~/components/spotify/context-header";
import VirtualTrackList from "~/components/spotify/virtual-track-list";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { accounts } from "~/server/db/schema";
import { getMySavedTracks } from "~/server/spotify/spotify-api";
import { type LikedTrackList } from "~/server/spotify/types";

export default async function LikedTracksPage() {
  const res = await getMySavedTracks();

  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  }

  const account = await db.query.accounts.findFirst({
    where: eq(accounts.userId, session.user.id),
  });

  const context: LikedTrackList = {
    type: "liked-track-list",
    tracks: res,
    uri: `spotify:user:${account ? account.providerAccountId : ""}:collection`,
  };

  return (
    <div>
      <ContextHeader context={context} />

      <VirtualTrackList tracks={res} context={context} />
    </div>
  );
}
