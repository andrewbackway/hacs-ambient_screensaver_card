# Next Feature Plan: Night Clock, Music Assistant, and Tap Navigation

## Scope

Implement three related additions to `custom:ambient-screensaver-card`:

1. Configurable opacity for the full-screen night-mode clock, defaulting to 10%.
2. A Music Assistant playback presentation when music is playing on a configured player.
3. Optional tap navigation to a configured Home Assistant dashboard/view, while preserving swipe navigation and excluding buttons/controls.

This plan is for approval before implementation. No source code changes are included in this step.

## 1. Night-mode clock opacity

### Proposed configuration

| Key | Type | Default | Purpose |
|---|---|---:|---|
| `night_mode_clock_opacity` | number | `10` | Opacity of the full-screen night clock, expressed as a percentage from `0` to `100`. |

The value would be applied to `.night-clock` through a host CSS custom property. The clock remains visible at the configured opacity while the existing night-mode behavior continues to stop photo rotation and hide the normal overlays.

The visual editor would expose this as a percentage-style number selector from `0` to `100`, and the card would convert the value to the CSS opacity range internally.

### Files expected to change

- `src/types.ts`: add the optional config field.
- `src/config-defaults.ts`: add the default.
- `src/editor.ts`: add the Night mode editor field and label.
- `src/ambient-screensaver-card.ts`: publish the CSS variable.
- `src/styles.ts`: apply the variable to `.night-clock`.
- `README.md`: document the field and default.

## 2. Music Assistant playback mode

### Intended behavior

When Music Assistant is playing on a configured Home Assistant media-player entity, render a music presentation instead of the normal photo presentation:

- Album art fills the background using `cover` sizing.
- The background image is blurred, with a separate readable foreground treatment so the metadata remains legible.
- Album art, artist, and title are shown.
- Play/pause and next controls are shown.
- A thin progress line displays elapsed position against track duration.
- The progress line is interactive and sends a seek/progress change to Home Assistant.
- When no album art is available, use a configurable fallback image.
- When the player is not playing, return to the normal photo/overlay presentation unless a different behavior is approved.

### Proposed configuration

| Key | Type | Default | Purpose |
|---|---|---|---|
| `music_assistant_player` | string or undefined | unset | Configured `media_player.*` entity. Music mode is disabled when unset. |
| `music_assistant_fallback_image` | string or undefined | unset | Image URL or HA-resolvable image source used when album art is unavailable. |
| `music_assistant_show_progress_control` | boolean | `true` | Whether the progress line can be tapped/dragged to seek. |

The minimum required configuration is the player entity and fallback image. The progress-control flag is proposed to make the interaction explicit, although it may be unnecessary if seeking should always be enabled.

### Data source and integration boundary

The planned implementation reads the configured standard `media_player.*` entity from `hass.states` and treats its state and attributes as the source of truth. It would use the entity's:

- `state` for playing/paused/idle status;
- `media_title` for title;
- `media_artist` and/or `media_album_name` for metadata;
- `entity_picture` for album art;
- `media_duration` and `media_position` for progress;
- `media_position_updated_at` plus elapsed time for a smoothly advancing display between Home Assistant updates.

Playback commands would use Home Assistant services on the configured entity:

- `media_player.media_play_pause` for play/pause;
- `media_player.media_next_track` for next;
- `media_player.media_seek` with a calculated `seek_position` for progress changes.

This uses Music Assistant's Home Assistant media-player entity rather than calling Music Assistant-specific WebSocket commands directly. It keeps authentication and service dispatch inside the existing `hass` interface and should work with any compatible player entity. If the target Music Assistant integration exposes different attributes or requires its own services, the adapter should be isolated in a new `src/media/music-assistant.ts` module rather than spread through the card component.

### Rendering and state design

Add a small pure state/normalization layer that converts the configured media-player entity into a display model, for example:

- `isPlaying`
- `title`
- `artist`
- `album`
- `albumArtUrl`
- `durationSeconds`
- `positionSeconds`
- `positionPercent`

The card would derive this model reactively from `hass` updates and maintain a short timer while playing so the progress line advances without waiting for an entity update. The timer must be stopped when music mode is not active or the card disconnects.

The music view should have explicit interactive elements with event propagation stopped so they cannot trigger tap navigation or photo swipe handling:

- play/pause button;
- next button;
- progress control.

The implementation should use HA/Lit-compatible icon elements and accessible labels. Controls should send commands optimistically only where the state transition is unambiguous; otherwise, the UI should let the next `hass` update confirm the result.

### Background and fallback image handling

Album art should be rendered as a background layer with:

- `background-size: cover`;
- a blur transform/layer that does not crop or blur the readable foreground art unintentionally;
- a darkening overlay for text contrast.

