import { useEffect, useState } from "react";
import { fetchYaml } from "../utils/yamlLoader";
import type {
  GameMapMeta,
  MapsFile,
  MarkerTypeCategory,
  TypesFile,
} from "../types/game";

export function useGameData() {
  const [maps, setMaps] = useState<GameMapMeta[]>([]);
  const [types, setTypes] = useState<MarkerTypeCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [mapsData, typesData] = await Promise.all([
          fetchYaml<MapsFile>("data/maps.yaml"),
          fetchYaml<TypesFile>("data/types.yaml"),
        ]);

        if (cancelled) return;

        const sortedMaps = [...mapsData.maps].sort((a, b) => {
          const ao = a.order ?? 9999;
          const bo = b.order ?? 9999;
          if (ao !== bo) return ao - bo;
          return a.id.localeCompare(b.id);
        });

        setMaps(sortedMaps);
        setTypes(typesData.categories);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { maps, types, loading };
}
