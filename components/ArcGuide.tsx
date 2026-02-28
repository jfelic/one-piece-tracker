import { useState } from "react";
import { ArcGuide as ArcGuideType, WatchEntry } from "../lib/parseEpisodes";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

const PAGE_SIZE = 10;

interface Props {
  arcs: ArcGuideType[];
  watchList: WatchEntry[];
  index: number;
  setIndex: (i: number) => void;
}

function formatMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function formatPercent(val: number): string {
  return `${Math.round(val * 100)}%`;
}

/** Strip "(TBR)" or "(WIP)" from arc name and return [cleanName, tag | null] */
function parseArcName(name: string): [string, string | null] {
  const match = name.match(/^(.*?)\s*\((TBR|WIP)[^)]*\)\s*$/);
  if (match) return [match[1].trim(), match[2]];
  return [name, null];
}

export default function ArcGuide({ arcs, watchList, index, setIndex }: Props) {
  const currentArcNo = watchList[index].arcNo;
  const totalArcs = arcs.length;
  const currentArcIndex = arcs.findIndex((a) => a.no === currentArcNo);
  const currentArc = arcs[currentArcIndex];

  const totalPages = Math.ceil(totalArcs / PAGE_SIZE);
  const [page, setPage] = useState(() => Math.floor(currentArcIndex / PAGE_SIZE));
  const pageArcs = arcs.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  /** Find the index in watchList of the last episode belonging to an arc */
  function lastIndexOfArc(arcNo: number): number {
    let last = -1;
    for (let i = 0; i < watchList.length; i++) {
      if (watchList[i].arcNo === arcNo) last = i;
    }
    return last;
  }

  function handleJumpToArc(arcNo: number) {
    const firstIndex = watchList.findIndex((e) => e.arcNo === arcNo);
    if (firstIndex === -1) return;
    setIndex(firstIndex);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="max-w-6xl mx-auto px-4 py-6 w-full flex flex-col gap-6">
        {/* Progress summary */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              Arc {currentArcIndex + 1} of {totalArcs}
              {currentArc && (
                <span className="text-foreground font-medium"> — {currentArc.arcs.replace(/\s*\([^)]*\)/, "")}</span>
              )}
            </span>
            <span>{index + 1} / {watchList.length} episodes</span>
          </div>
          <Progress value={((currentArcIndex + 1) / totalArcs) * 100} />
        </div>

        {/* Arc table */}
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-muted-foreground text-xs uppercase tracking-wide">
                <th className="px-3 py-2 text-left font-medium w-10">No.</th>
                <th className="px-3 py-2 text-left font-medium">Arc</th>
                <th className="px-3 py-2 text-left font-medium whitespace-nowrap">Episodes</th>
                <th className="px-3 py-2 text-right font-medium whitespace-nowrap">Pace Eps</th>
                <th className="px-3 py-2 text-right font-medium whitespace-nowrap">Saved</th>
                <th className="px-3 py-2 text-right font-medium whitespace-nowrap">Saved %</th>
                <th className="px-3 py-2 text-center font-medium">Res.</th>
                <th className="px-3 py-2 text-left font-medium">Guide</th>
              </tr>
            </thead>
            <tbody>
              {pageArcs.map((arc) => {
                const isCurrent = arc.no === currentArcNo;
                const isCompleted = lastIndexOfArc(arc.no) < index && !isCurrent;
                const [cleanName, tag] = parseArcName(arc.arcs);

                return (
                  <tr
                    key={arc.no}
                    onClick={() => handleJumpToArc(arc.no)}
                    className={[
                      "border-b last:border-0 cursor-pointer transition-colors",
                      isCurrent
                        ? "bg-primary/10 hover:bg-primary/15 border-l-4 border-l-primary"
                        : isCompleted
                        ? "opacity-50 hover:opacity-70 hover:bg-muted/50"
                        : "hover:bg-muted/50",
                    ].join(" ")}
                  >
                    <td className="px-3 py-2.5 text-muted-foreground tabular-nums">{arc.no}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{cleanName}</span>
                        {isCurrent && (
                          <Badge className="text-[10px] px-1.5 py-0 h-4">Here</Badge>
                        )}
                        {tag && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">{tag}</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap tabular-nums">{arc.animeEpisodes}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{arc.numPaceEp}</td>
                    <td className="px-3 py-2.5 text-right text-muted-foreground tabular-nums whitespace-nowrap">
                      {formatMinutes(arc.savedMinutes)}
                    </td>
                    <td className="px-3 py-2.5 text-right text-muted-foreground tabular-nums">
                      {formatPercent(arc.savedPercent)}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <Badge
                        variant={
                          arc.resolution === "1080p"
                            ? "default"
                            : arc.resolution === "720p"
                            ? "secondary"
                            : "outline"
                        }
                        className="text-[10px]"
                      >
                        {arc.resolution}
                      </Badge>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground text-xs max-w-[180px]">
                      <span className="line-clamp-2">{arc.arcWatchGuide}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between text-sm">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
          >
            ← Prev
          </Button>
          <span className="text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages - 1}
          >
            Next →
          </Button>
        </div>
      </main>
    </div>
  );
}
