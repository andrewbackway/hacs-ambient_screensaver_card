import type { HomeAssistant } from "custom-card-helpers";
import type { AmbientScreensaverCardConfig } from "../types";
import { resolveNumeric } from "./entity-fallback";

export interface RoomTempDisplay {
  temp: number;
  label: string;
  unit: string;
}

/**
 * Room temperature fallback chain (per custom-card-plan.md §5):
 * dedicated sensor -> climate entity's `current_temperature` attribute ->
 * literal default.
 */
export function getRoomTempDisplay(
  hass: HomeAssistant,
  config: AmbientScreensaverCardConfig
): RoomTempDisplay {
  const temp = resolveNumeric(
    hass,
    config.room_temp_entity,
    undefined,
    resolveClimateFallback(hass, config),
    undefined
  );

  return {
    temp,
    label: config.room_label ?? "Room",
    unit: config.room_unit ?? "°C",
  };
}

function resolveClimateFallback(
  hass: HomeAssistant,
  config: AmbientScreensaverCardConfig
): number {
  return resolveNumeric(
    hass,
    config.room_temp_climate_entity,
    undefined,
    config.room_temp_default ?? 21.5,
    "current_temperature"
  );
}
