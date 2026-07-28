import type { HomeAssistant } from "custom-card-helpers";
import {
  collectImageChildren,
  resolveAll,
  type ResolvedMediaItem,
} from "./media-source";

/**
 * Immich access, entirely via HA's `media_source` WebSocket API (never a
 * direct browser -> Immich HTTP call), per custom-card-plan.md §6.
 *
 * NOTE (open question #3 in the plan): the exact `media-source://immich/...`
 * content-id layout depends on how the Immich media-source provider exposes
 * albums, and hasn't yet been verified against a live HA instance. This
 * function is written defensively - if browsing fails or returns nothing,
 * callers should treat it the same as "Immich unavailable" and fall back to
 * the local media source, never as a hard error.
 */
export async function getImmichImages(
  hass: HomeAssistant,
  albumId?: string
): Promise<ResolvedMediaItem[]> {
  const rootContentId = albumId
    ? `media-source://immich/albums/${albumId}`
    : "media-source://immich";

  const children = await collectImageChildren(hass, rootContentId, 1);
  if (children.length === 0) {
    throw new Error(
      "Immich media-source returned no images - check that the Immich " +
        "integration is installed and, if `immich_album_id` is set, that " +
        "the album id is correct."
    );
  }

  return resolveAll(hass, children);
}
