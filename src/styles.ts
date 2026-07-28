import { css } from "lit";

/**
 * All card styling lives here, injected via LitElement's Shadow DOM -
 * naturally isolated from Home Assistant's card chrome/theming and immune
 * to Lovelace's DOMPurify sanitizing (which only applies to markdown-style
 * cards), per custom-card-plan.md §4/§7. No card background, border, or
 * box-shadow is ever applied - text sits directly on the photo.
 *
 * Dynamic, per-config values (font sizes, text-shadow, opacity, pixel-shift
 * offsets) are supplied as CSS custom properties set on the host element in
 * ambient-screensaver-card.ts; the fallback values below only apply if a
 * property is somehow unset.
 */
export const styles = css`
  :host {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #000;
    --asc-day-opacity: 1;
    --asc-night-opacity: 0.4;
    --asc-shift-x: 0px;
    --asc-shift-y: 0px;
  }

  .photo-layer {
    position: absolute;
    inset: 0;
  }

  .photo {
    position: absolute;
    inset: 0;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0;
    transition: opacity var(--asc-crossfade-time, 2s) ease-in-out;
  }

  .photo.cover {
    background-size: cover;
  }

  .photo.contain {
    background-size: contain;
  }

  .photo.visible {
    opacity: var(--asc-dim-opacity, 1);
  }

  .overlay {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr auto;
    padding: 2.5vh 2.5vw;
    box-sizing: border-box;
    pointer-events: none;
    color: #fff;
    transform: translate(var(--asc-shift-x), var(--asc-shift-y));
    transition: transform 3s ease-in-out, opacity 1s ease-in-out;
    opacity: var(--asc-dim-opacity, 1);
  }

  .bottom-left {
    grid-column: 1;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-self: start;
    align-self: end;
    gap: 0.2em;
  }

  .bottom-right {
    grid-column: 2;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-self: end;
    align-self: end;
    text-align: right;
    gap: 0.2em;
  }

  .clock {
    font-size: var(--asc-clock-font-size, clamp(3.5rem, 9vw, 6rem));
    font-weight: 500;
    line-height: 1;
    text-shadow: var(--asc-text-shadow, 0px 2px 12px rgba(0, 0, 0, 0.9));
  }

  .weather-row {
    display: flex;
    align-items: center;
    gap: 0.3em;
    font-size: var(--asc-weather-font-size, clamp(1.2rem, 3vw, 2rem));
    text-shadow: var(--asc-text-shadow, 0px 2px 12px rgba(0, 0, 0, 0.9));
  }

  .weather-row ha-icon {
    --mdc-icon-size: 1.1em;
  }

  .room-row {
    font-size: var(--asc-room-font-size, clamp(0.8rem, 1.8vw, 1.2rem));
    opacity: 0.9;
    text-shadow: var(--asc-text-shadow, 0px 2px 12px rgba(0, 0, 0, 0.9));
  }

  .location {
    font-size: var(--asc-location-font-size, clamp(1.2rem, 3vw, 2rem));
    font-weight: 500;
    text-shadow: var(--asc-text-shadow, 0px 2px 12px rgba(0, 0, 0, 0.9));
  }

  .subtitle {
    font-size: var(--asc-subtitle-font-size, clamp(0.8rem, 1.8vw, 1.2rem));
    opacity: 0.9;
    text-shadow: var(--asc-text-shadow, 0px 2px 12px rgba(0, 0, 0, 0.9));
  }

  .black-curtain {
    position: absolute;
    inset: 0;
    background: #000;
    opacity: 0;
    pointer-events: none;
    transition: opacity 2s ease-in-out;
  }

  .black-curtain.visible {
    opacity: 1;
  }
`;
