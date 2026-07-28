import type { HomeAssistant } from "custom-card-helpers";

export interface ResolvedMediaItem {
  url: string;
  title?: string;
}

interface BrowseMediaChild {
  media_content_id: string;
  media_content_type: string;
  title: string;
  can_play: boolean;
  can_expand: boolean;
  thumbnail?: string | null;
}

interface BrowseMediaResult {
  media_content_id: string;
  children?: BrowseMediaChild[];
}

interface ResolveMediaResult {
  url: string;
  mime_type: string;
}

/**
 * Thin wrapper around HA's `media_source` WebSocket API.
 * Browser never talks to any external media server directly - every request
 * is proxied through the authenticated HA WebSocket connection, which is
 * what lets us sidestep CORS entirely (see custom-card-plan.md §6).
 */
export async function browseMedia(
  hass: HomeAssistant,
  mediaContentId: string
): Promise<BrowseMediaResult> {
  return hass.callWS<BrowseMediaResult>({
    type: "media_source/browse_media",
    media_content_id: mediaContentId,
  });
}

export async function resolveMedia(
  hass: HomeAssistant,
  mediaContentId: string
): Promise<ResolveMediaResult> {
  return hass.callWS<ResolveMediaResult>({
    type: "media_source/resolve_media",
    media_content_id: mediaContentId,
  });
}

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

function looksLikeImage(child: BrowseMediaChild): boolean {
  if (child.can_expand) return false;
  const lower = child.media_content_id.toLowerCase();
  return IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

/**
 * Recursively walks a media-source folder (one level of sub-folders deep by
 * default) and returns every playable image child found.
 */
export async function collectImageChildren(
  hass: HomeAssistant,
  rootContentId: string,
  maxDepth = 1
): Promise<BrowseMediaChild[]> {
  const result = await browseMedia(hass, rootContentId);
  const children = result.children ?? [];
  const images = children.filter(looksLikeImage);

  if (maxDepth <= 0) return images;

  const folders = children.filter((c) => c.can_expand);
  const nested = await Promise.all(
    folders.map((folder) =>
      collectImageChildren(hass, folder.media_content_id, maxDepth - 1).catch(
        () => [] as BrowseMediaChild[]
      )
    )
  );

  return images.concat(...nested);
}

/**
 * Resolves a list of browsed children into playable URLs, dropping any that
 * fail to resolve rather than breaking the whole rotation.
 */
export async function resolveAll(
  hass: HomeAssistant,
  children: BrowseMediaChild[]
): Promise<ResolvedMediaItem[]> {
  const settled = await Promise.allSettled(
    children.map(async (child) => {
      const resolved = await resolveMedia(hass, child.media_content_id);
      return { url: resolved.url, title: child.title } as ResolvedMediaItem;
    })
  );

  return settled
    .filter(
      (r): r is PromiseFulfilledResult<ResolvedMediaItem> =>
        r.status === "fulfilled"
    )
    .map((r) => r.value);
}

/** Fisher-Yates shuffle, used so photo order doesn't repeat predictably. */
export function shuffle<T>(items: T[]): T[] {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
