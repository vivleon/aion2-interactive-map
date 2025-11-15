// src/components/GameMapView.tsx
import React from "react";
import {
  MapContainer,
  ImageOverlay,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";

import { useTranslation } from "react-i18next";

// VALUE imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as SolidIcons from "@fortawesome/free-solid-svg-icons";
import { faLocationPin } from "@fortawesome/free-solid-svg-icons";
import { renderToString } from "react-dom/server";

// TYPE imports
import type {
  GameMapMeta,
  MapRef,
  MarkerInstance,
  MarkerTypeCategory,
} from "../types/game";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

type Props = {
  selectedMap: GameMapMeta | null;
  markers: MarkerInstance[];
  mapRef: React.RefObject<MapRef>;
  visibleSubtypes: Set<string>;
  types: MarkerTypeCategory[];
};

/** Lookup icon definition from YAML */
function getSubtypeIconDef(
  types: MarkerTypeCategory[],
  categoryId: string,
  subtypeId: string
): IconDefinition {
  const cat = types.find((c) => c.id === categoryId);
  const sub = cat?.subtypes.find((s) => s.id === subtypeId) || null;

  const iconName =
    (sub as any)?.icon || (cat as any)?.icon || "faCircleDot";

  return (
    ((SolidIcons as any)[iconName] as IconDefinition) ||
    (SolidIcons.faCircleDot as IconDefinition)
  );
}

/** Lookup color from YAML */
function getSubtypeColor(
  types: MarkerTypeCategory[],
  categoryId: string,
  subtypeId: string
): string {
  const cat = types.find((c) => c.id === categoryId);
  const sub = cat?.subtypes.find((s) => s.id === subtypeId) || null;

  return (
    (sub as any)?.color ||
    (cat as any)?.color ||
    "#E53935"
  );
}

/** Create a FA-based pin icon */
function createPinIcon(
  innerIcon: IconDefinition,
  pinColor: string
): L.DivIcon {
  const html = renderToString(
    <div
      style={{
        position: "relative",
        width: "36px",
        height: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Outer big pin */}
      <FontAwesomeIcon
        icon={faLocationPin}
        style={{
          fontSize: "36px",
          color: pinColor,
          filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.4))",
        }}
      />

      {/* Inner icon shifted upward */}
      <FontAwesomeIcon
        icon={innerIcon}
        style={{
          position: "absolute",
          fontSize: "14px",
          color: "white",
          top: "6px",       // <<< shift up (tweakable)
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
    </div>
  );

  return L.divIcon({
    html,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });
}


const GameMapView: React.FC<Props> = ({
                                        selectedMap,
                                        markers,
                                        mapRef,
                                        visibleSubtypes,
                                        types,
                                      }) => {
  const { t } = useTranslation(["types"]);

  if (!selectedMap) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-default-500">
        No map selected.
      </div>
    );
  }

  const bounds: L.LatLngBoundsExpression = [
    [0, 0],
    [selectedMap.height, selectedMap.width],
  ];

  const center: [number, number] = [
    selectedMap.height / 2,
    selectedMap.width / 2,
  ];

  // 🔥 Correct image URL for dev + prod
  const base = import.meta.env.BASE_URL ?? "/";
  const imageUrl =
    base + selectedMap.imageUrl.replace(/^\//, ""); // remove leading slash

  return (
    <div className="flex-1 relative">
      <MapContainer
        key={selectedMap.id}
        center={center}
        zoom={0}
        minZoom={-2}
        maxZoom={2}
        crs={L.CRS.Simple}
        className="w-full h-full"
        attributionControl={false}
        ref={mapRef as any}
      >
        <ImageOverlay url={imageUrl} bounds={bounds} />

        {markers
          .filter((m) =>
            visibleSubtypes.has(`${m.categoryId}::${m.subtypeId}`)
          )
          .map((m) => {
            const innerIcon = getSubtypeIconDef(
              types,
              m.categoryId,
              m.subtypeId
            );
            const pinColor = getSubtypeColor(
              types,
              m.categoryId,
              m.subtypeId
            );
            const icon = createPinIcon(innerIcon, pinColor);

            return (
              <Marker
                key={`${m.categoryId}-${m.subtypeId}-${m.id}`}
                position={m.position}
                icon={icon}
              >
                <Popup>
                  <div className="text-xs">
                    <div className="font-semibold mb-1">{m.id}</div>
                    <div className="text-[11px] text-default-500">
                      {t(`categories.${m.categoryId}.name`)} /{" "}
                      {t(
                        `subtypes.${m.categoryId}.${m.subtypeId}.name`
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
};

export default GameMapView;
