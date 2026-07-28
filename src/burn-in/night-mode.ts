import type { HomeAssistant } from "custom-card-helpers";
import type { AmbientScreensaverCardConfig } from "../types";

/**
 * Resolves whether night mode should be active, driven by a numeric
 * light-level sensor entity (per custom-card-plan.md §14.6) - night mode is
 * active while the sensor's state is at or below `night_mode_light_threshold`.
 *
 * If the sensor is missing, `unavailable`, `unknown`, or non-numeric, the
 * previous night-mode state is kept unchanged rather than guessing, so a
 * transient sensor outage never forces an unwanted mode flip.
 */
export function isNightModeActive(
  hass: HomeAssistant,
  config: AmbientScreensaverCardConfig,
  previousState: boolean
): boolean {
  const entityId =
    config.night_mode_light_sensor_entity ?? "sensor.room_light_sensor";
  const threshold = config.night_mode_light_threshold ?? 0;

  const sensor = hass.states[entityId];
  if (!sensor || sensor.state === "unavailable" || sensor.state === "unknown") {
    return previousState;
  }

  const level = parseFloat(sensor.state);
  if (Number.isNaN(level)) {
    return previousState;
  }

  return level <= threshold;
}
