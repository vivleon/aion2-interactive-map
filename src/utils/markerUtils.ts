import L from "leaflet";
import type { RawMarkersFile, MarkerInstance } from "../types/game";

export function flattenMarkers(raw: RawMarkersFile): MarkerInstance[] {
  const result: MarkerInstance[] = [];
  for (const [categoryId, categoryValue] of Object.entries(raw)) {
    if (categoryId === "version") continue;
    if (typeof categoryValue === "number") continue;

    for (const [subtypeId, subtypeValue] of Object.entries(categoryValue)) {
      for (const [markerId, markerData] of Object.entries(subtypeValue)) {
        const position = (markerData as any).position as [number, number];
        if (!position) continue;
        result.push({
          id: markerId,
          categoryId,
          subtypeId,
          position,
        });
      }
    }
  }
  return result;
}

export function createMarkerIcon(categoryId: string) {
  let extraClass = "bg-emerald-500"; // default
  if (categoryId === "gatheringPoints") extraClass = "bg-amber-500";
  if (categoryId === "questPoints") extraClass = "bg-sky-500";
  if (categoryId === "enemies") extraClass = "bg-rose-500";

  return L.divIcon({
    className:
      "rounded-full w-4 h-4 border-2 border-white shadow-md " + extraClass,
    iconSize: [16, 16],
  });
}