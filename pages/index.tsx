import dynamic from "next/dynamic";
import { ARC_LIST, WATCH_LIST } from "../lib/parseEpisodes";
import { useProgress } from "../hooks/useProgress";

// Disable SSR since components read from localStorage on mount
const EpisodeTracker = dynamic(() => import("../components/EpisodeTracker"), { ssr: false });
const ArcGuide = dynamic(() => import("../components/ArcGuide"), { ssr: false });

export default function Home() {
  const [index, setIndex] = useProgress(WATCH_LIST.length);

  return (
    <>
      <EpisodeTracker watchList={WATCH_LIST} index={index} setIndex={setIndex} />
      <ArcGuide arcs={ARC_LIST} watchList={WATCH_LIST} index={index} setIndex={setIndex} />
    </>
  );
}
