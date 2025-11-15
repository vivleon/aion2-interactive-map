import type { Map as LeafletMap } from "leaflet";

export type GameMapMeta = {
  id: string;
  imageUrl: string;
  width: number;
  height: number;
  order?: number;
};

export type MapsFile = {
  version: number;
  maps: GameMapMeta[];
};

export type MarkerTypeSubtype = {
  id: string;
  iconId?: string;
};

export type MarkerTypeCategory = {
  id: string;
  color?: string;
  iconId?: string;
  subtypes: MarkerTypeSubtype[];
};

export type TypesFile = {
  version: number;
  categories: MarkerTypeCategory[];
};

// Raw markers YAML shape: category -> subtype -> markerId -> { position: [...] }
export type RawMarkersFile = {
  version: number;
  [categoryId: string]:
    | number
    | {
    [subtypeId: string]: {
      [markerId: string]: {
        position: [number, number];
        // future: visible, minZoom, tags, etc.
      };
    };
  };
};

export type MarkerInstance = {
  id: string;
  categoryId: string;
  subtypeId: string;
  position: [number, number];
};

export type MapRef = LeafletMap | null;