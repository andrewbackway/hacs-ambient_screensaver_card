# Ambient Screensaver Card

A self-contained Home Assistant Lovelace card: a Google Nest Hub–style ambient
screensaver with a full-screen rotating background photo and a clock /
weather / room-temperature overlay (bottom-left) plus a location / subtitle
overlay (bottom-right). No card container, no Home Assistant chrome — just
white text with a heavy shadow directly on the photo.

See [`custom-card-plan.md`](../custom-card-plan.md) in the parent folder for
the full architecture/design plan this card was built from.

## Features

- Fully self-contained — no WallPanel or other dashboard-level dependency.
- Photo rotation with smooth crossfade transitions.
- Local media-source folder as the baseline photo source; Immich as an
  **optional** additional source, via either of two access methods:
  - **Media source** (default): through Home Assistant's own `media_source`
    WebSocket API — no direct browser → Immich calls, so no CORS proxy is
    required.
  - **Direct Immich API**: the card calls Immich's REST API directly for
    full control over *what* photos are shown, via one or more **profiles**
    (random, album, people/faces, favorites, "on this day" memories,
    location/trips) that are all merged into one shared random pool. This
    requires Immich to accept cross-origin requests from your dashboard's
    origin — see "Immich direct API mode" below.
- Clock (12-hour, no leading zero), outdoor weather icon + current/high
  temperature, and room temperature, each with configurable entity + fallback
  entity + literal default.
- Location title and per-photo subtitle (static text, or driven from Immich
  photo metadata/EXIF — date and city/state/country — in either Immich mode).
- Burn-in protection: slow periodic pixel-shift of the overlay, night-time
  dimming (via `sun.sun` or a fixed hour window), and idle fade-to-black.
- Full visual (GUI) configuration editor, including a dedicated repeatable
  list editor for Immich profiles — no YAML required, though YAML is still
  fully supported.

## Installation (HACS custom repository)

