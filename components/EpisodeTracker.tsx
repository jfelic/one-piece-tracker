import { useState } from "react";
import { WatchEntry } from "../lib/parseEpisodes";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";

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
    <div className="flex justify-center p-4 pt-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <Badge className="w-fit mb-1">One Piece</Badge>
          <CardTitle className="text-2xl">Watch Tracker</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {/* Arc + Episode */}
          <Card>
            <CardContent className="pt-4 flex flex-col gap-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Arc</p>
              <p className="text-lg font-semibold leading-tight">{current.arcName}</p>
              <p className="text-4xl font-bold mt-2">Ep {current.episode}</p>
            </CardContent>
          </Card>

          {/* Progress */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Arc progress</span>
                <span>{arcProgress} / {current.arcTotal}</span>
              </div>
              <Progress value={(arcProgress / current.arcTotal) * 100} />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Overall</span>
                <span>{watchedCount} / {total}</span>
              </div>
              <Progress value={(watchedCount / total) * 100} />
            </div>
          </div>

          {/* Prev / Next */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handlePrev}
              disabled={index === 0}
            >
              ← Prev
            </Button>
            <Button
              className="flex-1"
              onClick={handleNext}
              disabled={index === total - 1}
            >
              Next →
            </Button>
          </div>

          {/* Jump to episode */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Input
                type="number"
                min={1}
                value={jumpValue}
                onChange={(e) => {
                  setJumpValue(e.target.value);
                  setJumpError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleJump()}
                placeholder="Jump to episode…"
                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <Button variant="secondary" onClick={handleJump}>
                Go
              </Button>
            </div>
            {jumpError && (
              <p className="text-xs text-destructive">{jumpError}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
