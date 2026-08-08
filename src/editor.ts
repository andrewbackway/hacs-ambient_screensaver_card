import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { fireEvent } from "custom-card-helpers";
import type { HomeAssistant, LovelaceCardEditor } from "custom-card-helpers";

import type { AmbientScreensaverCardConfig, ImmichProfileConfig } from "./types";
import { defaultConfig } from "./config-defaults";

/**
 * Visual (GUI) config editor for the card, required for v1 per
 * custom-card-plan.md §13. Built on HA's own `ha-form` schema-driven form
 * component (the same building block HA's built-in card editors use), so
 * it inherits HA's theming, validation, and selector widgets for free
 * instead of hand-rolling input controls.
 */

interface SchemaEntry {
  name: string;
  selector?: Record<string, unknown>;
  type?: string;
  title?: string;
  flatten?: boolean;
  schema?: SchemaEntry[];
}

const SCHEMA: SchemaEntry[] = [
  {
    name: "",
    type: "expandable",
    title: "Media source",
    flatten: true,
    schema: [
      {
        name: "media_mode",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "local", label: "Local media folder" },
              { value: "immich", label: "Immich (optional)" },
            ],
          },
        },
      },
      { name: "local_media_path", selector: { text: {} } },
      { name: "immich_album_id", selector: { text: {} } },
      {
        name: "immich_access_mode",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "media_source", label: "Media source (via HA, no CORS setup needed)" },
              { value: "api", label: "Direct Immich API (profiles, more control)" },
            ],
          },
        },
      },
      { name: "immich_url", selector: { text: {} } },
      { name: "immich_api_key", selector: { text: { type: "password" } } },
      {
        name: "immich_image_size",
        selector: {
          select: {
            mode: "dropdown",
            options: ["thumbnail", "preview", "fullsize"],
          },
        },
      },
      {
        name: "image_fit",
        selector: {
          select: { mode: "dropdown", options: ["cover", "contain"] },
        },
      },
    ],
  },
  {
    name: "",
    type: "expandable",
    title: "Timing & transitions",
    flatten: true,
    schema: [
      {
        name: "display_time",
        selector: { number: { mode: "box", min: 5, max: 3600, unit_of_measurement: "s" } },
      },
      {
        name: "crossfade_time",
        selector: { number: { mode: "box", min: 0, max: 30, unit_of_measurement: "s" } },
      },
    ],
  },
  {
    name: "",
    type: "expandable",
    title: "Music Assistant",
    flatten: true,
    schema: [
      { name: "music_assistant_player", selector: { entity: { domain: "media_player" } } },
      { name: "music_assistant_fallback_image", selector: { text: {} } },
    ],
  },
  {
    name: "",
    type: "expandable",
    title: "Outdoor weather",
    flatten: true,
    schema: [
      { name: "weather_entity", selector: { entity: { domain: "weather" } } },
      { name: "outdoor_temp_entity", selector: { entity: {} } },
      { name: "outdoor_high_entity", selector: { entity: {} } },
    ],
  },
  {
    name: "",
    type: "expandable",
    title: "Room temperature",
    flatten: true,
    schema: [
      { name: "room_temp_entity", selector: { entity: {} } },
      { name: "room_label", selector: { text: {} } },
      { name: "room_unit", selector: { text: {} } },
    ],
  },
  {
    name: "",
    type: "expandable",
    title: "Location & subtitle",
    flatten: true,
    schema: [
      {
        name: "location_source",
        selector: {
          select: { mode: "dropdown", options: ["static", "immich_metadata"] },
        },
      },
      { name: "location_text", selector: { text: {} } },
      { name: "subtitle_text", selector: { text: {} } },
    ],
  },
  {
    name: "",
    type: "expandable",
    title: "Typography",
    flatten: true,
    schema: [
      { name: "clock_font_size", selector: { text: {} } },
      { name: "weather_font_size", selector: { text: {} } },
      { name: "room_font_size", selector: { text: {} } },
      { name: "location_font_size", selector: { text: {} } },
      { name: "subtitle_font_size", selector: { text: {} } },
      { name: "text_shadow", selector: { text: {} } },
    ],
  },
  {
    name: "",
    type: "expandable",
    title: "Burn-in protection",
    flatten: true,
    schema: [
      { name: "pixel_shift_distance", selector: { number: { mode: "box", unit_of_measurement: "px" } } },
      { name: "pixel_shift_period", selector: { number: { mode: "box", unit_of_measurement: "s" } } },
      { name: "idle_time", selector: { number: { mode: "box", unit_of_measurement: "s" } } },
      { name: "idle_black_after", selector: { number: { mode: "box", unit_of_measurement: "s" } } },
    ],
  },
  {
    name: "",
    type: "expandable",
    title: "Night mode",
    flatten: true,
    schema: [
      { name: "night_mode_light_sensor_entity", selector: { entity: { domain: "sensor" } } },
      { name: "night_mode_light_threshold", selector: { number: { mode: "box" } } },
      { name: "night_mode_clock_opacity", selector: { number: { mode: "slider", min: 0, max: 100, step: 1, unit_of_measurement: "%" } } },
    ],
  },
  {
    name: "",
    type: "expandable",
    title: "Navigation",
    flatten: true,
    schema: [{ name: "tap_navigation_path", selector: { text: {} } }],
  },
  {
    name: "",
    type: "expandable",
    title: "Display brightness",
    flatten: true,
    schema: [
      { name: "brightness_entity", selector: { entity: { domain: "number" } } },
      { name: "brightness_day_default", selector: { number: { mode: "box" } } },
    ],
  },
  {
    name: "",
    type: "expandable",
    title: "Debug",
    flatten: true,
    schema: [{ name: "debug", selector: { boolean: {} } }],
  },
];

