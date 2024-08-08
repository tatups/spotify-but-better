"use client";

import { PauseCircleIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { type SpotifyPlayer } from "~/hooks/player";
import { type Track } from "~/server/spotify/types";
import { TrackItem } from "../track-list";

export default function SongsView({
  tracks,
  spotifyPlayer,
}: {
  tracks: Track[];
  spotifyPlayer: SpotifyPlayer;
}) {
  const [firstTrack, ...restTracks] = tracks;
  const { player, playbackState: playback, onPlay } = spotifyPlayer;

  const currentTrack =
    firstTrack && playback?.track_window.current_track?.id === firstTrack?.id;
  const isPlayingCurrentTrack = !playback?.paused && currentTrack;

  return (
    <div className="rounded-md bg-fuchsia-800">
      {/* Songs */}

      <div className="flex flex-col">
        <div className="px-4 pb-2 pt-3">
          <h2 className="text-2xl font-semibold tracking-wide text-yellow-300">
            Songs
          </h2>
        </div>

        <div className="flex">
          {firstTrack && (
            <Link
              href={"/albums/" + firstTrack.album.id}
              className="flex shrink-0 flex-col space-y-2 rounded-md px-4 pb-4 pt-4 hover:bg-fuchsia-500"
            >
              {
                <Image
                  className="size-60"
                  src={firstTrack.album.images[0]?.url ?? ""}
                  alt="hehe"
                  height={firstTrack.album.images[0]?.height}
                  width={firstTrack.album.images[0]?.width}
                />
              }
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xl font-semibold text-yellow-300">
                    {firstTrack.name}
                  </span>
                  <span className="text-yellow-300">
                    {firstTrack.artists.map((artist) => artist.name).join(", ")}
                  </span>
                </div>
                {!isPlayingCurrentTrack && (
                  <PlayCircleIcon
                    role="button"
                    className="size-14 text-yellow-300"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      void onPlay(firstTrack, firstTrack.album);
                    }}
                  />
                )}
                {isPlayingCurrentTrack && (
                  <PauseCircleIcon
                    role="button"
                    className="size-14 text-yellow-300"
                    onClick={(e) => {
                      e.preventDefault();

                      e.stopPropagation();

                      void player?.pause();
                    }}
                  />
                )}
              </div>
            </Link>
          )}
          <div className="flex flex-col px-4 pb-4 pt-4">
            {restTracks.map((track) => (
              <TrackItem
                key={track.id}
                track={track}
                context={track.album}
                image={track.album.images[0]?.url}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
