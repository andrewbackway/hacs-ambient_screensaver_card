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
import { getMusicDisplay } from "./media/music-assistant";
import { resolveMedia } from "./media/media-source";
import type { MusicDisplay } from "./types";
import { PixelShiftController } from "./burn-in/pixel-shift";
import { isNightModeActive } from "./burn-in/night-mode";
import { IdleController, type IdleState } from "./burn-in/idle-black";
import { styles } from "./styles";
import "./editor";

/** Minimum swipe distance (px) and velocity (px/ms) to count as a photo-nav gesture. */
const SWIPE_MIN_DISTANCE = 50;
const SWIPE_MIN_VELOCITY = 0.2;
/** Max photos kept in the in-memory "previous" history buffer. */
const HISTORY_CAP = 50;

type ResolvedConfig = typeof defaultConfig & AmbientScreensaverCardConfig;

@customElement("ambient-screensaver-card")
export class AmbientScreensaverCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _config?: ResolvedConfig;
  @state() private _urls: { a: string; b: string } = { a: "", b: "" };
  @state() private _activeLayer: "a" | "b" = "a";
  @state() private _clock = getClockDisplay();
  @state() private _idleState: IdleState = "active";
  @state() private _isNightMode = false;
  @state() private _screenWidth = 0;
  @state() private _screenHeight = 0;
  @state() private _devicePixelRatio = 1;
  @state() private _music?: MusicDisplay;
  @state() private _musicFallbackUrl = "";

  private _media?: MediaController;
  private _currentItem: ResolvedMediaItem | null = null;
  private _history: ResolvedMediaItem[] = [];
  private _historyIndex = -1;
  private _previousBrightness?: number;
  private _editorMode = false;
  private _clockTimer?: ReturnType<typeof setInterval>;
  private _rotationTimer?: ReturnType<typeof setInterval>;
  private _musicTimer?: ReturnType<typeof setInterval>;
  private _fallbackRequest = 0;
  private _resolvedFallbackSource = "";
  private readonly _pixelShift = new PixelShiftController();
  private readonly _idle = new IdleController();

  private _pointerStartX = 0;
  private _pointerStartY = 0;
  private _pointerStartTime = 0;
  private _pointerStartTarget: EventTarget | null = null;

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
    void this._resolveMusicFallback();
    if (this.hass) this._updateMusicState();
  }

  public getCardSize(): number {
    return 5;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._editorMode = this._inEditor();
    if (this._editorMode) return;

    this._clockTimer = setInterval(() => {
      this._clock = getClockDisplay();
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

    this._updateScreenSize();
    window.addEventListener("resize", this._handleResize);
    this.addEventListener("pointerdown", this._handlePointerDown, {
      passive: true,
    });
    this.addEventListener("pointerup", this._handlePointerUp, {
      passive: true,
    });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._editorMode) return;

    if (this._clockTimer) clearInterval(this._clockTimer);
    if (this._rotationTimer) clearInterval(this._rotationTimer);
    this._idle.stop();
    this._pixelShift.stop();
    this._media?.dispose();
    if (this._musicTimer) clearInterval(this._musicTimer);
    window.removeEventListener("resize", this._handleResize);
    this.removeEventListener("pointerdown", this._handlePointerDown);
    this.removeEventListener("pointerup", this._handlePointerUp);
  }

  /**
   * Detects whether the card is currently rendering inside the Lovelace
   * card config editor's live preview (rather than a real dashboard), by
   * walking up through the DOM/shadow-DOM boundary looking for an
   * "-editor"-ish ancestor. When true, timers/service calls/media fetches
   * are skipped entirely so editing a config never spams the log or a real
   * HA entity - see custom-card-plan.md §14.9.
   */
  private _inEditor(): boolean {
    let node: Node | null = this.parentNode;
    while (node) {
      if (node instanceof Element) {
        const tag = node.tagName.toLowerCase();
        if (
          tag.includes("-editor") ||
          Array.from(node.classList).some((c) => c.includes("editor"))
        ) {
          return true;
        }
      }
      node = node.parentNode ?? (node as Node & { host?: Node }).host ?? null;
    }
    return false;
  }

  private _handleResize = (): void => {
    this._updateScreenSize();
  };

  private _updateScreenSize(): void {
    const dpr = window.devicePixelRatio || 1;
    this._screenWidth = Math.round(window.innerWidth * dpr);
    this._screenHeight = Math.round(window.innerHeight * dpr);
    this._devicePixelRatio = dpr;
    this.style.setProperty("--asc-screen-width", `${this._screenWidth}px`);
    this.style.setProperty("--asc-screen-height", `${this._screenHeight}px`);
    this.style.setProperty(
      "--asc-device-pixel-ratio",
      `${this._devicePixelRatio}`
    );
  }

  private _handlePointerDown = (e: PointerEvent): void => {
    this._pointerStartX = e.clientX;
    this._pointerStartY = e.clientY;
    this._pointerStartTime = Date.now();
    this._pointerStartTarget = e.target;
  };

  private _handlePointerUp = (e: PointerEvent): void => {
    if (this._isInteractiveTarget(this._pointerStartTarget, e)) return;

    const deltaX = this._pointerStartX - e.clientX;
    const deltaY = this._pointerStartY - e.clientY;
    const deltaTime = Math.max(1, Date.now() - this._pointerStartTime);
    const velocityX = Math.abs(deltaX) / deltaTime;

    const isHorizontalSwipe =
      Math.abs(deltaX) > Math.abs(deltaY) &&
      Math.abs(deltaX) > SWIPE_MIN_DISTANCE &&
      velocityX > SWIPE_MIN_VELOCITY;
    if (isHorizontalSwipe) {
      if (this._isNightMode || this._music) return;
      if (deltaX > 0) {
        this._showPrevious();
      } else {
        void this._showNext();
      }
      this._restartRotationTimer();
      return;
    }

    if (Math.abs(deltaX) < SWIPE_MIN_DISTANCE && Math.abs(deltaY) < SWIPE_MIN_DISTANCE) {
      this._navigateFromTap();
    }
  };

  private _isInteractiveTarget(
    startTarget: EventTarget | null,
    event: Event
  ): boolean {
    const path = event.composedPath();
    if (startTarget) path.push(startTarget);
    return path.some(
      (target) =>
        target instanceof Element &&
        Boolean(target.closest("button, input, select, textarea, [data-interactive]"))
    );
  }

  private _navigateFromTap(): void {
    const path = this._config?.tap_navigation_path?.trim();
    if (!path || !this.hass) return;

    const hassWithNavigate = this.hass as HomeAssistant & {
      navigate?: (navigationPath: string) => void;
    };
    if (typeof hassWithNavigate.navigate === "function") {
      hassWithNavigate.navigate(path);
      return;
    }

    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    if (this._editorMode) return;

    if (changed.has("hass") && this._media) {
      this._media.updateHass(this.hass);
    }

    if (this.hass && this._config && !this._media) {
      this._media = new MediaController(this.hass, this._config);
      void this._startRotation();
    }

    if (changed.has("hass") && this.hass && this._config) {
      const nextNightMode = isNightModeActive(
        this.hass,
        this._config,
        this._isNightMode
      );
      if (nextNightMode !== this._isNightMode) {
        this._isNightMode = nextNightMode;
        void this._handleNightModeChange(nextNightMode);
      }
    }

    if (changed.has("hass") && this.hass && this._config) {
      void this._resolveMusicFallback();
      this._updateMusicState();
    }
  }

  private _updateMusicState(): void {
    const nextMusic = getMusicDisplay(
      this.hass,
      this._config?.music_assistant_player
    );
    const wasActive = Boolean(this._music);
    this._music = nextMusic;
    const isActive = Boolean(nextMusic);

    if (isActive && !wasActive) {
      if (this._rotationTimer) {
        clearInterval(this._rotationTimer);
        this._rotationTimer = undefined;
      }
      this._startMusicTimer();
    } else if (!isActive && wasActive) {
      this._stopMusicTimer();
      if (!this._isNightMode) this._restartRotationTimer();
    }
  }

  private _startMusicTimer(): void {
    this._stopMusicTimer();
    this._musicTimer = setInterval(() => {
      this._updateMusicState();
    }, 1000);
  }

  private _stopMusicTimer(): void {
    if (this._musicTimer) clearInterval(this._musicTimer);
    this._musicTimer = undefined;
  }

  private async _resolveMusicFallback(): Promise<void> {
    const source = this._config?.music_assistant_fallback_image;
    const request = ++this._fallbackRequest;
    if (!source) {
      this._musicFallbackUrl = "";
      this._resolvedFallbackSource = "";
      return;
    }
    if (source === this._resolvedFallbackSource) return;
    if (source.startsWith("media-source://") && !this.hass) return;

    try {
      const url = source.startsWith("media-source://")
        ? (await resolveMedia(this.hass, source)).url
        : source;
      if (request === this._fallbackRequest) {
        this._musicFallbackUrl = url;
        this._resolvedFallbackSource = source;
      }
    } catch (err) {
      console.warn(
        "[ambient-screensaver-card] Failed to resolve music fallback image:",
        err
      );
      if (request === this._fallbackRequest) this._musicFallbackUrl = "";
    }
  }

  private async _handleNightModeChange(active: boolean): Promise<void> {
    if (active) {
      if (this._rotationTimer) {
        clearInterval(this._rotationTimer);
        this._rotationTimer = undefined;
      }
    } else {
      if (!this._music) this._restartRotationTimer();
    }
    await this._setBrightness(active);
  }

  private async _setBrightness(nightMode: boolean): Promise<void> {
    const entityId = this._config?.brightness_entity;
    if (!entityId || !this.hass) return;

    try {
      if (nightMode) {
        const current = this.hass.states[entityId];
        const currentValue = current ? parseFloat(current.state) : NaN;
        if (!Number.isNaN(currentValue) && currentValue > 0) {
          this._previousBrightness = currentValue;
        }
        await this.hass.callService("number", "set_value", {
          entity_id: entityId,
          value: 0,
        });
      } else {
        const restoreValue =
          this._previousBrightness && this._previousBrightness > 0
            ? this._previousBrightness
            : this._config?.brightness_day_default ??
              defaultConfig.brightness_day_default;
        await this.hass.callService("number", "set_value", {
          entity_id: entityId,
          value: restoreValue,
        });
      }
    } catch (err) {
      console.warn(
        "[ambient-screensaver-card] Failed to update display brightness:",
        err
      );
    }
  }

  private async _startRotation(): Promise<void> {
    await this._showNext();
    this._restartRotationTimer();
  }

  private _restartRotationTimer(): void {
    if (this._rotationTimer) clearInterval(this._rotationTimer);
    const displaySeconds =
      this._config?.display_time ?? defaultConfig.display_time;
    this._rotationTimer = setInterval(
      () => void this._showNext(),
      Math.max(1, displaySeconds) * 1000
    );
  }

  /** Advances forward - either replaying a cached "forward" history item
   * (if the user has swiped back earlier) or fetching a genuinely new one. */
  private async _showNext(): Promise<void> {
    if (!this._media) return;

    if (this._historyIndex < this._history.length - 1) {
      this._historyIndex++;
      this._displayItem(this._history[this._historyIndex]);
      return;
    }

    const next = await this._media.getNext();
    if (!next) return;

    this._history.push(next);
    this._historyIndex = this._history.length - 1;
    this._trimHistory();
    this._displayItem(next);
  }

  /** Steps back to the previously-shown photo, if any is cached. */
  private _showPrevious(): void {
    if (this._historyIndex <= 0) return;
    this._historyIndex--;
    this._displayItem(this._history[this._historyIndex]);
  }

  /** Caps the history buffer so a long-running screensaver doesn't
   * accumulate unbounded memory; revokes any evicted blob URL. */
  private _trimHistory(): void {
    while (this._history.length > HISTORY_CAP) {
      const removed = this._history.shift();
      this._historyIndex--;
      if (removed?.url.startsWith("blob:")) {
        URL.revokeObjectURL(removed.url);
      }
    }
  }

  private _displayItem(item: ResolvedMediaItem): void {
    this._currentItem = item;
    const showingA = this._activeLayer === "a";
    if (showingA) {
      this._urls = { ...this._urls, b: item.url };
      this._activeLayer = "b";
    } else {
      this._urls = { ...this._urls, a: item.url };
      this._activeLayer = "a";
    }
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
    const clockOpacity = Math.min(
      100,
      Math.max(0, Number(c.night_mode_clock_opacity ?? 10))
    );
    this.style.setProperty("--asc-night-clock-opacity", `${clockOpacity / 100}`);
  }

  protected render() {
    if (this._editorMode) {
      return html`
        <div class="editor-placeholder">
          <h3>Ambient Screensaver Card</h3>
          <div>Media mode: ${this._config?.media_mode ?? "local"}</div>
          <div>
            Night mode sensor:
            ${this._config?.night_mode_light_sensor_entity ?? "not configured"}
          </div>
          <div>
            Brightness entity:
            ${this._config?.brightness_entity ?? "not configured"}
          </div>
        </div>
      `;
    }

    if (!this._config || !this.hass) return nothing;

    if (this._isNightMode) {
      return this._renderNightMode();
    }

    if (this._music) {
      return this._renderMusic();
    }

    const weather = getWeatherDisplay(this.hass, this._config);
    const room = getRoomTempDisplay(this.hass, this._config);
    const location = getLocationDisplay(this._config, this._currentItem);

    const dimStyle = styleMap({
      "--asc-dim-opacity": this._idleState === "black" ? 0 : 1,
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
          ${weather
            ? html`<div class="weather-row">
                <ha-icon icon=${weather.icon}></ha-icon>
                <span
                  >${Math.round(weather.outdoorTemp)}° /
                  ${Math.round(weather.outdoorHigh)}°</span
                >
              </div>`
            : nothing}
          ${room
            ? html`<div class="room-row">
                ${room.label} - ${Math.round(room.temp)}${room.unit}
              </div>`
            : nothing}
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
      ${this._renderDebugOverlay()}
    `;
  }

  private _renderNightMode() {
    return html`
      <div class="night-clock">
        ${this._clock.time}<span class="night-clock-ampm"
          >${this._clock.ampm}</span
        >
      </div>
      ${this._renderDebugOverlay()}
    `;
  }

  private _renderMusic() {
    const music = this._music;
    if (!music) return nothing;
    const albumArt = music.albumArtUrl ?? this._musicFallbackUrl;
    const progress = music.durationSeconds
      ? (music.positionSeconds / music.durationSeconds) * 100
      : 0;

    return html`
      <div
        class="music-view"
        style=${styleMap({ "--asc-music-art": albumArt ? `url("${albumArt}")` : "none" })}
      >
        <div class="music-background"></div>
        <div class="music-scrim"></div>
        <div class="music-content">
          ${albumArt
            ? html`<img class="music-cover" src=${albumArt} alt="Album cover" />`
            : html`<div class="music-cover music-cover-empty"></div>`}
          <div class="music-details">
            <div class="music-title">${music.title}</div>
            ${music.artist
              ? html`<div class="music-artist">${music.artist}</div>`
              : nothing}
            ${music.album
              ? html`<div class="music-album">${music.album}</div>`
              : nothing}
          </div>
          <div class="music-controls" data-interactive>
            <button
              class="music-button"
              aria-label=${music.state === "playing" ? "Pause" : "Play"}
              @click=${this._toggleMusic}
            >
              <ha-icon
                icon=${music.state === "playing" ? "mdi:pause" : "mdi:play"}
              ></ha-icon>
            </button>
            <button
              class="music-button"
              aria-label="Next track"
              @click=${this._nextMusic}
            >
              <ha-icon icon="mdi:skip-next"></ha-icon>
            </button>
          </div>
          <input
            class="music-progress"
            data-interactive
            type="range"
            min="0"
            max=${music.durationSeconds || 1}
            step="1"
            .value=${String(music.positionSeconds)}
            style=${styleMap({ "--asc-music-progress": `${progress}%` })}
            aria-label="Track progress"
            @input=${this._seekMusic}
          />
        </div>
      </div>
    `;
  }

  private _stopInteraction = (event: Event): void => {
    event.stopPropagation();
  };

  private _toggleMusic = (event: Event): void => {
    this._stopInteraction(event);
    const entityId = this._config?.music_assistant_player;
    if (!entityId) return;
    void this.hass.callService("media_player", "media_play_pause", {
      entity_id: entityId,
    });
  };

  private _nextMusic = (event: Event): void => {
    this._stopInteraction(event);
    const entityId = this._config?.music_assistant_player;
    if (!entityId) return;
    void this.hass.callService("media_player", "media_next_track", {
      entity_id: entityId,
    });
  };

  private _seekMusic = (event: Event): void => {
    this._stopInteraction(event);
    const input = event.currentTarget as HTMLInputElement;
    const entityId = this._config?.music_assistant_player;
    if (!entityId || !this._music || !this._music.durationSeconds) return;
    const seekPosition = Math.min(
      this._music.durationSeconds,
      Math.max(0, Number(input.value))
    );
    void this.hass.callService("media_player", "media_seek", {
      entity_id: entityId,
      seek_position: seekPosition,
    });
  };

  private _renderDebugOverlay() {
    if (!this._config?.debug) return nothing;
    return html`
      <div class="debug-overlay">
        <div>editor mode: ${this._editorMode}</div>
        <div>
          night mode: ${this._isNightMode} (sensor:
          ${this._config.night_mode_light_sensor_entity ?? "-"})
        </div>
        <div>brightness entity: ${this._config.brightness_entity ?? "none"}</div>
        <div>media mode: ${this._config.media_mode}</div>
        <div>photo: ${this._historyIndex + 1} / ${this._history.length}</div>
        <div>idle state: ${this._idleState}</div>
        <div>
          screen: ${this._screenWidth}x${this._screenHeight} @
          ${this._devicePixelRatio}x
        </div>
      </div>
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