This card isn't in the default HACS store, so it's installed as a **custom
repository** pointing at this Git repo. [HACS](https://hacs.xyz/) must
already be installed in your Home Assistant instance, and this repo must
already be pushed to GitHub with at least one tagged release.

1. In Home Assistant, go to **HACS → Frontend**, click the **⋮** menu (top
   right) → **Custom repositories**.
2. Paste this repo's GitHub URL (`https://github.com/andrewbackway/hacs-ambient_screensaver_card`),
   set **Category** to **Dashboard**, then **Add**.
3. Back in **HACS → Frontend**, search for **Ambient Screensaver Card** and
   click **Download**.
4. **Add the Lovelace resource** — HACS usually adds this automatically for
   Dashboard-category repos; if the card doesn't show up as an option when
   adding a card, add it manually:
   - **Settings → Dashboards → ⋮ → Resources → + Add Resource**
   - URL: `/hacsfiles/ambient-screensaver-card/ambient-screensaver-card.js`
   - Resource type: **JavaScript Module**
5. **Reload the dashboard** (hard refresh the browser) so the new resource
   loads.
6. Add a card of type `custom:ambient-screensaver-card` to a **panel** view
   for full-bleed display — either via **Add Card → search "Ambient
   Screensaver"** (uses the visual editor) or directly in YAML:
   ```yaml
   type: custom:ambient-screensaver-card
   ```

### Updating

HACS → Frontend → Ambient Screensaver Card → **Update**, whenever a new
release is tagged on GitHub.

## Local development

```
npm install
npm run watch
```

Copy/symlink `dist/ambient-screensaver-card.js` into
`/config/www/community/ambient-screensaver-card/` on your HA instance, add it
once as a Lovelace resource (`/local/community/ambient-screensaver-card/ambient-screensaver-card.js`,
type: JavaScript Module), then hard-refresh the dashboard after each rebuild.

## Immich direct API mode

When `immich_access_mode: api`, the card talks to your Immich server's REST
API **directly from the browser** (`fetch()`), instead of going through Home
Assistant's `media_source` proxy. This unlocks the full profile system below,
but has two consequences you should know about:

1. **CORS**: Immich must accept cross-origin requests from your dashboard's
   origin. Either enable CORS on Immich/its reverse proxy for that origin, or
   put Immich behind the same origin as Home Assistant (e.g. a reverse-proxy
   path like `/immich/` alongside `/`). Without this, the browser will block
   the requests and the card will log a warning and fall back to the local
   media folder.
2. **API key exposure**: `immich_api_key` is stored in plain text inside your
   dashboard configuration, exactly like any other Lovelace card option.
   Anyone who can edit your dashboards, or open browser dev tools while
   viewing them, can read this key. Use an Immich API key scoped to
   **read-only** access if your Immich version supports scoped keys, and
   treat it as you would any other credential pasted into a dashboard.

Profiles let you combine multiple Immich filters into one shared random pool
(e.g. a "Favorites" profile plus an "Album" profile plus a "Person" profile
all mixed together). Configure them via the visual editor's **Immich
profiles** section (appears once `media_mode: immich` and
`immich_access_mode: api` are set), or directly in YAML under
`immich_profiles:`. Each profile has:

| Field | Applies to | Description |
|---|---|---|
| `enabled` | all | temporarily exclude a profile from the pool without deleting it |
| `type` | all | `random`, `album`, `people`, `favorites`, `memories`, or `location` |
| `pool_size` | all | max photos this profile contributes to the shared pool |
| `album_ids` | `album` | Immich album UUIDs (find them in the Immich web UI URL) |
| `person_ids` | `people` | Immich person UUIDs |
| `city` / `state` / `country` | `location` | matched against each photo's EXIF location |

## Configuration

All fields are optional; sensible defaults are used for anything not set.
Use the visual editor (Edit Dashboard → Edit Card) to configure every field
below through HA's standard form UI, or set them directly in YAML:

| Field | Description | Default |
|---|---|---|
| `media_mode` | `local` or `immich` | `local` |
| `local_media_path` | media-source content id for the local photo folder | `media-source://media_source/local/screensaver` |
| `immich_access_mode` | `media_source` or `api` | `media_source` |
| `immich_album_id` | Immich album id (media-source mode only) | — |
| `immich_url` | Immich server URL (api mode) | — |
| `immich_api_key` | Immich API key (api mode) — see security note above | — |
| `immich_image_size` | `thumbnail`, `preview`, or `fullsize` (api mode) | `preview` |
| `immich_profiles` | list of profiles feeding the shared random pool (api mode) — see above | `[]` |
| `image_fit` | `cover` or `contain` | `cover` |
| `display_time` | seconds per photo | `30` |
| `crossfade_time` | seconds for the crossfade | `2` |
| `weather_entity` | weather entity for the condition icon | `weather.home` |
| `outdoor_temp_entity` / `outdoor_temp_fallback_entity` / `outdoor_temp_default` | outdoor temperature fallback chain | `sensor.laverton_temp` / `sensor.outdoor_temperature` / `22` |
| `outdoor_high_entity` / `outdoor_high_fallback_entity` / `outdoor_high_default` | outdoor high temperature fallback chain | `sensor.laverton_temp_max` / `sensor.outdoor_high_temperature` / `26` |
| `room_temp_entity` / `room_temp_climate_entity` / `room_temp_default` | room temperature fallback chain | `sensor.office_temperature` / `climate.daikin_dup_office` / `21.5` |
| `room_label` / `room_unit` | room temperature display label/unit | `Office` / `°C` |
| `location_source` | `static` or `immich_metadata` | `static` |
| `location_text` / `subtitle_text` | location/subtitle text | `Home` / `""` |
| `clock_font_size`, `weather_font_size`, `room_font_size`, `location_font_size`, `subtitle_font_size` | any valid CSS size, e.g. `clamp()` | see `src/config-defaults.ts` |
| `text_shadow` | CSS text-shadow value | `0px 2px 12px rgba(0, 0, 0, 0.9)` |
| `pixel_shift_distance` / `pixel_shift_period` | burn-in pixel-shift amount (px) / period (s) | `6` / `60` |
| `night_mode_light_sensor_entity` | numeric light-level sensor entity; night mode is active while its state is `<=` `night_mode_light_threshold` | `sensor.room_light_sensor` |
| `night_mode_light_threshold` | night-mode trigger threshold (see above) | `0` |
| `brightness_entity` | `number.*` entity for the display's real backlight brightness — set to `0` on entering night mode and restored on exit. Left unset to disable real brightness control entirely | — |
| `brightness_day_default` | fallback brightness value to restore if no previous value was captured before night mode started | `100` |
| `debug` | show an on-screen diagnostic overlay (night mode/brightness/media/idle/screen-size state) | `false` |
| `idle_time` / `idle_black_after` | seconds of inactivity before dimming / fading to black | `120` / `600` |

## Interaction

- **Swipe left** anywhere on the screen shows the **previous** photo; **swipe right** shows the **next** photo (skips ahead of the normal rotation timer, which restarts fresh after a manual swipe). Ignored while night mode is active.
- **Night mode** activates automatically once `night_mode_light_sensor_entity`'s state drops to/below `night_mode_light_threshold` (e.g. a room going dark) — photos and all overlay text/weather/room-temp info are hidden, replaced by a large centered clock only, and (if `brightness_entity` is configured) the real screen brightness is set to `0`. It deactivates automatically once the sensor reports a brighter level again, restoring the previous brightness. There is no manual/gesture override — it is purely sensor-driven.
