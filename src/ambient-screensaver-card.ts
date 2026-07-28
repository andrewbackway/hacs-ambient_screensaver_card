import { LitElement, html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import type { HomeAssistant, LovelaceCardEditor } from "custom-card-helpers";

import type { AmbientScreensaverCardConfig } from "./types";
import { defaultConfig } from "./config-defaults";
import { MediaController } from "./media/media-controller";
import type { ResolvedMediaItem } from "./media/media-source";
import { getClockDisplay } from "./overlay/clock";
import { getWeatherDisplay } from "./overlay/weather";
import { getRoomTempDisplay } from "./overlay/room-temp";
import { getLocationDisplay } from "./overlay/location";
import { PixelShiftController } from "./burn-in/pixel-shift";
import { getNightOpacity } from "./burn-in/night-dimming";
import { IdleController, type IdleState } from "./burn-in/idle-black";
import { styles } from "./styles";
import "./editor";

type ResolvedConfig = typeof defaultConfig & AmbientScreensaverCardConfig;

@customElement("ambient-screensaver-card")
export class AmbientScreensaverCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _config?: ResolvedConfig;
  @state() private _urls: { a: string; b: string } = { a: "", b: "" };
  @state() private _activeLayer: "a" | "b" = "a";
  @state() private _clock = getClockDisplay();
  @state() private _idleState: IdleState = "active";
  @state() private _dimOpacity = 1;

  private _media?: MediaController;
  private _currentItem: ResolvedMediaItem | null = null;
  private _clockTimer?: ReturnType<typeof setInterval>;
  private _rotationTimer?: ReturnType<typeof setInterval>;
  private _dimTimer?: ReturnType<typeof setInterval>;
  private readonly _pixelShift = new PixelShiftController();
  private readonly _idle = new IdleController();

  static styles = styles;

  public static getConfigElement(): LovelaceCardEditor {
    return document.createElement(
      "ambient-screensaver-card-editor"
    ) as unknown as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<AmbientScreensaverCardConfig> {
    return { type: "custom:ambient-screensaver-card" };
  }

  public setConfig(config: AmbientScreensaverCardConfig): void {
    if (!config) {
      throw new Error("Invalid configuration");
    }
    this._config = { ...defaultConfig, ...config };
    this._media?.updateConfig(this._config);
    this._applyHostVariables();
  }

  public getCardSize(): number {
    return 5;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._clockTimer = setInterval(() => {
      this._clock = getClockDisplay();
      this._updateDimOpacity();
    }, 1000);

    this._idle.start(
      this._config?.idle_time ?? defaultConfig.idle_time,
      this._config?.idle_black_after ?? defaultConfig.idle_black_after,
      (state) => {
        this._idleState = state;
      }
    );

    this._pixelShift.start(
      this._config?.pixel_shift_distance ?? defaultConfig.pixel_shift_distance,
      this._config?.pixel_shift_period ?? defaultConfig.pixel_shift_period,
      (dx, dy) => {
        this.style.setProperty("--asc-shift-x", `${dx}px`);
        this.style.setProperty("--asc-shift-y", `${dy}px`);
      }
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._clockTimer) clearInterval(this._clockTimer);
    if (this._rotationTimer) clearInterval(this._rotationTimer);
    if (this._dimTimer) clearInterval(this._dimTimer);
    this._idle.stop();
    this._pixelShift.stop();
    this._media?.dispose();
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);

    if (changed.has("hass") && this._media) {
      this._media.updateHass(this.hass);
    }

    if (this.hass && this._config && !this._media) {
      this._media = new MediaController(this.hass, this._config);
      void this._startRotation();
      this._updateDimOpacity();
      this._dimTimer = setInterval(() => this._updateDimOpacity(), 60_000);
    }
  }

  private async _startRotation(): Promise<void> {
    await this._advancePhoto();
    const displaySeconds =
      this._config?.display_time ?? defaultConfig.display_time;
    this._rotationTimer = setInterval(
      () => void this._advancePhoto(),
      Math.max(1, displaySeconds) * 1000
    );
  }

  private async _advancePhoto(): Promise<void> {
    if (!this._media) return;
    const next = await this._media.getNext();
    if (!next) return;

    this._currentItem = next;
    const showingA = this._activeLayer === "a";
    if (showingA) {
      this._urls = { ...this._urls, b: next.url };
      this._activeLayer = "b";
    } else {
      this._urls = { ...this._urls, a: next.url };
      this._activeLayer = "a";
    }
  }

  private _updateDimOpacity(): void {
    if (!this.hass || !this._config) return;
    this._dimOpacity = getNightOpacity(this.hass, this._config);
  }

  private _applyHostVariables(): void {
    if (!this._config) return;
    const c = this._config;
    this.style.setProperty("--asc-crossfade-time", `${c.crossfade_time}s`);
    this.style.setProperty(
      "--asc-clock-font-size",
      c.clock_font_size ?? defaultConfig.clock_font_size
    );
    this.style.setProperty(
      "--asc-weather-font-size",
      c.weather_font_size ?? defaultConfig.weather_font_size
    );
    this.style.setProperty(
      "--asc-room-font-size",
      c.room_font_size ?? defaultConfig.room_font_size
    );
    this.style.setProperty(
      "--asc-location-font-size",
      c.location_font_size ?? defaultConfig.location_font_size
    );
    this.style.setProperty(
      "--asc-subtitle-font-size",
      c.subtitle_font_size ?? defaultConfig.subtitle_font_size
    );
    this.style.setProperty(
      "--asc-text-shadow",
      c.text_shadow ?? defaultConfig.text_shadow
    );
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;

    const weather = getWeatherDisplay(this.hass, this._config);
    const room = getRoomTempDisplay(this.hass, this._config);
    const location = getLocationDisplay(this._config, this._currentItem);

    const dimStyle = styleMap({
      "--asc-dim-opacity": this._idleState === "black" ? 0 : this._dimOpacity,
    });

    return html`
      <div class="photo-layer" style=${dimStyle}>
        <div
          class="photo ${this._config.image_fit} ${this._activeLayer === "a"
            ? "visible"
            : ""}"
          style="background-image:url('${this._urls.a}')"
        ></div>
        <div
          class="photo ${this._config.image_fit} ${this._activeLayer === "b"
            ? "visible"
            : ""}"
          style="background-image:url('${this._urls.b}')"
        ></div>
      </div>
      <div class="overlay" style=${dimStyle}>
        <div class="bottom-left">
          <div class="clock">
            ${this._clock.time}<span style="font-size:0.4em;">
              ${this._clock.ampm}</span
            >
          </div>
          <div class="weather-row">
            <ha-icon icon=${weather.icon}></ha-icon>
            <span
              >${Math.round(weather.outdoorTemp)}° /
              ${Math.round(weather.outdoorHigh)}°</span
            >
          </div>
          <div class="room-row">
            ${room.label}: ${room.temp}${room.unit}
          </div>
        </div>
        <div class="bottom-right">
          <div class="location">${location.location}</div>
          ${location.subtitle
            ? html`<div class="subtitle">${location.subtitle}</div>`
            : nothing}
        </div>
      </div>
      <div
        class="black-curtain ${this._idleState === "black" ? "visible" : ""}"
      ></div>
    `;
  }
}

// Registers the card with HA's "Add Card" picker UI.
declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}
window.customCards = window.customCards || [];
window.customCards.push({
  type: "ambient-screensaver-card",
  name: "Ambient Screensaver Card",
  description:
    "Full-screen rotating photo ambient screensaver with clock/weather/room-temp overlay and burn-in protection.",
});
