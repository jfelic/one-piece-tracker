import dynamic from "next/dynamic";
import { ARC_LIST, WATCH_LIST } from "../lib/parseEpisodes";
import { useProgress } from "../hooks/useProgress";

// Disable SSR since components read from localStorage on mount
const EpisodeTracker = dynamic(() => import("../components/EpisodeTracker"), { ssr: false });
const ArcGuide = dynamic(() => import("../components/ArcGuide"), { ssr: false });

export default function Home() {
  const [index, setIndex] = useProgress(WATCH_LIST.length);

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-3.5rem)]">
      <div className="lg:w-1/3 lg:border-r border-b lg:border-b-0 lg:sticky lg:top-14 lg:self-start flex flex-col items-center">
        <EpisodeTracker watchList={WATCH_LIST} index={index} setIndex={setIndex} />
      </div>
      <div className="lg:w-2/3">
        <ArcGuide arcs={ARC_LIST} watchList={WATCH_LIST} index={index} setIndex={setIndex} />
      </div>
    </div>
  );
}
