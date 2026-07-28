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
  **optional** additional source, accessed entirely through Home Assistant's
  own `media_source` WebSocket API (no direct browser → Immich calls, so no
  CORS proxy is required).
- Clock (12-hour, no leading zero), outdoor weather icon + current/high
  temperature, and room temperature, each with configurable entity + fallback
  entity + literal default.
- Location title and per-photo subtitle (static text, or driven from Immich
  photo metadata).
- Burn-in protection: slow periodic pixel-shift of the overlay, night-time
  dimming (via `sun.sun` or a fixed hour window), and idle fade-to-black.
- Full visual (GUI) configuration editor — no YAML required, though YAML is
  still fully supported.

## Installation (HACS custom repository)

1. HACS → Frontend → ⋮ → Custom repositories → add this repository URL.
2. Install **Ambient Screensaver Card** from HACS.
3. Add the resulting `ambient-screensaver-card.js` as a Lovelace resource
   (HACS does this automatically for HACS-managed installs).
4. Add a card of type `custom:ambient-screensaver-card` to a **panel** view
   for full-bleed display.

## Local development

```
npm install
npm run watch
```

Copy/symlink `dist/ambient-screensaver-card.js` into
`/config/www/community/ambient-screensaver-card/` on your HA instance, add it
once as a Lovelace resource (`/local/community/ambient-screensaver-card/ambient-screensaver-card.js`,
type: JavaScript Module), then hard-refresh the dashboard after each rebuild.

## Configuration

All fields are optional; sensible defaults are used for anything not set.
Use the visual editor (Edit Dashboard → Edit Card) to configure every field
below through HA's standard form UI, or set them directly in YAML:

| Field | Description | Default |
|---|---|---|
| `media_mode` | `local` or `immich` | `local` |
| `local_media_path` | media-source content id for the local photo folder | `media-source://media_source/local/screensaver` |
| `immich_album_id` | Immich album id (optional) | — |
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
| `night_dim_mode` | `sun` or `hours` | `sun` |
| `night_dim_start_hour` / `night_dim_end_hour` | used when `night_dim_mode: hours` | `22` / `6` |
| `day_opacity` / `night_opacity` | dimming levels | `1` / `0.4` |
| `idle_time` / `idle_black_after` | seconds of inactivity before dimming / fading to black | `120` / `600` |
