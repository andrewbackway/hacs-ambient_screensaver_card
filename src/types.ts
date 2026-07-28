import type { LovelaceCardConfig } from "custom-card-helpers";

/** Where photos are sourced from. */
export type MediaMode = "local" | "immich";

/**
 * How Immich photos are fetched, when `media_mode: "immich"`:
 *  - `media_source`: via HA's own `media_source` WebSocket API (no CORS,
 *    but depends on the Immich HA integration exposing a media-source).
 *  - `api`: direct browser -> Immich REST API calls (full profile support
 *    below), which requires Immich to accept cross-origin requests from
 *    the dashboard's origin (native CORS support or a same-origin reverse
 *    proxy) - see README "Immich direct API mode" for details.
 */
export type ImmichAccessMode = "media_source" | "api";

/** Night-dimming trigger strategy. */
export type NightDimMode = "sun" | "hours";

/** One filter combination contributing photos into the shared random pool. */
export type ImmichProfileType =
  | "random"
  | "album"
  | "people"
  | "favorites"
  | "memories"
  | "location";

export interface ImmichProfileConfig {
  id: string;
  enabled?: boolean;
  type: ImmichProfileType;
  /** Max photos this profile contributes to the pool. */
  pool_size?: number;
  album_ids?: string[]; // used when type === "album"
  person_ids?: string[]; // used when type === "people"
  city?: string; // used when type === "location"
  state?: string; // used when type === "location"
  country?: string; // used when type === "location"
}

/**
 * Full configuration schema for the ambient-screensaver-card.
 * Every field is optional at the YAML level; sensible defaults live in
 * `defaultConfig` (config-defaults.ts) and are merged in `setConfig()`.
 */
export interface AmbientScreensaverCardConfig extends LovelaceCardConfig {
  type: "custom:ambient-screensaver-card";

  // --- Media source -------------------------------------------------------
  media_mode?: MediaMode;
  local_media_path?: string; // media-source content id, e.g. "media-source://media_source/local/screensaver"
  immich_album_id?: string; // used when immich_access_mode === "media_source"
  image_fit?: "cover" | "contain";

  // --- Immich direct API mode ---------------------------------------------
  immich_access_mode?: ImmichAccessMode;
  immich_url?: string; // e.g. https://immich.example.com (no trailing slash)
  immich_api_key?: string; // NOTE: stored in plain text in the dashboard config - see README security note
  immich_image_size?: "thumbnail" | "preview" | "fullsize";
  immich_profiles?: ImmichProfileConfig[];

  // --- Timing ---------------------------------------------------------------
  display_time?: number; // seconds a photo stays on screen
  crossfade_time?: number; // seconds for the crossfade transition

  // --- Outdoor weather --------------------------------------------------
  weather_entity?: string;
  outdoor_temp_entity?: string;
  outdoor_temp_fallback_entity?: string;
  outdoor_temp_default?: number;
  outdoor_high_entity?: string;
  outdoor_high_fallback_entity?: string;
  outdoor_high_default?: number;

  // --- Room temp ------------------------------------------------------------
  room_temp_entity?: string;
  room_temp_climate_entity?: string;
  room_temp_default?: number;
  room_label?: string;
  room_unit?: string;

  // --- Location / subtitle -------------------------------------------------
  location_source?: "static" | "immich_metadata";
  location_text?: string;
  subtitle_text?: string;

  // --- Typography (accepts any valid CSS size, e.g. clamp()) ---------------
  clock_font_size?: string;
  weather_font_size?: string;
  room_font_size?: string;
  location_font_size?: string;
  subtitle_font_size?: string;
  text_shadow?: string;

  // --- Burn-in protection -------------------------------------------------
  pixel_shift_distance?: number; // px
  pixel_shift_period?: number; // seconds
  night_dim_mode?: NightDimMode;
  night_dim_start_hour?: number; // 0-23, used when night_dim_mode === "hours"
  night_dim_end_hour?: number; // 0-23, used when night_dim_mode === "hours"
  day_opacity?: number; // 0-1
  night_opacity?: number; // 0-1
  idle_time?: number; // seconds of no interaction before dimming
  idle_black_after?: number; // seconds of no interaction before fading to black
}
