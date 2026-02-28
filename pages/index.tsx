import dynamic from "next/dynamic";
import { WATCH_LIST } from "../lib/parseEpisodes";
import { useProgress } from "../hooks/useProgress";

// Disable SSR for EpisodeTracker since it reads from localStorage on mount
const EpisodeTracker = dynamic(() => import("../components/EpisodeTracker"), {
  ssr: false,
});

export default function Home() {
  const [index, setIndex] = useProgress(WATCH_LIST.length);

  return <EpisodeTracker watchList={WATCH_LIST} index={index} setIndex={setIndex} />;
}
