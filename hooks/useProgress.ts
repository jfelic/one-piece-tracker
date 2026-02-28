import { useEffect, useState } from "react";

const STORAGE_KEY = "op_watch_index";

export function useProgress(total: number): [number, (index: number) => void] {
  const [index, setIndexState] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < total) {
        setIndexState(parsed);
      }
    }
  }, [total]);

  const setIndex = (newIndex: number) => {
    const clamped = Math.max(0, Math.min(newIndex, total - 1));
    localStorage.setItem(STORAGE_KEY, String(clamped));
    setIndexState(clamped);
  };

  return [index, setIndex];
}
