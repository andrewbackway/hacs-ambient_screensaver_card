import type { AmbientScreensaverCardConfig } from "../types";
import type { ResolvedMediaItem } from "../media/media-source";

export interface LocationDisplay {
  location: string;
  subtitle: string;
}

/**
 * Location/subtitle text. When `location_source` is `immich_metadata` and
 * the currently-displayed photo carries a title (from media-source browse
 * results), that's used as the subtitle; otherwise falls back to the
 * static config values. Immich is never a hard requirement here.
 */
export function getLocationDisplay(
  config: AmbientScreensaverCardConfig,
  currentItem: ResolvedMediaItem | null
): LocationDisplay {
  const subtitle =
    config.location_source === "immich_metadata" && currentItem?.title
      ? currentItem.title
      : config.subtitle_text ?? "";

  return {
    location: config.location_text ?? "Home",
    subtitle,
  };
}
