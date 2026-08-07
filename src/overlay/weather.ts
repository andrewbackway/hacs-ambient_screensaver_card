import type { HomeAssistant } from "custom-card-helpers";
import type { AmbientScreensaverCardConfig } from "../types";
import { getState } from "./entity-fallback";

const CONDITION_ICONS: Record<string, string> = {
  "clear-night": "mdi:weather-night",
  cloudy: "mdi:weather-cloudy",
  fog: "mdi:weather-fog",
  hail: "mdi:weather-hail",
  lightning: "mdi:weather-lightning",
  "lightning-rainy": "mdi:weather-lightning-rainy",
  partlycloudy: "mdi:weather-partly-cloudy",
  pouring: "mdi:weather-pouring",
  rainy: "mdi:weather-rainy",
  snowy: "mdi:weather-snowy",
  "snowy-rainy": "mdi:weather-snowy-rainy",
  sunny: "mdi:weather-sunny",
  windy: "mdi:weather-windy",
  "windy-variant": "mdi:weather-windy-variant",
  exceptional: "mdi:alert-circle-outline",
};

const DEFAULT_ICON = "mdi:weather-cloudy";

export interface WeatherDisplay {
  icon: string;
  outdoorTemp: number;
  outdoorHigh: number;
}

export function getWeatherDisplay(
  hass: HomeAssistant,
  config: AmbientScreensaverCardConfig
): WeatherDisplay | undefined {
  const condition = getState(hass, config.weather_entity);
  const icon = (condition && CONDITION_ICONS[condition]) || DEFAULT_ICON;

  const outdoorTemp = getNumericState(hass, config.outdoor_temp_entity);
  const outdoorHigh = getNumericState(hass, config.outdoor_high_entity);
  if (outdoorTemp === undefined || outdoorHigh === undefined) return undefined;

  return { icon, outdoorTemp, outdoorHigh };
}

function getNumericState(
  hass: HomeAssistant,
  entityId: string | undefined
): number | undefined {
  const value = getState(hass, entityId);
  if (value === undefined) return undefined;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
}
