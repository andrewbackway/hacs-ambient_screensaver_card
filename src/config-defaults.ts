import type { AmbientScreensaverCardConfig } from "./types";

/**
 * Defaults for every optional field in `AmbientScreensaverCardConfig`.
 * `setConfig()` merges the user's YAML/UI config on top of this object,
 * so every downstream consumer can assume every field is present.
 */
export const defaultConfig: Required<
  Omit<AmbientScreensaverCardConfig, "type" | "immich_album_id">
> &
  Pick<AmbientScreensaverCardConfig, "immich_album_id"> = {
  media_mode: "local",
  local_media_path: "media-source://media_source/local/screensaver",
  immich_album_id: undefined,
  image_fit: "cover",

  immich_access_mode: "media_source",
  immich_url: "",
  immich_api_key: "",
  immich_image_size: "preview",
  immich_profiles: [],

  display_time: 30,
  crossfade_time: 2,

  weather_entity: "weather.home",
  outdoor_temp_entity: "sensor.laverton_temp",
  outdoor_temp_fallback_entity: "sensor.outdoor_temperature",
  outdoor_temp_default: 22,
  outdoor_high_entity: "sensor.laverton_temp_max",
  outdoor_high_fallback_entity: "sensor.outdoor_high_temperature",
  outdoor_high_default: 26,

  room_temp_entity: "sensor.office_temperature",
  room_temp_climate_entity: "climate.daikin_dup_office",
  room_temp_default: 21.5,
  room_label: "Office",
  room_unit: "°C",

  location_source: "static",
  location_text: "Home",
  subtitle_text: "",

  clock_font_size: "clamp(3.5rem, 9vw, 6rem)",
  weather_font_size: "clamp(1.2rem, 3vw, 2rem)",
  room_font_size: "clamp(0.8rem, 1.8vw, 1.2rem)",
  location_font_size: "clamp(1.2rem, 3vw, 2rem)",
  subtitle_font_size: "clamp(0.8rem, 1.8vw, 1.2rem)",
  text_shadow: "0px 2px 12px rgba(0, 0, 0, 0.9)",

  pixel_shift_distance: 6,
  pixel_shift_period: 60,
  night_dim_mode: "sun",
  night_dim_start_hour: 22,
  night_dim_end_hour: 6,
  day_opacity: 1,
  night_opacity: 0.4,
  idle_time: 120,
  idle_black_after: 600,
};
