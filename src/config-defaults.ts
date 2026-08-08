import type { AmbientScreensaverCardConfig } from "./types";

/**
 * Defaults for every optional field in `AmbientScreensaverCardConfig`.
 * `setConfig()` merges the user's YAML/UI config on top of this object,
 * so every downstream consumer can assume every field is present.
 */
export const defaultConfig: Required<
  Omit<
    AmbientScreensaverCardConfig,
    | "type"
    | "immich_album_id"
    | "brightness_entity"
    | "music_assistant_player"
    | "music_assistant_fallback_image"
    | "tap_navigation_path"
  >
> &
  Pick<
    AmbientScreensaverCardConfig,
    | "immich_album_id"
    | "brightness_entity"
    | "music_assistant_player"
    | "music_assistant_fallback_image"
    | "tap_navigation_path"
  > = {
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

  music_assistant_player: undefined,
  music_assistant_fallback_image: undefined,

  weather_entity: "weather.home",
  outdoor_temp_entity: "sensor.laverton_temp",
  outdoor_high_entity: "sensor.laverton_temp_max",

  room_temp_entity: "sensor.office_temperature",
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
  idle_time: 120,
  idle_black_after: 600,

  night_mode_light_sensor_entity: "sensor.room_light_sensor",
  night_mode_light_threshold: 10,
  night_mode_clock_opacity: 10,

  tap_navigation_path: undefined,

  brightness_entity: undefined,
  brightness_day_default: 100,

  debug: false,
};
