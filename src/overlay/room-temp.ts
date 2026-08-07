import type { HomeAssistant } from "custom-card-helpers";
import type { AmbientScreensaverCardConfig } from "../types";
import { getState } from "./entity-fallback";

export interface RoomTempDisplay {
  temp: number;
  label: string;
  unit: string;
}

/**
 * Resolves the configured room temperature entity without substituting a
 * fallback value when the entity is unavailable.
 */
export function getRoomTempDisplay(
  hass: HomeAssistant,
  config: AmbientScreensaverCardConfig
): RoomTempDisplay | undefined {
  const value = getState(hass, config.room_temp_entity);
  if (value === undefined) return undefined;

  const temp = Number(value);
  if (!Number.isFinite(temp)) return undefined;

  return {
    temp,
    label: config.room_label ?? "Room",
    unit: config.room_unit ?? "°C",
  };
}
