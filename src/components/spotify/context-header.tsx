import { HeartIcon } from "@heroicons/react/24/solid";
import { type Context } from "~/server/spotify/types";

type ContextHeaderProps = {
  context: Context;
};

export default function ContextHeader({ context }: ContextHeaderProps) {
  const likedTrackList = context.type === "liked-track-list";
  const firstImage =
    !likedTrackList && context.images?.length > 0 ? context.images[0] : false;

  const album = context.type === "album" ? context : null;
  const playlist = context.type === "playlist" ? context : null;

  let totalTracks = 0;
  if (likedTrackList) {
    totalTracks = context.tracks.total;
  } else if (album) {
    totalTracks = album.tracks.length;
  } else if (playlist) {
    totalTracks = playlist.tracks.total;
  }

  return (
    <div className="mb-3 flex border-b-2 border-yellow-500 bg-fuchsia-600 pb-2 text-yellow-500">
      <div className="flex-shrink-0">
        {firstImage && !likedTrackList && (
          <img src={firstImage.url} alt={context.name} className="size-64" />
        )}
        {likedTrackList && <HeartIcon className="size-24" />}
      </div>
      <div className="flex flex-col justify-between px-4 pt-4">
        <h2 className="text-3xl">
          {likedTrackList ? "Liked songs" : context.name}
        </h2>
        <div className="flex space-x-2">
          {playlist && <p className="text-lg">{playlist.owner.display_name}</p>}

          {album && (
            <p className="text-lg">
              {album.artists.map((el) => el.name).join(", ")}
            </p>
          )}

          {!likedTrackList && <span>{" - "}</span>}
          {<p className="text-lg">{totalTracks} tracks</p>}
        </div>
      </div>
    </div>
  );
}
