import { useState } from "react";
import { WatchEntry } from "../lib/parseEpisodes";

interface Props {
  watchList: WatchEntry[];
  index: number;
  setIndex: (i: number) => void;
}

export default function EpisodeTracker({ watchList, index, setIndex }: Props) {
  const [jumpValue, setJumpValue] = useState("");
  const [jumpError, setJumpError] = useState("");

  const current = watchList[index];
  const total = watchList.length;
  const watchedCount = index + 1;

  const handlePrev = () => setIndex(index - 1);
  const handleNext = () => setIndex(index + 1);

  const handleJump = () => {
    const epNum = parseInt(jumpValue, 10);
    if (isNaN(epNum)) {
      setJumpError("Enter a valid episode number.");
      return;
    }
    const found = watchList.findIndex((e) => e.episode === epNum);
    if (found === -1) {
      setJumpError(`Episode ${epNum} is not in the watch list (may be filler or out of range).`);
      return;
    }
    setJumpError("");
    setJumpValue("");
    setIndex(found);
  };

  const arcProgress = current.arcIndex + 1;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl bg-gray-900 border border-gray-800 shadow-xl p-8 flex flex-col gap-6">
        {/* Header */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-1">
            One Piece
          </p>
          <h1 className="text-2xl font-bold text-white">Watch Tracker</h1>
        </div>

        {/* Arc + Episode */}
        <div className="rounded-xl bg-gray-800 p-5 flex flex-col gap-1">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Arc</p>
          <p className="text-lg font-semibold text-white leading-tight">
            {current.arcName}
          </p>
          <p className="text-4xl font-bold text-red-400 mt-2">
            Ep {current.episode}
          </p>
        </div>

        {/* Progress */}
        <div className="flex flex-col gap-3">
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Arc progress</span>
              <span>
                {arcProgress} / {current.arcTotal}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-700 overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full transition-all duration-300"
                style={{ width: `${(arcProgress / current.arcTotal) * 100}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Overall</span>
              <span>
                {watchedCount} / {total}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-700 overflow-hidden">
              <div
                className="h-full bg-red-700 rounded-full transition-all duration-300"
                style={{ width: `${(watchedCount / total) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Prev / Next */}
        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            disabled={index === 0}
            className="flex-1 rounded-xl border border-gray-700 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <button
            onClick={handleNext}
            disabled={index === total - 1}
            className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>

        {/* Jump to episode */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              value={jumpValue}
              onChange={(e) => {
                setJumpValue(e.target.value);
                setJumpError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleJump()}
              placeholder="Jump to episode…"
              className="flex-1 rounded-xl bg-gray-800 border border-gray-700 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-red-500 transition-colors [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              onClick={handleJump}
              className="rounded-xl bg-gray-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-600 transition-colors"
            >
              Go
            </button>
          </div>
          {jumpError && (
            <p className="text-xs text-red-400">{jumpError}</p>
          )}
        </div>
      </div>
    </div>
  );
}
