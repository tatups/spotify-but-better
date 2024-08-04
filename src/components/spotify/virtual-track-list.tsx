"use client";

import dayjs from "@/dayjs";
import {
  type Context,
  type LikedTrack,
  type PaginatedResponse,
  type Track,
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

  return (
    <div
      key={track.id}
      className={twMerge(
        "flex items-center space-x-2 px-2 py-2 text-lg text-yellow-500",
        current ? "text-green-500" : "",
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
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

      {!isHovering && !isPlaying && <span>{number ?? track.track_number}</span>}
      <span className="max-w-lg overflow-hidden text-ellipsis whitespace-nowrap">
        {track.name}
      </span>
      <span> - </span>
      <span>
        {dayjs.duration(track.duration_ms, "milliseconds").format("m:ss")}
      </span>
    </div>
  );
}

export default function VirtualTrackList({
  context,
  tracks,
}: {
  context: Context;
  tracks: PaginatedResponse<LikedTrack>;
}) {
  const parentRef = useRef<HTMLDivElement | null>(null);

  const virtualizer = useVirtualizer({
    count: tracks.total,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
    overscan: 5,
  });

  const [allRows, setAllRows] = useState(tracks.items);
  const [nextPage, setNextPage] = useState<string | null>(tracks.next);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const [lastItem] = [...virtualizer.getVirtualItems()].reverse();

    if (!lastItem) return;

    if (
      lastItem.index >= allRows.length - 1 &&
      nextPage &&
      !fetching &&
      !error
    ) {
      console.log("fetching next page", nextPage);
      setFetching(true);
      fetchNextPage<LikedTrack>(nextPage)
        .then((res) => {
          setNextPage(res.next);
          setAllRows([...allRows, ...res.items]);
          setFetching(false);
        })
        .catch((err) => {
          setFetching(false);
          setError(err);
          console.error(err);
        });
    }
  }, [
    tracks,
    virtualizer.getVirtualItems(),
    allRows.length,
    fetching,
    nextPage,
  ]);

  return (
    <div
      className="w-full overflow-auto"
      style={{ height: "500px" }}
      ref={parentRef}
    >
      <ul
        className="relative rounded-md text-yellow-500"
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((row) => {
          const myTrack = allRows[row.index];
          console.log("row.size", row.size);

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
              {myTrack && (
                <TrackItem
                  track={myTrack.track}
                  context={context}
                  number={row.index + 1}
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