const LABELS: Record<string, string> = {
  media_mode: "Photo source",
  local_media_path: "Local media folder (media-source content id)",
  immich_album_id: "Immich album id (media-source mode only)",
  immich_access_mode: "Immich access method",
  immich_url: "Immich server URL",
  immich_api_key: "Immich API key",
  immich_image_size: "Immich image size",
  image_fit: "Image fit",
  display_time: "Display time per photo",
  crossfade_time: "Crossfade duration",
  music_assistant_player: "Music Assistant player",
  music_assistant_fallback_image: "Music fallback image (URL, /local, or media-source)",
  weather_entity: "Weather entity",
  outdoor_temp_entity: "Outdoor temperature entity",
  outdoor_high_entity: "Outdoor high temperature entity",
  room_temp_entity: "Room temperature entity",
  room_label: "Room label",
  room_unit: "Room temperature unit",
  location_source: "Location/subtitle source",
  location_text: "Location text",
  subtitle_text: "Subtitle text",
  clock_font_size: "Clock font size (CSS, e.g. clamp())",
  weather_font_size: "Weather font size",
  room_font_size: "Room temperature font size",
  location_font_size: "Location font size",
  subtitle_font_size: "Subtitle font size",
  text_shadow: "Text shadow (CSS)",
  pixel_shift_distance: "Pixel-shift distance",
  pixel_shift_period: "Pixel-shift period",
  idle_time: "Idle time before dimming",
  idle_black_after: "Idle time before fading to black",
  night_mode_light_sensor_entity: "Night mode light sensor",
  night_mode_light_threshold: "Night mode threshold (state \u2264 this = night)",
  night_mode_clock_opacity: "Night clock opacity",
  tap_navigation_path: "Tap navigation path",
  brightness_entity: "Screen brightness entity (number.*)",
  brightness_day_default: "Day brightness fallback",
  debug: "Show debug overlay",
};

const PROFILE_TYPE_OPTIONS = [
  { value: "random", label: "Random (no filter)" },
  { value: "album", label: "Album" },
  { value: "people", label: "People / faces" },
  { value: "favorites", label: "Favorites only" },
  { value: "memories", label: "On this day / memories" },
  { value: "location", label: "Location / trips" },
];

