# Ambient Screensaver Card - Action Plan

## Status and approach

No implementation work is approved yet. The existing code already contains a first pass of sensor-driven night mode, brightness hooks, debug output, history-based previous/next navigation, and local-media shuffling. Those paths should be verified and corrected where necessary rather than rebuilt blindly.

Before each implementation slice:

1. Reproduce the behavior with the smallest available check (TypeScript build/lint plus a focused browser or Home Assistant test when available).
2. Record the current behavior and the expected behavior.
3. Make the smallest change in the owning module.
4. Run `npm run lint` and `npm run build`, then perform the relevant runtime smoke test.

## Phase 1 - Confirm scope and capture behavior

- [x] Resolve the missing-value rendering rules, portrait layout rules, local-media ordering, and night threshold.
- [ ] Review GitHub for alternative approaches and test utilities for timer/orientation behavior before choosing a browser test harness.
- [ ] Capture a debug trace for the photo timer: initial load, successful rotation, failed media resolution, empty folder, `hass` updates, and night-mode transitions.
- [ ] Confirm whether local media should be shuffled once per load, reshuffled after every complete cycle, or selected randomly for every photo.
- [ ] Verify the editor preview DOM ancestry and lifecycle timing so `editor_mode` reflects the real Lovelace editor state.
- [ ] Verify which media items expose dimensions or orientation. If dimensions are unavailable from `media_source`, choose a browser-image-loading approach before implementing the portrait layout.

## Phase 2 - Simplify entity configuration and rendering

- [ ] Remove these config keys from `src/types.ts`, `src/config-defaults.ts`, `src/editor.ts`, and the README/config reference:
	- `outdoor_temp_fallback_entity`
	- `outdoor_temp_default`
	- `outdoor_high_fallback_entity`
	- `outdoor_high_default`
	- `room_temp_climate_entity`
	- `room_temp_default`
- [ ] Remove the corresponding fallback-chain logic from `src/overlay/weather.ts`, `src/overlay/room-temp.ts`, and any now-unused helper arguments.
- [ ] Render the entire weather row only when the required outdoor temperature/high values have valid states; do not substitute a literal default.
- [ ] Render the entire room-temperature row only when its configured entity has a valid numeric state.
- [ ] Round room temperature to zero decimal places at the display boundary, while preserving the entity value as a number internally.
- [ ] Update editor labels/schema and README examples so removed options cannot still be configured silently.

## Phase 3 - Fix debug editor-mode reporting

- [ ] Trace why the debug overlay reports `editor mode: false` in the live editor preview.
- [ ] Make editor detection reliable across the Lovelace editor's shadow-DOM boundaries and lifecycle timing.
- [ ] Ensure editor mode remains side-effect-free: no media fetch, rotation/clock timers, idle/pixel-shift controllers, resize/touch listeners, or brightness service calls.
- [ ] Add a focused regression check for preview mode and normal dashboard mode.

## Phase 4 - Verify and complete sensor-driven night mode

- [ ] Keep night mode sensor-driven through the configured light sensor; remove any remaining automatic sun/time behavior if present.
- [ ] Confirm the sensor state transition handling: enter/exit only on valid numeric states, preserve the previous state for `unknown`/`unavailable`, and avoid repeated service calls on unchanged state.
- [ ] Confirm all dependent actions are wired to transitions: pause/resume photo rotation, hide/show the photo and overlays, maintain the night clock, and set/restore the optional display brightness.
- [ ] Confirm brightness restoration handles an unavailable entity, a zero previous value, service failure, and card teardown without breaking rendering.
- [ ] Set `night_mode_light_threshold` to the approved default of `10`, then update the README and editor label/help text with the sensor's expected units.

## Phase 5 - Portrait photo composition

- [ ] Detect portrait-oriented current images without blocking the rotation timer or leaking object URLs.
- [ ] For a portrait image, find the next portrait image and display the pair side by side in a Nest Hub-style composition.
- [ ] If no second portrait image is available, fall back to any next image and preserve the normal single-image behavior when necessary.
- [ ] Preserve crossfade, idle-black, pixel-shift, night mode, and overlay behavior in the two-photo layout.
- [ ] Check the layout at the Echo Show, tablet, and desktop dimensions documented in the project plan.

## Phase 6 - Diagnose and repair photo rotation

- [ ] Establish whether the apparent stall is caused by overlapping async `getNext()` calls, an empty/failed media queue, a timer being cleared without restart, an image that never loads, or a rejected promise.
- [ ] Guard rotation against concurrent requests and ensure a failed item cannot permanently stop future rotation.
- [ ] Ensure configuration and `hass` updates do not create duplicate timers or leave the card without a timer.
- [ ] Ensure a manual previous/next action restarts the timer exactly once and that night-mode transitions do not race with it.
- [ ] Add focused checks for an empty source, one-image source, failed resolution, slow resolution, and repeated timer ticks.

## Phase 7 - Define local media ordering

- [ ] Select local media randomly on every advance and document that ordering behavior in the README.
- [ ] Verify recursive folder discovery, image filtering, queue reshuffling, duplicate handling, and behavior after a media reload.
- [ ] Keep local-media behavior consistent with the history buffer so previous/next navigation does not unexpectedly duplicate or skip items.

## Future cleanup

- [ ] Remove typography config options and use reviewed default constants instead; update editor, types, defaults, styles, README, and migration notes together.
- [ ] Remove burn-in protection config options and use reviewed default constants instead; preserve the runtime protections.

## Resolved decisions

1. If either outdoor temperature/high value is missing or invalid, hide the entire weather row, including its icon.
2. If the room-temperature entity is missing or invalid, hide the entire room-temperature row.
3. Use `10` as the default `night_mode_light_threshold`; confirm and document the sensor's units during implementation.
4. For a portrait image, find the next portrait image in the available media and show both side by side.
5. If no second portrait image is available, fall back to any next image and use the normal single-image behavior when a pair cannot be formed.
6. Select local media randomly on every advance rather than following a fixed queue or waiting for a complete cycle.
7. Live Home Assistant testing is possible. Before building a dedicated browser harness, check GitHub for suitable alternative testing approaches and utilities for timer, image-orientation, and mocked-`hass` behavior.

