// src/components/MapSidebar.tsx
import React, { useState } from "react";
import { Card, Button, Spinner } from "@heroui/react";
import { useTranslation } from "react-i18next";
import type {
  GameMapMeta,
  MarkerTypeCategory,
} from "../types/game";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as SolidIcons from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

type Props = {
  maps: GameMapMeta[];
  types: MarkerTypeCategory[];
  selectedMapId: string | null;
  onMapChange: (id: string) => void;
  loadingMarkers: boolean;
  subtypeCounts: Map<string, number>;
  visibleSubtypes: Set<string>;
  onToggleSubtype: (categoryId: string, subtypeId: string) => void;
};

const MapSidebar: React.FC<Props> = ({
                                       maps,
                                       types,
                                       selectedMapId,
                                       onMapChange,
                                       loadingMarkers,
                                       subtypeCounts,
                                       visibleSubtypes,
                                       onToggleSubtype,
                                     }) => {
  const { t } = useTranslation(["maps", "types"]);

  // Track collapsed categories: if in set → collapsed
  const [collapsedCategories, setCollapsedCategories] = useState<
    Set<string>
  >(new Set());

  const toggleCategory = (categoryId: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  };

  return (
    <aside className="w-80 border-r border-default-200 p-3 flex flex-col gap-4 overflow-y-auto">
      {/* Map selection */}
      <Card className="p-3">
        <h2 className="text-sm font-semibold mb-2">
          {t("maps:listTitle", "Maps")}
        </h2>
        <div className="flex flex-col gap-2">
          {maps.map((map) => (
            <Button
              key={map.id}
              size="sm"
              variant={map.id === selectedMapId ? "solid" : "light"}
              className="justify-start"
              onPress={() => onMapChange(map.id)}
            >
              {t(`maps:${map.id}.name`)}
            </Button>
          ))}
        </div>
      </Card>

      {/* Categories & subtypes */}
      <Card className="p-3 flex-1 overflow-auto">
        <h2 className="text-sm font-semibold mb-2">
          {t("types:listTitle", "Marker Types")}
        </h2>

        {loadingMarkers && (
          <div className="flex items-center gap-2 text-xs text-default-500 mb-2">
            <Spinner size="sm" /> <span>Loading markers...</span>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {types.map((cat) => {
            const isCollapsed = collapsedCategories.has(cat.id);

            return (
              <div key={cat.id}>
                {/* Category header with collapse/expand chevron */}
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wide mb-1 opacity-80 hover:opacity-100"
                >
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon
                      icon={
                        (isCollapsed
                          ? SolidIcons.faChevronRight
                          : SolidIcons.faChevronDown) as IconDefinition
                      }
                      className="text-[10px]"
                    />
                    {t(`types:categories.${cat.id}.name`)}
                  </span>
                </button>

                {!isCollapsed && (
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {cat.subtypes.map((sub) => {
                      const key = `${cat.id}::${sub.id}`;
                      const count = subtypeCounts.get(key) ?? 0;
                      const active = visibleSubtypes.has(key);

                      // Icon comes directly from YAML: sub.icon or fallback to cat.icon
                      const iconName = (sub as any).icon || (cat as any).icon;
                      const icon: IconDefinition =
                        (SolidIcons as any)[iconName] ??
                        (SolidIcons.faCircleDot as IconDefinition);

                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => onToggleSubtype(cat.id, sub.id)}
                          className={[
                            "flex items-center justify-between text-xs px-2 py-1 rounded border transition-colors",
                            active
                              ? "bg-default-100 border-default-300"
                              : "bg-content1 border-default-200 opacity-60 hover:opacity-80",
                          ].join(" ")}
                        >
                          <span className="flex items-center gap-1 min-w-0">
                            <FontAwesomeIcon
                              icon={icon}
                              className="text-[11px]"
                            />
                            <span className="truncate text-left">
                              {t(
                                `types:subtypes.${cat.id}.${sub.id}.name`,
                              )}
                            </span>
                          </span>
                          <span className="text-[11px] text-default-500 ml-2">
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {types.length === 0 && (
            <p className="text-xs text-default-500">
              No marker types loaded.
            </p>
          )}
        </div>
      </Card>
    </aside>
  );
};

export default MapSidebar;
