import { eq } from "drizzle-orm";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { accounts } from "~/server/db/schema";
import {
  GetMyAlbums,
  GetMyPlaylists,
  getMySavedTracks,
} from "~/server/spotify/spotify-api";
import { type LikedTrackList } from "~/server/spotify/types";
import InitSpotifyData from "./init-data";

export default async function SpotifyContextWindow({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const playlists = await GetMyPlaylists();
  const albums = await GetMyAlbums();
  const savedTracks = await getMySavedTracks();

  if (!session) {
    return <div>Not authenticated</div>;
  }

  const account = await db.query.accounts.findFirst({
    where: eq(accounts.userId, session.user.id),
  });

  const likedTrackList: LikedTrackList = {
    type: "liked-track-list",
    tracks: savedTracks,
    uri: `spotify:user:${account ? account.providerAccountId : ""}:collection`,
  };

  return (
    <InitSpotifyData
      albums={albums}
      playlists={playlists}
      likedTracks={likedTrackList}
    >
      {children}
    </InitSpotifyData>
  );
}