function splitCsv(value: string): string[] {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

let profileCounter = 0;
function createDefaultProfile(): ImmichProfileConfig {
  profileCounter += 1;
  return {
    id: `profile-${Date.now()}-${profileCounter}`,
    type: "random",
    pool_size: 20,
    enabled: true,
  };
}

@customElement("ambient-screensaver-card-editor")
export class AmbientScreensaverCardEditor
  extends LitElement
  implements LovelaceCardEditor
{
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _config?: AmbientScreensaverCardConfig;

  static styles = css`
    .profiles {
      margin-top: 16px;
      padding: 8px 0;
      border-top: 1px solid var(--divider-color);
    }
    .profiles h3 {
      margin: 8px 0 0 0;
    }
    .hint {
      margin: 4px 0 12px 0;
      color: var(--secondary-text-color);
      font-size: 0.9em;
    }
    .profile-row {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: 8px;
      padding: 12px 8px;
      margin-bottom: 8px;
      border-radius: 8px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .profile-row > * {
      flex: 1 1 160px;
    }
    .profile-row ha-selector[data-field="enabled"] {
      flex: 0 0 auto;
      min-width: 90px;
    }
    .remove-button {
      flex: 0 0 auto;
    }
  `;

  public setConfig(config: AmbientScreensaverCardConfig): void {
    this._config = config;
  }

  private _computeLabel = (schema: SchemaEntry): string => {
    return LABELS[schema.name] ?? schema.title ?? schema.name;
  };

  private _valueChanged(ev: CustomEvent<{ value: AmbientScreensaverCardConfig }>): void {
    ev.stopPropagation();
    this._emitConfig(ev.detail.value);
  }

  private _emitConfig(patch: Partial<AmbientScreensaverCardConfig>): void {
    const newConfig: AmbientScreensaverCardConfig = {
      ...defaultConfig,
      ...this._config,
      ...patch,
      type: "custom:ambient-screensaver-card",
    } as AmbientScreensaverCardConfig;
    this._config = newConfig;
    fireEvent(this, "config-changed", { config: newConfig });
  }

  private _addProfile(): void {
    const profiles = [
      ...(this._config?.immich_profiles ?? []),
      createDefaultProfile(),
    ];
    this._emitConfig({ immich_profiles: profiles });
  }

  private _removeProfile(index: number): void {
    const profiles = (this._config?.immich_profiles ?? []).filter(
      (_, i) => i !== index
    );
    this._emitConfig({ immich_profiles: profiles });
  }

  private _updateProfile(index: number, patch: Partial<ImmichProfileConfig>): void {
    const profiles = [...(this._config?.immich_profiles ?? [])];
    profiles[index] = { ...profiles[index], ...patch };
    this._emitConfig({ immich_profiles: profiles });
  }

  private _renderProfilesEditor(profiles: ImmichProfileConfig[]) {
    return html`
      <div class="profiles">
        <h3>Immich profiles</h3>
        <p class="hint">
          Each enabled profile below contributes photos into one shared
          random pool - e.g. combine a "Favorites" profile with an "Album"
          profile to mix both into the same rotation.
        </p>
        ${profiles.map((profile, index) =>
          this._renderProfileRow(profile, index)
        )}
        <mwc-button outlined @click=${this._addProfile}>
          + Add profile
        </mwc-button>
      </div>
    `;
  }

  private _renderProfileRow(profile: ImmichProfileConfig, index: number) {
    const update = (patch: Partial<ImmichProfileConfig>) =>
      this._updateProfile(index, patch);

    return html`
      <div class="profile-row">
        <ha-selector
          data-field="enabled"
          .hass=${this.hass}
          .selector=${{ boolean: {} }}
          .value=${profile.enabled ?? true}
          label="Enabled"
          @value-changed=${(e: CustomEvent) => update({ enabled: e.detail.value })}
        ></ha-selector>

        <ha-selector
          .hass=${this.hass}
          .selector=${{ select: { mode: "dropdown", options: PROFILE_TYPE_OPTIONS } }}
          .value=${profile.type}
          label="Type"
          @value-changed=${(e: CustomEvent) => update({ type: e.detail.value })}
        ></ha-selector>

        <ha-selector
          .hass=${this.hass}
          .selector=${{ number: { mode: "box", min: 1, max: 200 } }}
          .value=${profile.pool_size ?? 20}
          label="Max photos"
          @value-changed=${(e: CustomEvent) => update({ pool_size: e.detail.value })}
        ></ha-selector>

        ${profile.type === "album"
          ? html`
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${(profile.album_ids ?? []).join(", ")}
                label="Album IDs (comma-separated)"
                @value-changed=${(e: CustomEvent) =>
                  update({ album_ids: splitCsv(e.detail.value) })}
              ></ha-selector>
            `
          : nothing}
        ${profile.type === "people"
          ? html`
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${(profile.person_ids ?? []).join(", ")}
                label="Person IDs (comma-separated)"
                @value-changed=${(e: CustomEvent) =>
                  update({ person_ids: splitCsv(e.detail.value) })}
              ></ha-selector>
            `
          : nothing}
        ${profile.type === "location"
          ? html`
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${profile.city ?? ""}
                label="City"
                @value-changed=${(e: CustomEvent) => update({ city: e.detail.value })}
              ></ha-selector>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${profile.state ?? ""}
                label="State"
                @value-changed=${(e: CustomEvent) => update({ state: e.detail.value })}
              ></ha-selector>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${profile.country ?? ""}
                label="Country"
                @value-changed=${(e: CustomEvent) => update({ country: e.detail.value })}
              ></ha-selector>
            `
          : nothing}

        <mwc-icon-button
          class="remove-button"
          title="Remove profile"
          @click=${() => this._removeProfile(index)}
        >
          <ha-icon icon="mdi:delete"></ha-icon>
        </mwc-icon-button>
      </div>
    `;
  }

  protected render() {
    if (!this.hass || !this._config) return nothing;

    const data = { ...defaultConfig, ...this._config };
    const showProfiles =
      data.media_mode === "immich" && data.immich_access_mode === "api";

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${SCHEMA}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
      ${showProfiles
        ? this._renderProfilesEditor(data.immich_profiles ?? [])
        : nothing}
    `;
  }
}
