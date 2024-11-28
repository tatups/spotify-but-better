"use client";

import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  return (
    <div className="flex h-full justify-center text-yellow-500">
      <div className="rounded p-2">
        <h1 className="text-2xl">Failed to load album</h1>

        <p className="text-lg">{error.message}</p>
        <div
          role="button"
          className="flex cursor-pointer items-center space-x-1 text-lg"
          onClick={() => reset()}
        >
          <span>Refresh </span>
          <ArrowPathIcon className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}