The fallback image must support both a normal browser-loadable URL or HA `/local/...` path and an HA `media-source://` content ID. The latter will use the existing media-source resolution path so fallback behavior remains authenticated through Home Assistant.

### Files expected to change

- `src/types.ts`: add Music Assistant config fields and related display model types if useful.
- `src/config-defaults.ts`: add disabled-by-default values.
- `src/editor.ts`: add media-player entity, fallback image, and any selected progress option.
- `src/ambient-screensaver-card.ts`: derive music state, manage the progress timer, dispatch controls, and choose between photo and music rendering.
- `src/styles.ts`: add music background, metadata, control, and progress-line styles.
- New `src/media/music-assistant.ts`: normalize entity attributes and contain service/seek calculations if the boundary proves useful.
- `README.md`: document setup, expected entity attributes, fallback behavior, and controls.

## 3. Tap-to-dashboard/view navigation

### Proposed configuration

| Key | Type | Default | Purpose |
|---|---|---|---|
| `tap_navigation_path` | string or undefined | unset | Relative Home Assistant dashboard/view path, such as `/lovelace/ambient`, to open when the user taps a non-interactive area. |

No action occurs by default when this is unset.

The path should be passed to Home Assistant's frontend navigation mechanism rather than constructing a new browser URL manually. The implementation should use the card's existing Home Assistant context where possible, with a clear choice between `hass.navigate(path)` if available in the target HA version and a browser-history fallback only if required.

### Gesture rules

- A short tap on any non-button/non-control area invokes navigation when configured.
- Existing horizontal swipe detection remains unchanged for photo navigation.
- A touch/mouse interaction that meets the existing swipe thresholds must never navigate.
- A target inside a button, progress control, or other element marked as interactive must never navigate.
- Night mode is included: tapping the night clock navigates if a path is configured.
- Music controls remain usable and must not cause navigation.
- The navigation handler should avoid breaking keyboard activation/accessibility for the music controls.

The event logic should be centralized around the existing touch lifecycle, with pointer/click support added only as needed for desktop and non-touch devices. The tap decision should be based on the final event target and movement threshold, not on a blanket card-level click that could accidentally follow control events.

### Files expected to change

- `src/types.ts`: add the optional navigation path.
- `src/config-defaults.ts`: default it to undefined/empty.
- `src/editor.ts`: add a text field and label.
- `src/ambient-screensaver-card.ts`: distinguish tap from swipe and navigate when configured.
- `README.md`: document the path format and default no-op behavior.

## 4. Interaction between modes

The planned precedence is:

1. Editor placeholder, when the card is rendered in the Lovelace editor.
2. Night mode full-screen clock, when night mode is active.
3. Fullscreen music view, when the configured player is playing or paused.
4. Normal rotating photo view.

This means playing or paused music temporarily replaces the photo view with a fullscreen music panel, while night mode always takes priority. Music playback must not start photo rotation or advance photo history while the music view is displayed. When the player leaves the playing/paused states, the existing photo rotation timer should resume with a fresh interval rather than immediately advancing.

## 5. Validation and testing plan

Before implementation is considered complete:

- Run `npm run lint` and `npm run build`.
- Add focused tests if a test runner is introduced or if pure helpers can be validated without browser infrastructure.
- Verify config defaults and editor fields for all new options.
- Verify night clock opacity at default, zero, full, and invalid/out-of-range values.
- Verify Music Assistant states: playing, paused, idle, unavailable, missing art, missing artist/title, and missing duration.
- Verify progress calculation, timer advancement, seek conversion, and clamping at `0` and duration.
- Verify play/pause/next/seek service calls use the configured entity.
- Verify music controls do not navigate or trigger photo swipe behavior.
- Verify tap navigation occurs only when configured and only for taps outside controls.
- Verify horizontal swipes still navigate photos and do not trigger dashboard navigation.
- Verify night mode, idle-black, pixel shift, and disconnect cleanup continue to work.
- Update README configuration and interaction sections.

## Open questions requiring approval

1. Resolved: `night_mode_clock_opacity` is configured as a percentage (`10` means 10%), with editor validation from `0` to `100`.
2. Resolved: configure a standard Music Assistant-backed `media_player.*` entity.
3. Resolved: show the fullscreen music panel while the player is either `playing` or `paused`.
4. Resolved: night mode always wins over music mode.
5. Resolved: `music_assistant_fallback_image` supports both URL/`/local/...` sources and `media-source://` content IDs.
6. Resolved: the progress line supports both tap-to-seek and pointer/touch dragging.
7. Resolved: use a relative Home Assistant path such as `/lovelace/ambient`; prefer the Home Assistant navigation API and use a fallback only if required by the target HA version.
8. Resolved: tapping the night-mode clock navigates when a path is configured.
9. Resolved: music mode replaces photo rotation entirely; photo rotation is paused and resumes with a fresh interval after music mode ends.
