"use client";

import dayjs from "@/dayjs";
import {
  type Context,
  type PaginatedResponse,
  type Track,
  type TracksForContext,
} from "@/server/spotify/types";
import {
  HandRaisedIcon,
  PlayIcon,
  RocketLaunchIcon,
} from "@heroicons/react/16/solid";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import useSpotifyPlayer from "~/hooks/player";
import { fetchNextPage } from "~/server/spotify/server-actions";

function TrackItem({
  context,
  track,
  number,
}: {
  context: Context;
  track: Track;
  number?: number;
}) {
  const { player, playbackState: playback, onPlay } = useSpotifyPlayer();

  const [isHovering, setIsHovering] = useState(false);

  const current = playback?.track_window.current_track?.id === track.id;
  const isPlaying = !playback?.paused && current;

  const artist = track.artists.map((artist) => artist.name).join(", ");

  return (
    <div
      key={track.id}
      className={twMerge(
        "flex items-center justify-between px-2 py-2 text-lg text-yellow-500",
        current ? "text-green-500" : "",
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex space-x-2">
        {isHovering && isPlaying && (
          <span>
            <HandRaisedIcon
              className="size-6 cursor-pointer text-gray-800"
              onClick={() => {
                void player?.pause();
              }}
            />
          </span>
        )}

        {isHovering && !isPlaying && (
          <PlayIcon
            className="size-6 cursor-pointer text-yellow-500"
            onClick={() => {
              if (current) {
                void player?.resume();
              } else {
                void onPlay(track, context);
              }
            }}
          />
        )}

        {!isHovering && isPlaying && (
          <RocketLaunchIcon className="size-6 cursor-pointer text-red-500" />
        )}

        {!isHovering && !isPlaying && (
          <span>{number ?? track.track_number}</span>
        )}
        <span>{artist}</span>
        <span> - </span>
        <span className="max-w-lg overflow-hidden text-ellipsis whitespace-nowrap">
          {track.name}
        </span>
      </div>
      <div>
        <span>
          {dayjs.duration(track.duration_ms, "milliseconds").format("m:ss")}
        </span>
      </div>
    </div>
  );
}

export default function VirtualTrackList<C extends Context>({
  context,
  tracks,
  setTracks,
}: {
  context: C;
  tracks: PaginatedResponse<TracksForContext<C>>;
  setTracks?: (tracks: TracksForContext<C>[]) => void;
}) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [allRows, setAllRows] = useState(tracks.items);
  const [nextPage, setNextPage] = useState<string | null>(tracks.next);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const virtualizer = useVirtualizer({
    count: nextPage ? allRows.length + 1 : allRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
    overscan: 5,
  });
  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse();

    if (!lastItem) return;

    if (
      lastItem.index >= allRows.length - 1 &&
      nextPage &&
      !fetching &&
      !error
    ) {
      console.log("fetching next page", nextPage);

      setFetching(true);
      fetchNextPage<TracksForContext<C>>(nextPage)
        .then((res) => {
          setNextPage(res.next);
          setAllRows([...allRows, ...res.items]);
          setFetching(false);
          setTracks ? setTracks([...allRows, ...res.items]) : null;
        })
        .catch((err) => {
          setFetching(false);
          if (err instanceof Error) {
            setError(err.message);
          }
          console.error(err);
        });
    } else {
      console.log(
        lastItem.index,
        allRows.length - 1,
        nextPage,
        fetching,
        error,
      );
    }
  }, [
    tracks,
    allRows.length,
    fetching,
    nextPage,
    virtualItems,
    allRows,
    error,
    setTracks,
  ]);

  return (
    <div className="h-full max-h-full w-full overflow-auto" ref={parentRef}>
      <ul
        className="relative rounded-md text-yellow-500"
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((row) => {
          const trackSource = allRows[row.index];
          const isLoaderRow = row.index > allRows.length - 1;

          const trackInTrack =
            trackSource &&
            typeof trackSource === "object" &&
            "track" in trackSource;

          const track = (
            trackInTrack ? trackSource.track : trackSource
          ) as Track;

          return (
            <li
              key={row.index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${row.size}px`,
                transform: `translateY(${row.start}px)`,
              }}
            >
              {track && (
                <TrackItem
                  track={track}
                  context={context}
                  number={row.index + 1}
                />
              )}
              {isLoaderRow && (
                <div className="text-lg text-red-400">Loading...</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
