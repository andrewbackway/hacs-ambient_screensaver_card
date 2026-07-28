import type { AmbientScreensaverCardConfig, ImmichProfileConfig } from "../types";
import type { ResolvedMediaItem } from "./media-source";

/**
 * Direct browser -> Immich REST API access, per the endpoint table the user
 * supplied (custom-card-plan.md / conversation): random pool, album, people,
 * favorites, memories ("on this day"), and location profiles, all merged
 * into one shared random pool, plus per-asset thumbnail + EXIF lookups for
 * the display image and the date/location subtitle.
 *
 * IMPORTANT: unlike the `media_source` access mode, this mode talks to the
 * Immich server directly from the browser, so it requires Immich to accept
 * cross-origin requests from the dashboard's origin (native CORS support or
 * a same-origin reverse proxy) - see README "Immich direct API mode".
 *
 * NOTE: exact endpoint/field names are version-dependent; this was written
 * against the endpoint table supplied by the user and should be verified
 * against the Immich API version actually deployed (Settings -> API docs).
 */

export type ImmichApiSettings = Pick<
  Required<AmbientScreensaverCardConfig>,
  "immich_url" | "immich_api_key" | "immich_image_size"
> & { profiles: ImmichProfileConfig[] };

function baseUrl(settings: ImmichApiSettings): string {
  return settings.immich_url.replace(/\/+$/, "");
}

async function immichGet(
  settings: ImmichApiSettings,
  path: string
): Promise<unknown> {
  const res = await fetch(`${baseUrl(settings)}/api${path}`, {
    headers: { "x-api-key": settings.immich_api_key, Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Immich GET ${path} failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function immichPost(
  settings: ImmichApiSettings,
  path: string,
  body: Record<string, unknown>
): Promise<unknown> {
  const res = await fetch(`${baseUrl(settings)}/api${path}`, {
    method: "POST",
    headers: {
      "x-api-key": settings.immich_api_key,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Immich POST ${path} failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function immichGetBlob(
  settings: ImmichApiSettings,
  path: string
): Promise<Blob> {
  const res = await fetch(`${baseUrl(settings)}/api${path}`, {
    headers: { "x-api-key": settings.immich_api_key },
  });
  if (!res.ok) {
    throw new Error(`Immich GET ${path} failed: ${res.status} ${res.statusText}`);
  }
  return res.blob();
}

interface ImmichAssetSummary {
  id?: string;
}

/** Resolves one profile's filter combination into a list of asset ids. */
export async function fetchProfileAssetIds(
  settings: ImmichApiSettings,
  profile: ImmichProfileConfig
): Promise<string[]> {
  const poolSize = profile.pool_size ?? 20;

  if (profile.type === "memories") {
    const memories = (await immichGet(settings, "/memories?type=ON_THIS_DAY")) as Array<{
      assets?: ImmichAssetSummary[];
    }>;
    const assets = Array.isArray(memories)
      ? memories.flatMap((m) => m.assets ?? [])
      : [];
    return assets
      .slice(0, poolSize)
      .map((a) => a.id)
      .filter((id): id is string => !!id);
  }

  const body: Record<string, unknown> = { size: poolSize, type: "IMAGE" };

  switch (profile.type) {
    case "album":
      if (profile.album_ids?.length) body.albumIds = profile.album_ids;
      break;
    case "people":
      if (profile.person_ids?.length) body.personIds = profile.person_ids;
      break;
    case "favorites":
      body.isFavorite = true;
      break;
    case "location":
      if (profile.city) body.city = profile.city;
      if (profile.state) body.state = profile.state;
      if (profile.country) body.country = profile.country;
      break;
    case "random":
    default:
      break;
  }

  const assets = (await immichPost(settings, "/search/random", body)) as ImmichAssetSummary[];
  return Array.isArray(assets)
    ? assets.map((a) => a.id).filter((id): id is string => !!id)
    : [];
}

/**
 * Fetches every enabled profile's asset ids and merges them (deduped) into
 * one shared pool - "a combination of options... feeding into the overall
 * random pool of photos to show".
 */
export async function fetchImmichAssetPool(
  settings: ImmichApiSettings
): Promise<string[]> {
  const enabled = settings.profiles.filter((p) => p.enabled !== false);
  if (enabled.length === 0) return [];

  const results = await Promise.allSettled(
    enabled.map((p) => fetchProfileAssetIds(settings, p))
  );

  const ids = new Set<string>();
  for (const result of results) {
    if (result.status === "fulfilled") {
      for (const id of result.value) ids.add(id);
    } else {
      console.warn(
        "[ambient-screensaver-card] Immich profile fetch failed:",
        result.reason
      );
    }
  }
  return Array.from(ids);
}

interface ImmichAssetDetail {
  exifInfo?: {
    dateTimeOriginal?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

function buildSubtitle(detail: ImmichAssetDetail | undefined): string | undefined {
  const exif = detail?.exifInfo;
  if (!exif) return undefined;

  const parts: string[] = [];
  const location = [exif.city, exif.state, exif.country].filter(Boolean).join(", ");
  if (location) parts.push(location);

  if (exif.dateTimeOriginal) {
    const date = new Date(exif.dateTimeOriginal);
    if (!Number.isNaN(date.getTime())) {
      parts.push(
        date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    }
  }

  return parts.length ? parts.join(" · ") : undefined;
}

/**
 * Resolves one asset id into a displayable image (as a same-origin blob:
 * URL, fetched with the API key header - browsers can't attach custom
 * headers to a plain `background-image: url()`) plus an EXIF-derived
 * date/location subtitle.
 */
export async function resolveImmichAsset(
  settings: ImmichApiSettings,
  assetId: string
): Promise<ResolvedMediaItem> {
  const imagePath =
    settings.immich_image_size === "fullsize"
      ? `/assets/${assetId}/original`
      : `/assets/${assetId}/thumbnail?size=${encodeURIComponent(
          settings.immich_image_size ?? "preview"
        )}`;

  const [blob, detail] = await Promise.all([
    immichGetBlob(settings, imagePath),
    (immichGet(settings, `/assets/${assetId}`) as Promise<ImmichAssetDetail>).catch(
      () => undefined
    ),
  ]);

  return { url: URL.createObjectURL(blob), title: buildSubtitle(detail) };
}
