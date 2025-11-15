import { useEffect, useMemo, useState } from "react";
import type { MarkerInstance, RawMarkersFile } from "../types/game";
import { fetchYaml } from "../utils/yamlLoader";
import { flattenMarkers } from "../utils/markerUtils";

export function useMarkers(selectedMapId: string | null) {
  const [markers, setMarkers] = useState<MarkerInstance[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedMapId) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const raw = await fetchYaml<RawMarkersFile>(
          `data/markers/${selectedMapId}.yaml`,
        );
        if (cancelled) return;
        const flat = flattenMarkers(raw);
        setMarkers(flat);
      } catch (e) {
        console.error(e);
        if (!cancelled) setMarkers([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [selectedMapId]);

  const subtypeCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const m of markers) {
      const key = `${m.categoryId}::${m.subtypeId}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  }, [markers]);

  return { markers, loading, subtypeCounts };
}