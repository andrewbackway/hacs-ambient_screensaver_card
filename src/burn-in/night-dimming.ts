import type { HomeAssistant } from "custom-card-helpers";
import type { AmbientScreensaverCardConfig } from "../types";

/**
 * Resolves the current dimming opacity for night-time burn-in protection.
 * Two strategies (per custom-card-plan.md §7 / §5):
 *  - `sun`: dim whenever `sun.sun` is below the horizon.
 *  - `hours`: dim during a fixed hour window (handles wrap-around, e.g.
 *    22 -> 6).
 */
export function getNightOpacity(
  hass: HomeAssistant,
  config: AmbientScreensaverCardConfig,
  now: Date = new Date()
): number {
  const dayOpacity = config.day_opacity ?? 1;
  const nightOpacity = config.night_opacity ?? 0.4;

  const isNight =
    config.night_dim_mode === "hours"
      ? isWithinHourWindow(
          now.getHours(),
          config.night_dim_start_hour ?? 22,
          config.night_dim_end_hour ?? 6
        )
      : hass.states["sun.sun"]?.state === "below_horizon";

  return isNight ? nightOpacity : dayOpacity;
}

function isWithinHourWindow(
  hour: number,
  start: number,
  end: number
): boolean {
  if (start === end) return false;
  if (start < end) {
    return hour >= start && hour < end;
  }
  // Wraps past midnight, e.g. 22 -> 6.
  return hour >= start || hour < end;
}
