import type { HomeAssistant } from "custom-card-helpers";
import type { AmbientScreensaverCardConfig } from "../types";
import {
  collectImageChildren,
  resolveAll,
  shuffle,
  type ResolvedMediaItem,
} from "./media-source";
import { getImmichImages } from "./immich";
import {
  fetchImmichAssetPool,
  resolveImmichAsset,
  type ImmichApiSettings,
} from "./immich-api";

type QueueMode = "eager" | "immich-api";

/**
 * Owns the current photo queue and hands out the "next" photo on request.
 * Supports three photo sources (custom-card-plan.md §6 + the Immich direct
 * API extension): local media-source folder, Immich via HA's media_source
 * WebSocket API, and Immich via its direct REST API. Immich is always
 * optional - any Immich failure falls back to the local folder rather than
 * breaking the rotation.
 */
export class MediaController {
  private hass: HomeAssistant;
  private config: AmbientScreensaverCardConfig;

  private mode: QueueMode = "eager";
  private eagerQueue: ResolvedMediaItem[] = [];
  private assetIdQueue: string[] = [];
  private index = 0;
  private loaded = false;
  private loading: Promise<void> | null = null;

  // Blob URLs (Immich API mode) must be revoked once no longer displayed,
  // otherwise every photo shown leaks memory for the lifetime of the card.
  private recentBlobUrls: string[] = [];

  constructor(hass: HomeAssistant, config: AmbientScreensaverCardConfig) {
    this.hass = hass;
    this.config = config;
  }

  updateHass(hass: HomeAssistant): void {
    this.hass = hass;
  }

  updateConfig(config: AmbientScreensaverCardConfig): void {
    this.config = config;
    // Force a reload next time an image is requested, config may have
    // changed the media source entirely.
    this.loaded = false;
    this.loading = null;
  }

  /** Revokes any outstanding blob URLs. Call when the card is torn down. */
  dispose(): void {
    for (const url of this.recentBlobUrls) {
      URL.revokeObjectURL(url);
    }
    this.recentBlobUrls = [];
  }

  async getNext(): Promise<ResolvedMediaItem | null> {
    await this.ensureLoaded();

    if (this.mode === "immich-api") {
      return this._nextFromImmichApi();
    }
    return this._nextFromEagerQueue();
  }

  private _nextFromEagerQueue(): ResolvedMediaItem | null {
    if (this.eagerQueue.length === 0) return null;

    const item = this.eagerQueue[this.index % this.eagerQueue.length];
    this.index++;

    // Reshuffle once we've looped back to the start, so repeat viewings
    // don't show photos in the exact same order every cycle.
    if (this.index % this.eagerQueue.length === 0) {
      this.eagerQueue = shuffle(this.eagerQueue);
    }

    return item;
  }

  private async _nextFromImmichApi(): Promise<ResolvedMediaItem | null> {
    if (this.assetIdQueue.length === 0) return null;

    const assetId = this.assetIdQueue[this.index % this.assetIdQueue.length];
    this.index++;
    if (this.index % this.assetIdQueue.length === 0) {
      this.assetIdQueue = shuffle(this.assetIdQueue);
    }

    try {
      const item = await resolveImmichAsset(this._immichSettings(), assetId);
      this._trackBlobUrl(item.url);
      return item;
    } catch (err) {
      console.warn(
        "[ambient-screensaver-card] Failed to resolve Immich asset, skipping:",
        err
      );
      return null;
    }
  }

  private _trackBlobUrl(url: string): void {
    if (!url.startsWith("blob:")) return;
    this.recentBlobUrls.push(url);
    // Keep the currently-visible and about-to-be-replaced layer's URLs
    // alive; revoke anything older than that.
    while (this.recentBlobUrls.length > 2) {
      const stale = this.recentBlobUrls.shift();
      if (stale) URL.revokeObjectURL(stale);
    }
  }

  private _immichSettings(): ImmichApiSettings {
    return {
      immich_url: this.config.immich_url ?? "",
      immich_api_key: this.config.immich_api_key ?? "",
      immich_image_size: this.config.immich_image_size ?? "preview",
      profiles: this.config.immich_profiles ?? [],
    };
  }

  private async ensureLoaded(): Promise<void> {
    if (this.loaded) return;
    if (!this.loading) {
      this.loading = this.load();
    }
    await this.loading;
  }

  private async load(): Promise<void> {
    this.dispose();
    this.index = 0;

    if (this.config.media_mode === "immich") {
      if (this.config.immich_access_mode === "api") {
        const loadedFromApi = await this._loadImmichApi();
        if (loadedFromApi) return;
      } else {
        const loadedFromMediaSource = await this._loadImmichMediaSource();
        if (loadedFromMediaSource) return;
      }
    }

    this.mode = "eager";
    this.eagerQueue = shuffle(await this.loadLocal());
    this.loaded = true;
  }

  /** Returns true on success; caller falls back to local on failure. */
  private async _loadImmichApi(): Promise<boolean> {
    if (!this.config.immich_url || !this.config.immich_api_key) {
      console.warn(
        "[ambient-screensaver-card] Immich API mode selected but immich_url/immich_api_key are not set, falling back to local media source."
      );
      return false;
    }

    try {
      const ids = await fetchImmichAssetPool(this._immichSettings());
      if (ids.length === 0) {
        console.warn(
          "[ambient-screensaver-card] Immich API returned no assets, falling back to local media source."
        );
        return false;
      }
      this.mode = "immich-api";
      this.assetIdQueue = shuffle(ids);
      this.loaded = true;
      return true;
    } catch (err) {
      console.warn(
        "[ambient-screensaver-card] Immich API unavailable, falling back to local media source:",
        err
      );
      return false;
    }
  }

  /** Returns true on success; caller falls back to local on failure. */
  private async _loadImmichMediaSource(): Promise<boolean> {
    try {
      const items = await getImmichImages(this.hass, this.config.immich_album_id);
      if (items.length === 0) return false;
      this.mode = "eager";
      this.eagerQueue = shuffle(items);
      this.loaded = true;
      return true;
    } catch (err) {
      console.warn(
        "[ambient-screensaver-card] Immich media-source unavailable, falling back to local media source:",
        err
      );
      return false;
    }
  }

  private async loadLocal(): Promise<ResolvedMediaItem[]> {
    const rootContentId =
      this.config.local_media_path ??
      "media-source://media_source/local/screensaver";
    const children = await collectImageChildren(this.hass, rootContentId, 1);
    return resolveAll(this.hass, children);
  }
}
