import type { HomeAssistant } from "custom-card-helpers";

export function getState(
  hass: HomeAssistant,
  entityId?: string
): string | undefined {
  if (!entityId) return undefined;
  const state = hass.states[entityId];
  if (!state || state.state === "unknown" || state.state === "unavailable") {
    return undefined;
  }
  return state.state;
}

export function getAttribute(
  hass: HomeAssistant,
  entityId?: string,
  attribute?: string
): string | undefined {
  if (!entityId || !attribute) return undefined;
  const state = hass.states[entityId];
  if (!state) return undefined;
  const value = state.attributes[attribute];
  return value === undefined || value === null ? undefined : String(value);
}

function toNumber(value: string | undefined): number | undefined {
  if (value === undefined) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Resolves a numeric display value using the three-tier fallback chain
 * used throughout the overlay: primary entity -> fallback entity -> literal
 * default. Optionally reads an attribute (e.g. a climate entity's
 * `current_temperature`) instead of the entity's own state.
 */
export function resolveNumeric(
  hass: HomeAssistant,
  primaryEntity: string | undefined,
  fallbackEntity: string | undefined,
  defaultValue: number,
  attribute?: string
): number {
  const primary = attribute
    ? toNumber(getAttribute(hass, primaryEntity, attribute))
    : toNumber(getState(hass, primaryEntity));
  if (primary !== undefined) return primary;

  const fallback = toNumber(getState(hass, fallbackEntity));
  if (fallback !== undefined) return fallback;

  return defaultValue;
}
