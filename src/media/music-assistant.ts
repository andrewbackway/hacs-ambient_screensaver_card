import type { HomeAssistant } from "custom-card-helpers";
import type { MusicDisplay } from "../types";

type MediaPlayerState = {
  state: string;
  attributes: Record<string, unknown>;
};

function numberAttribute(
  attributes: Record<string, unknown>,
  name: string
): number {
  const value = Number(attributes[name]);
  return Number.isFinite(value) ? value : 0;
}

function stringAttribute(
  attributes: Record<string, unknown>,
  name: string
): string {
  const value = attributes[name];
  return typeof value === "string" ? value : "";
}

function positionAt(
  attributes: Record<string, unknown>,
  now: number,
  isPlaying: boolean
): number {
  const position = numberAttribute(attributes, "media_position");
  if (!isPlaying) return position;
  const updatedAt = stringAttribute(attributes, "media_position_updated_at");
  if (!updatedAt) return position;

  const updatedTime = Date.parse(updatedAt);
  if (!Number.isFinite(updatedTime)) return position;

  return position + Math.max(0, (now - updatedTime) / 1000);
}

export function getMusicDisplay(
  hass: HomeAssistant,
  entityId: string | undefined,
  now = Date.now()
): MusicDisplay | undefined {
  if (!entityId) return undefined;

  const state = hass.states[entityId] as MediaPlayerState | undefined;
  if (!state || (state.state !== "playing" && state.state !== "paused")) {
    return undefined;
  }

  const attributes = state.attributes ?? {};
  const durationSeconds = Math.max(
    0,
    numberAttribute(attributes, "media_duration")
  );
  const positionSeconds = Math.min(
    durationSeconds || Number.MAX_SAFE_INTEGER,
    Math.max(0, positionAt(attributes, now, state.state === "playing"))
  );

  return {
    state: state.state,
    title: stringAttribute(attributes, "media_title") || "Unknown title",
    artist: stringAttribute(attributes, "media_artist"),
    album: stringAttribute(attributes, "media_album_name"),
    albumArtUrl: stringAttribute(attributes, "entity_picture") || undefined,
    durationSeconds,
    positionSeconds,
  };
}