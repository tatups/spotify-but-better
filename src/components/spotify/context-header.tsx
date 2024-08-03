import { type Context } from "~/server/spotify/types";

type ContextHeaderProps = {
  context: Context;
};

export default function ContextHeader({ context }: ContextHeaderProps) {
  const firstImage = context.images?.length > 0 ? context.images[0] : false;

  const album = context.type === "album" ? context : null;
  const playlist = context.type === "playlist" ? context : null;

  const totalTracks = playlist ? playlist.tracks.total : album?.tracks.length;

  return (
    <div className="flex bg-fuchsia-600 text-yellow-500">
      <div className="flex-shrink-0">
        {firstImage && (
          <img src={firstImage.url} alt={context.name} className="size-64" />
        )}
      </div>
      <div className="flex flex-col justify-between px-4 pt-4">
        <h2 className="text-3xl">{context.name}</h2>
        <div className="flex space-x-2">
          {playlist && <p className="text-lg">{playlist.owner.display_name}</p>}

          {album && (
            <p className="text-lg">
              {album.artists.map((el) => el.name).join(", ")}
            </p>
          )}

          <span>{" - "}</span>
          {playlist && <p className="text-lg">{totalTracks} tracks</p>}
        </div>
      </div>
    </div>
  );
}
