import rawData from "../data/watchGuide.json";

export interface WatchEntry {
  episode: number;
  arcNo: number;
  arcName: string;
  /** 0-based index within this arc's episode list */
  arcIndex: number;
  /** total episodes in this arc's watch list */
  arcTotal: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RawArc = Record<string, any>;

/** Expand a range string like "1 - 4, 19" or "291 - 292, 303" into a sorted array of numbers */
export function parseRangeString(s: string): number[] {
  const episodes: number[] = [];
  const parts = s.split(",").map((p) => p.trim());
  for (const part of parts) {
    if (part.includes("-")) {
      const [start, end] = part.split("-").map((n) => parseInt(n.trim(), 10));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) episodes.push(i);
      }
    } else {
      const n = parseInt(part, 10);
      if (!isNaN(n)) episodes.push(n);
    }
  }
  return episodes;
}

function buildWatchList(): WatchEntry[] {
  const arcs = (rawData as RawArc[]).filter(
    (row) =>
      typeof row["No."] === "number" &&
      typeof row["Anime Episodes"] === "string" &&
      row["Anime Episodes"].trim().length > 0
  );

  arcs.sort((a, b) => (a["No."] as number) - (b["No."] as number));

  const result: WatchEntry[] = [];
  const seen = new Set<number>();

  for (const arc of arcs) {
    const arcNo = arc["No."] as number;
    const arcName = arc["Arcs"] as string;

    const allEps = parseRangeString(arc["Anime Episodes"] as string);

    const fillerSet = new Set<number>();
    if (typeof arc["Filler Episodes"] === "string") {
      for (const ep of parseRangeString(arc["Filler Episodes"])) {
        fillerSet.add(ep);
      }
    }

    const watchEps = allEps.filter((ep) => !fillerSet.has(ep) && !seen.has(ep));
    // Mark all episodes in this arc (including filtered ones) as seen to avoid
    // re-adding duplicates from overlapping arc ranges
    for (const ep of allEps) seen.add(ep);

    const arcTotal = watchEps.length;
    watchEps.forEach((episode, arcIndex) => {
      result.push({ episode, arcNo, arcName, arcIndex, arcTotal });
    });
  }

  return result;
}

export const WATCH_LIST: WatchEntry[] = buildWatchList();
